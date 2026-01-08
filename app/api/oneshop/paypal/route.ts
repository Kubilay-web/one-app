import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import paypal from "@paypal/checkout-server-sdk";

const paypalClientId = process.env.PAYPAL_CLIENT_ID!;
const paypalClientSecret = process.env.PAYPAL_SECRET!;
const environment = new paypal.core.SandboxEnvironment(paypalClientId, paypalClientSecret);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, resource } = body;

    console.log("PayPal Webhook Received:", event_type);

    // CHECKOUT.ORDER.APPROVED - Kullanıcı ödemeyi onayladı
    // PAYMENT.CAPTURE.COMPLETED - Ödeme tamamlandı
    if (event_type === "CHECKOUT.ORDER.APPROVED" || event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = resource.id || resource.purchase_units[0]?.reference_id;
      
      if (!orderId) {
        return NextResponse.json({ error: "No order ID found" }, { status: 400 });
      }

      // Order'ı güncelle
      await db.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "Paid",
          orderStatus: "Processing",
          paidAt: new Date(),
        },
      });

      console.log(`✅ Order ${orderId} updated to Paid`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PayPal webhook doğrulama için GET endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: "PayPal webhook endpoint is running",
    status: "active" 
  });
}