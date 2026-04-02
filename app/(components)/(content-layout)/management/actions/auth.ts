"use server";

import { School, User } from "../types/types";
// import { api, getSchoolById } from "./schools";
import { cookies } from "next/headers";
import db from "@/app/lib/db";

// export async function loginUser(data: { email: string; password: string }) {
//   try {
//     const response = await api.post("/login", data);
//     const { user, accessToken, refreshToken } = response.data.data;
//     const userData = response.data.data;
//     await createServerSession(userData);
//     const school = await getSchoolById(userData?.user.schoolId);
//     await saveServerSchool(school as School);
//     return response.data.data as SessionData;
//   } catch (error) {
//     console.log(error);
//   }
// }

// Session data schema
interface SessionData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Server action to create user session
export async function createServerSession(data: SessionData) {
  try {
    const cookieStore = await cookies();
    // Set cookies with appropriate expiration
    cookieStore.set("user", JSON.stringify(data.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, // 1 day
    });

    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, // 1 day
    });

    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { success: true };
  } catch (error) {
    console.error("Session creation error:", error);
    return { success: false, error: "Invalid session data" };
  }
}
export async function saveServerSchool(data: School) {
  try {
    const cookieStore = await cookies();
    // Set cookies with appropriate expiration
    cookieStore.set("school", JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return { success: true };
  } catch (error) {
    console.error("Session creation error:", error);
    return { success: false, error: "Invalid session data" };
  }
}

// Server action to logout and clear cookies
export async function logout() {
  try {
    const cookieStore = await cookies();
    // Delete all authentication-related cookies
    cookieStore.delete("user");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

// Helper function to get current user from cookies (server-side)
export async function getServerUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) return null;

  try {
    const user = JSON.parse(userCookie.value);
    return user as User;
  } catch {
    return null;
  }
}
export async function getServerSchool() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("school");

  if (!userCookie) return null;

  try {
    const school = JSON.parse(userCookie.value);
    return school as School;
  } catch {
    return null;
  }
}


// export async function SchoolUser(userId: string) {
//   const user = await db.user.findUnique({
//     where: { id: userId },
//     select: {
//       schoolId: true
//     }
//   });

//   if (!user?.schoolId) return null;

//   const school = await db.school.findUnique({
//     where: { id: user.schoolId }
//   });

//   return school;
// }






export async function SchoolUser(userId: string) {
  try {
    // Önce user'ı bul
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        roleschool: true,
        email: true,
        name: true,
      },
    });

    if (!user) return null;

    let schoolId = null;
    let schoolName = null;

    // Role göre school bilgisini bul
    switch (user.roleschool) {
      case "STUDENT":
        const student = await db.student.findUnique({
          where: { userId },
          select: { schoolId: true, schoolName: true },
        });
        schoolId = student?.schoolId;
        schoolName = student?.schoolName;
        break;

      case "TEACHER":
        const teacher = await db.teacher.findUnique({
          where: { userId },
          select: { schoolId: true, schoolName: true },
        });
        schoolId = teacher?.schoolId;
        schoolName = teacher?.schoolName;
        break;

      case "PARENT":
        const parent = await db.parent.findUnique({
          where: { userId },
          select: { schoolId: true, schoolName: true },
        });
        schoolId = parent?.schoolId;
        schoolName = parent?.schoolName;
        break;

      case "ADMIN":
      case "SUPER_ADMIN":
        // Admin'ler için farklı bir mantık
        const adminSchool = await db.school.findFirst({
          where: { siteEnabled: true },
        });
        schoolId = adminSchool?.id;
        schoolName = adminSchool?.name;
        break;
    }

    if (!schoolId) return null;

    const school = await db.school.findUnique({
      where: { id: schoolId },
    });

    return {
      school,
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.roleschool,
      },
    };
  } catch (error) {
    console.error("Error fetching school by user:", error);
    return null;
  }
}


