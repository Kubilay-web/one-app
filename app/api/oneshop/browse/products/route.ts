// import { NextRequest, NextResponse } from 'next/server';
// import db from '@/app/lib/db';

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '12');
//     const skip = (page - 1) * limit;
    
//     // Filtre parametreleri
//     const category = searchParams.get('category');
//     const subCategory = searchParams.get('subCategory');
//     const brand = searchParams.get('brand');
//     const store = searchParams.get('store');
//     const minPrice = parseFloat(searchParams.get('minPrice') || '0');
//     const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000');
//     const sortBy = searchParams.get('sortBy') || 'newest';
//     const search = searchParams.get('q') || '';
//     const rating = parseFloat(searchParams.get('rating') || '0');

//     console.log('🔄 Fetching products with filters:', {
//       category,
//       subCategory,
//       brand,
//       store,
//       minPrice,
//       maxPrice,
//       sortBy,
//       search,
//       page,
//       limit
//     });

//     // Where koşulu
//     const where: any = {};

//     // Arama
//     if (search && search.trim() !== '') {
//       where.OR = [
//         { name: { contains: search, mode: 'insensitive' } },
//         { description: { contains: search, mode: 'insensitive' } },
//         { brand: { contains: search, mode: 'insensitive' } }
//       ];
//     }

//     // Kategori filtresi
//     if (category && category.trim() !== '' && category !== 'null') {
//       where.categoryId = category;
//     }

//     // Alt kategori filtresi
//     if (subCategory && subCategory.trim() !== '' && subCategory !== 'null') {
//       where.subCategoryId = subCategory;
//     }

//     // Marka filtresi
//     if (brand && brand.trim() !== '' && brand !== 'null') {
//       where.brand = brand;
//     }

//     // Mağaza filtresi
//     if (store && store.trim() !== '' && store !== 'null') {
//       where.storeId = store;
//     }

//     // Rating filtresi
//     if (rating > 0) {
//       where.rating = { gte: rating };
//     }

//     // Ürünleri getir
//     const products = await db.product.findMany({
//       where,
//       include: {
//         store: {
//           select: {
//             id: true,
//             name: true,
//             logo: true,
//             averageRating: true
//           }
//         },
//         category: {
//           select: {
//             id: true,
//             name: true,
//             url: true
//           }
//         },
//         subCategory: {
//           select: {
//             id: true,
//             name: true,
//             url: true
//           }
//         },
//         variants: {
//           include: {
//             sizes: {
//               orderBy: { price: 'asc' },
//               take: 1
//             },
//             images: {
//               take: 1
//             }
//           },
//           take: 1
//         },
//         reviews: {
//           select: {
//             rating: true
//           }
//         },
//         _count: {
//           select: {
//             reviews: true,
//             wishlist: true
//           }
//         }
//       },
//       skip,
//       take: limit,
//       orderBy: getOrderBy(sortBy)
//     });

//     // Toplam ürün sayısı
//     const total = await db.product.count({ where });

//     // Fiyat filtresini client-side'da uygula
//     let filteredProducts = products;
//     if (minPrice > 0 || maxPrice < 10000) {
//       filteredProducts = products.filter(product => {
//         const price = product.variants[0]?.sizes[0]?.price || 0;
//         return price >= minPrice && price <= maxPrice;
//       });
//     }

//     // Sıralamayı uygula
//     const sortedProducts = sortProducts(filteredProducts, sortBy);

//     // Her ürün için rating hesapla
//     const productsWithRating = sortedProducts.map(product => {
//       const reviews = product.reviews || [];
//       const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//       const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
//       return {
//         ...product,
//         rating: averageRating,
//         numReviews: reviews.length
//       };
//     });

//     console.log(`✅ Found ${total} products, returning ${productsWithRating.length}`);

//     return NextResponse.json({
//       success: true,
//       products: productsWithRating,
//       meta: {
//         total,
//         page,
//         totalPages: Math.ceil(total / limit),
//         limit
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error fetching products:', error);
    
//     return NextResponse.json({
//       success: false,
//       error: 'Failed to fetch products',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     }, { status: 500 });
//   }
// }

// // Prisma için sıralama
// function getOrderBy(sortBy: string) {
//   switch (sortBy) {
//     case 'newest':
//       return { createdAt: 'desc' };
//     case 'oldest':
//       return { createdAt: 'asc' };
//     case 'popular':
//       return { sales: 'desc' };
//     case 'rating':
//       return { rating: 'desc' };
//     case 'sales':
//       return { sales: 'desc' };
//     default:
//       return { createdAt: 'desc' };
//   }
// }

// // Client-side sıralama (fiyat için)
// function sortProducts(products: any[], sortBy: string) {
//   const sorted = [...products];
  
//   switch (sortBy) {
//     case 'price-low':
//       return sorted.sort((a, b) => {
//         const priceA = a.variants[0]?.sizes[0]?.price || 0;
//         const priceB = b.variants[0]?.sizes[0]?.price || 0;
//         return priceA - priceB;
//       });
      
//     case 'price-high':
//       return sorted.sort((a, b) => {
//         const priceA = a.variants[0]?.sizes[0]?.price || 0;
//         const priceB = b.variants[0]?.sizes[0]?.price || 0;
//         return priceB - priceA;
//       });
      
//     default:
//       return sorted;
//   }
// }










import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { redis } from '@/app/lib/redis';

const CACHE_TTL = 86400; // 1 gün
const REFRESH_THRESHOLD = 7200; // 2 saat
const REFRESH_IN_PROGRESS_PREFIX = 'refreshing:';

// Helper: Cache key üret (RAM dostu, filtreleri grupla)
function generateCacheKey(searchParams: URLSearchParams, page: number, limit: number) {
  const category = searchParams.get('category') || 'all';
  const subCategory = searchParams.get('subCategory') || 'all';
  const brand = searchParams.get('brand') || 'all';
  const store = searchParams.get('store') || 'all';
  const sortBy = searchParams.get('sortBy') || 'newest';
  return `products:cat=${category}:sub=${subCategory}:brand=${brand}:store=${store}:page=${page}:limit=${limit}:sort=${sortBy}`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const cacheKey = generateCacheKey(searchParams, page, limit);

    // 1️⃣ Redis cache kontrol
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("CACHE HIT ⚡");

      // TTL düşükse arka planda yenile
      const ttl = await redis.ttl(cacheKey);
      if (ttl && ttl > 0 && ttl < REFRESH_THRESHOLD) {
        const refreshFlagKey = REFRESH_IN_PROGRESS_PREFIX + cacheKey;
        const isRefreshing = await redis.get(refreshFlagKey);

        if (!isRefreshing) {
          await redis.set(refreshFlagKey, '1', 'EX', 300); // 5 dk flag
          refreshCache(cacheKey, searchParams, page, limit)
            .finally(() => redis.del(refreshFlagKey));
        }
      }

      return NextResponse.json(JSON.parse(cached));
    }

    console.log("CACHE MISS ❌");
    const freshResponse = await fetchProducts(searchParams, page, limit);

    // Cache'e kaydet
    await redis.set(cacheKey, JSON.stringify(freshResponse), "EX", CACHE_TTL);

    return NextResponse.json(freshResponse);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DB’den ürünleri çekme
async function fetchProducts(searchParams: URLSearchParams, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  const brand = searchParams.get('brand');
  const store = searchParams.get('store');
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000');
  const sortBy = searchParams.get('sortBy') || 'newest';
  const search = searchParams.get('q') || '';
  const rating = parseFloat(searchParams.get('rating') || '0');

  const where: any = {};
  if (search.trim() !== '') {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category && category !== 'null') where.categoryId = category;
  if (subCategory && subCategory !== 'null') where.subCategoryId = subCategory;
  if (brand && brand !== 'null') where.brand = brand;
  if (store && store !== 'null') where.storeId = store;
  if (rating > 0) where.rating = { gte: rating };

  const products = await db.product.findMany({
    where,
    include: {
      store: { select: { id: true, name: true, logo: true, averageRating: true } },
      category: { select: { id: true, name: true, url: true } },
      subCategory: { select: { id: true, name: true, url: true } },
      variants: { include: { sizes: { orderBy: { price: 'asc' }, take: 1 }, images: { take: 1 } }, take: 1 },
      reviews: { select: { rating: true } },
      _count: { select: { reviews: true, wishlist: true } },
    },
    skip,
    take: limit,
    orderBy: getOrderBy(sortBy),
  });

  const total = await db.product.count({ where });

  const filteredProducts = products.filter(p => {
    const price = p.variants[0]?.sizes[0]?.price || 0;
    return price >= minPrice && price <= maxPrice;
  });

  const sortedProducts = sortProducts(filteredProducts, sortBy);

  const productsWithRating = sortedProducts.map(p => {
    const reviews = p.reviews || [];
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length ? totalRating / reviews.length : 0;
    return { ...p, rating: averageRating, numReviews: reviews.length };
  });

  return {
    success: true,
    products: productsWithRating,
    meta: { total, page, totalPages: Math.ceil(total / limit), limit },
  };
}

// Background refresh
async function refreshCache(cacheKey: string, searchParams: URLSearchParams, page: number, limit: number) {
  try {
    console.log("🔄 Background refresh çalışıyor");
    const freshResponse = await fetchProducts(searchParams, page, limit);
    await redis.set(cacheKey, JSON.stringify(freshResponse), "EX", CACHE_TTL);
    console.log("✅ Background refresh tamamlandı");
  } catch (err) {
    console.error("❌ Cache refresh hatası:", err);
  }
}

// Prisma sıralama
function getOrderBy(sortBy: string) {
  switch (sortBy) {
    case 'newest': return { createdAt: 'desc' };
    case 'oldest': return { createdAt: 'asc' };
    case 'popular': return { sales: 'desc' };
    case 'rating': return { rating: 'desc' };
    case 'sales': return { sales: 'desc' };
    default: return { createdAt: 'desc' };
  }
}

// Fiyat sıralama
function sortProducts(products: any[], sortBy: string) {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => (a.variants[0]?.sizes[0]?.price || 0) - (b.variants[0]?.sizes[0]?.price || 0));
    case 'price-high':
      return sorted.sort((a, b) => (b.variants[0]?.sizes[0]?.price || 0) - (a.variants[0]?.sizes[0]?.price || 0));
    default: return sorted;
  }
}