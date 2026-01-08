import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import Stripe from "stripe";
import { validateRequest } from "@/app/auth";
import paypal from "@paypal/checkout-server-sdk";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// PAYPAL CLIENT
const paypalClientId = process.env.PAYPAL_CLIENT_ID!;
const paypalClientSecret = process.env.PAYPAL_SECRET!;
const environment = new paypal.core.SandboxEnvironment(
  paypalClientId,
  paypalClientSecret
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      shippingAddressId,
      paymentMethod,
      shippingMethod,
      cartItems,
      total,
      shippingFee,
      discountAmount,
    } = body;



    // CART VALIDATION
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    const subTotal = cartItems.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const shippingFees =
      shippingFee || (shippingMethod === "express" ? 9.99 : 4.99);

    const finalTotal = total;

    // ✅ SHIPPING ADDRESS (Stripe + PayPal ortak)
    const shippingAddress = await db.shippingAddress.findUnique({
      where: {
        id: shippingAddressId,
        userId: user.id,
      },
    });

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address not found" },
        { status: 400 }
      );
    }

    // ✅ ORDER CREATE
    const order = await db.order.create({
      data: {
        userId: user.id,
        shippingAddressId,
        subTotal,
        shippingFees,
        total: finalTotal,
        orderStatus: "Pending",
        paymentStatus: "Pending",
        paymentMethod:
          paymentMethod === "card"
            ? "Stripe"
            : paymentMethod === "paypal"
            ? "Paypal"
            : null,

        groups: {
          create: [
            {
              storeId:"store-1", // ✅ HARD-CODE YOK
              status: "Pending",

              shippingService:
                shippingMethod === "express"
                  ? "Express Delivery"
                  : "Standard Delivery",

              shippingDeliveryMin: shippingMethod === "express" ? 2 : 5,
              shippingDeliveryMax: shippingMethod === "express" ? 3 : 7,

              shippingFees,
              subTotal,
              total: finalTotal,

              items: {
                create: cartItems.map((item: any) => ({
                  productId: item.productId,
                  variantId: item.variantId,
                  sizeId: item.sizeId,
                  productSlug: item.productSlug,
                  variantSlug: item.variantSlug,
                  sku: item.sku,
                  name: item.name,
                  image: item.image,
                  size: item.size,
                  quantity: Number(item.quantity),
                  price: Number(item.price),
                  totalPrice:
                    Number(item.price) * Number(item.quantity),
                  shippingFee: shippingFees / cartItems.length,
                  status: "Pending",
                })),
              },
            },
          ],
        },
      },
      include: {
        groups: { include: { items: true } },
      },
    });

    // CART CLEAN
    await db.cartItem.deleteMany({
      where: { cart: { userId: user.id } },
    });

    // ================= STRIPE =================
    if (paymentMethod === "card") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Order #${order.id.slice(0, 8)}`,
              },
              unit_amount: Math.round(finalTotal * 100),
            },
            quantity: 1,
          },
        ],

        customer_email: user.email ?? undefined,

        metadata: {
          orderId: order.id,
          userId: user.id,
        },

        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout/success?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout`,
      });

      return NextResponse.json({
        success: true,
        paymentUrl: session.url,
        sessionId: session.id,
        order,
      });
    }

    // ================= PAYPAL =================
    if (paymentMethod === "paypal") {
      const req = new paypal.orders.OrdersCreateRequest();

      req.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: order.id,
            description: `Order #${order.id.slice(0, 8)}`,
            amount: {
              currency_code: "USD",
              value: finalTotal.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: subTotal.toFixed(2),
                },
                shipping: {
                  currency_code: "USD",
                  value: shippingFees.toFixed(2),
                },
                discount: {
                  currency_code: "USD",
                  value: (discountAmount || 0).toFixed(2),
                },
              },
            },

            // ✅ STRIPE İLE AYNI ADRES KAYNAĞI
            shipping: {
              name: {
                full_name: shippingAddress.fullName,
              },
              address: {
                address_line_1: shippingAddress.addressLine1,
                address_line_2:
                  shippingAddress.addressLine2 || "",
                admin_area_2: shippingAddress.city,
                admin_area_1: shippingAddress.state,
                postal_code: shippingAddress.postalCode,
                country_code: shippingAddress.countryCode,
              },
            },

            items: cartItems.map((item: any, i: number) => ({
              name:
                item.name.length > 127
                  ? item.name.slice(0, 124) + "..."
                  : item.name,
              sku: item.sku || `ITEM-${i + 1}`,
              unit_amount: {
                currency_code: "USD",
                value: Number(item.price).toFixed(2),
              },
              quantity: item.quantity.toString(),
              category: "PHYSICAL_GOODS",
            })),
          },
        ],

        application_context: {
          brand_name: "OneShop",
          user_action: "PAY_NOW",
          landing_page: "BILLING",
          shipping_preference: "SET_PROVIDED_ADDRESS",
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout/success?orderId=${order.id}&paymentMethod=paypal`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout`,
        },
      });

      const paypalOrder = await paypalClient.execute(req);

      await db.order.update({
        where: { id: order.id },
        data: { paymentProviderId: paypalOrder.result.id },
      });

      const approvalUrl = paypalOrder.result.links.find(
        (l: any) => l.rel === "approve"
      )?.href;

      return NextResponse.json({
        success: true,
        paymentUrl: approvalUrl,
        paypalOrderId: paypalOrder.result.id,
        order,
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
