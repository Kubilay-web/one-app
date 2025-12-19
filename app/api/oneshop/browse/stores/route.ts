import { NextResponse } from 'next/server';
import  db  from '@/app/lib/db';

export async function GET() {
  try {
    const stores = await db.store.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        logo: true,
        description: true,
        averageRating: true,
        _count: {
          select: {
            products: true,
            followers: true,
          },
        },
      },
      orderBy: {
        averageRating: 'desc',
      },
      take: 20,
    });
    
    return NextResponse.json({
      success: true,
      stores,
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching stores' },
      { status: 500 }
    );
  }
}