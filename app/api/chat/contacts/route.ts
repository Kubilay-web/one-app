// app/api/users/route.ts

import prisma from "@/app/lib/prisma"; // Prisma Client'ı içe aktar

// Kullanıcıları baş harfe göre gruplamak için yardımcı fonksiyon
function groupUsersByFirstLetter(users: any[]) {
  const groupedUsers: { [key: string]: any[] } = {};

  users.forEach((user) => {
    const firstLetter = user.username[0].toUpperCase(); // Username'in ilk harfini alıyoruz
    if (!groupedUsers[firstLetter]) {
      groupedUsers[firstLetter] = [];
    }
    groupedUsers[firstLetter].push(user);
  });

  return groupedUsers;
}

// GET isteği için named export
export async function GET(req: Request) {
  try {
    // Tüm kullanıcıları çekiyoruz, sadece belirli alanları seçiyoruz
    const users = await prisma.user.findMany({
      select: {
        id: true,            // Kullanıcı id'si
        username: true,      // Kullanıcı adı
        bio:true,
        displayName: true,   // Görünen ad
        email: true,         // Email
        avatarUrl: true,     // Avatar URL'si
        reputation: true,    // İtibar
      },
    });

    // Kullanıcıları baş harfe göre grupla
    const groupedUsers = groupUsersByFirstLetter(users);

    // Başarılı yanıt
    return new Response(JSON.stringify(groupedUsers), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    // Hata durumunda
    return new Response(JSON.stringify({ error: "Bir hata oluştu." }), {
      status: 500,
    });
  }
}
