import ProductDetails from "@/app/projects/components/dashboard/forms/product-details";
import { getAllCategories } from "@/app/queries/category";
import { getAllOfferTags } from "@/app/queries/offer-tag";
import React from "react";
import db from "@/app/lib/db";

export default async function SellerNewProductsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();

  const countries = await db.country.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="w-full">
      <ProductDetails
        categories={categories}
        storeUrl={params.storeUrl}
        offerTags={offerTags}
        countries={countries}
      />
    </div>
  );
}
