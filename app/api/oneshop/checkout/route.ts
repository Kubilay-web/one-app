import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import Stripe from 'stripe';
import { validateRequest } from '@/app/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion:"2025-08-27.basil"
});

// GET: Checkout bilgilerini getir
export async function GET(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sepeti getir
    const cart = await db.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        cartItems: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        coupon: true,
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Kullanıcının adreslerini getir
    const shippingAddresses = await db.shippingAddress.findMany({
      where: {
        userId: user.id,
      },
      include: {
        country: true,
      },
    });

    return NextResponse.json({
      cart,
      shippingAddresses,
    });
  } catch (error) {
    console.error('Checkout fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checkout data' },
      { status: 500 }
    );
  }
}

// POST: Sipariş oluştur
export async function POST(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      shippingAddressId,
      paymentMethod,
      shippingMethod,
      note,
    } = body;

    // Sepeti getir
    const cart = await db.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        cartItems: {
          include: {
            store: true,
          },
        },
        coupon: true,
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Adresi doğrula
    const shippingAddress = await db.shippingAddress.findUnique({
      where: {
        id: shippingAddressId,
        userId: user.id,
      },
      include: {
        country: true,
      },
    });

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address not found' }, { status: 404 });
    }

    // Store'lara göre grupla
    const storeGroups = new Map();
    cart.cartItems.forEach(item => {
      if (!storeGroups.has(item.storeId)) {
        storeGroups.set(item.storeId, {
          store: item.store,
          items: [],
          subTotal: 0,
        });
      }
      const group = storeGroups.get(item.storeId);
      group.items.push(item);
      group.subTotal += item.totalPrice;
    });

    // Sipariş oluştur
    const order = await db.order.create({
      data: {
        userId:user.id,
        shippingAddressId: shippingAddress.id,
        shippingFees: cart.shippingFees,
        subTotal: cart.subTotal,
        total: cart.total,
        orderStatus: 'Pending',
        paymentStatus: 'Pending',
        paymentMethod: paymentMethod === 'card' ? 'Stripe' : 'COD',
      },
    });

    // Her store için OrderGroup oluştur
    for (const [storeId, group] of storeGroups) {
      const shippingFee = await calculateShippingFee(
        storeId,
        shippingAddress.countryId,
        group.items.length,
        shippingMethod
      );

      const orderGroup = await db.orderGroup.create({
        data: {
          orderId: order.id,
          storeId: storeId,
          couponId: cart.couponId,
          shippingService: shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
          shippingDeliveryMin: shippingMethod === 'express' ? 2 : 7,
          shippingDeliveryMax: shippingMethod === 'express' ? 5 : 14,
          shippingFees: shippingFee,
          subTotal: group.subTotal,
          total: group.subTotal + shippingFee,
          status: 'Pending',
        },
      });

      // OrderItem'ları oluştur
      for (const item of group.items) {
        await db.orderItem.create({
          data: {
            orderGroupId: orderGroup.id,
            productId: item.productId,
            variantId: item.variantId,
            sizeId: item.sizeId,
            productSlug: item.productSlug,
            variantSlug: item.variantSlug,
            sku: item.sku,
            name: item.name,
            image: item.image,
            size: item.size,
            quantity: item.quantity,
            shippingFee: item.shippingFee,
            price: item.price,
            totalPrice: item.totalPrice,
            status: 'Pending',
          },
        });

        // Stok güncelle (gerçek uygulamada stok kontrolü yapılmalı)
        await db.size.update({
          where: { id: item.sizeId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // Sepeti temizle
    await db.cart.update({
      where: { id: cart.id },
      data: {
        cartItems: {
          deleteMany: {},
        },
        couponId: null,
        subTotal: 0,
        total: 0,
        shippingFees: 0,
      },
    });

    // Stripe ödeme için
    if (paymentMethod === 'card') {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cart.cartItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        metadata: {
          orderId: order.id,
          userId: user.id,
        },
      });

      return NextResponse.json({
        success: true,
        order,
        paymentUrl: stripeSession.url,
      });
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully. Pay on delivery.',
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

async function calculateShippingFee(
  storeId: string,
  countryId: string,
  itemCount: number,
  shippingMethod: string
) {
  const store = await db.store.findUnique({
    where: { id: storeId },
    include: {
      shippingRates: {
        where: {
          countryId: countryId,
        },
      },
    },
  });

  if (!store?.shippingRates?.[0]) {
    return store?.defaultShippingFeeFixed || 0;
  }

  const rate = store.shippingRates[0];
  let shippingFee = 0;

  switch (store.defaultShippingService) {
    case 'ITEM':
      shippingFee =
        rate.shippingFeePerItem +
        Math.max(0, itemCount - 1) * rate.shippingFeeForAdditionalItem;
      break;
    case 'WEIGHT':
      // Varsayılan ağırlık hesaplaması
      const weightPerItem = 0.5; // kg
      shippingFee = rate.shippingFeePerKg * weightPerItem * itemCount;
      break;
    case 'FIXED':
      shippingFee = rate.shippingFeeFixed;
      break;
    default:
      shippingFee = store.defaultShippingFeeFixed || 0;
  }

  // Express delivery için ek ücret
  if (shippingMethod === 'express') {
    shippingFee *= 1.5; // %50 daha fazla
  }

  return shippingFee;
}