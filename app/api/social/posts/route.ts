import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

export async function POST(req) {
  try {
    const { user } = await validateRequest(); // kullanıcıyı doğrula
    const userId = user?.id; 

    const body = await req.json();
    const { type, text, images, background } = body; // userId body’den çıkarıldı

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const post = await db.postSocial.create({
      data: {
        type: type || null,
        text: text || "",
        images: images || [],
        background: background || "",
        user: { connect: { id: userId } },
      },
    });

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



//GET ALL POSTS



export async function GET(req) {
  try {
    const posts = await db.postSocial.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true, // kullanıcı bilgisi dahil
        comments: true,
      },
    });

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

