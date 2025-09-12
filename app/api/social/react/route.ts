// app/api/social/react/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db"; // db client
import { validateRequest } from "@/app/auth";

export async function POST(req: NextRequest) {
  try {

    const {user} = await validateRequest();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { postId, react } = body;

    if (!postId || !react) {
      return NextResponse.json({ message: "Missing postId or react" }, { status: 400 });
    }

    // Kullanıcının zaten react yapıp yapmadığını kontrol et
    const existingReact = await db.react.findFirst({
      where: {
        postRefId: postId,
        reactById: user.id,
      },
    });

    if (!existingReact) {
      // Yoksa yeni react oluştur
      await db.react.create({
        data: {
          react,
          postRefId: postId,
          reactById: user.id,
        },
      });
    } else {
      // Aynı react ise sil, farklı ise güncelle
      if (existingReact.react === react) {
        await db.react.delete({ where: { id: existingReact.id } });
      } else {
        await db.react.update({
          where: { id: existingReact.id },
          data: { react },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const {user} =  await validateRequest() ;

    if (!postId) return NextResponse.json({ message: "Missing postId" }, { status: 400 });

    // Post için tüm reactları al
    const reactsArray = await db.react.findMany({
      where: { postRefId: postId },
    });

    const grouped = reactsArray.reduce((acc: any, r) => {
      acc[r.react] = acc[r.react] || [];
      acc[r.react].push(r);
      return acc;
    }, {});

    const reacts = ["like", "love", "haha", "sad", "wow", "angry"].map((type) => ({
      react: type,
      count: grouped[type]?.length || 0,
    }));

    const userReact = user
      ? await db.react.findFirst({
          where: { postRefId: postId, reactById: user.id },
        })
      : null;

    return NextResponse.json({
      reacts,
      check: userReact?.react || null,
      total: reactsArray.length,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
