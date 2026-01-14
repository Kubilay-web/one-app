// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/app/lib/prisma';

// export async function POST(request: NextRequest) {
//   console.log('=== COUPON VALIDATE API CALLED ===');
  
//   try {
//     const body = await request.json();
//     const { couponCode, userId } = body;

//     console.log('Request body:', { couponCode, userId });

//     if (!couponCode) {
//       return NextResponse.json(
//         { valid: false, message: 'Coupon code is required' },
//         { status: 400 }
//       );
//     }

//     // Kupon kodunu uppercase'e çevir
//     const code = couponCode.toUpperCase().trim();
//     console.log('Searching for coupon:', code);

//     // Kuponu veritabanında ara
//     const coupon = await prisma.coupon.findFirst({
//       where: {
//         code: code,
//       },
//       include: {
//         store: true,
//       },
//     });

//     console.log('Found coupon:', coupon);

//     if (!coupon) {
//       return NextResponse.json(
//         { valid: false, message: 'Invalid coupon code' },
//         { status: 404 }
//       );
//     }

//     // Tarih kontrolleri (MongoDB'de string olarak saklandığı için)
//     const currentDate = new Date();
//     const startDate = new Date(coupon.startDate);
    
//     console.log('Date check:', {
//       currentDate,
//       startDate,
//       startDateValid: startDate <= currentDate
//     });

//     // Başlangıç tarihi kontrolü
//     if (startDate > currentDate) {
//       return NextResponse.json(
//         { valid: false, message: 'Coupon is not yet active' },
//         { status: 400 }
//       );
//     }

//     // Bitiş tarihi kontrolü (eğer varsa)
//     if (coupon.endDate) {
//       const endDate = new Date(coupon.endDate);
//       console.log('End date check:', {
//         endDate,
//         endDateValid: endDate >= currentDate
//       });
      
//       if (endDate < currentDate) {
//         return NextResponse.json(
//           { valid: false, message: 'Coupon has expired' },
//           { status: 400 }
//         );
//       }
//     }

//     // Kullanıcı daha önce bu kuponu kullandı mı? (opsiyonel)
//     if (userId) {
//       const alreadyUsed = await prisma.couponToUser.findFirst({
//         where: {
//           couponId: coupon.id,
//           userId: userId,
//         },
//       });

//       if (alreadyUsed) {
//         return NextResponse.json(
//           { valid: false, message: 'You have already used this coupon' },
//           { status: 400 }
//         );
//       }
//     }

//     // Başarılı response
//     return NextResponse.json({
//       valid: true,
//       coupon: {
//         id: coupon.id,
//         code: coupon.code,
//         discount: coupon.discount,
//         storeId: coupon.storeId,
//         storeName: coupon.store?.name || 'Unknown Store',
//       },
//       message: 'Coupon is valid'
//     });

//   } catch (error) {
//     console.error('Coupon validation error:', error);
    
//     // Detaylı hata mesajı
//     let errorMessage = 'Failed to validate coupon';
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }
    
//     return NextResponse.json(
//       { 
//         valid: false, 
//         message: errorMessage,
//         error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

// // GET request için de basit bir endpoint (test için)
// export async function GET(request: NextRequest) {
//   console.log('=== COUPON VALIDATE GET REQUEST ===');
  
//   return NextResponse.json({
//     message: 'Coupon validate API is working',
//     timestamp: new Date().toISOString(),
//     endpoint: '/api/oneshop/coupon/validate'
//   });
// }










import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponCode, userId } = body;

    if (!couponCode) {
      return NextResponse.json(
        { valid: false, message: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Kupon kodunu uppercase'e çevir
    const code = couponCode.toUpperCase().trim();

    // Kuponu veritabanında ara
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code,
      },
      include: {
        store: true,
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Tarih kontrolleri
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);

    // Başlangıç tarihi kontrolü
    if (startDate > currentDate) {
      return NextResponse.json(
        { valid: false, message: 'Coupon is not yet active' },
        { status: 400 }
      );
    }

    // Bitiş tarihi kontrolü (eğer varsa)
    if (coupon.endDate) {
      const endDate = new Date(coupon.endDate);
      if (endDate < currentDate) {
        return NextResponse.json(
          { valid: false, message: 'Coupon has expired' },
          { status: 400 }
        );
      }
    }

    // Kupon kullanım limiti kontrolü
    if (coupon.usageLimit) {
      const usageCount = await prisma.couponToUser.count({
        where: { couponId: coupon.id },
      });
      
      if (usageCount >= coupon.usageLimit) {
        return NextResponse.json(
          { valid: false, message: 'Coupon usage limit reached' },
          { status: 400 }
        );
      }
    }

    // Kullanıcı daha önce bu kuponu kullandı mı?
    if (userId) {
      const alreadyUsed = await prisma.couponToUser.findFirst({
        where: {
          couponId: coupon.id,
          userId: userId,
        },
      });

      if (alreadyUsed) {
        return NextResponse.json(
          { valid: false, message: 'You have already used this coupon' },
          { status: 400 }
        );
      }
    }

    // Başarılı response
    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
        storeId: coupon.storeId,
        storeName: coupon.store?.name || 'Unknown Store',
      },
      message: 'Coupon is valid'
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    
    return NextResponse.json(
      { 
        valid: false, 
        message: 'Failed to validate coupon',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}