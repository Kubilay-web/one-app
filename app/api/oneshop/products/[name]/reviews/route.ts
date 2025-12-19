import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { validateRequest } from '@/app/auth';

// GET: Ürün yorumlarını getir (sayfalı)
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort') || 'newest';

    const slug = params.slug;
    const skip = (page - 1) * limit;

    // ProductVariant'ı bul
    const productVariant = await db.productVariant.findUnique({
      where: { slug },
      select: { productId: true },
    });

    if (!productVariant) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Filtre oluştur
    const where: any = {
      productId: productVariant.productId,
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    // Sıralama
    let orderBy: any = {};
    switch (sort) {
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      case 'highest':
        orderBy.rating = 'desc';
        break;
      case 'lowest':
        orderBy.rating = 'asc';
        break;
      case 'mostHelpful':
        orderBy.likes = 'desc';
        break;
    }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST: Yeni yorum ekle
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slug = params.slug;
    const body = await req.json();
    const {
      rating,
      review,
      variant,
      color,
      size,
      quantity,
      images,
    } = body;

    // ProductVariant'ı bul
    const productVariant = await db.productVariant.findUnique({
      where: { slug },
      include: {
        product: true,
      },
    });

    if (!productVariant) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Kullanıcının bu ürün için daha önce yorum yapıp yapmadığını kontrol et
    const existingReview = await db.review.findUnique({
      where: {
        productId_userId_variant: {
          productId: productVariant.productId,
          userId: user.id,
          variant,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Yeni yorum oluştur
    const newReview = await db.review.create({
      data: {
        variant,
        variantImage: productVariant.variantImage,
        review,
        rating,
        color,
        size,
        quantity,
        userId: user.id,
        productId: productVariant.productId,
        images: {
          create: images?.map((url: string) => ({
            url,
            alt: `${productVariant.variantName} review image`,
          })),
        },
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
    });

    // Ürün rating'ini güncelle
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

    await db.product.update({
      where: { id: productVariant.productId },
      data: {
        rating: reviewStats._avg.rating || 0,
        numReviews: reviewStats._count._all || 0,
      },
    });

    return NextResponse.json({
      success: true,
      review: newReview,
    });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}