import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

export async function GET() {
  const { user } = await validateRequest();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const userId = user.id;

  // Takip edilenleri al
  const following = await db.followSocial.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map(f => f.followingId);
  if (followingIds.length === 0) return Response.json([]);

  // Takip edilenlerin beğenileri
  const likes = await db.react.findMany({
    where: { reactById: { in: followingIds } },
    include: {
      reactBy: { select: { username: true, avatarUrl: true } }, // doğru alanlar
      postRef: { include: { user: { select: { username: true, avatarUrl: true } } } },
    },
  });

  // Takip edilenlerin yorumları
  const comments = await db.commentSocial.findMany({
    where: { commentById: { in: followingIds } },
    include: {
      commentBy: { select: { username: true, avatarUrl: true } }, // doğru alanlar
      post: { include: { user: { select: { username: true, avatarUrl: true } } } },
    },
  });

  // Tek bir listeye topla
  const activities = [
    ...likes.map(like => ({
      id: like.id,
      type: "like",
      actor: like.reactBy,
      targetUser: like.postRef.user,
      postId: like.postRef.id,
      message: `${like.reactBy.username}, ${like.postRef.user.username}'nin gönderisini beğendi.`,
      createdAt: like.createdAt,
    })),
    ...comments.map(comment => ({
      id: comment.id,
      type: "comment",
      actor: comment.commentBy,
      targetUser: comment.post.user,
      postId: comment.post.id,
      message: `${comment.commentBy.username}, ${comment.post.user.username}'nin gönderisine yorum yaptı.`,
      createdAt: comment.commentAt,
    })),
  ];

  // Zaman sırasına göre sırala
  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return Response.json(activities);
}
