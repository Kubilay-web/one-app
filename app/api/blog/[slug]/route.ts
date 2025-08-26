import db from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { slug: string } }) {
  try {
    const { slug } = context.params;

    // 🔑 slug ile sorgulama
    const blog = await db.blog.findUnique({
      where: { slug }, // id yerine slug kullan
    });

    if (!blog) {
      return NextResponse.json({ err: "Blog not found" }, { status: 404 });
    }

    const latest = await db.blog.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ blog, latest });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { err: err.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
