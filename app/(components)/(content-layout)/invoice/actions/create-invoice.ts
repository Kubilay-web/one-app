"use server";

import db from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/app/auth";
import { getInvoiceQuota } from "./limits";
import { CreateInvoiceData, InvoiceStatus, InvoiceTemplate, InvoiceWithRelations, UpdateInvoiceData } from "../types/create-invoice";



// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const { user } = await validateRequest();

  if (!user?.email) {
    throw new Error("Unauthorized");
  }

  const userData = await db.user.findUnique({
    where: { email: user.email },
    include: {
      subscription: true,
      brand: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return userData;
}

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Helper function to generate unique invoice number
export async function generateInvoiceNumber(): Promise<string> {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    // Get current year
    const currentYear = new Date().getFullYear();

    // Count existing invoices for this year to get next sequence
    const existingInvoicesCount = await db.invoiceModel.count({
      where: {
        userId,
        invoiceDate: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
    });

    // Generate invoice number: INV-YYYY-XXXX
    const sequence = (existingInvoicesCount + 1).toString().padStart(4, "0");
    return `INV-${currentYear}-${sequence}`;
  } catch (error) {
    // Fallback to random number if database query fails
    const prefix = "INV";
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomDigits}-${timestamp}`;
  }
}

// Get all invoices with pagination
export async function getInvoices(
  page: number = 1,
  limit: number = 10,
  status?: InvoiceStatus,
  clientId?: string
): Promise<{
  invoices: InvoiceWithRelations[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    const offset = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
      ...(clientId && { clientId }),
    };

    const [invoices, totalCount] = await Promise.all([
      db.invoiceModel.findMany({
        where,
        include: {
          client: true,
          items: {
            orderBy: { itemOrder: "asc" },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      db.invoiceModel.count({ where }),
    ]);

    // Get brand for each invoice (brand is per user, not per invoice)
    const brand = await db.brand.findUnique({
      where: { userId },
    });

    const formattedInvoices: InvoiceWithRelations[] = invoices.map((invoice) => ({
      ...invoice,
      invoiceDate: invoice.invoiceDate.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      sentAt: invoice.sentAt?.toISOString() || null,
      viewedAt: invoice.viewedAt?.toISOString() || null,
      paidAt: invoice.paidAt?.toISOString() || null,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      client: {
        ...invoice.client,
        createdAt: invoice.client.createdAt.toISOString(),
        updatedAt: invoice.client.updatedAt.toISOString(),
      },
      items: invoice.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      brand: brand ? {
        ...brand,
        createdAt: brand.createdAt.toISOString(),
        updatedAt: brand.updatedAt.toISOString(),
      } : null,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return {
      invoices: formattedInvoices,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw new Error("Unauthorized");
    }
    return {
      invoices: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// Get single invoice by ID
export async function getInvoiceById(invoiceId: string): Promise<InvoiceWithRelations | null> {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    const invoice = await db.invoiceModel.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
      include: {
        client: true,
        items: {
          orderBy: { itemOrder: "asc" },
        },
      },
    });

    if (!invoice) {
      return null;
    }

    const brand = await db.brand.findUnique({
      where: { userId },
    });

    return {
      ...invoice,
      invoiceDate: invoice.invoiceDate.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      sentAt: invoice.sentAt?.toISOString() || null,
      viewedAt: invoice.viewedAt?.toISOString() || null,
      paidAt: invoice.paidAt?.toISOString() || null,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      client: {
        ...invoice.client,
        createdAt: invoice.client.createdAt.toISOString(),
        updatedAt: invoice.client.updatedAt.toISOString(),
      },
      items: invoice.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      brand: brand ? {
        ...brand,
        createdAt: brand.createdAt.toISOString(),
        updatedAt: brand.updatedAt.toISOString(),
      } : null,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw new Error("Unauthorized");
    }
    return null;
  }
}

// Create invoice
export async function createInvoice(data: CreateInvoiceData) {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    // Check invoice quota before proceeding
    const quota = await getInvoiceQuota(userId);
    if (!quota) {
      return {
        success: false,
        error: "Unable to verify invoice quota",
      };
    }
    if (!quota.hasUnlimited && quota.remaining <= 0) {
      return {
        success: false,
        error: `You've reached your daily limit of ${quota.dailyLimit} invoices. Please try again after ${quota.resetTime.toLocaleTimeString()} or upgrade your plan.`,
      };
    }

    // Parse dates
    const invoiceDate = new Date(data.invoiceDate);
    const dueDate = new Date(data.invoiceDueDate);

    // Validate dates
    if (isNaN(invoiceDate.getTime()) || isNaN(dueDate.getTime())) {
      return {
        success: false,
        error: "Invalid date format",
      };
    }

    // Validate items
    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        error: "At least one item is required",
      };
    }

    // Generate invoice number if not provided
    const invoiceNumber = data.invoiceNumber || await generateInvoiceNumber();

    // Start a transaction
    const result = await db.$transaction(async (tx) => {
      // 1. Get or create brand (optional - only update if data provided)
      let brand = await tx.brand.findUnique({
        where: { userId },
      });

      if (!brand && (data.companyName || data.companyEmail)) {
        // Create new brand only if company info is provided
        brand = await tx.brand.create({
          data: {
            userId,
            name: data.companyName || "My Company",
            logo: data.logoUrl,
            phone: data.companyPhone,
            address: data.companyAddress,
            email: data.companyEmail,
            paymentInfo: data.paymentInfo,
            thankYouMsg: data.thankYouMessage,
            contactInfo: data.contactInfo,
            taxRate: data.taxRate ? Number(data.taxRate) : null,
            salesTax: data.salesTax ? Number(data.salesTax) : null,
            otherCharges: data.other ? Number(data.other) : null,
            template: InvoiceTemplate.PROFESSIONAL,
          },
        });
      } else if (brand && (data.companyName || data.companyEmail)) {
        // Update existing brand with latest info
        brand = await tx.brand.update({
          where: { userId },
          data: {
            name: data.companyName,
            logo: data.logoUrl,
            phone: data.companyPhone,
            address: data.companyAddress,
            email: data.companyEmail,
            paymentInfo: data.paymentInfo,
            thankYouMsg: data.thankYouMessage,
            contactInfo: data.contactInfo,
            taxRate: data.taxRate ? Number(data.taxRate) : null,
            salesTax: data.salesTax ? Number(data.salesTax) : null,
            otherCharges: data.other ? Number(data.other) : null,
          },
        });
      }

      // 2. Create or find client
      let client = await tx.client.findFirst({
        where: {
          userId,
          OR: [
            { companyName: data.billToCompanyName },
            {
              AND: [
                { contactPerson: data.billToContactPerson },
                { phone: data.billToPhone },
              ],
            },
          ],
        },
      });

      if (!client) {
        // Create new client
        client = await tx.client.create({
          data: {
            userId,
            contactPerson: data.billToContactPerson,
            companyName: data.billToCompanyName,
            location: data.billToLocation,
            phone: data.billToPhone,
            email: data.billToEmail || "",
            customerID: data.customerID,
          },
        });
      }

      // 3. Create invoice
      const invoice = await tx.invoiceModel.create({
        data: {
          userId,
          clientId: client.id,
          invoiceNumber,
          invoiceDate,
          dueDate,
          preparedBy: data.preparedBy,
          status: InvoiceStatus.DRAFT,
          subtotal: Number(data.subtotal),
          taxAmount: Number(data.salesTax || 0),
          totalAmount: Number(data.total),
          notes: data.notes || data.contactInfo,
          terms: data.terms || data.paymentInfo,
        },
      });

      // 4. Create invoice items
      const invoiceItems = await Promise.all(
        data.items
          .filter((item) => item.quantity > 0 && item.description.trim() !== "")
          .map((item, index) =>
            tx.invoiceItem.create({
              data: {
                invoiceId: invoice.id,
                description: item.description,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                totalPrice: Number(item.amount),
                itemOrder: item.itemOrder || index + 1,
              },
            })
          )
      );

      // 5. Update user invoice counters
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await tx.user.update({
        where: { id: userId },
        data: {
          dailyInvoicesCreated: {
            increment: 1,
          },
          lastInvoiceDate: new Date(),
          totalInvoicesCreated: {
            increment: 1,
          },
        },
      });

      return {
        invoice,
        client,
        brand,
        items: invoiceItems,
      };
    });

    // Revalidate pages
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        ...result,
        invoice: {
          ...result.invoice,
          invoiceDate: result.invoice.invoiceDate.toISOString(),
          dueDate: result.invoice.dueDate.toISOString(),
          createdAt: result.invoice.createdAt.toISOString(),
          updatedAt: result.invoice.updatedAt.toISOString(),
        },
      },
      message: "Invoice created successfully",
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create invoice",
    };
  }
}

// Update invoice
export async function updateInvoice(invoiceId: string, data: UpdateInvoiceData) {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    // Check if invoice exists and belongs to user
    const existingInvoice = await db.invoiceModel.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
    });

    if (!existingInvoice) {
      return { success: false, error: "Invoice not found" };
    }

    // Parse dates if provided
    const dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
    if (dueDate && isNaN(dueDate.getTime())) {
      return { success: false, error: "Invalid due date format" };
    }

    // Start transaction
    const result = await db.$transaction(async (tx) => {
      // Update invoice
      const invoice = await tx.invoiceModel.update({
        where: { id: invoiceId },
        data: {
          clientId: data.clientId,
          dueDate,
          preparedBy: data.preparedBy,
          notes: data.notes,
          terms: data.terms,
          status: data.status,
          subtotal: data.subtotal ? Number(data.subtotal) : undefined,
          taxAmount: data.taxAmount ? Number(data.taxAmount) : undefined,
          totalAmount: data.totalAmount ? Number(data.totalAmount) : undefined,
        },
      });

      // Update items if provided
      if (data.items) {
        // Delete existing items
        await tx.invoiceItem.deleteMany({
          where: { invoiceId },
        });

        // Create new items
        const items = await Promise.all(
          data.items
            .filter((item) => item.quantity > 0 && item.description.trim() !== "")
            .map((item, index) =>
              tx.invoiceItem.create({
                data: {
                  invoiceId,
                  description: item.description,
                  quantity: Number(item.quantity),
                  unitPrice: Number(item.unitPrice),
                  totalPrice: Number(item.amount || (item.quantity * item.unitPrice)),
                  itemOrder: item.itemOrder || index + 1,
                },
              })
            )
        );

        return { invoice, items };
      }

      return { invoice, items: null };
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return {
      success: true,
      data: {
        ...result.invoice,
        invoiceDate: result.invoice.invoiceDate.toISOString(),
        dueDate: result.invoice.dueDate.toISOString(),
        createdAt: result.invoice.createdAt.toISOString(),
        updatedAt: result.invoice.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating invoice:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update invoice",
    };
  }
}

// Delete invoice
export async function deleteInvoice(invoiceId: string) {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    // Check if invoice exists and belongs to user
    const invoice = await db.invoiceModel.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
    });

    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    // Start transaction
    await db.$transaction(async (tx) => {
      // Delete invoice items first
      await tx.invoiceItem.deleteMany({
        where: { invoiceId },
      });

      // Delete invoice
      await tx.invoiceModel.delete({
        where: { id: invoiceId },
      });
    });

    revalidatePath("/dashboard/invoices");

    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete invoice",
    };
  }
}

// Update invoice status
export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    const invoice = await db.invoiceModel.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
    });

    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    const updateData: any = { status };

    // Set timestamps based on status
    if (status === InvoiceStatus.SENT && !invoice.sentAt) {
      updateData.sentAt = new Date();
    } else if (status === InvoiceStatus.PAID && !invoice.paidAt) {
      updateData.paidAt = new Date();
    } else if (status === InvoiceStatus.VIEWED && !invoice.viewedAt) {
      updateData.viewedAt = new Date();
    }

    const updatedInvoice = await db.invoiceModel.update({
      where: { id: invoiceId },
      data: updateData,
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return {
      success: true,
      invoice: {
        ...updatedInvoice,
        invoiceDate: updatedInvoice.invoiceDate.toISOString(),
        dueDate: updatedInvoice.dueDate.toISOString(),
        createdAt: updatedInvoice.createdAt.toISOString(),
        updatedAt: updatedInvoice.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update invoice status",
    };
  }
}

// Mark invoice as sent
export async function markInvoiceAsSent(invoiceId: string) {
  return updateInvoiceStatus(invoiceId, InvoiceStatus.SENT);
}

// Mark invoice as paid
export async function markInvoiceAsPaid(invoiceId: string) {
  return updateInvoiceStatus(invoiceId, InvoiceStatus.PAID);
}

// Get invoice statistics
export async function getInvoiceStats() {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalInvoices,
      draftInvoices,
      sentInvoices,
      paidInvoices,
      overdueInvoices,
      todayInvoices,
      monthInvoices,
      yearInvoices,
      totalRevenue,
      monthRevenue,
      yearRevenue,
    ] = await Promise.all([
      db.invoiceModel.count({ where: { userId } }),
      db.invoiceModel.count({ where: { userId, status: InvoiceStatus.DRAFT } }),
      db.invoiceModel.count({ where: { userId, status: InvoiceStatus.SENT } }),
      db.invoiceModel.count({ where: { userId, status: InvoiceStatus.PAID } }),
      db.invoiceModel.count({
        where: {
          userId,
          status: { not: InvoiceStatus.PAID },
          dueDate: { lt: new Date() },
        },
      }),
      db.invoiceModel.count({
        where: {
          userId,
          createdAt: { gte: today, lt: tomorrow },
        },
      }),
      db.invoiceModel.count({
        where: {
          userId,
          createdAt: { gte: firstDayOfMonth },
        },
      }),
      db.invoiceModel.count({
        where: {
          userId,
          createdAt: { gte: firstDayOfYear },
        },
      }),
      db.invoiceModel.aggregate({
        where: { userId, status: InvoiceStatus.PAID },
        _sum: { totalAmount: true },
      }),
      db.invoiceModel.aggregate({
        where: {
          userId,
          status: InvoiceStatus.PAID,
          paidAt: { gte: firstDayOfMonth },
        },
        _sum: { totalAmount: true },
      }),
      db.invoiceModel.aggregate({
        where: {
          userId,
          status: InvoiceStatus.PAID,
          paidAt: { gte: firstDayOfYear },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      success: true,
      stats: {
        total: totalInvoices,
        draft: draftInvoices,
        sent: sentInvoices,
        paid: paidInvoices,
        overdue: overdueInvoices,
        today: todayInvoices,
        thisMonth: monthInvoices,
        thisYear: yearInvoices,
        revenue: {
          total: Number(totalRevenue._sum.totalAmount || 0),
          thisMonth: Number(monthRevenue._sum.totalAmount || 0),
          thisYear: Number(yearRevenue._sum.totalAmount || 0),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching invoice stats:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to fetch invoice statistics" };
  }
}

// Search invoices
export async function searchInvoices(searchTerm: string) {
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;

    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const invoices = await db.invoiceModel.findMany({
      where: {
        userId,
        OR: [
          { invoiceNumber: { contains: searchTerm, mode: "insensitive" } },
          { client: { companyName: { contains: searchTerm, mode: "insensitive" } } },
          { client: { contactPerson: { contains: searchTerm, mode: "insensitive" } } },
        ],
      },
      include: {
        client: true,
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    return invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client.companyName,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      dueDate: invoice.dueDate.toISOString(),
    }));
  } catch (error) {
    console.error("Error searching invoices:", error);
    return [];
  }
}