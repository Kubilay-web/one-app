import React from "react";
import { getAllStoreProducts } from "@/app/queries/product";
import DataTable from "@/app/projects/components/ui/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import ProductDetails from "@/app/projects/components/dashboard/forms/product-details";
import { getAllCategories } from "@/app/queries/category";

export default async function SellerProductsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const products = await getAllStoreProducts(params.storeUrl);

  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create product
        </>
      }
      modalChildren={
        <ProductDetails categories={categories} storeUrl={params.storeUrl} />
      }
      newTabLink={`/dashboard/seller/stores/${params.storeUrl}/products/new`}
      filterValue="name"
      data={products}
      columns={columns}
      searchPlaceholder="Search product name..."
    />
  );
}
