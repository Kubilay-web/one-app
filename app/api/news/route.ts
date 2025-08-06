import { NextResponse } from "next/server";
import db from "@/lib/db";
import { validateRequest } from "@/auth";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "ADMIN") {
      const newsList = await db.news.findMany({
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ news: newsList }, { status: 200 });
    }

    // Writer ise önce yazar ID'sini bul
    const writer = await db.writer.findUnique({
      where: { userId: user.id },
    });

    if (!writer) {
      return NextResponse.json(
        { message: "Writer not found" },
        { status: 404 },
      );
    }

    const newsList = await db.news.findMany({
      where: { writerId: writer.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ news: newsList }, { status: 200 });
  } catch (error) {
    console.error("Dashboard News Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
