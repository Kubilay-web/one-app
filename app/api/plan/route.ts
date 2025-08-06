import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  try {
    const plans = await db.plan.findMany({
      where: {
        frontendshow: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(plans);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
