import { NextRequest, NextResponse } from 'next/server';
import  db  from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Query parametreleri
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const brand = searchParams.get('brand');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const searchQuery = searchParams.get('q');
    const store = searchParams.get('store');
    
    // Filtreleme koşulları
    const whereConditions: any = {};
    
    // Kategori filtresi
    if (category) {
      whereConditions.categoryId = category;
    }
    
    // Alt kategori filtresi
    if (subCategory) {
      whereConditions.subCategoryId = subCategory;
    }
    
    // Marka filtresi
    if (brand) {
      whereConditions.brand = brand;
    }
    
    // Mağaza filtresi
    if (store) {
      whereConditions.storeId = store;
    }
    
    // Arama filtresi
    if (searchQuery) {
      whereConditions.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { brand: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }
    
    // Fiyat filtresi
    whereConditions.variants = {
      some: {
        sizes: {
          some: {
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
        },
      },
    };
    
    // Sıralama
    let orderBy: any = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'price-low':
        orderBy = { variants: { sizes: { price: 'asc' } } };
        break;
      case 'price-high':
        orderBy = { variants: { sizes: { price: 'desc' } } };
        break;
      case 'popular':
        orderBy = { views: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'sales':
        orderBy = { sales: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    
    // Ürünleri getir
    const products = await db.product.findMany({
      where: whereConditions,
      skip,
      take: limit,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        category: true,
        subCategory: true,
        variants: {
          include: {
            sizes: {
              orderBy: {
                price: 'asc',
              },
            },
            images: {
              take: 1,
            },
          },
        },
        reviews: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
            wishlist: true,
          },
        },
      },
      orderBy,
    });
    
    const total = await db.product.count({
      where: whereConditions,
    });
    
    // Filtreleme için meta veriler
    const brands = await db.product.groupBy({
      by: ['brand'],
      where: category ? { categoryId: category } : {},
      _count: {
        brand: true,
      },
      orderBy: {
        brand: 'asc',
      },
    });
    
    const priceRange = await db.size.aggregate({
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        brands: brands.map(b => ({ brand: b.brand, count: b._count.brand })),
        priceRange: {
          min: priceRange._min.price || 0,
          max: priceRange._max.price || 10000,
        },
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