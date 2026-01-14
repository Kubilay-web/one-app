// app/api/oneshop/checkout/complete-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentIntentId, orderId, amount, status } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get the order
    const order = await db.order.findUnique({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order with payment information
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: status === "succeeded" ? "Paid" : "Failed",
        paymentProviderId: paymentIntentId,
        paidAt: status === "succeeded" ? new Date() : null,
        orderStatus: status === "succeeded" ? "Processing" : "Failed",
      },
      include: {
        groups: {
          include: {
            items: true,
          },
        },
      },
    });

    // Send confirmation email
    if (status === "succeeded" && user.email) {
      try {
        await fetch("/api/oneshop/email/order-confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderId,
            customerEmail: user.email,
            customerName: user.username || user.email,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error completing order:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}