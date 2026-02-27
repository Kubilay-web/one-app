// import React from "react";
// import { columns } from "./columns";
// import { CategoryProject } from "@prisma/client";
// import DataTable from "../../components/DataTableComponents/DataTable";
// import TableHeader from "../../components/dashboard/Tables/TableHeader";
// import { getAllCategories } from "../../actions/categories";

// export default async function page() {
//   const categories: CategoryProject[] = (await getAllCategories()) || [];
  
//   return (
//     <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
//       <div className="w-full mb-6 sm:mb-8">
//         <TableHeader
//           title="Categories"
//           linkTitle="Add Category"
//           href="/oneproject/dashboard/categories/new"
//           data={categories}
//           model="category"
//         />
//       </div>
//       <div className="py-6 sm:py-8 w-full">
//         <div className="w-full overflow-x-auto lg:overflow-x-hidden">
//           <div className="min-w-full lg:min-w-0">
//             <DataTable data={categories} columns={columns} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







import React from "react";
import { columns } from "./columns";
import { CategoryProject } from "@prisma/client";
import DataTable from "../../components/DataTableComponents/DataTable";
import TableHeader from "../../components/dashboard/Tables/TableHeader";
import { getAllCategories } from "../../actions/categories";

export default async function page() {
  const categories: CategoryProject[] = (await getAllCategories()) || [];

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-4 gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <TableHeader
          title="Categories"
          linkTitle="Add Category"
          href="/oneproject/dashboard/categories/new"
          data={categories}
          model="category"
        />
      </div>

      {/* Table Section */}
      <div className="flex w-full">
        <div className="w-full overflow-x-auto">
          <div className="w-full">
            <DataTable data={categories} columns={columns} />
          </div>
        </div>
      </div>

    </div>
  );
}