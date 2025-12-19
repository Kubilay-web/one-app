import { NextResponse } from 'next/server';
import  db  from '@/app/lib/db';

export async function GET() {
  try {
    // Tüm filtreleme verilerini tek seferde getir
    const [categories, brands, priceRange, stores] = await Promise.all([
      // Kategoriler
      db.category.findMany({
        include: {
          subCategories: {
            include: {
              _count: {
                select: { product: true },
              },
            },
          },
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      
      // Markalar
      db.product.groupBy({
        by: ['brand'],
        _count: {
          brand: true,
        },
        orderBy: {
          brand: 'asc',
        },
      }),
      
      // Fiyat aralığı
      db.size.aggregate({
        _min: {
          price: true,
        },
        _max: {
          price: true,
        },
      }),
      
      // Mağazalar
      db.store.findMany({
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          name: true,
          logo: true,
        },
        orderBy: { name: 'asc' },
      }),
    ]);
    
    return NextResponse.json({
      success: true,
      filters: {
        categories,
        brands: brands.map(b => ({ brand: b.brand, count: b._count.brand })),
        priceRange: {
          min: priceRange._min.price || 0,
          max: priceRange._max.price || 10000,
        },
        stores,
      },
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching filters' },
      { status: 500 }
    );
  }
}