"use server";

import db from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/app/auth";

// Types based on schema
export type BrandProfile = {
  id: string;
  userId: string;
  name: string;
  logo?: string | null;
  slogan?: string | null;
  phone?: string | null;
  address?: string | null;
  currency?: string | null;
  email?: string | null;
  brandColor?: string | null;
  template: "PROFESSIONAL" | "MODERN" | "CLASSIC" | "MINIMAL";
  paymentInfo?: string | null;
  contactInfo?: string | null;
  thankYouMsg?: string | null;
  taxRate?: number | null;
  salesTax?: number | null;
  otherCharges?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateBrandData = {
  name?: string;
  logo?: string | null;
  slogan?: string | null;
  phone?: string | null;
  address?: string | null;
  currency?: string | null;
  email?: string | null;
  brandColor?: string | null;
  template?: "PROFESSIONAL" | "MODERN" | "CLASSIC" | "MINIMAL";
  paymentInfo?: string | null;
  contactInfo?: string | null;
  thankYouMsg?: string | null;
  taxRate?: number | null;
  salesTax?: number | null;
  otherCharges?: number | null;
};

export type CreateBrandData = Omit<UpdateBrandData, ""> & {
  name: string;
};

// Helper function to get authenticated user
async function getAuthenticatedUser() {


  
  const { user } = await validateRequest();

  if (!user?.email) {
    throw new Error("Unauthorized");
  }

  const userData = await db.user.findUnique({
    where: { email: user.email },
    include: {
      subscription: true,
      brand: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return userData;
}

/**
 * Get brand details for the current authenticated user
 */
export async function getCurrentUserBrand() {
  try {
    const user = await getAuthenticatedUser();

    const brand = await db.brand.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!brand) {
      return { data: null };
    }

    // Convert dates to ISO strings for serialization
    const formattedBrand = {
      ...brand,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
    };

    return { data: formattedBrand };
  } catch (error) {
    console.error("Error fetching brand:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    return { error: "Failed to fetch brand details" };
  }
}

/**
 * Get brand details by user ID (admin use only)
 */
export async function getBrandByUserId(userId: string) {
  try {
    if (!userId) {
      return { error: "User ID is required" };
    }

    // Check if current user is admin (you can implement admin check here)
    const user = await getAuthenticatedUser();
    const isAdmin = user.role === "ADMIN"; // Assuming you have role field

    if (!isAdmin) {
      return { error: "Unauthorized: Admin access required" };
    }

    const brand = await db.brand.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!brand) {
      return { data: null };
    }

    const formattedBrand = {
      ...brand,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
    };

    return { data: formattedBrand };
  } catch (error) {
    console.error("Error fetching brand:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    return { error: "Failed to fetch brand details" };
  }
}

/**
 * Create brand for the current authenticated user
 */
export async function createBrand(data: CreateBrandData) {
  try {
    const user = await getAuthenticatedUser();

    // Check if user already has a brand
    const existingBrand = await db.brand.findUnique({
      where: { userId: user.id },
    });

    if (existingBrand) {
      return { error: "Brand already exists for this user" };
    }

    // Validate required fields
    if (!data.name || data.name.trim().length < 2) {
      return { error: "Brand name must be at least 2 characters" };
    }

    // Validate email format if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { error: "Invalid email format" };
    }

    // Validate tax rate if provided (should be between 0 and 100)
    if (data.taxRate !== undefined && data.taxRate !== null && 
        (data.taxRate < 0 || data.taxRate > 100)) {
      return { error: "Tax rate must be between 0 and 100" };
    }

    // Validate template
    const validTemplates = ["PROFESSIONAL", "MODERN", "CLASSIC", "MINIMAL"];
    if (data.template && !validTemplates.includes(data.template)) {
      return { error: "Invalid template selection" };
    }

    // Clean up data - remove undefined values and convert empty strings to null
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) {
        // Skip undefined values
        return acc;
      } else if (value === "") {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const brand = await db.brand.create({
      data: {
        userId: user.id,
        ...cleanedData,
        template: data.template || "PROFESSIONAL",
        currency: data.currency || "$",
        brandColor: data.brandColor || "#000000",
      },
    });

    const formattedBrand = {
      ...brand,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
    };

    // Revalidate paths that might display brand information
    revalidatePath("/dashboard/settings/brand");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/invoices");

    return { data: formattedBrand };
  } catch (error) {
    console.error("Error creating brand:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    return { error: "Failed to create brand" };
  }
}

/**
 * Update brand for the current authenticated user
 */
export async function updateCurrentUserBrand(data: UpdateBrandData) {
  try {
    const user = await getAuthenticatedUser();

    // Check if brand exists
    const existingBrand = await db.brand.findUnique({
      where: { userId: user.id },
    });

    if (!existingBrand) {
      // If brand doesn't exist, create it
      if (!data.name) {
        return { error: "Brand name is required to create a brand" };
      }
      return createBrand(data as CreateBrandData);
    }

    // Validate data if provided
    if (data.name !== undefined && data.name.trim().length < 2) {
      return { error: "Brand name must be at least 2 characters" };
    }

    // Validate email format if provided
    if (data.email !== undefined && data.email !== null && 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { error: "Invalid email format" };
    }

    // Validate tax rate if provided
    if (data.taxRate !== undefined && data.taxRate !== null && 
        (data.taxRate < 0 || data.taxRate > 100)) {
      return { error: "Tax rate must be between 0 and 100" };
    }

    // Validate template if provided
    if (data.template) {
      const validTemplates = ["PROFESSIONAL", "MODERN", "CLASSIC", "MINIMAL"];
      if (!validTemplates.includes(data.template)) {
        return { error: "Invalid template selection" };
      }
    }

    // Clean up data - remove undefined values and convert empty strings to null
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) {
        // Skip undefined values
        return acc;
      } else if (value === "") {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const updatedBrand = await db.brand.update({
      where: {
        userId: user.id,
      },
      data: cleanedData,
    });

    const formattedBrand = {
      ...updatedBrand,
      createdAt: updatedBrand.createdAt.toISOString(),
      updatedAt: updatedBrand.updatedAt.toISOString(),
    };

    // Revalidate paths that might display brand information
    revalidatePath("/dashboard/settings/brand");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/invoices");

    return { data: formattedBrand };
  } catch (error) {
    console.error("Error updating brand:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    return { error: "Failed to update brand" };
  }
}

/**
 * Update brand by brand ID (legacy support)
 */
export async function updateBrand(brandId: string, data: UpdateBrandData) {
  try {
    if (!brandId) {
      return { error: "Brand ID is required" };
    }

    const user = await getAuthenticatedUser();

    // Verify that the brand belongs to the user
    const brand = await db.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return { error: "Brand not found" };
    }

    if (brand.userId !== user.id) {
      return { error: "Unauthorized: This brand does not belong to you" };
    }

    // Validate data
    if (data.name !== undefined && data.name.trim().length < 2) {
      return { error: "Brand name must be at least 2 characters" };
    }

    if (data.email !== undefined && data.email !== null && 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { error: "Invalid email format" };
    }

    if (data.taxRate !== undefined && data.taxRate !== null && 
        (data.taxRate < 0 || data.taxRate > 100)) {
      return { error: "Tax rate must be between 0 and 100" };
    }

    if (data.template) {
      const validTemplates = ["PROFESSIONAL", "MODERN", "CLASSIC", "MINIMAL"];
      if (!validTemplates.includes(data.template)) {
        return { error: "Invalid template selection" };
      }
    }

    // Clean up data
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      } else if (value === "") {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const updatedBrand = await db.brand.update({
      where: {
        id: brandId,
      },
      data: cleanedData,
    });

    const formattedBrand = {
      ...updatedBrand,
      createdAt: updatedBrand.createdAt.toISOString(),
      updatedAt: updatedBrand.updatedAt.toISOString(),
    };

    revalidatePath("/dashboard/settings/brand");
    revalidatePath("/dashboard");

    return { data: formattedBrand };
  } catch (error) {
    console.error("Error updating brand:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    return { error: "Failed to update brand" };
  }
}

/**
 * Delete brand for the current authenticated user
 */
export async function deleteCurrentUserBrand() {
  try {
    const user = await getAuthenticatedUser();

    // Check if brand exists
    const existingBrand = await db.brand.findUnique({
      where: { userId: user.id },
    });

    if (!existingBrand) {
      return { error: "Brand not found" };
    }

    await db.brand.delete({
      where: {
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/settings/brand");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    return { error: "Failed to delete brand" };
  }
}

/**
 * Get brand template options
 */
export async function getBrandTemplates() {
  return {
    data: [
      { value: "PROFESSIONAL", label: "Professional", description: "Clean and professional design suitable for most businesses" },
      { value: "MODERN", label: "Modern", description: "Contemporary design with bold elements" },
      { value: "CLASSIC", label: "Classic", description: "Traditional invoice layout" },
      { value: "MINIMAL", label: "Minimal", description: "Simple and minimalistic design" },
    ],
  };
}

/**
 * Check if user has branding permissions based on subscription
 */
export async function checkBrandingPermissions() {
  try {
    const user = await getAuthenticatedUser();

    // Get plan limits
    const planLimit = await db.planLimit.findUnique({
      where: { plan: user.subscription?.plan || "FREE" },
    });

    const canCustomizeBranding = planLimit?.customBranding || false;
    const canRemoveBranding = planLimit?.canRemoveBranding || false;

    return {
      data: {
        canCustomizeBranding,
        canRemoveBranding,
        plan: user.subscription?.plan || "FREE",
      },
    };
  } catch (error) {
    console.error("Error checking branding permissions:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    return { error: "Failed to check branding permissions" };
  }
}