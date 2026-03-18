// "use server";

// import { ContactProps } from "../components/frontend/contact-us";
// import { api } from "./schools";
// import axios from "axios";
// import { Contact, Parent } from "../types/types";
// import { ParentProps } from "../components/dashboard/forms/users/parent-form";
// import { revalidatePath } from "next/cache";
// import { BriefStudent } from "../components/portal/parents/StudentList";



// export async function createParent(data: ParentProps) {

//     const url = process.env.NEXT_PUBLIC_BASE_URL;
//   try {
//     const response = await api.post(`${url}/api/schoolmanage/parents`, data);
//     revalidatePath("/dashboard/users/parents");
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       // Type-safe error handling
//       const message =
//         error.response?.data?.message || "Failed to create parent";
//       throw new Error(message);
//     }
//     throw error;
//   }
// }

// export async function deleteParent(id: string) {
//   // console.log("deleted", id);
//   return {
//     ok: true,
//   };
// }

// export async function getAllParents(schoolId: string) {

//     const url = process.env.NEXT_PUBLIC_BASE_URL;
//   try {
//     const response = await api.get(`${url}/api/schoolmanage/parents`);
//     const parents = response.data;
//     return parents as Parent[];
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function getStudentsByParentId(parentId: string) {

//     const url = process.env.NEXT_PUBLIC_BASE_URL;
//   try {
//     const response = await api.get(`${url}/api/schoolmanage/parents`);
//     const students = response.data;
//     return students as BriefStudent[];
//   } catch (error) {
//     console.log(error);
//   }
// }







"use server";

import { Parent } from "../types/types";
import { ParentProps } from "../components/dashboard/forms/users/parent-form";
import { revalidatePath } from "next/cache";
import { BriefStudent } from "../components/portal/parents/StudentList";

type ApiResponse<T> = {
  data: T;
  error: string | null;
};

export async function createParent(data: ParentProps) {
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(`${url}/api/schoolmanage/parents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create parent");
    }

    const result = await response.json();

    revalidatePath("/management/dashboard/users/parents");

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteParent(id: string) {
  return { ok: true };
}

export async function getAllParents(schoolId: string): Promise<Parent[]> {
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(`${url}/api/schoolmanage/parents`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch parents");
    }

    const json: ApiResponse<Parent[]> = await response.json();

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getStudentsByParentId(
  parentId: string
): Promise<BriefStudent[]> {
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(
      `${url}/api/schoolmanage/parents/${parentId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    const json: ApiResponse<BriefStudent[]> = await response.json();

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}




