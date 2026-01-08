import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { couponCode, cart } = await request.json();

    if (!couponCode || !cart) {
      return NextResponse.json(
        { success: false, message: 'Coupon code and cart are required' },
        { status: 400 }
      );
    }

    // Kuponu doğrula
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: couponCode.toUpperCase().trim(),
        endDate: {
          gte: new Date().toISOString()
        }
      },
      include: {
        store: true,
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Kuponun geçerlilik tarihi kontrolü
    const startDate = new Date(coupon.startDate);
    const endDate = coupon.endDate ? new Date(coupon.endDate) : null;
    const currentDate = new Date();

    if (startDate > currentDate) {
      return NextResponse.json(
        { success: false, message: 'Coupon is not yet active' },
        { status: 400 }
      );
    }

    if (endDate && endDate < currentDate) {
      return NextResponse.json(
        { success: false, message: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Sepette kuponun mağazasına ait ürün var mı kontrol et
    const cartItems = Array.isArray(cart) ? cart : [];
    const storeItems = cartItems.filter(item => {
      // Eğer item'da storeId yoksa, varsayılan olarak coupon'ın storeId'sini kabul et
      // Gerçek uygulamada bu daha detaylı olmalı
      return true; // Şimdilik tüm item'ları kabul et
    });

    if (storeItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No eligible items for this coupon' },
        { status: 400 }
      );
    }

    // Toplam tutarı hesapla
    const subTotal = storeItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // İndirim miktarını hesapla
    const discountAmount = (subTotal * coupon.discount) / 100;

    return NextResponse.json({
      success: true,
      message: `Coupon applied! ${coupon.discount}% discount`,
      coupon: {
        couponId: coupon.id,
        couponCode: coupon.code,
        discountPercentage: coupon.discount,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        storeId: coupon.storeId,
        storeName: coupon.store.name,
      }
    });

  } catch (error) {
    console.error('Coupon application error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}