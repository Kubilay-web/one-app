import { stripe } from "../../config/stripe";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";

// Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
  description: string;
}

export interface CheckoutRequest {
  products: CartItem[];
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutResponse {
  id: string;
  client_secret: string | null;
  url: string | null;
  amount: number;
  currency: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// Enums based on schema
export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

// Helper function to get active products from Stripe
async function getActiveProducts() {
  try {
    const stripeProducts = await stripe.products.list({
      active: true,
      limit: 100,
    });
    return stripeProducts.data;
  } catch (error) {
    console.error("Error fetching active products:", error);
    throw error;
  }
}

// Helper function to create or update product in Stripe
async function createOrUpdateProduct(product: CartItem) {
  try {
    const unitAmount = Math.round(product.price * 100); // Convert to cents

    const productData = await stripe.products.create({
      name: product.name,
      description: product.description || `${product.name} - Digital Product`,
      default_price_data: {
        unit_amount: unitAmount,
        currency: "usd",
        recurring: undefined, // One-time payment
      },
      images: product.image ? [product.image] : [],
      metadata: {
        productId: product.id,
        stock: product.stock.toString(),
        source: "invoice_generator_checkout",
      },
    });

    console.log(`Product created: ${productData.name} (${productData.id})`);
    return productData;
  } catch (error) {
    console.error(`Error creating product ${product.name}:`, error);
    throw error;
  }
}

// POST /api/checkout - Create checkout session
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { products, successUrl, cancelUrl, customerEmail, metadata = {} } = body as CheckoutRequest;

    // Validate products
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json<ErrorResponse>(
        { error: "Products are required" },
        { status: 400 }
      );
    }

    // Validate product quantities
    for (const product of products) {
      if (product.qty <= 0) {
        return NextResponse.json<ErrorResponse>(
          { error: `Invalid quantity for product ${product.name}` },
          { status: 400 }
        );
      }

      // Check stock if needed
      if (product.stock !== undefined && product.qty > product.stock) {
        return NextResponse.json<ErrorResponse>(
          { error: `Insufficient stock for product ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Get authenticated user if available
    let userId: string | undefined;
    let userEmail: string | undefined;
    
    try {
      const { user } = await validateRequest();
      if (user?.email) {
        userId = user.id;
        userEmail = user.email;
      }
    } catch {
      // Guest checkout - continue without user
      console.log("Guest checkout - no user authentication");
    }

    // Calculate total amount
    const totalAmount = products.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // Create or retrieve Stripe products
    let activeProducts = await getActiveProducts();
    
    for (const product of products) {
      try {
        const existingProduct = activeProducts.find(
          (stripeProduct: any) =>
            stripeProduct.name?.toLowerCase() === product.name?.toLowerCase()
        );

        if (!existingProduct) {
          // Create new product in Stripe
          const newProduct = await createOrUpdateProduct(product);
          activeProducts = [...activeProducts, newProduct];
        } else {
          console.log(`Product already exists: ${existingProduct.name}`);
          
          // Optionally update price if changed
          const unitAmount = Math.round(product.price * 100);
          const currentPrice = existingProduct.default_price;
          
          if (currentPrice && typeof currentPrice === 'string') {
            const price = await stripe.prices.retrieve(currentPrice);
            if (price.unit_amount !== unitAmount) {
              // Price has changed, create new price
              const newPrice = await stripe.prices.create({
                unit_amount: unitAmount,
                currency: "usd",
                product: existingProduct.id,
              });
              
              // Update product default price
              await stripe.products.update(existingProduct.id, {
                default_price: newPrice.id,
              });
              
              console.log(`Price updated for product: ${existingProduct.name}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing product ${product.name}:`, error);
        return NextResponse.json<ErrorResponse>(
          { error: `Failed to process product: ${product.name}` },
          { status: 500 }
        );
      }
    }

    // Refresh active products
    activeProducts = await getActiveProducts();

    // Prepare line items for checkout
    const lineItems = [];
    for (const product of products) {
      const stripeProduct = activeProducts.find(
        (sp: any) => sp.name?.toLowerCase() === product.name?.toLowerCase()
      );

      if (stripeProduct && stripeProduct.default_price) {
        lineItems.push({
          price: stripeProduct.default_price,
          quantity: product.qty,
        });
      } else {
        return NextResponse.json<ErrorResponse>(
          { error: `Product ${product.name} not found in Stripe` },
          { status: 404 }
        );
      }
    }

    console.log("Line items:", lineItems);

    // Get base URL for return URLs
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Determine if we should use embedded or hosted checkout
    const uiMode = request.nextUrl.searchParams.get("ui_mode") || "embedded";

    // Create checkout session
    const sessionParams: any = {
      line_items: lineItems,
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        userId: userId || 'guest',
        products: JSON.stringify(
          products.map((p) => ({
            id: p.id,
            name: p.name,
            quantity: p.qty,
            price: p.price,
          }))
        ),
        total: totalAmount.toString(),
        ...metadata,
      },
    };

    // Add customer email if available
    if (customerEmail || userEmail) {
      sessionParams.customer_email = customerEmail || userEmail;
    }

    // Configure based on UI mode
    if (uiMode === "embedded") {
      sessionParams.ui_mode = "embedded";
      sessionParams.return_url = `${origin}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`;
    } else {
      sessionParams.success_url = successUrl || `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
      sessionParams.cancel_url = cancelUrl || `${origin}/payment-cancel`;
    }

    // Add shipping options for physical products
    const hasPhysicalProducts = products.some(p => p.description?.includes('physical'));
    if (hasPhysicalProducts) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'SE', 'NO', 'DK', 'FI'],
      };
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500,
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ];
    }

    // Add discount/coupon support
    const couponCode = request.nextUrl.searchParams.get("coupon");
    if (couponCode) {
      // You would validate coupon here
      sessionParams.discounts = [
        {
          coupon: couponCode,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Checkout session created:", {
      id: session.id,
      url: session.url,
      uiMode: session.ui_mode,
    });

    // Store order in database if user is logged in
    if (userId) {
      await db.paymentInvoice.create({
        data: {
          userId,
          stripePaymentId: session.id,
          amount: totalAmount * 100, // Convert to cents
          currency: "usd",
          status: PaymentStatus.PENDING,
          description: `Order for ${products.length} item(s)`,
          plan: "FREE", // Default for e-commerce
        },
      });
    }

    const response: CheckoutResponse = {
      id: session.id,
      client_secret: session.client_secret || null,
      url: session.url || null,
      amount: totalAmount,
      currency: "usd",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Handle Stripe errors
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
        case 'StripeRateLimitError':
          statusCode = 429;
          errorMessage = "Stripe rate limit exceeded";
          break;
      }

      return NextResponse.json<ErrorResponse>(
        { error: errorMessage, details: error.message },
        { status: statusCode }
      );
    }

    return NextResponse.json<ErrorResponse>(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// GET /api/checkout - Retrieve checkout session status
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    // Check if session belongs to user (if logged in)
    if (user?.id) {
      const payment = await db.paymentInvoice.findFirst({
        where: {
          stripePaymentId: sessionId,
          userId: user.id,
        },
      });

      if (!payment) {
        return NextResponse.json<ErrorResponse>(
          { error: "Session not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      id: session.id,
      status: session.payment_status,
      amount: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_email,
      customerDetails: session.customer_details,
      lineItems: session.line_items?.data.map(item => ({
        description: item.description,
        quantity: item.quantity,
        amount: item.amount_total,
      })),
      paymentIntent: session.payment_intent,
      url: session.url,
    });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to retrieve checkout session" },
      { status: 500 }
    );
  }
}

// Webhook handler for Stripe events
export async function POST_WEBHOOK(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json<ErrorResponse>(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event;
  try {
    const body = await request.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json<ErrorResponse>(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'checkout.session.async_payment_succeeded':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'checkout.session.async_payment_failed':
        await handleCheckoutSessionFailed(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook event ${event.type}:`, error);
    return NextResponse.json<ErrorResponse>(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Helper functions for webhook handling
async function handleCheckoutSessionCompleted(session: any) {
  await db.paymentInvoice.update({
    where: { stripePaymentId: session.id },
    data: {
      status: PaymentStatus.SUCCEEDED,
      paidAt: new Date(),
      receiptUrl: session.receipt_url,
      invoiceUrl: session.invoice_url,
    },
  });

  console.log(`Checkout session completed: ${session.id}`);
}

async function handleCheckoutSessionFailed(session: any) {
  await db.paymentInvoice.update({
    where: { stripePaymentId: session.id },
    data: {
      status: PaymentStatus.FAILED,
      failedAt: new Date(),
    },
  });

  console.log(`Checkout session failed: ${session.id}`);
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  // Find session by payment intent
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1,
  });

  if (sessions.data.length > 0) {
    await db.paymentInvoice.update({
      where: { stripePaymentId: sessions.data[0].id },
      data: {
        status: PaymentStatus.SUCCEEDED,
        paidAt: new Date(),
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
      },
    });
  }

  console.log(`Payment intent succeeded: ${paymentIntent.id}`);
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1,
  });

  if (sessions.data.length > 0) {
    await db.paymentInvoice.update({
      where: { stripePaymentId: sessions.data[0].id },
      data: {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
      },
    });
  }

  console.log(`Payment intent failed: ${paymentIntent.id}`);
}

// Export webhook handler separately
export const webhook = POST_WEBHOOK;