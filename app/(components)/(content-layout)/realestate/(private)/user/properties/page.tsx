import PageTitle from "../../../components/page-title";
import React, { Suspense } from "react";
import PropertiesTable from "./_components/properties-table";
import Filters from "../../../components/filters";
import Loader from "../../../components/loader";
import Link from "next/link";

async function Properties({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ✅ searchParams promise'ını çöz
  const resolvedSearchParams = await searchParams;
  
  // DEBUG
  console.log("Page - Resolved searchParams:", resolvedSearchParams);
  
  // URLSearchParams'tan düz objeye çevir
  const params: Record<string, string> = {};
  
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      params[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      // Sadece ilk değeri al (veya join et)
      params[key] = value[0];
    }
  });

  const key = JSON.stringify(params);
  console.log("Page - Processed params for key:", params);

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Properties" />
        <Link
          href="/realestate/user/properties/create-property"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Create Property
        </Link>
      </div>
      <Filters searchParams={params} />
      <Suspense fallback={<Loader />} key={key}>
        <PropertiesTable searchParams={params} />
      </Suspense>
    </div>
  );
}

export default Properties;