import { validateRequest } from "@/app/auth";
import { stripe } from "../../config/stripe";
import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

// Price configurations mapping
const PRICING_CONFIG = {
  monthly: {
    amount: 2000, // $20.00 in cents
    currency: "usd",
    description: "Monthly Plan - Invoice Generator Pro",
    plan: SubscriptionPlan.MONTHLY,
    interval: "month",
  },
  yearly: {
    amount: 20000, // $200.00 in cents
    currency: "usd",
    description: "Yearly Plan - Invoice Generator Pro",
    plan: SubscriptionPlan.YEARLY,
    interval: "year",
  },
};

// Request validation schema
interface PaymentIntentRequest {
  priceId: string;
  email: string;
  name: string;
  planType: "monthly" | "yearly";
  metadata?: Record<string, string>;
}

// Response types
interface PaymentIntentResponse {
  client_secret: string | null;
  customer_id: string;
  amount: number;
  currency: string;
  payment_intent_id: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, email, name, planType, metadata = {} } = body as PaymentIntentRequest;

    console.log("Payment Intent Request:", { priceId, email, name, planType });

    // Validate required fields
    if (!priceId || !email || !name || !planType) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "Missing required fields: priceId, email, name, and planType are required",
        },
        { status: 400 }
      );
    }

    // Validate planType
    if (!["monthly", "yearly"].includes(planType)) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid plan type. Must be either "monthly" or "yearly"' },
        { status: 400 }
      );
    }

    // Get session to verify user
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized - session email does not match request" },
        { status: 401 }
      );
    }

    // Get pricing configuration
    const pricingConfig = PRICING_CONFIG[planType];

    // Find or create user in our database
    const userData = await db.user.findUnique({
      where: { email },
      include: {
        subscription: true,
      },
    });

    if (!userData) {
      return NextResponse.json<ErrorResponse>(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if user already has an active subscription
    // if (userData.subscription && userData.subscription.status === SubscriptionStatus.ACTIVE) {
    //   return NextResponse.json<ErrorResponse>(
    //     { error: "User already has an active subscription" },
    //     { status: 400 }
    //   );
    // }

    // Create or retrieve Stripe customer
    let stripeCustomer;
    if (userData.stripeCustomerId) {
      try {
        stripeCustomer = await stripe.customers.retrieve(userData.stripeCustomerId);
        
        // Check if customer is deleted
        if (stripeCustomer.deleted) {
          stripeCustomer = null;
        }
      } catch (error) {
        console.log("Stripe customer not found, creating new one");
        stripeCustomer = null;
      }
    }

    if (!stripeCustomer) {
      stripeCustomer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId: userData.id,
          source: "invoice_generator_saas",
          ...metadata,
        },
      });

      // Update user with Stripe customer ID
      await db.user.update({
        where: { id: userData.id },
        data: { stripeCustomerId: stripeCustomer.id },
      });
    }

    // Create payment intent with additional configuration
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pricingConfig.amount,
      currency: pricingConfig.currency,
      customer: stripeCustomer.id,
      description: pricingConfig.description,
      receipt_email: email,
      // setup_future_usage: "off_session", // Allow future payments without authentication
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userData.id,
        userEmail: email,
        userName: name,
        planType,
        plan: pricingConfig.plan,
        interval: pricingConfig.interval,
        stripePriceId: priceId,
        product: "invoice_generator_subscription",
        ...metadata,
      },
    });

    console.log("Payment Intent Created:", {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      customer: paymentIntent.customer,
      planType,
    });

    // Create initial payment record in database
    await db.paymentInvoice.create({
      data: {
        userId: userData.id,
        stripePaymentId: paymentIntent.id,
        stripeCustomerId: stripeCustomer.id,
        amount: pricingConfig.amount,
        currency: pricingConfig.currency,
        status: PaymentStatus.PENDING,
        description: pricingConfig.description,
        plan: pricingConfig.plan,
        interval: pricingConfig.interval,
      },
    });

    const response: PaymentIntentResponse = {
      client_secret: paymentIntent.client_secret,
      customer_id: stripeCustomer.id,
      amount: pricingConfig.amount,
      currency: pricingConfig.currency,
      payment_intent_id: paymentIntent.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating payment intent:", error);

    // Handle specific Stripe errors
    if (error instanceof stripe.errors.StripeError) {
      let statusCode = 500;
      let errorMessage = "Stripe error occurred";
      let details = error.message;

      switch (error.type) {
        case 'StripeInvalidRequestError':
          statusCode = 400;
          errorMessage = "Invalid request to Stripe";
          
          // Check for specific error messages
          if (error.message.includes("No such price")) {
            errorMessage = "Invalid price ID. Please check your Stripe configuration.";
          } else if (error.message.includes("No such customer")) {
            errorMessage = "Customer not found in Stripe.";
          }
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
          errorMessage = "Stripe rate limit exceeded. Please try again later.";
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
        { error: errorMessage, details },
        { status: statusCode }
      );
    }

    // Handle other errors
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: "Failed to create payment intent", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ErrorResponse>(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve payment intent status
export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get("payment_intent_id");

    if (!paymentIntentId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Verify payment intent belongs to user
    const payment = await db.paymentInvoice.findFirst({
      where: {
        stripePaymentId: paymentIntentId,
        userId: user.id,
      },
    });

    if (!payment) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Retrieve from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      client_secret: paymentIntent.client_secret,
      payment_method: paymentIntent.payment_method,
      created: new Date(paymentIntent.created * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to retrieve payment intent" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update payment intent
export async function PATCH(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { paymentIntentId, ...updateData } = body;

    if (!paymentIntentId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Verify payment intent belongs to user
    const payment = await db.paymentInvoice.findFirst({
      where: {
        stripePaymentId: paymentIntentId,
        userId: user.id,
      },
    });

    if (!payment) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Update payment intent in Stripe
    const paymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      updateData
    );

    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      updated: true,
    });
  } catch (error) {
    console.error("Error updating payment intent:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to update payment intent" },
      { status: 500 }
    );
  }
}

// POST endpoint for webhook handling (optional)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentIntentId, status, receiptUrl, invoiceUrl } = body;

    if (!paymentIntentId || !status) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment intent ID and status are required" },
        { status: 400 }
      );
    }

    // Update payment record in database
    const updateData: any = {
      status: status as PaymentStatus,
    };

    if (status === PaymentStatus.SUCCEEDED) {
      updateData.paidAt = new Date();
      
      if (receiptUrl) {
        updateData.receiptUrl = receiptUrl;
      }
      
      if (invoiceUrl) {
        updateData.invoiceUrl = invoiceUrl;
      }
    } else if (status === PaymentStatus.FAILED) {
      updateData.failedAt = new Date();
    } else if (status === PaymentStatus.REFUNDED) {
      updateData.refundedAt = new Date();
    }

    const payment = await db.paymentInvoice.update({
      where: { stripePaymentId: paymentIntentId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        updatedAt: payment.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}