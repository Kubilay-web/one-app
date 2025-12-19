import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

// GET: Ürün sorularını getir
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // ProductVariant'ı bul
    const productVariant = await db.productVariant.findUnique({
      where: { slug },
      select: { productId: true },
    });

    if (!productVariant) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Ürün sorularını getir
    const questions = await db.question.findMany({
      where: {
        productId: productVariant.productId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Fetch questions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}