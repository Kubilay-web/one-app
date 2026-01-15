// app/api/oneshop/webhook/paypal/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;
    const resource = body.resource;

    if (eventType === "CHECKOUT.ORDER.APPROVED" || eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = resource.purchase_units?.[0]?.reference_id;
      const paypalOrderId = resource.id;

      if (orderId) {
        // Order'ı güncelle
        await db.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "Paid",
            orderStatus: "Confirmed",
          },
        });

        // PaymentDetails'ı güncelle
        await db.paymentDetails.update({
          where: { paymentInetntId: paypalOrderId },
          data: {
            status: "Completed",
          },
        });

        console.log(`Order ${orderId} marked as Paid via PayPal`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}