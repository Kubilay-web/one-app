import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    const products = await db.product.findMany({
      skip,
      take: limit,
      include: {
        store: true,
        category: true,
        subCategory: true,
        variants: {
          include: {
            sizes: true,
            images: true,
            colors: true,
          },
        },
        specs: true,
        reviews: {
          take: 5,
          include: {
            user: true,
            images: true,
          },
        },
        wishlist: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await db.product.count();

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching products' },
      { status: 500 }
    );
  }
}