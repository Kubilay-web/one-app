"use server";

import {
  DepartmentBrief,
  EventData,
  GalleryCategory,
  GalleryImageDTO,
  News,
  RecentActivity,
  Section,
} from "../types/types";


import { GalleryCategoryCreateDTO } from "@/app/api/schoolmanage/types/types";
import { revalidatePath } from "next/cache";
import { NewsItem } from "../components/school/section-forms/news-section-form";
import { Event } from "../components/school/section-forms/events-section-form";
import { ContactData } from "../components/school/SchoolContactForm";
import { SchoolContactMessage } from "../(back)/dashboard/communication/website-messages/messages-table";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface Activity {
  activity: string;
  description: string;
  time: string;
  schoolId: string;
}

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

// --- site / sections ---
export async function createSchoolWebsite(schoolId: string, siteEnabled: boolean) {
  const sections = [/* ... tüm sections dizisi ... */];
  const data = { schoolId, siteEnabled, sections };

  try {
    const result = await fetcher(`${BASE_URL}/api/schoolmanage/site`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidatePath(`/sch/${schoolId}`);
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create school website");
  }
}

export async function createActivity(data: Activity) {
  try {
    const result = await fetcher(`${BASE_URL}/api/schoolmanage/site`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath(`/sch/${data.schoolId}`);
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create activity");
  }
}

export async function createGalleryCategory(data: GalleryCategoryCreateDTO) {
  try {
    const result = await fetcher(`${BASE_URL}/api/schoolmanage/site`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath(`/sch/${data.schoolId}`);
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create gallery category");
  }
}

export async function addNewsItem(data: NewsItem) {
  try {
    const result = await fetcher(`${BASE_URL}/api/schoolmanage/site`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath(`/sch/${data.schoolId}`);
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to add news item");
  }
}

export async function addEventItem(data: Event) {
  try {
    const result = await fetcher(`${BASE_URL}/api/schoolmanage/site`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath(`/sch/${data.schoolId}`);
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to add event item");
  }
}

export async function updateSection(id: string, data: any, schoolId?: string) {
  try {
    const result = await fetcher(`${BASE_URL}/api/schoolmanage/site`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return result.data as Section;
  } catch (error) {
    console.log(error);
  }
}

// --- GET işlemleri ---
export async function getSiteRecentActivities(schoolId: string) {
  try {
    const result = await fetcher<{ data: RecentActivity[] }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSiteGalleryCategories(schoolId: string) {
  try {
    const result = await fetcher<{ data: GalleryCategory[] }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSiteRecentNews(schoolId: string) {
  try {
    const result = await fetcher<{ data: News[] }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSiteRecentEvents(schoolId: string) {
  try {
    const result = await fetcher<{ data: EventData[] }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSectionByType(schoolId: string | null | undefined, type: string) {
  if (!schoolId) return null;
  try {
    const result = await fetcher<{ data: Section }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllSchoolSections(schoolId: string) {
  try {
    const result = await fetcher<{ data: Section[] }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

// --- Gallery Images ---
export async function createGalleryImage(data: GalleryImageCreateDTO) {
  try {
    const result = await fetcher<{ data: GalleryImageDTO }>(`${BASE_URL}/api/schoolmanage/site`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath(`/sch/${data.schoolId}`);
    return result.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create gallery image");
  }
}

export async function getSiteGalleryImages(schoolId: string) {
  try {
    const result = await fetcher<{ data: GalleryImageDTO[] }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSiteGalleryImage(id: string) {
  try {
    const result = await fetcher<{ data: GalleryImageDTO }>(`${BASE_URL}/api/schoolmanage/site`, {
      method: "DELETE",
    });
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSiteGalleryCategory(id: string) {
  try {
    const result = await fetcher<{ data: GalleryCategory }>(`${BASE_URL}/api/schoolmanage/site`, {
      method: "DELETE",
    });
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

// --- Contact / Inquiry ---
export async function createSchoolInquiry(data: ContactData) {
  try {
    const result = await fetcher<{ data: any }>(`${BASE_URL}/api/schoolmanage/site`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create school inquiry");
  }
}

export async function getSchoolNotifications(schoolId: string) {
  try {
    const result = await fetcher<{ data: RecentActivity[] }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSchoolWebsiteMessages(schoolId: string) {
  try {
    const result = await fetcher<{ data: SchoolContactMessage[] }>(`${BASE_URL}/api/schoolmanage/site`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}