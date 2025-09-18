import SubCategoryDetails from "@/app/projects/components/dashboard/forms/subCategory-details";
import DataTable from "@/app/projects/components/ui/data-table";
import { getAllCategories } from "@/app/queries/category";
import { getAllSubCategories } from "@/app/queries/subCategory";
import { Plus } from "lucide-react";
import React from "react";
import { columns } from "./columns";

export default async function AdminSubCategoriesPage() {
  const subCategories = await getAllSubCategories();

  if (!subCategories) return null;

  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create SubCategory
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      newTabLink="/dashboard/admin/subCategories/new"
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subCategory name..."
      columns={columns}
    />
  );
}
