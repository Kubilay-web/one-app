"use server";

import {
  MarkSheetStudent,
  UpdateMarkSheetProps,
} from "../types/types";
import { revalidatePath } from "next/cache";
import { StudentWithMarks } from "../components/dashboard/exams/StudentMarkSheet";

export type SubjectMarkSheetDTO = {
  examId: string;
  classId: string;
  subjectId: string;
  termId: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ortak fetch helper
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    // gerekiyorsa:
    // credentials: "include",
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function updateMarkSheetWithMarks(
  data: UpdateMarkSheetProps
) {
  try {
    const result = await fetcher<MarkSheetStudent[]>(
      `${BASE_URL}/api/schoolmanage/marksheets`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    revalidatePath("/dashboard/academics/exams");

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update marks");
  }
}

export async function getSubjectMarkSheet(data: SubjectMarkSheetDTO) {
  try {
    const result = await fetcher<{ data: StudentWithMarks[] }>(
      `${BASE_URL}/api/schoolmanage/marksheets`
    );

    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}