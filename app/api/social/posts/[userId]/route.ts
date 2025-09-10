import db from "@/app/lib/db"; // Prisma client'ını import et

// GET isteği işleme fonksiyonu
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params; // URL parametresinden userId al

  try {
    // Kullanıcının tüm PostSocial verilerini al
    const posts = await db.postSocial.findMany({
      where: { userId: userId }, // userId'ye göre filtrele
      select: {
        images: true, // Sadece images alanını al
      },
    });

    // Eğer kullanıcıya ait post yoksa
    if (posts.length === 0) {
      return new Response(
        JSON.stringify({ message: "Kullanıcıya ait post bulunamadı" }),
        {
          status: 404,
        }
      );
    }

    // Kullanıcıya ait tüm postların images'ını döndür
    const allImages = posts.flatMap((post) => post.images); // Tüm postlardan image URL'lerini al

    return new Response(JSON.stringify(allImages), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
