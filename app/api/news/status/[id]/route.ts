import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db"; // Prisma Client
import { ObjectId } from "mongodb";
import { validateRequest } from "@/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const news_id = params.id;

  if (!ObjectId.isValid(news_id)) {
    return NextResponse.json({ message: "Invalid news ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 },
      );
    }

    const { user } = await validateRequest();
    if (!user || user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You cannot access this API" },
        { status: 401 },
      );
    }

    // Haber güncelle
    const updated = await db.news.update({
      where: { id: news_id },
      data: { status },
    });

    return NextResponse.json(
      { message: "News status updated successfully", news: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
