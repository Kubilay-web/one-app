import { NextRequest, NextResponse } from 'next/server';
import db from "@/app/lib/db";
import { validateRequest } from '@/app/auth';


export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const {user} = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await db.order.findUnique({
      where: {
        id: params.orderId,
        userId: user.id,
      },
      include: {
        groups: {
          include: {
            items: true,
            store: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                logo: true,
              },
            },
            coupon: {
              select: {
                code: true,
                discount: true,
              },
            },
          },
        },
        shippingAddress: {
          include: {
            country: true,
          },
        },
        paymentDetails: {
          select: {
            paymentMethod: true,
            amount: true,
            currency: true,
            status: true,
            createdAt: true,
          },
        },
        user: {
          select: {
            email: true,
            displayName: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}