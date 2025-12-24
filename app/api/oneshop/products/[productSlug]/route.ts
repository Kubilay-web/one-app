import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { productSlug: string } }
) {
  try {
    const { productSlug } = params;

    const product = await db.product.findUnique({
      where: {
        slug: productSlug,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            averageRating: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        specs: {
          select: {
            name: true,
            value: true,
          },
        },
        variants: {
          include: {
            sizes: true,
            colors: true,
            images: true,
            specs: {
              select: {
                name: true,
                value: true,
              },
            },
          },
        },
        reviews: {
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
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        freeShipping: {
          include: {
            eligableCountries: {
              include: {
                country: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    // Ürün görüntülenme sayısını arttır
    await db.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Ürün getirme hatası:", error);
    return NextResponse.json(
      { error: "Ürün getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}