import { NextResponse } from "next/server";
import db from "@/lib/db";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { updateUserSchema } from "@/lib/validation";

// GET /api/user/[id]
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) throw new NotFoundError("User");

  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) throw new NotFoundError("User");

  try {
    const user = await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    // Prisma, silinmek istenen kayıt yoksa hata fırlatır
    if (error.code === "P2025") {
      return handleError(new NotFoundError("User"), "api");
    }
    return handleError(error, "api");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) throw new NotFoundError("User");

  try {
    const body = await request.json();

    // Zod ile doğrulama (partial: sadece gelen alanları doğrular)
    const validateData = updateUserSchema.partial().parse(body);

    const updateUser = await db.user.update({
      where: { id },
      data: validateData,
    });

    return NextResponse.json(
      { success: true, data: updateUser },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return handleError(new NotFoundError("User"), "api");
    }
    return handleError(error, "api");
  }
}
