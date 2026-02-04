"use server";

import db from "@/app/lib/db";
import { CategoryProps } from "../types/types";
import { revalidatePath } from "next/cache";

export async function createCategory(data: CategoryProps) {
  const slug = data.slug;
  try {
    const existingCategory = await db.categoryProject.findUnique({
      where: {
        slug,
      },
    });
    if (existingCategory) {
      return existingCategory;
    }
    const newCategory = await db.categoryProject.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/oneproject/dashboard/categories");
    return newCategory;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getAllCategories() {
  try {
    const categories = await db.categoryProject.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return categories;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updateCategoryById(id: string, data: CategoryProps) {
  try {
    const updatedCategory = await db.categoryProject.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/oneproject/dashboard/categories");
    return updatedCategory;
  } catch (error) {
    console.log(error);
  }
}
export async function getCategoryById(id: string) {
  try {
    const category = await db.categoryProject.findUnique({
      where: {
        id,
      },
    });
    return category;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteCategory(id: string) {
  try {
    const deletedCategory = await db.categoryProject.delete({
      where: {
        id,
      },
    });
    revalidatePath("/oneproject/dashboard/categories");
    return {
      ok: true,
      data: deletedCategory,
    };
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkCategories(categories: CategoryProps[]) {
  try {
    for (const category of categories) {
      await createCategory(category);
    }
  } catch (error) {
    console.log(error);
  }
}
