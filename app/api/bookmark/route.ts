import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const bookmarks = await db.jobbookmark.findMany({
      include: {
        candidate: true,
        job: true,
      },
    });

    return NextResponse.json(bookmarks);
  } catch (err: any) {
    console.error("Error fetching bookmarks:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
