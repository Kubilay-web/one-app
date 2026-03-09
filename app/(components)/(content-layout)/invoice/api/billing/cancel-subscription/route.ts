// app/api/billing/cancel-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/app/lib/db";
import { stripe } from "../../../config/stripe";
import { validateRequest } from "@/app/auth";

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

// Request validation schema
const validateCancelRequest = (body: any): { immediate: boolean } => {
  const immediate = body?.immediate === true ? true : false;
  return { immediate };
};

// Response types
interface SuccessResponse {
  message: string;
  subscription: {
    id: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    cancelAtPeriodEnd: boolean;
    cancelAt: string | null;
    canceledAt: string | null;
    currentPeriodEnd: string | null;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let immediate = false;
    try {
      const body = await request.json();
      ({ immediate } = validateCancelRequest(body));
    } catch (error) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Get user with subscription
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

    // Check if user has an active subscription
    if (!userData.subscription) {
      return NextResponse.json<ErrorResponse>(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = userData.subscription;

    // Check if subscription is already cancelled
    if (subscription.status === SubscriptionStatus.CANCELLED) {
      return NextResponse.json<ErrorResponse>(
        { error: "Subscription is already cancelled" },
        { status: 400 }
      );
    }

    // If it's a Stripe subscription, cancel it through Stripe
    if (subscription.stripeSubscriptionId) {
      try {
        if (immediate) {
          // Cancel immediately
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        } else {
          // Cancel at period end
          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true,
          });
        }
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        
        if (stripeError instanceof Stripe.errors.StripeError) {
          return NextResponse.json<ErrorResponse>(
            { 
              error: "Failed to cancel subscription with Stripe", 
              details: stripeError.message 
            },
            { status: 500 }
          );
        }
        throw stripeError;
      }
    }

    // Update our database
    const now = new Date();
    const updatedSubscription = await db.subscriptionInvoice.update({
      where: { userId: userData.id },
      data: {
        cancelAtPeriodEnd: !immediate,
        cancelAt: immediate ? now : subscription.currentPeriodEnd,
        canceledAt: immediate ? now : null,
        status: immediate ? SubscriptionStatus.CANCELLED : subscription.status,
      },
    });

    // Log the cancellation for audit purposes
    console.log(
      `Subscription ${subscription.id} for user ${userData.id} cancelled ${immediate ? 'immediately' : 'at period end'}`
    );

    const response: SuccessResponse = {
      message: immediate
        ? "Subscription cancelled immediately"
        : "Subscription will be cancelled at the end of the current period",
      subscription: {
        id: updatedSubscription.id,
        plan: updatedSubscription.plan as SubscriptionPlan,
        status: updatedSubscription.status as SubscriptionStatus,
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
        cancelAt: updatedSubscription.cancelAt?.toISOString() || null,
        canceledAt: updatedSubscription.canceledAt?.toISOString() || null,
        currentPeriodEnd: updatedSubscription.currentPeriodEnd?.toISOString() || null,
      },
    };

    return NextResponse.json<SuccessResponse>(response, { status: 200 });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { 
          error: "Failed to cancel subscription", 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json<ErrorResponse>(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to check cancellation status
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

    if (!userData?.subscription) {
      return NextResponse.json<ErrorResponse>(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = userData.subscription;

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        cancelAt: subscription.cancelAt?.toISOString() || null,
        canceledAt: subscription.canceledAt?.toISOString() || null,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
        currentPeriodStart: subscription.currentPeriodStart?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}

// Optional: Add POST method to reactivate a subscription that's set to cancel at period end
export async function PATCH(request: NextRequest) {
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

    if (!userData?.subscription) {
      return NextResponse.json<ErrorResponse>(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = userData.subscription;

    // Check if subscription is set to cancel at period end
    if (!subscription.cancelAtPeriodEnd) {
      return NextResponse.json<ErrorResponse>(
        { error: "Subscription is not scheduled for cancellation" },
        { status: 400 }
      );
    }

    // Update in Stripe if it's a Stripe subscription
    if (subscription.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false,
        });
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        return NextResponse.json<ErrorResponse>(
          { error: "Failed to reactivate subscription with Stripe" },
          { status: 500 }
        );
      }
    }

    // Update in database
    const updatedSubscription = await db.subscriptionInvoice.update({
      where: { userId: userData.id },
      data: {
        cancelAtPeriodEnd: false,
        cancelAt: null,
      },
    });

    return NextResponse.json({
      message: "Subscription reactivated successfully",
      subscription: {
        id: updatedSubscription.id,
        plan: updatedSubscription.plan,
        status: updatedSubscription.status,
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
      },
    });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to reactivate subscription" },
      { status: 500 }
    );
  }
}