"use server";

import { revalidatePath } from "next/cache";
import { SchoolProps } from "../components/dashboard/forms/school/school-admin-form";
import { School } from "../types/types";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// ==================== CREATE SCHOOL ====================
export async function createSchool(data: SchoolProps) {
  try {
    const res = await fetch(`${BASE_API_URL}/api/schoolmanage/schools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to create school");
    }

    revalidatePath("/dashboard/admin/schools");

    return result.data as School;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create school");
  }
}

// ==================== GET SCHOOL BY ID ====================
export async function getSchoolById(id?: string) {
  if (!id) return null;

  try {
    const res = await fetch(`${BASE_API_URL}/api/schoolmanage/schools?id=${id}`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to fetch school");
    }

    return result as School;
  } catch (error) {
    console.log("getSchoolById error:", error);
    return null;
  }
}

// ==================== GET SCHOOL NAMES ====================
export interface BriefSchool {
  id: string;
  name: string;
}

export async function getSchoolNames() {
  try {
    const res = await fetch(`${BASE_API_URL}/api/schoolmanage/schools?type=titles`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to fetch school names");
    }

    return result as BriefSchool[];
  } catch (error) {
    console.log("getSchoolNames error:", error);
    return [];
  }
}

// ==================== GET ALL SCHOOLS ====================
export async function getAllSchoolsAction() {
  try {
    const res = await fetch(`${BASE_API_URL}/api/schoolmanage/schools`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to fetch schools");
    }

    return result as School[];
  } catch (error) {
    console.log("getAllSchoolsAction error:", error);
    return [];
  }
}

// ==================== DELETE SCHOOL ====================
export async function deleteSchoolById(id?: string) {
  if (!id) return null;

  try {
    const res = await fetch(`${BASE_API_URL}/api/schoolmanage/schools?id=${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to delete school");
    }

    return result.data as School;
  } catch (error) {
    console.log("deleteSchoolById error:", error);
    return null;
  }
}