import { NextResponse } from 'next/server';
import  db  from '@/app/lib/db';

export async function GET() {
  try {
    // Öne çıkan ürünler
    const featuredProducts = await db.product.findMany({
      where: {
        OR: [
          { sales: { gt: 50 } },
          { rating: { gte: 4.5 } },
        ],
      },
      include: {
        store: true,
        category: true,
        variants: {
          include: {
            sizes: true,
            images: true,
          },
        },
      },
      take: 8,
      orderBy: {
        sales: 'desc',
      },
    });

    // Yeni eklenen ürünler
    const newArrivals = await db.product.findMany({
      include: {
        store: true,
        category: true,
        variants: {
          include: {
            sizes: true,
            images: true,
          },
        },
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Popüler ürünler (en çok görüntülenen)
    const popularProducts = await db.product.findMany({
      include: {
        store: true,
        category: true,
        variants: {
          include: {
            sizes: true,
            images: true,
          },
        },
      },
      take: 8,
      orderBy: {
        views: 'desc',
      },
    });

    // Kategoriler
    const categories = await db.category.findMany({
      where: {
        featured: true,
      },
      include: {
        subCategories: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      take: 6,
    });

    // Özel teklifler
    const specialOffers = await db.product.findMany({
      where: {
        variants: {
          some: {
            isSale: true,
          },
        },
      },
      include: {
        store: true,
        variants: {
          where: {
            isSale: true,
          },
          include: {
            sizes: true,
            images: true,
          },
        },
      },
      take: 4,
    });

    return NextResponse.json({
      success: true,
      data: {
        featuredProducts,
        newArrivals,
        popularProducts,
        categories,
        specialOffers,
      },
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching home data' },
      { status: 500 }
    );
  }
}