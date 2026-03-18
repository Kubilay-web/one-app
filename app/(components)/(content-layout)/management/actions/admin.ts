"use server";

import { ContactProps } from "../components/frontend/contact-us";
import { Contact } from "../types/types";
import { revalidatePath } from "next/cache";


export async function createContact(data: ContactProps) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/oneschool/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.error || "Failed to create contact");
    }

    revalidatePath("/dashboard/admin/contacts");

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function deleteContact(id: string) {
  // console.log("deleted", id);
  return {
    ok: true,
  };
}



export async function getAllContacts(): Promise<Contact[] | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/oneschool/contacts`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch contacts");
    }

    const contacts = await res.json();

    return contacts as Contact[];
  } catch (error) {
    console.log(error);
  }
}