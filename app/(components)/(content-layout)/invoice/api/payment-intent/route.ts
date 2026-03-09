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

export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

export interface PaymentIntentRequest {
  products: Item[];
  successUrl?: string;
  cancelUrl?: string;
  customerId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string | null;
  paymentIntentId: string;
  amount: number;
  currency: string;
  url?: string; // For checkout session
}

export interface ErrorResponse {
  error: string;
  details?: string;
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
async function createOrUpdateProduct(product: Item) {
  try {
    const unitAmount = Math.round(product.price * 100); // Convert to cents

    const productData = await stripe.products.create({
      name: product.name,
      description: product.description || `${product.name} - Invoice Generator`,
      default_price_data: {
        unit_amount: unitAmount,
        currency: "usd",
        recurring: undefined, // One-time payment
      },
      images: product.image ? [product.image] : [],
      metadata: {
        productId: product.id,
        source: "invoice_generator_ecommerce",
      },
    });

    console.log(`Product created: ${productData.name} (${productData.id})`);
    return productData;
  } catch (error) {
    console.error(`Error creating product ${product.name}:`, error);
    throw error;
  }
}

// POST /api/create-payment-intent - Create payment intent for e-commerce
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      products, 
      successUrl, 
      cancelUrl, 
      customerEmail,
      metadata = {} 
    } = body as PaymentIntentRequest;

    // Validate products
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json<ErrorResponse>(
        { error: "Products are required" },
        { status: 400 }
      );
    }

    // Validate product quantities
    for (const product of products) {
      if (product.quantity <= 0) {
        return NextResponse.json<ErrorResponse>(
          { error: `Invalid quantity for product ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Get authenticated user if available (optional for guest checkout)
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
      (sum, item) => sum + item.price * item.quantity,
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
          quantity: product.quantity,
        });
      } else {
        return NextResponse.json<ErrorResponse>(
          { error: `Product ${product.name} not found in Stripe` },
          { status: 404 }
        );
      }
    }

    // If successUrl and cancelUrl are provided, create a checkout session
    if (successUrl && cancelUrl) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail || userEmail,
        metadata: {
          userId: userId || 'guest',
          products: JSON.stringify(products.map(p => ({
            id: p.id,
            name: p.name,
            quantity: p.quantity,
            price: p.price,
          }))),
          total: totalAmount.toString(),
          ...metadata,
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'SE', 'NO', 'DK', 'FI'],
        },
        shipping_options: [
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
        ],
      });

      // Store order in database if user is logged in
      if (userId) {
        await db.paymentInvoice.create({
          data: {
            userId,
            stripePaymentId: session.id,
            amount: totalAmount * 100, // Convert to cents
            currency: 'usd',
            status: 'PENDING',
            description: `Order for ${products.length} item(s)`,
            plan: 'FREE', // Default for e-commerce
          },
        });
      }

      return NextResponse.json<PaymentIntentResponse>({
        clientSecret: null,
        paymentIntentId: session.id,
        amount: totalAmount,
        currency: 'usd',
        url: session.url || undefined,
      });
    }

    // Otherwise create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customerEmail || userEmail,
      metadata: {
        userId: userId || 'guest',
        items: JSON.stringify(
          products.map((p) => ({
            id: p.id,
            name: p.name,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
        total: totalAmount.toString(),
        ...metadata,
      },
    });

    // Store payment in database if user is logged in
    if (userId) {
      await db.paymentInvoice.create({
        data: {
          userId,
          stripePaymentId: paymentIntent.id,
          amount: totalAmount * 100,
          currency: 'usd',
          status: 'PENDING',
          description: `Order for ${products.length} item(s)`,
          plan: 'FREE', // Default for e-commerce
        },
      });
    }

    return NextResponse.json<PaymentIntentResponse>({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      currency: 'usd',
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

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
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

// GET /api/create-payment-intent - Retrieve payment intent status
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get("payment_intent_id");
    const sessionId = searchParams.get("session_id");

    if (!paymentIntentId && !sessionId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment intent ID or session ID is required" },
        { status: 400 }
      );
    }

    // Check database first
    const payment = await db.paymentInvoice.findFirst({
      where: {
        OR: [
          { stripePaymentId: paymentIntentId || '' },
          { stripePaymentId: sessionId || '' },
        ],
        userId: user.id,
      },
    });

    if (!payment) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    let paymentData;
    if (sessionId) {
      // Retrieve checkout session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paymentData = {
        id: session.id,
        status: session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_email,
        paymentIntent: session.payment_intent,
        url: session.url,
      };
    } else if (paymentIntentId) {
      // Retrieve payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      paymentData = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        clientSecret: paymentIntent.client_secret,
        paymentMethod: paymentIntent.payment_method,
        created: new Date(paymentIntent.created * 1000).toISOString(),
      };
    }

    return NextResponse.json({
      ...paymentData,
      dbStatus: payment.status,
      dbCreated: payment.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error retrieving payment:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to retrieve payment" },
      { status: 500 }
    );
  }
}

// PATCH /api/create-payment-intent - Update payment intent
export async function PATCH(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentIntentId, ...updateData } = body;

    if (!paymentIntentId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Verify payment belongs to user
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
    const webhookSecret = process.env.INVOICE_WEBHOOK_STRIPE_SECRET;

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
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
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
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  await db.paymentInvoice.update({
    where: { stripePaymentId: paymentIntent.id },
    data: {
      status: 'SUCCEEDED',
      paidAt: new Date(),
      receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
    },
  });

  console.log(`Payment intent succeeded: ${paymentIntent.id}`);
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  await db.paymentInvoice.update({
    where: { stripePaymentId: paymentIntent.id },
    data: {
      status: 'FAILED',
      failedAt: new Date(),
    },
  });

  console.log(`Payment intent failed: ${paymentIntent.id}`);
}

async function handleCheckoutSessionCompleted(session: any) {
  await db.paymentInvoice.update({
    where: { stripePaymentId: session.id },
    data: {
      status: 'SUCCEEDED',
      paidAt: new Date(),
      receiptUrl: session.receipt_url,
      invoiceUrl: session.invoice_url,
    },
  });

  console.log(`Checkout session completed: ${session.id}`);
}

async function handleChargeRefunded(charge: any) {
  const paymentIntentId = charge.payment_intent;

  if (paymentIntentId) {
    await db.paymentInvoice.update({
      where: { stripePaymentId: paymentIntentId },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
      },
    });
  }

  console.log(`Charge refunded: ${charge.id}`);
}

// Export webhook handler separately
export const webhook = POST_WEBHOOK;