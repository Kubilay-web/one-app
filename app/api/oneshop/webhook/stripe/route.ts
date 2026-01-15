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

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Order'ı güncelle
      await db.order.update({
        where: { id: session.metadata?.orderId },
        data: {
          paymentStatus: "Paid",
          orderStatus: "Confirmed",
        },
      });

      // PaymentDetails'ı güncelle
      await db.paymentDetails.update({
        where: { paymentInetntId: session.id },
        data: {
          status: "Completed",
        },
      });

      console.log(`Order ${session.metadata?.orderId} marked as Paid`);
    } catch (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}