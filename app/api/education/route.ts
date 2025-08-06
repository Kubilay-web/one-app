import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const educationIds = await db.educationid.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(educationIds);
  } catch (error: any) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
