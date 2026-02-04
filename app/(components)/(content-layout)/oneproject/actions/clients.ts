"use server";

import db from "@/app/lib/db";

export async function getUserClients(userId: string | undefined) {
  if (userId) {
    try {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          roleproject: "CLIENT",
          userId,
        },
      });

      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getUserRecentClients(userId: string | undefined) {
  if (userId) {
    try {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          roleproject: "CLIENT",
          userId,
        },
        take: 3,
      });

      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
