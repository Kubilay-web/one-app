import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Prisma ile kategorilere göre gruplanmış haber sayısını alıyoruz
    const categories = await db.news.groupBy({
      by: ["category"], // Kategorilere göre grupla
      _count: {
        category: true, // Her kategorideki haber sayısını al
      },
    });

    // Gruplanan kategorilerin haber sayılarını hazırlıyoruz
    const result = categories.map((category) => ({
      category: category.category,
      count: category._count.category,
    }));

    // 200 yanıtı ile kategorileri döndürüyoruz
    return NextResponse.json({ categories: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
