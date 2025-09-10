import db from "@/app/lib/db"; // Prisma client'ı doğru import et

// GET isteği işleme fonksiyonu
export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params; // URL parametresinden kullanıcı adı al

  try {
    // Kullanıcıyı `username` ile bul ve ilişkili `posts` ve `comments`'larını al
    const profile = await db.user.findUnique({
      where: { username: username },
      include: {
        postsocial: {
          // PostSocial'ı dahil et
          include: {
            comments: true, // PostSocial'lara ait CommentSocial'ları dahil et
            user: true,
          },
        },
      },
    });

    if (!profile) {
      return new Response(JSON.stringify({ message: "Kullanıcı bulunamadı" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
