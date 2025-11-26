import { NextResponse } from "next/server";
import db from "@/app/lib/db"
import { validateRequest } from "@/app/auth";

export async function POST(req: Request) {
  // Kullanıcı doğrulama
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId gerekli" }, { status: 400 });

  // Eğer kendi videoma abone olmak istemiyorsan aç
  if (userId === user.id) {
    return NextResponse.json({ error: "Kendi kendine abone olunamaz" }, { status: 400 });
  }

  // Mevcut aboneliği kontrol et
  const existing = await db.subscription.findFirst({
    where: { viewerId: user.id, creatorId: userId },
  });

  if (existing) {
    // Abonelik varsa sil
    await db.subscription.delete({ where: { id: existing.id } });
  } else {
    // Abonelik yoksa oluştur
    await db.subscription.create({
      data: {
        viewerId: user.id,
        creatorId: userId,
      },
    });
  }

  return NextResponse.json({ isSubscribed: !existing });
}

// DELETE: Abonelik silme
export async function DELETE(req: Request) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId gerekli" }, { status: 400 });

  // Kendi aboneliğini silmek mantıklı değil
  if (userId === user.id) return NextResponse.json({ error: "Kendi aboneliğini silemezsin" }, { status: 400 });

  const deleted = await db.subscription.deleteMany({
    where: { viewerId: user.id, creatorId: userId },
  });

  return NextResponse.json({ deleted });
}
