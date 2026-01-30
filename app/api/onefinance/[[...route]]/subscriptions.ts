import crypto from "crypto";
import { Hono } from "hono";
import { createId } from "@paralleldrive/cuid2";
import { createCheckout, getSubscription } from "@lemonsqueezy/lemonsqueezy.js";

import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { setupLemon } from "@/app/(components)/(content-layout)/finance/ls";

setupLemon();

const app = new Hono()
  .get(
    "/current",
    async (c) => {
      try {
        const { user } = await validateRequest();

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const subscription = await db.subscriptionFinance.findUnique({
          where: {
            userId: user.id,
          },
        });

        return c.json({ data: subscription || null });
      } catch (error) {
        console.error("Error fetching subscription:", error);
        return c.json({ error: "Failed to fetch subscription" }, 500);
      }
    }
  )
  .post(
    "/checkout",
    async (c) => {
      try {
        const { user } = await validateRequest();

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Check if user already has a subscription
        const existingSubscription = await db.subscriptionFinance.findUnique({
          where: {
            userId: user.id,
          },
        });

        // If user has an existing subscription with Lemon Squeezy
        if (existingSubscription?.subscriptionId) {
          try {
            const subscription = await getSubscription(existingSubscription.subscriptionId);
            const portalUrl = subscription.data?.data.attributes.urls.customer_portal;

            if (!portalUrl) {
              return c.json({ error: "Failed to get customer portal URL" }, 500);
            }

            return c.json({ 
              data: { 
                url: portalUrl,
                type: "portal" 
              } 
            });
          } catch (error) {
            console.error("Error getting subscription:", error);
            // If we can't get the portal, create a new checkout
          }
        }

        // Create new checkout
        const checkout = await createCheckout(
          process.env.LEMONSQUEEZY_STORE_ID!,
          process.env.LEMONSQUEEZY_PRODUCT_ID!,
          {
            checkoutData: {
              custom: {
                user_id: user.id,
                user_email: user.email, // Add email if available
              },
            },
            productOptions: {
              redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL!}/finance/dashboard`,
              receiptButtonText: "Go to Dashboard",
              receiptThankYouNote: "Thank you for subscribing!",
            }
          }
        );

        const checkoutUrl = checkout.data?.data.attributes.url;

        if (!checkoutUrl) {
          return c.json({ error: "Failed to create checkout URL" }, 500);
        }

        return c.json({ 
          data: { 
            url: checkoutUrl,
            type: "checkout" 
          } 
        });
      } catch (error) {
        console.error("Error creating checkout:", error);
        
        if (error instanceof Error && error.message.includes("store_id")) {
          return c.json({ error: "Invalid store configuration" }, 500);
        }
        
        return c.json({ error: "Failed to create checkout" }, 500);
      }
    }
  )
  .post(
    "/webhook",
    async (c) => {
      try {
        const rawBody = await c.req.text();
        
        // Verify webhook signature
        const hmac = crypto.createHmac(
          "sha256",
          process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
        );
        const digest = hmac.update(rawBody).digest("hex");
        const signature = c.req.header("x-signature");

        if (!signature || !crypto.timingSafeEqual(
          Buffer.from(digest, "utf8"),
          Buffer.from(signature, "utf8")
        )) {
          console.error("Invalid webhook signature");
          return c.json({ error: "Invalid signature" }, 401);
        }

        const payload = JSON.parse(rawBody);
        const event = payload.meta.event_name;
        const subscriptionId = payload.data.id;
        const userId = payload.meta.custom_data?.user_id;
        const status = payload.data.attributes.status;

        // Log webhook for debugging
        console.log(`Webhook received: ${event} for subscription ${subscriptionId}`);

        // Validate required fields
        if (!subscriptionId || !userId) {
          console.error("Missing required fields in webhook payload");
          return c.json({ error: "Missing required fields" }, 400);
        }

        // Handle different events
        switch (event) {
          case "subscription_created":
          case "subscription_updated":
          case "subscription_cancelled":
          case "subscription_resumed":
          case "subscription_expired":
          case "subscription_paused":
          case "subscription_unpaused":
            await handleSubscriptionUpdate(subscriptionId, userId, status);
            break;

          case "order_created":
          case "order_refunded":
            // Handle order events if needed
            console.log(`Order event: ${event}`);
            break;

          default:
            console.log(`Unhandled event type: ${event}`);
        }

        return c.json({ success: true }, 200);
      } catch (error) {
        console.error("Error processing webhook:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );

// Helper function to handle subscription updates
async function handleSubscriptionUpdate(
  subscriptionId: string, 
  userId: string, 
  status: string
) {
  try {
    // Check if subscription already exists
    const existingSubscription = await db.subscriptionFinance.findUnique({
      where: {
        subscriptionId: subscriptionId,
      },
    });

    if (existingSubscription) {
      // Update existing subscription
      await db.subscriptionFinance.update({
        where: {
          subscriptionId: subscriptionId,
        },
        data: {
          status: status,
          userId: userId, // In case user_id changed (shouldn't happen)
        },
      });
      console.log(`Updated subscription ${subscriptionId} to status: ${status}`);
    } else {
      // Create new subscription
      // Check if user already has a subscription
      const userSubscription = await db.subscriptionFinance.findUnique({
        where: {
          userId: userId,
        },
      });

      if (userSubscription) {
        // User already has a subscription, update it
        await db.subscriptionFinance.update({
          where: {
            userId: userId,
          },
          data: {
            subscriptionId: subscriptionId,
            status: status,
          },
        });
        console.log(`Updated user ${userId} subscription to ${subscriptionId} with status: ${status}`);
      } else {
        // Create new subscription
        await db.subscriptionFinance.create({
          data: {
            id: createId(),
            subscriptionId: subscriptionId,
            userId: userId,
            status: status,
          },
        });
        console.log(`Created new subscription ${subscriptionId} for user ${userId} with status: ${status}`);
      }
    }
  } catch (error) {
    console.error("Error in handleSubscriptionUpdate:", error);
    throw error;
  }
}

export default app;