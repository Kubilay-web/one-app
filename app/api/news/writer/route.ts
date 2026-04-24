import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

export async function GET() {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Writer'ı bul
    const writer = await db.writer.findUnique({
      where: { userId: user.id }
    });

    if (!writer) {
      return NextResponse.json({ message: "Writer not found" }, { status: 404 });
    }

    // Writer'ın kendi haberlerini getir
    const news = await db.news.findMany({
      where: { writerId: writer.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Error fetching writer news:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}