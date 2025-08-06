import { NextResponse } from "next/server";
import db from "@/lib/db"; // Prisma Client burada tanımlı olmalı
import handleError from "@/lib/handlers/error";

type APIErrorResponse = ReturnType<typeof handleError>;

export async function GET() {
  try {
    const users = await db.user.findMany();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
