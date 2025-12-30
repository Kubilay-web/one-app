// app/api/seller/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { validateRequest } from '@/app/auth';

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı oturumunu kontrol et
    const {user} = await validateRequest();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Request body'den form verilerini al
    const formData = await request.json();
    
    // 1. Önce kullanıcının roleshop alanını SELLER olarak güncelle
    const updatedUser = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        roleshop: 'SELLER'
      }
    });

    // 2. Store kaydını oluştur
    const store = await db.store.create({
      data: {
        name: formData.name,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        url: formData.url,
        logo: formData.logo,
        cover: formData.cover,
        defaultShippingService: formData.defaultShippingService || 'International Delivery',
        defaultShippingFeePerItem: formData.defaultShippingFeePerItem || 0,
        defaultShippingFeeForAdditionalItem: formData.defaultShippingFeeForAdditionalItem || 0,
        defaultShippingFeePerKg: formData.defaultShippingFeePerKg || 0,
        defaultShippingFeeFixed: formData.defaultShippingFeeFixed || 0,
        defaultDeliveryTimeMin: formData.defaultDeliveryTimeMin || 7,
        defaultDeliveryTimeMax: formData.defaultDeliveryTimeMax || 31,
        returnPolicy: formData.returnPolicy || 'Return in 30 days.',
        userId: user.id,
        status: 'PENDING' // Başlangıçta PENDING olarak ayarla
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Store application submitted successfully',
      user: {
        id: updatedUser.id,
        roleshop: updatedUser.roleshop
      },
      store: store
    });

  } catch (error) {
    console.error('Error applying for seller:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}