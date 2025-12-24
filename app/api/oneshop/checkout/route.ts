import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import Stripe from "stripe";
import { validateRequest } from "@/app/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});


export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shippingAddressId, paymentMethod, shippingMethod, note, cartItems } = body;

    // 🔐 DÜZELTİLMİŞ CART VALIDATION
    console.log('Received cart items:', cartItems);
    
    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: 'Cart is invalid format' },
        { status: 400 }
      );
    }
    
    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Her item'ın gerekli alanları kontrol et
    const hasInvalidItems = cartItems.some((item: any) => {
      return !item.productId || !item.variantId || !item.sizeId || 
             !item.price || !item.quantity;
    });
    
    if (hasInvalidItems) {
      return NextResponse.json(
        { error: 'Some cart items are invalid' },
        { status: 400 }
      );
    }

    // Kalan kod aynı kalacak...
    const subTotal = cartItems.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
    }, 0);

    const shippingFees = shippingMethod === 'express' ? 9.99 : 4.99;
    const tax = subTotal * 0.18;
    const total = subTotal + shippingFees + tax;

    // Order oluştur...
    const order = await db.order.create({
      data: {
        userId: user.id,
        shippingAddressId,
        subTotal,
        shippingFees,
        total,
        orderStatus: paymentMethod === 'cod' ? 'Pending' : 'Processing',
        paymentStatus: 'Pending',
        paymentMethod: paymentMethod === 'card' ? 'Stripe' : paymentMethod === 'upi' ? 'UPI' : 'COD',
        groups: {
          create: [
            {
              storeId: 'store-1',
              status: 'Pending',
              shippingService: shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
              shippingDeliveryMin: shippingMethod === 'express' ? 2 : 5,
              shippingDeliveryMax: shippingMethod === 'express' ? 3 : 7,
              shippingFees,
              subTotal,
              total,
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
                  shippingFee: shippingFees / cartItems.length,
                  price: Number(item.price),
                  totalPrice: Number(item.price) * Number(item.quantity),
                  status: 'Pending',
                })),
              },
            },
          ],
        },
      },
      include: {
        groups: {
          include: {
            items: true,
          },
        },
      },
    });

    // Cart'ı temizle
    await db.cartItem.deleteMany({
      where: { cart: { userId: user.id } },
    });

    // Stripe için
    if (paymentMethod === 'card') {
      const lineItems = cartItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity),
      }));

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: lineItems,
        customer_email: user.email ?? undefined,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout/success?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout`,
        metadata: { orderId: order.id, userId: user.id },
      });

      return NextResponse.json({
        success: true,
        paymentUrl: session.url,
        order,
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}