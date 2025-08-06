"use client";  // Client-side rendering için 'use client' kullanıyoruz.

import { useEffect, useState } from "react";
import { FiltersQueryType } from "@/app/lib/types";
import { getAllCategories } from "@/app/queries/category";
import { getAllOfferTags } from "@/app/queries/offer-tag";
import CategoryFilter from "./filters/category/category-filter";
import OfferFilter from "./filters/offer/offer-filter";
import SizeFilter from "./filters/size/size-filter";
import FiltersHeader from "./filters/header";
import PriceFilter from "./filters/price/price";
import { getFilteredColors } from "@/app/queries/color";
import ColorFilter from "./filters/color/color-filter";

export default function ProductFilters({
  queries,
  storeUrl,
}: {
  queries: FiltersQueryType;
  storeUrl?: string;
}) {
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    // Verileri async olmayan bir şekilde almak için useEffect
    const fetchFilters = async () => {
      try {
        const fetchedCategories = await getAllCategories(storeUrl);
        const fetchedOffers = await getAllOfferTags(storeUrl);
        const fetchedColors = await getFilteredColors(storeUrl);

        setCategories(fetchedCategories);
        setOffers(fetchedOffers);
        setColors(fetchedColors);
      } catch (error) {
        console.error("Veri alırken hata oluştu:", error);
      }
    };

    fetchFilters();
  }, [storeUrl]);  // storeUrl değiştiğinde yeniden çalışacak

  return (
    <div className="scrollbar h-full w-48 flex-none basis-[196px] overflow-auto overflow-x-hidden pb-2.5 pr-6 transition-transform">
      <FiltersHeader queries={queries} />
      {/* Filters */}
      <div className="w-40 border-t md:w-44">
        <PriceFilter />
        <CategoryFilter categories={categories} />
        <ColorFilter queries={queries} storeUrl={storeUrl} colors={colors} />
        <OfferFilter offers={offers} />
        <SizeFilter queries={queries} storeUrl={storeUrl} />
      </div>
    </div>
  );
}
