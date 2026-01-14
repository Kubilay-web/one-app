// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/app/lib/prisma';

// export async function POST(request: NextRequest) {
//   try {
//     const { couponCode, cart } = await request.json();

//     if (!couponCode || !cart) {
//       return NextResponse.json(
//         { success: false, message: 'Coupon code and cart are required' },
//         { status: 400 }
//       );
//     }

//     // Kuponu doğrula
//     const coupon = await prisma.coupon.findFirst({
//       where: {
//         code: couponCode.toUpperCase().trim(),
//         endDate: {
//           gte: new Date().toISOString()
//         }
//       },
//       include: {
//         store: true,
//       },
//     });

//     if (!coupon) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid coupon code' },
//         { status: 404 }
//       );
//     }

//     // Kuponun geçerlilik tarihi kontrolü
//     const startDate = new Date(coupon.startDate);
//     const endDate = coupon.endDate ? new Date(coupon.endDate) : null;
//     const currentDate = new Date();

//     if (startDate > currentDate) {
//       return NextResponse.json(
//         { success: false, message: 'Coupon is not yet active' },
//         { status: 400 }
//       );
//     }

//     if (endDate && endDate < currentDate) {
//       return NextResponse.json(
//         { success: false, message: 'Coupon has expired' },
//         { status: 400 }
//       );
//     }

//     // Sepette kuponun mağazasına ait ürün var mı kontrol et
//     const cartItems = Array.isArray(cart) ? cart : [];
//     const storeItems = cartItems.filter(item => {
//       // Eğer item'da storeId yoksa, varsayılan olarak coupon'ın storeId'sini kabul et
//       // Gerçek uygulamada bu daha detaylı olmalı
//       return true; // Şimdilik tüm item'ları kabul et
//     });

//     if (storeItems.length === 0) {
//       return NextResponse.json(
//         { success: false, message: 'No eligible items for this coupon' },
//         { status: 400 }
//       );
//     }

//     // Toplam tutarı hesapla
//     const subTotal = storeItems.reduce((sum, item) => {
//       return sum + (item.price * item.quantity);
//     }, 0);

//     // İndirim miktarını hesapla
//     const discountAmount = (subTotal * coupon.discount) / 100;

//     return NextResponse.json({
//       success: true,
//       message: `Coupon applied! ${coupon.discount}% discount`,
//       coupon: {
//         couponId: coupon.id,
//         couponCode: coupon.code,
//         discountPercentage: coupon.discount,
//         discountAmount: parseFloat(discountAmount.toFixed(2)),
//         storeId: coupon.storeId,
//         storeName: coupon.store.name,
//       }
//     });

//   } catch (error) {
//     console.error('Coupon application error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to apply coupon' },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { couponCode, cart, userId } = await request.json();

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

    // Geçerlilik kontrolü
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = coupon.endDate ? new Date(coupon.endDate) : null;

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

    // Sepetteki ilgili ürünleri bul
    const cartItems = Array.isArray(cart) ? cart : [];
    
    // Kuponun minimum alışveriş tutarı kontrolü
    const subTotal = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    if (coupon.minOrderValue && subTotal < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        message: `Minimum order value of $${coupon.minOrderValue} required for this coupon`,
      }, { status: 400 });
    }

    // İndirim miktarını hesapla
    let discountAmount = 0;
    
    // discountType kontrolü yap
    if (coupon.discountType === 'PERCENTAGE' || !coupon.discountType) {
      // Varsayılan olarak percentage kabul et
      discountAmount = (subTotal * coupon.discount) / 100;
      
      // Maksimum indirim limiti kontrolü
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'FIXED') {
      discountAmount = coupon.discount;
    }

    // Kupon kullanım kaydı oluştur (mevcut Prisma schema'ya göre)
    if (userId) {
      try {
        // Önce mevcut alanları kontrol et
        const couponToUserData: any = {
          couponId: coupon.id,
          userId: userId,
        };

        // createdDate veya createdAt alanını kontrol et
        const couponToUserModel = prisma.couponToUser as any;
        const fields = Object.keys(couponToUserModel.fields || {});

        if (fields.includes('createdAt')) {
          couponToUserData.createdAt = new Date();
        } else if (fields.includes('createdDate')) {
          couponToUserData.createdDate = new Date();
        } else if (fields.includes('usedAt')) {
          couponToUserData.usedAt = new Date();
        } else if (fields.includes('usedDate')) {
          couponToUserData.usedDate = new Date();
        }

        // discountAmount alanını kontrol et
        if (fields.includes('discountAmount')) {
          couponToUserData.discountAmount = discountAmount;
        }

        await prisma.couponToUser.create({
          data: couponToUserData
        });
      } catch (dbError) {
        console.error('Coupon usage tracking error:', dbError);
        // Kupon kullanım kaydı hatası kupon uygulamasını engellemesin
      }
    }

    // Response'u hazırla
    const responseCoupon = {
      couponId: coupon.id,
      couponCode: coupon.code,
      discountPercentage: coupon.discountType === 'PERCENTAGE' || !coupon.discountType ? coupon.discount : 0,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      expiryDate: coupon.endDate || null,
      minOrderValue: coupon.minOrderValue || 0,
      maxDiscount: coupon.maxDiscount || null,
    };

    return NextResponse.json({
      success: true,
      message: `Coupon applied successfully! You saved $${discountAmount.toFixed(2)}`,
      coupon: responseCoupon
    });

  } catch (error) {
    console.error('Coupon application error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}