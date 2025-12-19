import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { validateRequest } from '@/app/auth';

// GET: Tüm shipping adreslerini getir
export async function GET(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shippingAddresses = await db.shippingAddress.findMany({
      where: {
        userId: user.id,
      },
      include: {
        country: true,
      },
      orderBy: {
        default: 'desc',
      },
    });

    return NextResponse.json(shippingAddresses);
  } catch (error) {
    console.error('Fetch shipping addresses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping addresses' },
      { status: 500 }
    );
  }
}

// POST: Yeni shipping adresi ekle
export async function POST(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      phone,
      address1,
      address2,
      state,
      city,
      zip_code,
      countryId,
      default: isDefault,
    } = body;

    // Eğer default olarak işaretlenmişse, diğer adresleri default'tan çıkar
    if (isDefault) {
      await db.shippingAddress.updateMany({
        where: {
          userId: user.id,
          default: true,
        },
        data: {
          default: false,
        },
      });
    }

    const shippingAddress = await db.shippingAddress.create({
      data: {
        firstName,
        lastName,
        phone,
        address1,
        address2,
        state,
        city,
        zip_code,
        default: isDefault || false,
        userId: user.id,
        countryId,
      },
      include: {
        country: true,
      },
    });

    return NextResponse.json({
      success: true,
      shippingAddress,
    });
  } catch (error) {
    console.error('Create shipping address error:', error);
    return NextResponse.json(
      { error: 'Failed to create shipping address' },
      { status: 500 }
    );
  }
}

// PUT: Shipping adresini güncelle
export async function PUT(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('id');
    const body = await req.json();

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    const { default: isDefault, ...updateData } = body;

    // Eğer default olarak işaretlenmişse, diğer adresleri default'tan çıkar
    if (isDefault) {
      await db.shippingAddress.updateMany({
        where: {
          userId: user.id,
          default: true,
        },
        data: {
          default: false,
        },
      });
    }

    const shippingAddress = await db.shippingAddress.update({
      where: {
        id: addressId,
        userId: user.id,
      },
      data: {
        ...updateData,
        default: isDefault,
      },
      include: {
        country: true,
      },
    });

    return NextResponse.json({
      success: true,
      shippingAddress,
    });
  } catch (error) {
    console.error('Update shipping address error:', error);
    return NextResponse.json(
      { error: 'Failed to update shipping address' },
      { status: 500 }
    );
  }
}

// DELETE: Shipping adresini sil
export async function DELETE(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('id');

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    await db.shippingAddress.delete({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Shipping address deleted',
    });
  } catch (error) {
    console.error('Delete shipping address error:', error);
    return NextResponse.json(
      { error: 'Failed to delete shipping address' },
      { status: 500 }
    );
  }
}