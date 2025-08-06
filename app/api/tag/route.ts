import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tags);
  } catch (error: any) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
