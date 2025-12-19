import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { validateRequest } from '@/app/auth';

// POST: Ürünü sepete ekle
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Önce params'ı resolve et
    const { slug } = await params;
    
    const { user } = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sizeId, quantity = 1 } = body;

    if (!sizeId) {
      return NextResponse.json({ error: 'Size is required' }, { status: 400 });
    }

    // ProductVariant ve Size'ı bul
    const productVariant = await db.productVariant.findFirst({
      where: {
        slug: {
          equals: slug,
          mode: "insensitive",
        },
      },
      include: {
        product: {
          include: {
            store: true,
          },
        },
        sizes: true,
      },
    });

    if (!productVariant) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const size = productVariant.sizes.find(s => s.id === sizeId);
    if (!size) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }

    // Stok kontrolü
    if (size.quantity < quantity) {
      return NextResponse.json(
        { error: 'Not enough stock available' },
        { status: 400 }
      );
    }

    // Kullanıcının sepetini bul veya oluştur
    let cart = await db.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId: user.id,
          subTotal: 0,
          total: 0,
          shippingFees: 0,
        },
      });
    }

    // Aynı ürün sepette var mı kontrol et
    const existingCartItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId: productVariant.id,
        sizeId: size.id,
      },
    });

    if (existingCartItem) {
      // Miktarı güncelle
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (size.quantity < newQuantity) {
        return NextResponse.json(
          { error: 'Not enough stock available' },
          { status: 400 }
        );
      }

      const updatedCartItem = await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          totalPrice: size.price * newQuantity,
        },
      });

      await updateCartTotals(cart.id);

      return NextResponse.json({
        success: true,
        action: 'updated',
        cartItem: updatedCartItem,
      });
    }

    // Yeni sepet öğesi oluştur
    const cartItem = await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productVariant.productId,
        variantId: productVariant.id,
        sizeId: size.id,
        productSlug: productVariant.product.slug,
        variantSlug: productVariant.slug,
        sku: productVariant.sku,
        name: productVariant.variantName,
        image: productVariant.variantImage,
        size: size.size,
        price: size.price,
        quantity,
        shippingFee: 0,
        totalPrice: size.price * quantity,
        storeId: productVariant.product.storeId,
      },
    });

    await updateCartTotals(cart.id);

    return NextResponse.json({
      success: true,
      action: 'added',
      cartItem,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// GET: Sepetteki ürünleri getir
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Önce params'ı resolve et
    const { slug } = await params;
    
    const { user } = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Belirli bir ürün için cart item kontrolü
    const productVariant = await db.productVariant.findFirst({
      where: {
        slug: {
          equals: slug,
          mode: "insensitive",
        },
      },
    });

    if (!productVariant) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          where: {
            variantId: productVariant.id,
          },
        },
      },
    });

    return NextResponse.json({
      inCart: cart?.cartItems || [],
    });
  } catch (error) {
    console.error('Get cart item error:', error);
    return NextResponse.json(
      { error: 'Failed to get cart item' },
      { status: 500 }
    );
  }
}

// DELETE: Sepetten ürünü çıkar
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Önce params'ı resolve et
    const { slug } = await params;
    
    const { user } = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const sizeId = searchParams.get('sizeId');

    if (!sizeId) {
      return NextResponse.json({ error: 'Size ID is required' }, { status: 400 });
    }

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Ürünü sepette bul
    const productVariant = await db.productVariant.findFirst({
      where: {
        slug: {
          equals: slug,
          mode: "insensitive",
        },
      },
    });

    if (!productVariant) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId: productVariant.id,
        sizeId: sizeId,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Item not in cart' }, { status: 404 });
    }

    // Cart item'ı sil
    await db.cartItem.delete({
      where: { id: cartItem.id },
    });

    // Sepet toplamlarını güncelle
    await updateCartTotals(cart.id);

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}

async function updateCartTotals(cartId: string) {
  const cartItems = await db.cartItem.findMany({
    where: { cartId },
  });

  const subTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFees = 0;
  const total = subTotal + shippingFees;

  await db.cart.update({
    where: { id: cartId },
    data: {
      subTotal,
      shippingFees,
      total,
    },
  });
}