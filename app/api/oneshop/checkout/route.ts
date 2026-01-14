// app/api/oneshop/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import Stripe from "stripe";
import { validateRequest } from "@/app/auth";
import paypal from "@paypal/checkout-server-sdk";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

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
      shippingFee,
      discountAmount,
      appliedCoupon,
    } = body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!shippingAddressId) {
      return NextResponse.json(
        { error: "Shipping address required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method required" },
        { status: 400 }
      );
    }

    const subTotal = cartItems.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const shippingFees = Number(shippingFee) || 0;
    const discount = Number(discountAmount) || 0;
    const total = Math.max(0, subTotal + shippingFees - discount);

    const shippingAddress = await db.shippingAddress.findUnique({
      where: { id: shippingAddressId, userId: user.id },
      include: { country: true },
    });

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 400 }
      );
    }

    for (const item of cartItems) {
      const size = await db.size.findFirst({
        where: { id: item.sizeId, productVariantId: item.variantId },
      });

      if (!size) {
        return NextResponse.json(
          { error: `Size not found for ${item.name}` },
          { status: 400 }
        );
      }

      if (size.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        );
      }
    }

    let paymentMethodEnum: "Paypal" | "Stripe" | null = null;
    
    if (paymentMethod === "card") {
      paymentMethodEnum = "Stripe";
    } else if (paymentMethod === "paypal") {
      paymentMethodEnum = "Paypal";
    }

    // Order oluştur
    const order = await db.order.create({
      data: {
        userId: user.id,
        shippingAddressId,
        subTotal,
        shippingFees,
        total,
        orderStatus: "Pending",
        paymentStatus: "Pending", // Schema'ya göre
        paymentMethod: paymentMethodEnum,
        groups: {
          create: cartItems.map((item: any) => ({
            storeId: item.storeId || "default-store",
            status: "Pending",
            shippingService: shippingMethod === "express" 
              ? "Express Delivery" 
              : "Standard Delivery",
            shippingDeliveryMin: shippingMethod === "express" ? 2 : 5,
            shippingDeliveryMax: shippingMethod === "express" ? 3 : 7,
            shippingFees: shippingFees / cartItems.length,
            subTotal: Number(item.price) * Number(item.quantity),
            total: Number(item.price) * Number(item.quantity) + (shippingFees / cartItems.length),
            note: shippingMethod === "express" 
              ? "Express shipping" 
              : "Standard shipping",
            ...(appliedCoupon && {
              couponId: appliedCoupon.couponId,
            }),
            items: {
              create: {
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
                totalPrice: Number(item.price) * Number(item.quantity),
                shippingFee: shippingFees / cartItems.length,
                status: "Pending",
              },
            },
          })),
        },
      },
      include: {
        groups: {
          include: {
            items: true,
            coupon: true,
          },
        },
      },
    });

    for (const item of cartItems) {
      await db.size.update({
        where: { id: item.sizeId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // Clear cart
    try {
      const cart = await db.cart.findUnique({ where: { userId: user.id } });
      if (cart) {
        await db.cartItem.deleteMany({ where: { cartId: cart.id } });
        await db.cart.update({
          where: { id: cart.id },
          data: { couponId: null },
        });
      }
    } catch (error) {
      console.error("Cart clear error:", error);
    }

    // Stripe
    if (paymentMethod === "card") {
      try {
        let customer: Stripe.Customer;
        const existingCustomers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        });

        customer = existingCustomers.data.length > 0 
          ? existingCustomers.data[0]
          : await stripe.customers.create({
              email: user.email,
              name: user.displayName || user.username,
              metadata: { userId: user.id },
            });

        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          mode: "payment",
          payment_method_types: ["card"],
          line_items: cartItems.map((item: any) => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
                description: `Size: ${item.size}`,
                images: item.image ? [item.image] : [],
              },
              unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: item.quantity,
          })),
          ...(shippingFees > 0 && {
            shipping_options: [{
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: {
                  amount: Math.round(shippingFees * 100),
                  currency: "usd",
                },
                display_name: shippingMethod === "express" 
                  ? "Express Shipping" 
                  : "Standard Shipping",
              },
            }],
          }),
          ...(discount > 0 && {
            discounts: [{
              coupon: await stripe.coupons.create({
                amount_off: Math.round(discount * 100),
                currency: "usd",
                duration: "once",
              }),
            }],
          }),
          metadata: { orderId: order.id, userId: user.id },
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        });

        // PaymentDetails oluştur
        await db.paymentDetails.create({
          data: {
            paymentInetntId: session.id,
            paymentMethod: "Stripe",
            status: "Processing", // PaymentDetails'te string, enum değil
            amount: total,
            currency: "USD",
            orderId: order.id,
            userId: user.id,
          },
        });

        // Order status'u PENDING olarak kalacak, ödeme tamamlanana kadar
        // Stripe success webhook'unda "Paid" yapılacak

        return NextResponse.json({
          success: true,
          paymentUrl: session.url,
          sessionId: session.id,
          order,
        });

      } catch (error: any) {
        // Rollback
        for (const item of cartItems) {
          try {
            await db.size.update({
              where: { id: item.sizeId },
              data: { quantity: { increment: item.quantity } },
            });
          } catch {}
        }
        
        await db.order.update({
          where: { id: order.id },
          data: { 
            paymentStatus: "Failed", // Schema'da var
            orderStatus: "Cancelled",
          },
        });

        return NextResponse.json(
          { error: `Stripe error: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // PayPal
    if (paymentMethod === "paypal") {
      try {
        const paypalClient = initializePayPal();
        const req = new paypal.orders.OrdersCreateRequest();
        
        req.requestBody({
          intent: "CAPTURE",
          purchase_units: [{
            reference_id: order.id,
            description: `Order #${order.id.slice(0, 8)}`,
            amount: {
              currency_code: "USD",
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: "USD", value: subTotal.toFixed(2) },
                shipping: { currency_code: "USD", value: shippingFees.toFixed(2) },
                ...(discount > 0 && {
                  discount: { currency_code: "USD", value: discount.toFixed(2) },
                }),
              },
            },
            items: cartItems.map((item: any) => ({
              name: item.name.length > 127 ? item.name.substring(0, 124) + "..." : item.name,
              sku: item.sku,
              unit_amount: { currency_code: "USD", value: Number(item.price).toFixed(2) },
              quantity: item.quantity.toString(),
              category: "PHYSICAL_GOODS",
            })),
          }],
          application_context: {
            brand_name: "OneShop",
            user_action: "PAY_NOW",
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order_id=${order.id}&payment_method=paypal`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
          },
        });

        const response = await paypalClient.execute(req);
        
        if (response.statusCode !== 201) {
          throw new Error(`PayPal error: ${response.statusCode}`);
        }

        // PaymentDetails oluştur
        await db.paymentDetails.create({
          data: {
            paymentInetntId: response.result.id,
            paymentMethod: "PayPal",
            status: "Processing", // PaymentDetails'te string
            amount: total,
            currency: "USD",
            orderId: order.id,
            userId: user.id,
          },
        });

        // Order status'u PENDING olarak kalacak
        // PayPal webhook'unda "Paid" yapılacak

        const approvalUrl = response.result.links.find(
          (link: any) => link.rel === "approve"
        )?.href;

        if (!approvalUrl) throw new Error("No approval URL");

        return NextResponse.json({
          success: true,
          paymentUrl: approvalUrl,
          paypalOrderId: response.result.id,
          order,
        });

      } catch (error: any) {
        // Rollback
        for (const item of cartItems) {
          try {
            await db.size.update({
              where: { id: item.sizeId },
              data: { quantity: { increment: item.quantity } },
            });
          } catch {}
        }
        
        await db.order.update({
          where: { id: order.id },
          data: { 
            paymentStatus: "Failed", // Schema'da var
            orderStatus: "Cancelled",
          },
        });

        return NextResponse.json(
          { error: `PayPal error: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // COD/UPI
    if (paymentMethod === "cod" || paymentMethod === "upi") {
      // COD/UPI için paymentStatus PENDING kalır
      await db.order.update({
        where: { id: order.id },
        data: { 
          orderStatus: "Confirmed",
        },
      });

      return NextResponse.json({
        success: true,
        order,
        message: "Order placed",
      });
    }

    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}