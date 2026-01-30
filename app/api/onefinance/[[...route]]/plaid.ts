import { z } from "zod";
import { Hono } from "hono";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { 
  Configuration, 
  CountryCode, 
  PlaidApi, 
  PlaidEnvironments, 
  Products
} from "plaid";

import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { convertAmountToMiliunits } from "@/app/(components)/(content-layout)/finance/utils";

const configuration = new Configuration({
  basePath: process.env.PLAID_ENVIRONMENT === "production" 
    ? PlaidEnvironments.production 
    : PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_TOKEN!,
      "PLAID-SECRET": process.env.PLAID_SECRET_TOKEN!,
    },
  },
});

const client = new PlaidApi(configuration);

const app = new Hono()
  .get(
    "/connected-bank",
    async (c) => {
      try {
        const { user } = await validateRequest();

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const connectedBank = await db.connectedBank.findFirst({
          where: {
            userId: user.id,
          },
        });

        return c.json({ data: connectedBank || null });
      } catch (error) {
        console.error("Error fetching connected bank:", error);
        return c.json({ error: "Failed to fetch connected bank" }, 500);
      }
    }
  )
  .delete(
    "/connected-bank",
    async (c) => {
      try {
        const { user } = await validateRequest();

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Use transaction to ensure data consistency
        const result = await db.$transaction(async (tx) => {
          // First, delete the connected bank
          const deletedBank = await tx.connectedBank.delete({
            where: {
              userId: user.id,
            },
          });

          if (!deletedBank) {
            throw new Error("Not found");
          }

          // Get plaid accounts and categories for this user
          const plaidAccounts = await tx.account.findMany({
            where: {
              userId: user.id,
              plaidId: { not: null },
            },
            select: { id: true },
          });

          const plaidCategories = await tx.categoryFinance.findMany({
            where: {
              userId: user.id,
              plaidId: { not: null },
            },
            select: { id: true },
          });

          const accountIds = plaidAccounts.map(acc => acc.id);
          const categoryIds = plaidCategories.map(cat => cat.id);

          // Delete transactions associated with plaid accounts
          if (accountIds.length > 0) {
            await tx.transaction.deleteMany({
              where: {
                accountId: { in: accountIds },
              },
            });
          }

          // Delete plaid accounts
          if (accountIds.length > 0) {
            await tx.account.deleteMany({
              where: {
                id: { in: accountIds },
                userId: user.id,
              },
            });
          }

          // Only delete categories if they're not used in any remaining transactions
          for (const category of plaidCategories) {
            const transactionCount = await tx.transaction.count({
              where: {
                categoryId: category.id,
              },
            });

            if (transactionCount === 0) {
              await tx.categoryFinance.delete({
                where: {
                  id: category.id,
                  userId: user.id,
                },
              });
            } else {
              // If category is used, just remove plaidId but keep the category
              await tx.categoryFinance.update({
                where: {
                  id: category.id,
                  userId: user.id,
                },
                data: {
                  plaidId: null,
                },
              });
            }
          }

          return deletedBank;
        });

        return c.json({ 
          data: { id: result.id },
          message: "Connected bank and associated data removed successfully" 
        });
      } catch (error) {
        console.error("Error deleting connected bank:", error);
        
    
        
        return c.json({ error: "Failed to delete connected bank" }, 500);
      }
    }
  )
  .post(
    "/create-link-token",
    async (c) => {
      try {
        const { user } = await validateRequest();

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Check if user already has a connected bank
        const existingBank = await db.connectedBank.findFirst({
          where: {
            userId: user.id,
          },
        });

        // If user already has a connected bank, get their access token
        let accessToken: string | undefined;
        if (existingBank) {
          accessToken = existingBank.accessToken;
        }

        const tokenResponse = await client.linkTokenCreate({
          user: {
            client_user_id: user.id,
          },
          client_name: process.env.APP_NAME || "Finance App",
          products: [Products.Transactions],
          country_codes: [CountryCode.US],
          language: "en",
          access_token: accessToken, // Include if reconnecting
        });

        return c.json({ 
          data: { 
            link_token: tokenResponse.data.link_token,
            hasExistingConnection: !!existingBank 
          } 
        });
      } catch (error) {
        console.error("Error creating link token:", error);
        return c.json({ error: "Failed to create link token" }, 500);
      }
    }
  )
  .post(
    "/exchange-public-token",
    zValidator(
      "json",
      z.object({
        publicToken: z.string(),
      }),
    ),
    async (c) => {
      try {
        const { user } = await validateRequest();
        const { publicToken } = c.req.valid("json");

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Exchange public token for access token
        const exchangeResponse = await client.itemPublicTokenExchange({
          public_token: publicToken,
        });

        const { access_token, item_id } = exchangeResponse.data;

        // Check if this item is already connected for this user
        const existingConnection = await db.connectedBank.findFirst({
          where: {
            userId: user.id,
          },
        });

        let connectedBank;
        
        if (existingConnection) {
          // Update existing connection
          connectedBank = await db.connectedBank.update({
            where: {
              id: existingConnection.id,
            },
            data: {
              accessToken: access_token,
            },
          });
        } else {
          // Create new connection
          connectedBank = await db.connectedBank.create({
            data: {
              id: createId(),
              userId: user.id,
              accessToken: access_token,
            },
          });
        }

        // Get accounts from Plaid
        const accountsResponse = await client.accountsGet({
          access_token: access_token,
        });

        // Get categories from Plaid
        const categoriesResponse = await client.categoriesGet({});

        // Sync transactions
        const transactionsResponse = await client.transactionsSync({
          access_token: access_token,
        });

        // Process accounts
        const accountPromises = accountsResponse.data.accounts.map(async (plaidAccount) => {
          // Check if account already exists
          const existingAccount = await db.account.findFirst({
            where: {
              userId: user.id,
              plaidId: plaidAccount.account_id,
            },
          });

          if (existingAccount) {
            // Update existing account
            return await db.account.update({
              where: { id: existingAccount.id },
              data: {
                name: plaidAccount.name,
              },
            });
          } else {
            // Create new account
            return await db.account.create({
              data: {
                id: createId(),
                userId: user.id,
                name: plaidAccount.name,
                plaidId: plaidAccount.account_id,
              },
            });
          }
        });

        const accounts = await Promise.all(accountPromises);

        // Process categories
        const categoryPromises = categoriesResponse.data.categories.map(async (plaidCategory) => {
          const categoryName = plaidCategory.hierarchy.join(", ");
          
          // Check if category already exists
          const existingCategory = await db.categoryFinance.findFirst({
            where: {
              userId: user.id,
              plaidId: plaidCategory.category_id,
            },
          });

          if (existingCategory) {
            // Update existing category
            return await db.categoryFinance.update({
              where: { id: existingCategory.id },
              data: {
                name: categoryName,
              },
            });
          } else {
            // Create new category
            return await db.categoryFinance.create({
              data: {
                id: createId(),
                userId: user.id,
                name: categoryName,
                plaidId: plaidCategory.category_id,
              },
            });
          }
        });

        const categories = await Promise.all(categoryPromises);

        // Process new transactions
        const newTransactions = transactionsResponse.data.added;
        
        if (newTransactions.length > 0) {
          const transactionPromises = newTransactions.map(async (plaidTransaction) => {
            try {
              const account = accounts.find(acc => acc.plaidId === plaidTransaction.account_id);
              
              if (!account) {
                console.warn(`Account not found for transaction: ${plaidTransaction.transaction_id}`);
                return null;
              }

              // Find category by plaidId
              const category = categories.find(cat => cat.plaidId === plaidTransaction.category_id);
              
              const amountInMiliunits = convertAmountToMiliunits(plaidTransaction.amount);
              
              // Check if transaction already exists
              const existingTransaction = await db.transaction.findFirst({
                where: {
                  // Assuming you have a plaidTransactionId field, if not you might want to add one
                  // For now, we'll check based on amount, date, and account
                  accountId: account.id,
                  amount: amountInMiliunits,
                  date: new Date(plaidTransaction.date),
                  payee: plaidTransaction.merchant_name || plaidTransaction.name,
                },
              });

              if (existingTransaction) {
                // Update existing transaction
                return await db.transaction.update({
                  where: { id: existingTransaction.id },
                  data: {
                    amount: amountInMiliunits,
                    payee: plaidTransaction.merchant_name || plaidTransaction.name,
                    notes: plaidTransaction.name,
                    date: new Date(plaidTransaction.date),
                    categoryId: category?.id,
                  },
                });
              } else {
                // Create new transaction
                return await db.transaction.create({
                  data: {
                    id: createId(),
                    amount: amountInMiliunits,
                    payee: plaidTransaction.merchant_name || plaidTransaction.name,
                    notes: plaidTransaction.name,
                    date: new Date(plaidTransaction.date),
                    accountId: account.id,
                    categoryId: category?.id,
                  },
                });
              }
            } catch (error) {
              console.error("Error processing transaction:", error);
              return null;
            }
          });

          const createdTransactions = await Promise.all(transactionPromises);
          const successfulTransactions = createdTransactions.filter(t => t !== null);

          return c.json({ 
            data: {
              bankConnected: true,
              accountsSynced: accounts.length,
              categoriesSynced: categories.length,
              transactionsSynced: successfulTransactions.length,
              message: "Bank connected successfully and data synced"
            }
          }, 200);
        }

        return c.json({ 
          data: {
            bankConnected: true,
            accountsSynced: accounts.length,
            categoriesSynced: categories.length,
            transactionsSynced: 0,
            message: "Bank connected successfully"
          }
        }, 200);

      } catch (error) {
        console.error("Error exchanging public token:", error);
        

        
        return c.json({ error: "Failed to connect bank" }, 500);
      }
    }
  );

export default app;