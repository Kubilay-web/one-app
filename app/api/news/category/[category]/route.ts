// app/api/news/category/[category]/route.ts

import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } },
) {
  const { category } = params; // URL'den kategori parametresini alıyoruz

  try {
    // Belirli kategori ve aktif statüdeki haberleri getiriyoruz
    const news = await db.news.findMany({
      where: {
        category: category, // Belirtilen kategori
        status: "active", // Sadece 'active' olanlar
      },
      orderBy: {
        createdAt: "desc", // En yeni haberler önce
      },
    });

    // Haberleri döndürüyoruz
    return NextResponse.json({ news }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
