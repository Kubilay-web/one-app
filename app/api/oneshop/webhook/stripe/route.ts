// app/api/oneshop/webhook/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/app/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature")!;
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          // Order'ı Paid olarak güncelle
          await db.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "Paid",
              orderStatus: "Confirmed",
            },
          });

          // PaymentDetails'ı güncelle
          await db.paymentDetails.update({
            where: { orderId: orderId },
            data: {
              status: "Completed",
            },
          });
        }
        break;

      case "checkout.session.async_payment_failed":
        const failedSession = event.data.object as Stripe.Checkout.Session;
        const failedOrderId = failedSession.metadata?.orderId;

        if (failedOrderId) {
          await db.order.update({
            where: { id: failedOrderId },
            data: {
              paymentStatus: "Failed",
              orderStatus: "Cancelled",
            },
          });
        }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}