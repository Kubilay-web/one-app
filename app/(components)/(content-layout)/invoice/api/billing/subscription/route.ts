// app/api/billing/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { stripe } from "../../../config/stripe";

// Enums based on schema
export enum SubscriptionPlan {
  FREE = "FREE",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELLED = "CANCELLED",
  PAST_DUE = "PAST_DUE",
  TRIALING = "TRIALING",
  INCOMPLETE = "INCOMPLETE",
  INCOMPLETE_EXPIRED = "INCOMPLETE_EXPIRED",
  UNPAID = "UNPAID",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

// Response types
interface SubscriptionResponse {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  cancelAt: string | null;
  canceledAt: string | null;
  trialStart: string | null;
  trialEnd: string | null;
  priceAmount: number | null;
  priceCurrency: string | null;
  interval: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionWithDetailsResponse extends SubscriptionResponse {
  recentPayments: PaymentResponse[];
  upcomingInvoice: {
    amount: number;
    date: string;
    description: string;
  } | null;
  usageStats: {
    invoicesThisMonth: number;
    invoicesLimit: number | null;
    clientsCount: number;
    clientsLimit: number | null;
  };
}

interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  paidAt: string | null;
  receiptUrl: string | null;
  invoiceUrl: string | null;
  createdAt: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// GET /api/billing/subscription - Get current user's subscription details
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await db.user.findUnique({
      where: { email: user.email },
      include: {
        subscription: true,
      },
    });

    if (!userData) {
      return NextResponse.json<ErrorResponse>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get URL search params
    const { searchParams } = new URL(request.url);
    const includePayments = searchParams.get("includePayments") === "true";
    const includeUsage = searchParams.get("includeUsage") === "true";

    // Get subscription data
    const subscription = userData.subscription;

    if (!subscription) {
      // Return default FREE plan if no subscription
      const defaultSubscription: SubscriptionResponse = {
        id: "default",
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        cancelAt: null,
        canceledAt: null,
        trialStart: null,
        trialEnd: null,
        priceAmount: 0,
        priceCurrency: "usd",
        interval: null,
        stripeSubscriptionId: null,
        stripeCustomerId: userData.stripeCustomerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json(defaultSubscription);
    }

    // Get recent payments if requested
    let recentPayments: PaymentResponse[] = [];
    if (includePayments) {
      const payments = await db.paymentInvoice.findMany({
        where: {
          userId: userData.id,
          status: {
            in: [PaymentStatus.SUCCEEDED, PaymentStatus.PENDING],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          description: true,
          paidAt: true,
          receiptUrl: true,
          invoiceUrl: true,
          createdAt: true,
        },
      });

      recentPayments = payments.map(payment => ({
        ...payment,
        amount: Number(payment.amount),
        status: payment.status as PaymentStatus,
        paidAt: payment.paidAt?.toISOString() || null,
        createdAt: payment.createdAt.toISOString(),
      }));
    }

    // Get usage statistics if requested
    let usageStats = null;
    if (includeUsage) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [invoicesThisMonth, clientsCount, planLimits] = await Promise.all([
        db.invoiceModel.count({
          where: {
            userId: userData.id,
            createdAt: {
              gte: firstDayOfMonth,
            },
          },
        }),
        db.client.count({
          where: {
            userId: userData.id,
            isActive: true,
          },
        }),
        db.planLimit.findUnique({
          where: { plan: subscription.plan },
        }),
      ]);

      usageStats = {
        invoicesThisMonth,
        invoicesLimit: planLimits?.maxDailyInvoices || null,
        clientsCount,
        clientsLimit: planLimits?.maxClients || null,
      };
    }

    // Get upcoming invoice from Stripe if available
    let upcomingInvoice = null;
    if (subscription.stripeSubscriptionId && subscription.status === SubscriptionStatus.ACTIVE) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripeSubscriptionId
        );
        
        if (stripeSubscription && stripeSubscription.items.data.length > 0) {
          const nextInvoice = await stripe.invoices.retrieveUpcoming({
            subscription: subscription.stripeSubscriptionId,
          });

          upcomingInvoice = {
            amount: nextInvoice.amount_due,
            date: new Date(nextInvoice.next_payment_attempt || Date.now()).toISOString(),
            description: `Next invoice for ${subscription.plan} plan`,
          };
        }
      } catch (stripeError) {
        console.error("Error fetching upcoming invoice from Stripe:", stripeError);
        // Don't fail the whole request if Stripe call fails
      }
    }

    // Format subscription response
    const formattedSubscription: SubscriptionResponse = {
      id: subscription.id,
      plan: subscription.plan as SubscriptionPlan,
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: subscription.currentPeriodStart?.toISOString() || null,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      cancelAt: subscription.cancelAt?.toISOString() || null,
      canceledAt: subscription.canceledAt?.toISOString() || null,
      trialStart: subscription.trialStart?.toISOString() || null,
      trialEnd: subscription.trialEnd?.toISOString() || null,
      priceAmount: subscription.priceAmount,
      priceCurrency: subscription.priceCurrency,
      interval: subscription.interval,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCustomerId: subscription.stripeCustomerId || userData.stripeCustomerId,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };

    // If detailed response requested
    if (includePayments || includeUsage) {
      const detailedResponse: SubscriptionWithDetailsResponse = {
        ...formattedSubscription,
        recentPayments,
        upcomingInvoice,
        usageStats: usageStats || {
          invoicesThisMonth: 0,
          invoicesLimit: null,
          clientsCount: 0,
          clientsLimit: null,
        },
      };

      return NextResponse.json(detailedResponse);
    }

    return NextResponse.json(formattedSubscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST /api/billing/subscription - Update subscription or get details
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await db.user.findUnique({
      where: { email: user.email },
      include: {
        subscription: true,
      },
    });

    if (!userData) {
      return NextResponse.json<ErrorResponse>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { action, ...params } = body;

    // Handle different actions
    switch (action) {
      case "update_payment_method":
        return await handleUpdatePaymentMethod(userData, params);
      
      case "cancel":
        return await handleCancelSubscription(userData, params);
      
      case "reactivate":
        return await handleReactivateSubscription(userData, params);
      
      case "change_plan":
        return await handleChangePlan(userData, params);
      
      case "sync_with_stripe":
        return await handleSyncWithStripe(userData);
      
      case "get_invoice_history":
        return await handleGetInvoiceHistory(userData, params);
      
      default:
        return NextResponse.json<ErrorResponse>(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing subscription request:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to update payment method
async function handleUpdatePaymentMethod(userData: any, params: any) {
  const { paymentMethodId } = params;

  if (!paymentMethodId) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment method ID is required" },
      { status: 400 }
    );
  }

  if (!userData.stripeCustomerId) {
    return NextResponse.json<ErrorResponse>(
      { error: "No Stripe customer found" },
      { status: 404 }
    );
  }

  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: userData.stripeCustomerId,
    });

    // Set as default payment method
    await stripe.customers.update(userData.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return NextResponse.json({
      message: "Payment method updated successfully",
    });
  } catch (stripeError) {
    console.error("Stripe error updating payment method:", stripeError);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to update payment method with Stripe" },
      { status: 500 }
    );
  }
}

// Helper function to cancel subscription
async function handleCancelSubscription(userData: any, params: any) {
  const { immediate = false } = params;

  if (!userData.subscription || !userData.subscription.stripeSubscriptionId) {
    return NextResponse.json<ErrorResponse>(
      { error: "No active subscription found" },
      { status: 404 }
    );
  }

  const subscription = userData.subscription;

  try {
    if (immediate) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      
      // Update database
      await db.subscriptionInvoice.update({
        where: { userId: userData.id },
        data: {
          status: SubscriptionStatus.CANCELLED,
          canceledAt: new Date(),
          cancelAtPeriodEnd: false,
        },
      });
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update database
      await db.subscriptionInvoice.update({
        where: { userId: userData.id },
        data: {
          cancelAtPeriodEnd: true,
          cancelAt: subscription.currentPeriodEnd,
        },
      });
    }

    return NextResponse.json({
      message: immediate
        ? "Subscription cancelled immediately"
        : "Subscription will be cancelled at the end of the current period",
    });
  } catch (stripeError) {
    console.error("Stripe error cancelling subscription:", stripeError);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to cancel subscription with Stripe" },
      { status: 500 }
    );
  }
}

// Helper function to reactivate subscription
async function handleReactivateSubscription(userData: any, params: any) {
  if (!userData.subscription || !userData.subscription.stripeSubscriptionId) {
    return NextResponse.json<ErrorResponse>(
      { error: "No subscription found" },
      { status: 404 }
    );
  }

  const subscription = userData.subscription;

  if (!subscription.cancelAtPeriodEnd) {
    return NextResponse.json<ErrorResponse>(
      { error: "Subscription is not scheduled for cancellation" },
      { status: 400 }
    );
  }

  try {
    // Update in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update in database
    await db.subscriptionInvoice.update({
      where: { userId: userData.id },
      data: {
        cancelAtPeriodEnd: false,
        cancelAt: null,
      },
    });

    return NextResponse.json({
      message: "Subscription reactivated successfully",
    });
  } catch (stripeError) {
    console.error("Stripe error reactivating subscription:", stripeError);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to reactivate subscription with Stripe" },
      { status: 500 }
    );
  }
}

// Helper function to change plan
async function handleChangePlan(userData: any, params: any) {
  const { newPlan, priceId } = params;

  if (!newPlan || !Object.values(SubscriptionPlan).includes(newPlan)) {
    return NextResponse.json<ErrorResponse>(
      { error: "Invalid plan" },
      { status: 400 }
    );
  }

  if (!userData.subscription || !userData.subscription.stripeSubscriptionId) {
    return NextResponse.json<ErrorResponse>(
      { error: "No active subscription found" },
      { status: 404 }
    );
  }

  const subscription = userData.subscription;

  try {
    // Get current subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    // Update subscription in Stripe
    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: "create_prorations",
      }
    );

    // Update database
    await db.subscriptionInvoice.update({
      where: { userId: userData.id },
      data: {
        plan: newPlan,
        stripePriceId: priceId,
        priceAmount: updatedStripeSubscription.items.data[0].price.unit_amount,
        interval: updatedStripeSubscription.items.data[0].price.recurring?.interval,
      },
    });

    return NextResponse.json({
      message: `Plan changed to ${newPlan} successfully`,
    });
  } catch (stripeError) {
    console.error("Stripe error changing plan:", stripeError);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to change plan with Stripe" },
      { status: 500 }
    );
  }
}

// Helper function to sync subscription with Stripe
async function handleSyncWithStripe(userData: any) {
  if (!userData.subscription || !userData.subscription.stripeSubscriptionId) {
    return NextResponse.json<ErrorResponse>(
      { error: "No Stripe subscription found" },
      { status: 404 }
    );
  }

  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      userData.subscription.stripeSubscriptionId
    );

    // Update database with latest Stripe data
    const updatedSubscription = await db.subscriptionInvoice.update({
      where: { userId: userData.id },
      data: {
        status: stripeSubscription.status.toUpperCase() as SubscriptionStatus,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        cancelAt: stripeSubscription.cancel_at 
          ? new Date(stripeSubscription.cancel_at * 1000) 
          : null,
        canceledAt: stripeSubscription.canceled_at 
          ? new Date(stripeSubscription.canceled_at * 1000) 
          : null,
        trialStart: stripeSubscription.trial_start 
          ? new Date(stripeSubscription.trial_start * 1000) 
          : null,
        trialEnd: stripeSubscription.trial_end 
          ? new Date(stripeSubscription.trial_end * 1000) 
          : null,
      },
    });

    return NextResponse.json({
      message: "Subscription synced successfully",
      subscription: {
        ...updatedSubscription,
        createdAt: updatedSubscription.createdAt.toISOString(),
        updatedAt: updatedSubscription.updatedAt.toISOString(),
        currentPeriodStart: updatedSubscription.currentPeriodStart?.toISOString(),
        currentPeriodEnd: updatedSubscription.currentPeriodEnd?.toISOString(),
      },
    });
  } catch (stripeError) {
    console.error("Stripe error syncing subscription:", stripeError);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to sync with Stripe" },
      { status: 500 }
    );
  }
}

// Helper function to get invoice history
async function handleGetInvoiceHistory(userData: any, params: any) {
  const { page = 1, limit = 10 } = params;

  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    db.paymentInvoice.findMany({
      where: {
        userId: userData.id,
        status: PaymentStatus.SUCCEEDED,
      },
      orderBy: {
        paidAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        stripePaymentId: true,
        amount: true,
        currency: true,
        description: true,
        paidAt: true,
        receiptUrl: true,
        invoiceUrl: true,
        plan: true,
        interval: true,
        createdAt: true,
      },
    }),
    db.paymentInvoice.count({
      where: {
        userId: userData.id,
        status: PaymentStatus.SUCCEEDED,
      },
    }),
  ]);

  const formattedInvoices = invoices.map(invoice => ({
    ...invoice,
    amount: Number(invoice.amount),
    paidAt: invoice.paidAt?.toISOString() || null,
    createdAt: invoice.createdAt.toISOString(),
  }));

  return NextResponse.json({
    invoices: formattedInvoices,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  });
}

// PUT /api/billing/subscription - Update subscription details
export async function PUT(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await db.user.findUnique({
      where: { email: user.email },
      include: {
        subscription: true,
      },
    });

    if (!userData) {
      return NextResponse.json<ErrorResponse>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!userData.subscription) {
      return NextResponse.json<ErrorResponse>(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Update subscription in database only (for non-Stripe fields)
    const { metadata, ...updateData } = body;

    const updatedSubscription = await db.subscriptionInvoice.update({
      where: { userId: userData.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription: {
        ...updatedSubscription,
        createdAt: updatedSubscription.createdAt.toISOString(),
        updatedAt: updatedSubscription.updatedAt.toISOString(),
        currentPeriodStart: updatedSubscription.currentPeriodStart?.toISOString(),
        currentPeriodEnd: updatedSubscription.currentPeriodEnd?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

// DELETE /api/billing/subscription - Admin only: Delete subscription record
export async function DELETE(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userData = await db.user.findUnique({
      where: { email: user.email },
      select: { role: true },
    });

    if (userData?.role !== "ADMIN") {
      return NextResponse.json<ErrorResponse>(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get("id");

    if (!subscriptionId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    // Delete subscription record
    await db.subscriptionInvoice.delete({
      where: { id: subscriptionId },
    });

    return NextResponse.json({
      message: "Subscription record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}