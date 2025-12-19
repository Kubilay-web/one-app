import { NextRequest, NextResponse } from 'next/server';
import  db  from '@/app/lib/db';

// GET: Ürün detaylarını getir
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // params'ı bekleyin
    const { slug } = await params;

    
    // Önce ProductVariant'ı slug ile bul (case insensitive olarak)
    const productVariant = await db.productVariant.findFirst({
      where: {
        slug: {
          equals: slug,
          mode: 'insensitive' // Büyük/küçük harf duyarsız arama
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

    if (!productVariant) {
      console.log('Product variant not found for slug:', slug);
      
      // Alternatif olarak Product'ı slug ile arayalım
      const product = await db.product.findFirst({
        where: {
          slug: {
            equals: slug,
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
            take: 1,
          },
        },
      });

      if (!product || product.variants.length === 0) {
        return NextResponse.json({ 
          error: 'Product not found',
          message: `No product found with slug: ${slug}` 
        }, { status: 404 });
      }

      // İlk variantı kullan
      const firstVariant = product.variants[0];
      
      return NextResponse.json({
        product: {
          ...firstVariant,
          product: {
            ...product,
            variants: undefined // Circular reference önlemek için
          }
        },
        variants: [],
        allSizes: firstVariant.sizes,
        reviews: [],
        similarProducts: [],
        stats: {
          averageRating: product.rating || 0,
          totalReviews: product.numReviews || 0,
          ratingDistribution: [],
        },
      });
    }

    // Ürünün tüm variantlarını getir
    const variants = await db.productVariant.findMany({
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
    });

    // Ürünün diğer bedenlerini getir
    const allSizes = await db.size.findMany({
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
    });

    // Ürün yorumlarını getir
    const reviews = await db.review.findMany({
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
    });

    // Benzer ürünleri getir (aynı kategori)
    const similarProducts = await db.productVariant.findMany({
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
    });

    // Ürün görüntülenme sayısını artır
    await db.product.update({
      where: { id: productVariant.productId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // Toplam yorum sayısı ve ortalama rating
    const reviewStats = await db.review.aggregate({
      where: {
        productId: productVariant.productId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    // Rating dağılımı
    const ratingDistribution = await db.review.groupBy({
      by: ['rating'],
      where: {
        productId: productVariant.productId,
      },
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      product: productVariant,
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
  } catch (error: any) {
    console.error('Product details error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product details',
        details: error.message 
      },
      { status: 500 }
    );
  }
}