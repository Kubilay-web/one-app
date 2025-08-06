// app/api/news/latest/route.ts

import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 'active' statüde olan, en son 5 haberi alıyoruz, createdAt'a göre sıralıyoruz
    const latestNews = await db.news.findMany({
      where: {
        status: "active", // Sadece 'active' statüsündeki haberler
      },
      orderBy: {
        createdAt: "desc", // En son oluşturulandan önceki haberler
      },
      take: 5, // İlk 5 haberi alıyoruz
    });

    // Sonuçları döndürüyoruz
    return NextResponse.json({ latestNews }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
