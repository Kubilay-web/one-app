import ProductDetails from "@/app/projects/components/dashboard/forms/product-details";
import db from "@/app/lib/db";
import { getAllCategories } from "@/app/queries/category";
import { getAllOfferTags } from "@/app/queries/offer-tag";
import { getProductMainInfo } from "@/app/queries/product";
import React from "react";

export default async function SellerNewProductVariantPage({
  params,
}: {
  params: { storeUrl: string; productId: string };
}) {
  const categories = await getAllCategories(params.storeUrl);
  console.log("categpries--->",categories)
  const offerTags = await getAllOfferTags();
  const product = await getProductMainInfo(params.productId);
  if (!product) return null;

  const countries = await db.country.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={params.storeUrl}
        data={product}
        offerTags={offerTags}
        countries={countries}
      />
    </div>
  );
}
