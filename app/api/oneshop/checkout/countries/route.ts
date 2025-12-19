import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const countries = await db.country.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(countries);
  } catch (error) {
    console.error('Fetch countries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}