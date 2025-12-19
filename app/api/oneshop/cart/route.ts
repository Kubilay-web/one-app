import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { validateRequest } from '@/app/auth';

// GET: Sepeti getir
export async function GET(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await db.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        cartItems: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
        coupon: true,
      },
    });

    if (!cart) {
      // Eğer sepet yoksa oluştur
      const newCart = await db.cart.create({
        data: {
          userId: user.id,
          subTotal: 0,
          total: 0,
          shippingFees: 0,
        },
      });
      return NextResponse.json({ cart: newCart, items: [] });
    }

    return NextResponse.json({
      cart,
      items: cart.cartItems,
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST: Sepete ürün ekle
export async function POST(req: NextRequest) {
  try {
     const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      productId,
      variantId,
      sizeId,
      productSlug,
      variantSlug,
      sku,
      name,
      image,
      size,
      price,
      quantity = 1,
      storeId,
    } = body;

    // Store'u kontrol et
    const store = await db.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Kullanıcının sepetini bul veya oluştur
    let cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: { cartItems: true },
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

    // Aynı ürün var mı kontrol et
    const existingItem = cart.cartItems.find(
      (item) =>
        item.variantId === variantId &&
        item.sizeId === sizeId &&
        item.storeId === storeId
    );

    if (existingItem) {
      // Miktarı güncelle
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          totalPrice: (existingItem.quantity + quantity) * price,
        },
      });

      // Sepet toplamlarını güncelle
      await updateCartTotals(cart.id);
    } else {
      // Yeni ürün ekle
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          sizeId,
          productSlug,
          variantSlug,
          sku,
          name,
          image,
          size,
          price,
          quantity,
          shippingFee: await calculateShippingFee(storeId, quantity),
          totalPrice: price * quantity,
          storeId,
        },
      });

      // Sepet toplamlarını güncelle
      await updateCartTotals(cart.id);
    }

    // Güncellenmiş sepeti döndür
    const updatedCart = await db.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT: Sepet öğesini güncelle
export async function PUT(req: NextRequest) {
  try {
     const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const body = await req.json();
    const { quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Sepet öğesini bul
    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (quantity <= 0) {
      // Eğer miktar 0 veya daha az ise, öğeyi sil
      await db.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      // Miktarı güncelle
      await db.cartItem.update({
        where: { id: itemId },
        data: {
          quantity,
          totalPrice: cartItem.price * quantity,
        },
      });
    }

    // Sepet toplamlarını güncelle
    await updateCartTotals(cartItem.cartId);

    // Güncellenmiş sepeti döndür
    const updatedCart = await db.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        cartItems: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE: Sepet öğesini sil
export async function DELETE(req: NextRequest) {
  try {
     const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    // Sepet öğesini bul
    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Öğeyi sil
    await db.cartItem.delete({
      where: { id: itemId },
    });

    // Sepet toplamlarını güncelle
    await updateCartTotals(cartItem.cartId);

    // Güncellenmiş sepeti döndür
    const updatedCart = await db.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        cartItems: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item from cart' },
      { status: 500 }
    );
  }
}

// Yardımcı fonksiyonlar
async function updateCartTotals(cartId: string) {
  const cartItems = await db.cartItem.findMany({
    where: { cartId },
  });

  const subTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFees = cartItems.reduce(
    (sum, item) => sum + item.shippingFee,
    0
  );
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

async function calculateShippingFee(storeId: string, quantity: number) {
  const store = await db.store.findUnique({
    where: { id: storeId },
    include: {
      shippingRates: {
        where: {
          country: {
            name: 'Turkey', // Varsayılan ülke
          },
        },
      },
    },
  });

  if (!store?.shippingRates?.[0]) {
    return store?.defaultShippingFeeFixed || 0;
  }

  const rate = store.shippingRates[0];
  let shippingFee = 0;

  switch (store.defaultShippingService) {
    case 'ITEM':
      shippingFee =
        rate.shippingFeePerItem +
        Math.max(0, quantity - 1) * rate.shippingFeeForAdditionalItem;
      break;
    case 'WEIGHT':
      // Varsayılan ağırlık hesaplaması
      const weightPerItem = 0.5; // kg
      shippingFee = rate.shippingFeePerKg * weightPerItem * quantity;
      break;
    case 'FIXED':
      shippingFee = rate.shippingFeeFixed;
      break;
    default:
      shippingFee = store.defaultShippingFeeFixed || 0;
  }

  return shippingFee;
}