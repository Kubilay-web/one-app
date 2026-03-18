"use server";

import { revalidatePath } from "next/cache";
import {
  AssignClassTeacherProps,
  Class,
  ClassBrief,
  ClassCreateProps,
  Stream,
  StreamCreateProps,
} from "../types/types";



export async function createClass(data: ClassCreateProps) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.message || "Failed to create Class");
    }

    revalidatePath("/dashboard/academics/classes");
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createStream(data: StreamCreateProps) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/streams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.message || "Failed to create stream");
    }

    revalidatePath("/dashboard/academics/classes");
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteContact(id: string) {
  return { ok: true };
}

export async function getAllClasses(schoolId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/classes/school/${schoolId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch classes");
    }

    const classes = await res.json();
    return classes as Class[];
  } catch (error) {
    console.log(error);
  }
}

export async function getBriefClasses(schoolId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/classes/brief/${schoolId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch classes");
    }

    const classes = await res.json();
    return classes as ClassBrief[];
  } catch (error) {
    console.log(error);
  }
}

export async function getAllStreams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/streams`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch streams");
    }

    const streams = await res.json();
    return streams as Stream[];
  } catch (error) {
    console.log(error);
  }
}

export async function assignClassTeacher(data: AssignClassTeacherProps) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/classes/teacher/${data.classId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.message || "Failed to assign class teacher");
    }

    revalidatePath("/dashboard/academics/classes");

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}