// app/api/oneshop/webhook/paypal/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, resource } = body;

    if (event_type === "CHECKOUT.ORDER.APPROVED") {
      const orderId = resource.purchase_units[0].reference_id;

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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}