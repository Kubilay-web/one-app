// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const { couponId, userId } = await request.json();

//     if (!couponId) {
//       return NextResponse.json(
//         { success: false, message: 'Coupon ID is required' },
//         { status: 400 }
//       );
//     }

//     // Gerçek uygulamada burada kupon kullanım kaydını silebilirsiniz
//     // Örneğin: await prisma.couponToUser.deleteMany({ where: { couponId, userId } });

//     return NextResponse.json({
//       success: true,
//       message: 'Coupon removed successfully',
//     });

//   } catch (error) {
//     console.error('Coupon removal error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to remove coupon' },
//       { status: 500 }
//     );
//   }
// }













import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { couponId, userId } = await request.json();

    if (!couponId) {
      return NextResponse.json(
        { success: false, message: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    // Kullanıcıya ait kupon kullanım kaydını sil
    if (userId) {
      await prisma.couponToUser.deleteMany({
        where: {
          couponId: couponId,
          userId: userId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon removed successfully',
    });

  } catch (error) {
    console.error('Coupon removal error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove coupon' },
      { status: 500 }
    );
  }
}