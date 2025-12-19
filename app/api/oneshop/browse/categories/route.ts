import { NextResponse } from 'next/server';
import  db  from '@/app/lib/db';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        subCategories: {
          include: {
            _count: {
              select: {
                product: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching categories' },
      { status: 500 }
    );
  }
}