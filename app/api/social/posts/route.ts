import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { NextResponse } from "next/server";

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




export async function GET(req: NextRequest) {
  try {
    // 1. Giriş yapan kullanıcıyı al
    const { user } = await validateRequest();
    const userId = user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Accepted arkadaşlık ilişkilerini al
    const friends = await db.friendRequest.findMany({
      where: {
        OR: [
          { userId: userId, status: "accepted" },
          { friendId: userId, status: "accepted" },
        ],
      },
    });

    const friendIds = friends.map((f) =>
      f.userId === userId ? f.friendId : f.userId
    );

    const allowedUserIds = [userId, ...friendIds];

    // 3. Kullanıcı ve arkadaşlarının postlarını al
    const posts = await db.postSocial.findMany({
      where: {
        userId: {
          in: allowedUserIds,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        comments: {
          include: {
            commentBy: true,
          },
        },
        React: true,
        SavedPost: true,
      },
    });

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("GET /api/social/posts error:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}




//  export async function GET(req) {
//    try {
//      const posts = await db.postSocial.findMany({
//        orderBy: { createdAt: "desc" },
//        include: {
//          user: true, // postu paylaşan kullanıcı bilgisi
//          comments: {
//            include: {
//              commentBy: true, // commentById üzerinden tüm user bilgilerini getir
//            },
//          },
//        },
//      })
//      return new Response(JSON.stringify(posts), {
//        status: 200,
//        headers: { "Content-Type": "application/json" },
//      });
//    } catch (error) {
//      console.error(error);
//      return new Response(JSON.stringify({ message: error.message }), {
//        status: 500,
//        headers: { "Content-Type": "application/json" },
//      });
//    }
//  }




// export async function GET(req: Request) {
//   try {
//     // 1. Kullanıcı oturumunu al
//     const { user } = await validateRequest();
//     if (!user) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const userId = user.id;

//     // 2. Kullanıcının takip ettiklerini getir
//     const followingRelations = await db.followSocial.findMany({
//       where: {
//         followerId: userId,
//       },
//       select: {
//         followingId: true,
//       },
//     });

//     const followingIds = followingRelations.map((rel) => rel.followingId);

//     // 3. Takip edilen kullanıcıların ve kullanıcının kendi postlarını al
//     const allPosts = await db.postSocial.findMany({
//       where: {
//         userId: {
//           in: [...followingIds, userId], // hem takip ettikleri hem kendisi
//         },
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             username: true,
//             avatarUrl: true,
//             cover: true,
//           },
//         },
//         comments: {
//           include: {
//             commentBy: {
//               select: {
//                 id: true,
//                 username: true,
//                 avatarUrl: true,
//               },
//             },
//           },
//         },
//         React: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: 20,
//     });

//     return NextResponse.json(allPosts, {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("[GET_POSTS_ERROR]", error);
//     return NextResponse.json({ message: "Server error", error: error.message }, {
//       status: 500,
//     });
//   }
// }