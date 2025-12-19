import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { validateRequest } from '@/app/auth';

// POST: Ürünü wishlist'e ekle
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
    const { sizeId } = body;

    // ProductVariant'ı bul
    const productVariant = await db.productVariant.findUnique({
      where: { slug },
      include: {
        product: true,
        sizes: true,
      },
    });

    if (!productVariant) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Size kontrol et
    let selectedSize = null;
    if (sizeId) {
      selectedSize = await db.size.findUnique({
        where: { id: sizeId },
      });
    }

    // Wishlist'te var mı kontrol et
    const existingWishlist = await db.wishlist.findFirst({
      where: {
        userId: user.id,
        productId: productVariant.productId,
        variantId: productVariant.id,
        ...(selectedSize && { sizeId: selectedSize.id }),
      },
    });

    if (existingWishlist) {
      // Eğer varsa, kaldır
      await db.wishlist.delete({
        where: { id: existingWishlist.id },
      });

      return NextResponse.json({
        success: true,
        action: 'removed',
        message: 'Removed from wishlist',
      });
    }

    // Wishlist'e ekle
    await db.wishlist.create({
      data: {
        userId: user.id,
        productId: productVariant.productId,
        variantId: productVariant.id,
        sizeId: selectedSize?.id || null,
      },
    });

    return NextResponse.json({
      success: true,
      action: 'added',
      message: 'Added to wishlist',
    });
  } catch (error) {
    console.error('Wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}

// GET: Kullanıcının bu ürünü wishlist'te olup olmadığını kontrol et
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slug = params.slug;

    // ProductVariant'ı bul
    const productVariant = await db.productVariant.findUnique({
      where: { slug },
    });

    if (!productVariant) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Wishlist'te var mı kontrol et
    const wishlistItem = await db.wishlist.findFirst({
      where: {
        userId: user.id,
        productId: productVariant.productId,
        variantId: productVariant.id,
      },
    });

    return NextResponse.json({
      inWishlist: !!wishlistItem,
      wishlistItem,
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to check wishlist' },
      { status: 500 }
    );
  }
}