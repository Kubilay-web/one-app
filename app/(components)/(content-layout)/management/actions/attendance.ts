"use server";

import { revalidatePath } from "next/cache";
import { AttendanceData } from "../(back)/dashboard/attendance/components/StudentListingByStream";
import { AttendanceData as Attendance } from "../types/attendance";
import { StudentAttendanceData } from "../types/studentAttendance";



export async function createAttendance(data: AttendanceData) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.message || "Failed to create Attendance");
    }

    revalidatePath("/dashboard/attendance");

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAttendanceList(streamId: string, date: Date) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/attendance/${streamId}?date=${date.toISOString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch attendance");
    }

    const data = await res.json();
    return data as Attendance;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getStudentAttendanceList(
  studentId: string,
  date: Date
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/schoolproject/attendance/student/${studentId}?date=${date.toISOString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch student attendance");
    }

    const data = await res.json();
    return data as StudentAttendanceData;
  } catch (error) {
    console.log(error);
    return null;
  }
}