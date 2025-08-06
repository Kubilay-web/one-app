import { NextResponse } from "next/server";
import db from "@/lib/db";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) throw new ValidationError({ email: ["Email is required"] });

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
}
