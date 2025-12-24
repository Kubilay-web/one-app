import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { productSlug: string } }
) {
  try {
    const { productSlug } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const product = await db.product.findUnique({
      where: { slug: productSlug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where: { productId: product.id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          images: {
            select: {
              url: true,
              alt: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      db.review.count({
        where: { productId: product.id },
      }),
    ]);

    // Ortalama rating hesapla
    const ratingStats = await db.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: { id: true },
    });

    // Rating dağılımını hesapla
    const ratingDistribution = await db.review.groupBy({
      by: ['rating'],
      where: { productId: product.id },
      _count: { rating: true },
    });

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        averageRating: ratingStats._avg.rating || 0,
        totalReviews: ratingStats._count.id,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Yorumlar getirme hatası:", error);
    return NextResponse.json(
      { error: "Yorumlar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productSlug: string } }
) {
  try {
    const { productSlug } = params;
    const body = await request.json();
    const { userId, rating, review, variant, images } = body;

    const product = await db.product.findUnique({
      where: { slug: productSlug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    // Kullanıcının bu varyant için daha önce yorum yapıp yapmadığını kontrol et
    const existingReview = await db.review.findFirst({
      where: {
        productId: product.id,
        userId,
        variant,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Bu varyant için zaten yorum yapmışsınız" },
        { status: 400 }
      );
    }

    const newReview = await db.review.create({
      data: {
        productId: product.id,
        userId,
        rating: parseFloat(rating),
        review,
        variant,
        color: body.color || '',
        size: body.size || '',
        quantity: body.quantity || '1',
        images: {
          create: images?.map((img: any) => ({
            url: img.url,
            alt: img.alt || '',
          })) || [],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        images: true,
      },
    });

    // Ürünün ortalama rating'ini güncelle
    const reviews = await db.review.findMany({
      where: { productId: product.id },
      select: { rating: true },
    });

    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    await db.product.update({
      where: { id: product.id },
      data: {
        rating: averageRating,
        numReviews: reviews.length,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Yorum oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Yorum oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}