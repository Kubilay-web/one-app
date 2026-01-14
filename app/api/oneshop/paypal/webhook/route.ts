// app/api/oneshop/checkout/paypal/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import paypal from "@paypal/checkout-server-sdk";

// Initialize PayPal
let paypalClient: paypal.core.PayPalHttpClient;
const initializePayPal = () => {
  if (!paypalClient) {
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_SECRET!;
    
    const isProduction = process.env.NODE_ENV === "production";
    const environment = isProduction
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    
    paypalClient = new paypal.core.PayPalHttpClient(environment);
  }
  return paypalClient;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;
    const resource = body.resource;

    console.log("PayPal Webhook Received:", { eventType, resource });

    // Verify webhook signature (recommended for production)
    // const headers = request.headers;
    // const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    
    // For now, we'll trust the webhook in development
    // In production, implement signature verification:
    // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature_post

    if (eventType === "CHECKOUT.ORDER.APPROVED") {
      // Order approved but not yet captured
      const orderId = resource.id;
      
      // Find order in database
      const order = await db.order.findUnique({
        where: { paymentProviderId: orderId },
      });

      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "Approved",
            orderStatus: "Processing",
          },
        });
      }
    }

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      // Payment successfully captured
      const captureId = resource.id;
      const orderId = resource.custom_id || resource.invoice_id;

      // Find order in database
      const order = await db.order.findUnique({
        where: { id: orderId },
      });

      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "Completed",
            orderStatus: "Processing",
            paymentProviderId: captureId,
          },
        });

        // Send order confirmation email
        // await sendOrderConfirmationEmail(order);
      }
    }

    if (eventType === "PAYMENT.CAPTURE.DENIED" || 
        eventType === "PAYMENT.CAPTURE.FAILED") {
      // Payment failed
      const orderId = resource.custom_id || resource.invoice_id;

      const order = await db.order.findUnique({
        where: { id: orderId },
      });

      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "Failed",
            orderStatus: "Cancelled",
          },
        });
      }
    }

    if (eventType === "CHECKOUT.ORDER.COMPLETED") {
      // Order completed
      const orderId = resource.id;

      const order = await db.order.findUnique({
        where: { paymentProviderId: orderId },
      });

      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "Completed",
            orderStatus: "Confirmed",
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
