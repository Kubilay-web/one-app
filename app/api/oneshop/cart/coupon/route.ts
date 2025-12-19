import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { validateRequest } from '@/app/auth';

// POST: Kupon uygula
export async function POST(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
    }

    // Kuponu bul
    const coupon = await db.coupon.findUnique({
      where: { code },
      include: {
        store: true,
        userRelations: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    }

    // Kupon tarihlerini kontrol et
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (currentDate < startDate || currentDate > endDate) {
      return NextResponse.json({ error: 'Coupon is expired or not yet valid' }, { status: 400 });
    }

    // Sepeti bul
    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: { cartItems: true },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Sepetin store'unu kontrol et (eğer store-spesifik kupon ise)
    const cartStoreIds = [...new Set(cart.cartItems.map(item => item.storeId))];
    if (coupon.storeId && !cartStoreIds.includes(coupon.storeId)) {
      return NextResponse.json({ error: 'Coupon not valid for items in cart' }, { status: 400 });
    }

    // Kuponu sepete uygula
    const updatedCart = await db.cart.update({
      where: { id: cart.id },
      data: {
        couponId: coupon.id,
      },
      include: {
        cartItems: true,
        coupon: true,
      },
    });

    return NextResponse.json({
      success: true,
      cart: updatedCart,
      discount: coupon.discount,
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}

// DELETE: Kuponu kaldır
export async function DELETE(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const updatedCart = await db.cart.update({
      where: { id: cart.id },
      data: {
        couponId: null,
      },
      include: {
        cartItems: true,
      },
    });

    return NextResponse.json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to remove coupon' },
      { status: 500 }
    );
  }
}