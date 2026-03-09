"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { stripe } from "../config/stripe";
import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "REFUNDED";
  description: string | null;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  interval: string | null;
  paidAt?: string;
  failedAt?: string;
  refundedAt?: string;
  receiptUrl?: string | null;
  invoiceUrl?: string | null;
  createdAt: string;
}

interface Subscription {
  id: string;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelAt?: string;
  priceAmount?: number;
  priceCurrency: string;
  interval?: string;
}

// Get user session and validate
async function getAuthenticatedUser() {
  const { user } = await validateRequest();

  if (!user?.email) {
    throw new Error("Unauthorized");
  }

  const userData = await db.user.findUnique({
    where: { email: user.email },
    include: { 
      subscription: true,
      brand: true
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return userData;
}

// Server action to fetch subscription data
export async function getSubscriptionData(): Promise<Subscription | null> {
  try {
    const user = await getAuthenticatedUser();

    if (!user.subscription) {
      return null;
    }


        console.log("SUBSCRIPTION:", user.subscription);



    return {
      id: user.subscription.id,
      plan: user.subscription.plan,
      status: user.subscription.status,
      currentPeriodStart: user.subscription.currentPeriodStart?.toISOString(),
      currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString(),
      cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
      cancelAt: user.subscription.cancelAt?.toISOString(),
      priceAmount: user.subscription.priceAmount || 0,
      priceCurrency: user.subscription.priceCurrency || "usd",
      interval: user.subscription.interval || "",
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

export async function getInvoiceCount(): Promise<number> {
  try {
    const user = await getAuthenticatedUser();

    // Invoice count from the InvoiceModel
    const count = await db.invoiceModel.count({
      where: { userId: user.id },
    });

    return count;
  } catch (error) {
    console.error("Error fetching invoice count:", error);
    return 0;
  }
}

// Server action to fetch payments/invoices
export async function getPayments(
  page: number = 1,
  limit: number = 10
): Promise<{
  payments: Payment[];
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

    const offset = (page - 1) * limit;

    const [payments, totalCount] = await Promise.all([
      db.paymentInvoice.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          stripePaymentId: true,
          amount: true,
          currency: true,
          status: true,
          description: true,
          plan: true,
          interval: true,
          paidAt: true,
          failedAt: true,
          refundedAt: true,
          receiptUrl: true,
          invoiceUrl: true,
          createdAt: true,
        },
      }),
      db.paymentInvoice.count({
        where: { userId: user.id },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      payments: payments.map((payment) => ({
        ...payment,
        paidAt: payment.paidAt?.toISOString(),
        failedAt: payment.failedAt?.toISOString(),
        refundedAt: payment.refundedAt?.toISOString(),
        createdAt: payment.createdAt.toISOString(),
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return {
      payments: [],
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

// Server action to cancel subscription
export async function cancelSubscription(immediate: boolean = false): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const user = await getAuthenticatedUser();

    if (!user.subscription) {
      return {
        success: false,
        message: "No active subscription found",
      };
    }

    const subscription = user.subscription;

    // If it's a Stripe subscription, cancel it through Stripe
    if (subscription.stripeSubscriptionId) {
      if (immediate) {
        // Cancel immediately
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      } else {
        // Cancel at period end
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
      }
    }

    // Update our database
    await db.subscriptionInvoice.update({
      where: { userId: user.id },
      data: {
        cancelAtPeriodEnd: !immediate,
        cancelAt: immediate ? new Date() : subscription.currentPeriodEnd,
        canceledAt: immediate ? new Date() : null,
        status: immediate ? "CANCELLED" : subscription.status,
      },
    });

    revalidatePath("/dashboard/billing");

    return {
      success: true,
      message: immediate
        ? "Subscription cancelled immediately"
        : "Subscription will be cancelled at the end of the current period",
    };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return {
      success: false,
      message: "Failed to cancel subscription",
    };
  }
}

// Server action to create customer portal session
export async function createCustomerPortalSession(): Promise<{
  success: boolean;
  url?: string;
  message?: string;
}> {
  try {
    const user = await getAuthenticatedUser();

    if (!user.stripeCustomerId) {
      return {
        success: false,
        message: "No Stripe customer found",
      };
    }

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard/billing`,
    });

    return {
      success: true,
      url: portalSession.url,
    };
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return {
      success: false,
      message: "Failed to create portal session",
    };
  }
}

// Server action to redirect to checkout with selected plan
export async function redirectToCheckout(planType: "monthly" | "yearly") {
  const validPlans = ["monthly", "yearly"];

  if (!validPlans.includes(planType)) {
    throw new Error("Invalid plan type");
  }

  // Redirect will be handled on client side
  return { success: true, planType };
}

// Invoice Generator Server Actions

// Brand Management
export async function getBrand() {
  try {
    const user = await getAuthenticatedUser();
    
    const brand = await db.brand.findUnique({
      where: { userId: user.id },
    });

    return brand;
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
}

export async function createOrUpdateBrand(data: {
  name: string;
  logo?: string;
  currency?: string;
  slogan?: string;
  phone?: string;
  address?: string;
  email?: string;
  brandColor?: string;
  template?: "PROFESSIONAL" | "MODERN" | "CLASSIC" | "MINIMAL";
  paymentInfo?: string;
  thankYouMsg?: string;
  contactInfo?: string;
  taxRate?: number;
  salesTax?: number;
  otherCharges?: number;
}) {
  try {
    const user = await getAuthenticatedUser();

    const brand = await db.brand.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        userId: user.id,
        ...data,
      },
    });

    revalidatePath("/dashboard/brand");
    return { success: true, brand };
  } catch (error) {
    console.error("Error saving brand:", error);
    return { success: false, error: "Failed to save brand" };
  }
}

// Client Management
export async function getClients(page: number = 1, limit: number = 10) {
  try {
    const user = await getAuthenticatedUser();
    const offset = (page - 1) * limit;

    const [clients, totalCount] = await Promise.all([
      db.client.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: { invoices: true },
          },
        },
      }),
      db.client.count({
        where: { userId: user.id },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      clients,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return {
      clients: [],
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

export async function createClient(data: {
  contactPerson: string;
  companyName: string;
  location?: string;
  phone?: string;
  email?: string;
  customerID?: string;
  notes?: string;
}) {
  try {
    const user = await getAuthenticatedUser();

    // Check invoice limit for FREE plan
    if (user.subscription?.plan === "FREE") {
      const invoiceCount = await db.invoiceModel.count({
        where: { userId: user.id },
      });

      const planLimit = await db.planLimit.findUnique({
        where: { plan: "FREE" },
      });

      if (planLimit?.maxDailyInvoices && invoiceCount >= planLimit.maxDailyInvoices) {
        return {
          success: false,
          error: "You have reached your daily invoice limit. Please upgrade your plan.",
        };
      }
    }

    const client = await db.client.create({
      data: {
        userId: user.id,
        ...data,
      },
    });

    revalidatePath("/dashboard/clients");
    return { success: true, client };
  } catch (error) {
    console.error("Error creating client:", error);
    return { success: false, error: "Failed to create client" };
  }
}

export async function updateClient(
  clientId: string,
  data: {
    contactPerson?: string;
    companyName?: string;
    location?: string;
    phone?: string;
    email?: string;
    customerID?: string;
    notes?: string;
    isActive?: boolean;
  }
) {
  try {
    const user = await getAuthenticatedUser();

    const client = await db.client.update({
      where: { 
        id: clientId,
        userId: user.id,
      },
      data,
    });

    revalidatePath("/dashboard/clients");
    return { success: true, client };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false, error: "Failed to update client" };
  }
}

export async function deleteClient(clientId: string) {
  try {
    const user = await getAuthenticatedUser();

    await db.client.delete({
      where: { 
        id: clientId,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/clients");
    return { success: true };
  } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false, error: "Failed to delete client" };
  }
}

// Invoice Management
export async function getInvoices(page: number = 1, limit: number = 10) {
  try {
    const user = await getAuthenticatedUser();
    const offset = (page - 1) * limit;

    const [invoices, totalCount] = await Promise.all([
      db.invoiceModel.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          client: true,
          items: true,
        },
      }),
      db.invoiceModel.count({
        where: { userId: user.id },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      invoices: invoices.map(invoice => ({
        ...invoice,
        invoiceDate: invoice.invoiceDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        sentAt: invoice.sentAt?.toISOString(),
        viewedAt: invoice.viewedAt?.toISOString(),
        paidAt: invoice.paidAt?.toISOString(),
        createdAt: invoice.createdAt.toISOString(),
      })),
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

export async function getInvoice(invoiceId: string) {
  try {
    const user = await getAuthenticatedUser();

    const invoice = await db.invoiceModel.findFirst({
      where: { 
        id: invoiceId,
        userId: user.id,
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

    return {
      ...invoice,
      invoiceDate: invoice.invoiceDate.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      sentAt: invoice.sentAt?.toISOString(),
      viewedAt: invoice.viewedAt?.toISOString(),
      paidAt: invoice.paidAt?.toISOString(),
      createdAt: invoice.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}

export async function createInvoice(data: {
  clientId: string;
  invoiceDate?: Date;
  dueDate: Date;
  preparedBy?: string;
  notes?: string;
  terms?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    itemOrder?: number;
  }>;
}) {
  try {
    const user = await getAuthenticatedUser();

    // Check invoice limit for FREE plan
    if (user.subscription?.plan === "FREE") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const invoiceCount = await db.invoiceModel.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      const planLimit = await db.planLimit.findUnique({
        where: { plan: "FREE" },
      });

      if (planLimit?.maxDailyInvoices && invoiceCount >= planLimit.maxDailyInvoices) {
        return {
          success: false,
          error: `You have reached your daily invoice limit (${planLimit.maxDailyInvoices}). Please upgrade your plan.`,
        };
      }
    }

    // Get brand for tax calculations
    const brand = await db.brand.findUnique({
      where: { userId: user.id },
    });

    // Generate invoice number
    const lastInvoice = await db.invoiceModel.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    let invoiceNumber = "INV-001";
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-")[1]);
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(3, "0")}`;
    }

    // Calculate totals
    let subtotal = 0;
    const items = data.items.map((item, index) => {
      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;
      return {
        ...item,
        totalPrice,
        itemOrder: item.itemOrder || index,
      };
    });

    const taxAmount = brand?.taxRate ? (subtotal * brand.taxRate) / 100 : 0;
    const salesTax = brand?.salesTax || 0;
    const otherCharges = brand?.otherCharges || 0;
    const totalAmount = subtotal + taxAmount + salesTax + otherCharges;

    // Create invoice with items
    const invoice = await db.invoiceModel.create({
      data: {
        userId: user.id,
        clientId: data.clientId,
        invoiceNumber,
        invoiceDate: data.invoiceDate || new Date(),
        dueDate: data.dueDate,
        preparedBy: data.preparedBy,
        notes: data.notes,
        terms: data.terms,
        subtotal,
        taxAmount,
        totalAmount,
        status: "DRAFT",
        items: {
          create: items,
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    revalidatePath("/dashboard/invoices");
    return { success: true, invoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

export async function updateInvoice(
  invoiceId: string,
  data: {
    clientId?: string;
    dueDate?: Date;
    preparedBy?: string;
    notes?: string;
    terms?: string;
    status?: "DRAFT" | "SENT" | "VIEWED" | "PAID" | "OVERDUE" | "CANCELLED";
    items?: Array<{
      id?: string;
      description: string;
      quantity: number;
      unitPrice: number;
      itemOrder?: number;
    }>;
  }
) {
  try {
    const user = await getAuthenticatedUser();

    // Get brand for tax calculations
    const brand = await db.brand.findUnique({
      where: { userId: user.id },
    });

    // If items are being updated, recalculate totals
    if (data.items) {
      let subtotal = 0;
      data.items.forEach((item) => {
        subtotal += item.quantity * item.unitPrice;
      });

      const taxAmount = brand?.taxRate ? (subtotal * brand.taxRate) / 100 : 0;
      const salesTax = brand?.salesTax || 0;
      const otherCharges = brand?.otherCharges || 0;
      const totalAmount = subtotal + taxAmount + salesTax + otherCharges;

      // Update invoice with new totals
      await db.invoiceModel.update({
        where: { id: invoiceId, userId: user.id },
        data: {
          clientId: data.clientId,
          dueDate: data.dueDate,
          preparedBy: data.preparedBy,
          notes: data.notes,
          terms: data.terms,
          status: data.status,
          subtotal,
          taxAmount,
          totalAmount,
        },
      });

      // Delete existing items
      await db.invoiceItem.deleteMany({
        where: { invoiceId },
      });

      // Create new items
      await db.invoiceItem.createMany({
        data: data.items.map((item, index) => ({
          invoiceId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          itemOrder: item.itemOrder || index,
        })),
      });
    } else {
      // Update invoice without changing items
      await db.invoiceModel.update({
        where: { id: invoiceId, userId: user.id },
        data: {
          clientId: data.clientId,
          dueDate: data.dueDate,
          preparedBy: data.preparedBy,
          notes: data.notes,
          terms: data.terms,
          status: data.status,
        },
      });
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    const user = await getAuthenticatedUser();

    await db.invoiceItem.deleteMany({
      where: { invoiceId },
    });

    await db.invoiceModel.delete({
      where: { 
        id: invoiceId,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/invoices");
    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: "Failed to delete invoice" };
  }
}

export async function markInvoiceAsSent(invoiceId: string) {
  try {
    const user = await getAuthenticatedUser();

    await db.invoiceModel.update({
      where: { 
        id: invoiceId,
        userId: user.id,
      },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return { success: true };
  } catch (error) {
    console.error("Error marking invoice as sent:", error);
    return { success: false, error: "Failed to mark invoice as sent" };
  }
}

export async function markInvoiceAsPaid(invoiceId: string) {
  try {
    const user = await getAuthenticatedUser();

    await db.invoiceModel.update({
      where: { 
        id: invoiceId,
        userId: user.id,
      },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return { success: true };
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return { success: false, error: "Failed to mark invoice as paid" };
  }
}

// Plan Limits
export async function getPlanLimits() {
  try {
    const user = await getAuthenticatedUser();
    
    const planLimit = await db.planLimit.findUnique({
      where: { plan: user.subscription?.plan || "FREE" },
    });

    // Get current usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyInvoiceCount = await db.invoiceModel.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const totalClients = await db.client.count({
      where: { userId: user.id },
    });

    const totalInvoices = await db.invoiceModel.count({
      where: { userId: user.id },
    });

    return {
      limits: planLimit,
      usage: {
        dailyInvoices: dailyInvoiceCount,
        totalClients,
        totalInvoices,
      },
    };
  } catch (error) {
    console.error("Error fetching plan limits:", error);
    return null;
  }
}