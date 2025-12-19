// app/api/oneshop/products/[name]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

// GET: Ürün detaylarını getir (name'e göre)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    console.log('🔍 [PRODUCT API] GET request received');
    
    // params'ı bekleyin
    const { name } = await params;
    console.log('📦 Requested product name:', name);

    // Önce Product'ı name'e göre bul (case insensitive)
    const product = await db.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            averageRating: true,
            url: true,
          },
        },
        category: true,
        subCategory: true,
        offerTag: true,
        variants: {
          include: {
            sizes: {
              orderBy: {
                price: 'asc',
              },
            },
            images: true,
            colors: true,
            specs: true,
          },
        },
      },
    });

    console.log('✅ Product query result:', product ? `Found (${product.name})` : 'Not found');

    if (!product || product.variants.length === 0) {
      console.log(`❌ Product not found with name: ${name}`);
      
      // Alternatif olarak variant name'ini kontrol et
      const variantByName = await db.productVariant.findFirst({
        where: {
          variantName: {
            equals: name,
            mode: 'insensitive'
          }
        },
        include: {
          product: {
            include: {
              store: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  averageRating: true,
                  url: true,
                },
              },
              category: true,
              subCategory: true,
              offerTag: true,
            },
          },
          sizes: {
            orderBy: {
              price: 'asc',
            },
          },
          images: true,
          colors: true,
          specs: true,
        },
      });

      if (!variantByName) {
        return NextResponse.json({ 
          success: false,
          error: 'Product not found',
          message: `No product found with name: ${name}`,
          suggestion: 'Check if product exists in the database'
        }, { status: 404 });
      }

      // Variant'ı bulduk
      const productVariant = variantByName;
      
      // İlgili verileri getir
      const [variants, allSizes, reviews, similarProducts, reviewStats, ratingDistribution] = await Promise.all([
        // Diğer variantlar
        db.productVariant.findMany({
          where: {
            productId: productVariant.productId,
            id: {
              not: productVariant.id,
            },
          },
          include: {
            sizes: {
              orderBy: {
                price: 'asc',
              },
            },
            images: {
              take: 1,
            },
            colors: true,
          },
          take: 10,
        }),
        
        // Tüm bedenler
        db.size.findMany({
          where: {
            productVariant: {
              productId: productVariant.productId,
            },
          },
          include: {
            productVariant: {
              include: {
                colors: true,
              },
            },
          },
          orderBy: {
            size: 'asc',
          },
        }),
        
        // Yorumlar
        db.review.findMany({
          where: {
            productId: productVariant.productId,
          },
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            images: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        }),
        
        // Benzer ürünler
        db.productVariant.findMany({
          where: {
            product: {
              OR: [
                { categoryId: productVariant.product.categoryId },
                { subCategoryId: productVariant.product.subCategoryId },
              ],
              id: {
                not: productVariant.productId,
              },
            },
          },
          include: {
            product: {
              include: {
                store: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            sizes: {
              orderBy: {
                price: 'asc',
              },
              take: 1,
            },
            images: {
              take: 1,
            },
          },
          take: 8,
        }),
        
        // İstatistikler
        db.review.aggregate({
          where: {
            productId: productVariant.productId,
          },
          _avg: {
            rating: true,
          },
          _count: {
            _all: true,
          },
        }),
        
        // Rating dağılımı
        db.review.groupBy({
          by: ['rating'],
          where: {
            productId: productVariant.productId,
          },
          _count: {
            _all: true,
          },
        })
      ]);

      // Görüntülenme sayısını artır
      await db.product.update({
        where: { id: productVariant.productId },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({
        success: true,
        product: productVariant,
        baseProduct: productVariant.product,
        variants,
        allSizes,
        reviews,
        similarProducts,
        stats: {
          averageRating: reviewStats._avg.rating || productVariant.product.rating || 0,
          totalReviews: reviewStats._count._all || productVariant.product.numReviews || 0,
          ratingDistribution,
        },
      });
    }

    // İlk variantı kullan
    const firstVariant = product.variants[0];
    
    console.log(`✅ Using first variant: ${firstVariant.variantName}`);

    // İlgili verileri getir
    const [variants, allSizes, reviews, similarProducts, reviewStats, ratingDistribution] = await Promise.all([
      // Diğer variantlar
      db.productVariant.findMany({
        where: {
          productId: product.id,
          id: {
            not: firstVariant.id,
          },
        },
        include: {
          sizes: {
            orderBy: {
              price: 'asc',
            },
          },
          images: {
            take: 1,
          },
          colors: true,
        },
        take: 10,
      }),
      
      // Tüm bedenler
      db.size.findMany({
        where: {
          productVariant: {
            productId: product.id,
          },
        },
        include: {
          productVariant: {
            include: {
              colors: true,
            },
          },
        },
        orderBy: {
          size: 'asc',
        },
      }),
      
      // Yorumlar
      db.review.findMany({
        where: {
          productId: product.id,
        },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      }),
      
      // Benzer ürünler
      db.productVariant.findMany({
        where: {
          product: {
            OR: [
              { categoryId: product.categoryId },
              { subCategoryId: product.subCategoryId },
            ],
            id: {
              not: product.id,
            },
          },
        },
        include: {
          product: {
            include: {
              store: {
                select: {
                  name: true,
                },
              },
            },
          },
          sizes: {
            orderBy: {
              price: 'asc',
            },
            take: 1,
          },
          images: {
            take: 1,
          },
        },
        take: 8,
      }),
      
      // İstatistikler
      db.review.aggregate({
        where: {
          productId: product.id,
        },
        _avg: {
          rating: true,
        },
        _count: {
          _all: true,
        },
      }),
      
      // Rating dağılımı
      db.review.groupBy({
        by: ['rating'],
        where: {
          productId: product.id,
        },
        _count: {
          _all: true,
        },
      })
    ]);

    // Görüntülenme sayısını artır
    await db.product.update({
      where: { id: product.id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    console.log('✅ All data fetched successfully');

    return NextResponse.json({
      success: true,
      product: firstVariant,
      baseProduct: product,
      variants,
      allSizes,
      reviews,
      similarProducts,
      stats: {
        averageRating: reviewStats._avg.rating || product.rating || 0,
        totalReviews: reviewStats._count._all || product.numReviews || 0,
        ratingDistribution,
      },
    });
  } catch (error: any) {
    console.error('❌ Product details error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch product details',
        details: error.message 
      },
      { status: 500 }
    );
  }
}