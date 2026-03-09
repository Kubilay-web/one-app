export const runtime = "nodejs";
export const dynamic = "force-dynamic";




import { NextRequest, NextResponse } from "next/server";



import { stripe } from "../../../config/stripe";
import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import Stripe from "stripe";

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

// Response types
interface SuccessResponse {
  url: string;
  sessionId: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// Request body validation
interface PortalRequest {
  returnUrl?: string;
  configuration?: string;
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

    // Parse request body for optional parameters
    let returnUrl: string | undefined;
    let configurationId: string | undefined;
    
    try {
      const body = await request.json() as PortalRequest;
      returnUrl = body.returnUrl;
      configurationId = body.configuration;
    } catch {
      // No body or invalid JSON - use defaults
    }

    // Get user from database with subscription
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

    // Check if user has Stripe customer ID
    if (!userData.stripeCustomerId) {
      return NextResponse.json<ErrorResponse>(
        { 
          error: "No Stripe customer found", 
          details: "User does not have a Stripe customer ID. They may need to subscribe first." 
        },
        { status: 404 }
      );
    }

    // Get user's subscription details for context
    const subscription = userData.subscription;
    
    // Prepare portal session configuration
    const sessionParams: Stripe.BillingPortal.SessionCreateParams = {
      customer: userData.stripeCustomerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard/billing`,
    };

    // Add configuration if provided
    if (configurationId) {
      sessionParams.configuration = configurationId;
    }

    // Set flow data based on subscription status if needed
    if (subscription?.stripeSubscriptionId) {
      // You can customize the portal flow based on subscription status
      if (subscription.status === SubscriptionStatus.CANCELLED) {
        // For cancelled subscriptions, maybe show reactivation options
        sessionParams.flow_data = {
          type: "subscription_cancel",
          after_completion: {
            type: "redirect",
            redirect: {
              return_url: sessionParams.return_url,
            },
          },
        };
      }
    }

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create(sessionParams);

    // Log portal session creation for audit
    console.log(
      `Customer portal session created for user ${userData.id} (stripe_customer: ${userData.stripeCustomerId})`
    );

    // Update user's last portal access (optional - you'd need to add this field to schema)
    // await db.user.update({
    //   where: { id: userData.id },
    //   data: { lastPortalAccess: new Date() },
    // });

    return NextResponse.json<SuccessResponse>({
      url: portalSession.url,
      sessionId: portalSession.id,
    });
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    
    // Handle Stripe errors specifically
    if (error instanceof stripe.errors.StripeError) {
      let statusCode = 500;
      let errorMessage = "Stripe error occurred";
      
      switch (error.type) {
        case 'StripeInvalidRequestError':
          statusCode = 400;
          errorMessage = "Invalid request to Stripe";
          break;
        case 'StripeAuthenticationError':
          statusCode = 401;
          errorMessage = "Stripe authentication failed";
          break;
        case 'StripePermissionError':
          statusCode = 403;
          errorMessage = "Permission denied by Stripe";
          break;
        case 'StripeRateLimitError':
          statusCode = 429;
          errorMessage = "Stripe rate limit exceeded";
          break;
        case 'StripeAPIError':
          statusCode = 500;
          errorMessage = "Stripe API error";
          break;
        case 'StripeConnectionError':
          statusCode = 503;
          errorMessage = "Failed to connect to Stripe";
          break;
      }
      
      return NextResponse.json<ErrorResponse>(
        { 
          error: errorMessage, 
          details: error.message 
        },
        { status: statusCode }
      );
    }
    
    // Generic error response
    return NextResponse.json<ErrorResponse>(
      { 
        error: "Failed to create portal session",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check portal configuration
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

    // Check if user has Stripe customer ID
    const hasStripeCustomer = !!userData.stripeCustomerId;
    
    // Get subscription details
    const subscription = userData.subscription;
    
    // Determine if portal is available
    const isPortalAvailable = hasStripeCustomer && subscription?.stripeSubscriptionId;

    return NextResponse.json({
      hasStripeCustomer,
      hasSubscription: !!subscription,
      isPortalAvailable,
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
      } : null,
    });
  } catch (error) {
    console.error("Error checking portal availability:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to check portal availability" },
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint to clear Stripe customer ID (admin only)
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

    // Parse user ID from query params
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      return NextResponse.json<ErrorResponse>(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Clear Stripe customer ID for the target user
    await db.user.update({
      where: { id: targetUserId },
      data: {
        stripeCustomerId: null,
      },
    });

    return NextResponse.json({
      message: "Stripe customer ID cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing Stripe customer ID:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to clear Stripe customer ID" },
      { status: 500 }
    );
  }
}