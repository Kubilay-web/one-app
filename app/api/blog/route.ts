import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const blogs = await db.blog.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(blogs);
  } catch (err: any) {
    return NextResponse.json(
      { err: err.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
