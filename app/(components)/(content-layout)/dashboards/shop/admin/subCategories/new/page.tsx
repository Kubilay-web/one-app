import SubCategoryDetails from "@/app/projects/components/dashboard/forms/subCategory-details";
import { getAllCategories } from "@/app/queries/category";
import React from "react";

export default async function AdminNewSubCategoryPage() {
  const categories = await getAllCategories();

  return <SubCategoryDetails categories={categories} />;
}
