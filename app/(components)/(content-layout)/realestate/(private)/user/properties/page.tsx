// import PageTitle from "../../../components/page-title";
// import React, { Suspense } from "react";
// import PropertiesTable from "./_components/properties-table";
// import Filters from "../../../components/filters";
// import Loader from "../../../components/loader";
// import Link from "next/link";

// async function Properties({ 
//   searchParams 
// }: { 
//   searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//   // ✅ searchParams promise'ını çöz
//   const resolvedSearchParams = await searchParams;
  
//   // DEBUG
//   console.log("Page - Resolved searchParams:", resolvedSearchParams);
  
//   // URLSearchParams'tan düz objeye çevir
//   const params: Record<string, string> = {};
  
//   Object.entries(resolvedSearchParams).forEach(([key, value]) => {
//     if (typeof value === 'string' && value.trim() !== '') {
//       params[key] = value;
//     } else if (Array.isArray(value) && value.length > 0) {
//       // Sadece ilk değeri al (veya join et)
//       params[key] = value[0];
//     }
//   });

//   const key = JSON.stringify(params);
//   console.log("Page - Processed params for key:", params);

//   return (
//     <div>
//       <div className="flex justify-between items-center">
//         <PageTitle title="Properties" />
//         <Link
//           href="/realestate/user/properties/create-property"
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//         >
//           Create Property
//         </Link>
//       </div>
//       <Filters searchParams={params} />
//       <Suspense fallback={<Loader />} key={key}>
//         <PropertiesTable searchParams={params} />
//       </Suspense>
//     </div>
//   );
// }

// export default Properties;











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
  const resolvedSearchParams = await searchParams;

  console.log("Page - Resolved searchParams:", resolvedSearchParams);

  const params: Record<string, string> = {};

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      params[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      params[key] = value[0];
    }
  });

  const key = JSON.stringify(params);
  console.log("Page - Processed params for key:", params);

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-4">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          
          <PageTitle title="Properties" />

          <Link
            href="/realestate/user/properties/create-property"
            className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Create Property
          </Link>
        </div>

        {/* FILTERS */}
        <div className="mb-4">
          <Filters searchParams={params} />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Suspense fallback={
            <div className="py-10 flex justify-center">
              <Loader />
            </div>
          } key={key}>
            <PropertiesTable searchParams={params} />
          </Suspense>
        </div>

      </div>
    </div>
  );
}

export default Properties;