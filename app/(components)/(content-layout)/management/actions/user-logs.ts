"use server";

import { UserLogCreateProps } from "../types/types";
import { UserLog } from "../components/dashboard/UserLogs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// --- ortak fetch helper ---
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

// --- Create User Log ---
export async function createUserLog(data: UserLogCreateProps) {
  try {
    const result = await fetcher(`${BASE_URL}/api/schoolmanage/userlogs`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create log");
  }
}

// --- Get All Logs ---
export async function getAllLogs(schoolId: string) {
  try {
    const result = await fetcher<UserLog[]>(`${BASE_URL}/api/schoolmanage/userlogs`);
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}