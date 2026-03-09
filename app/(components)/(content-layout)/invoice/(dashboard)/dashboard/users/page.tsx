// // Your courses page
// import { getAllUsers } from "../../../actions/users";
// import { Suspense } from "react";

// import { TableLoading } from "../../../components/ui/data-table";
// import UsersTableListing from "../../../components/dashboard/UsersTableListing";

// // Create an async component for data fetching
// async function StudentListingWithData() {
//   const users = (await getAllUsers()) || [];

//   return (
//     <UsersTableListing
//       title={`Users (${users.length})`}
//       subtitle="Manage Users"
//       users={users}
//     />
//   );
// }

// export default function Courses() {
//   return (
//     <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//       <Suspense fallback={<TableLoading />}>
//         <StudentListingWithData />
//       </Suspense>
//     </div>
//   );
// }



// app/admin/users/page.tsx
import { getAllUsers } from "../../../actions/users";
import { Suspense } from "react";
import { TableLoading } from "../../../components/ui/data-table";
import UsersTableListing from "../../../components/dashboard/UsersTableListing";

// Create an async component for data fetching
async function StudentListingWithData() {
  // getAllUsers artık pagination parametreleri bekliyor
  // Varsayılan değerlerle çağırıyoruz
  const result = await getAllUsers(1, 10);
  
  // result.users artık bir array, result.pagination da pagination bilgileri
  const users = result.users || [];

  return (
    <UsersTableListing
      title={`Users (${users.length})`}
      subtitle="Manage Users"
      users={users}
      pagination={result.pagination}
    />
  );
}

export default function UsersPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <StudentListingWithData />
      </Suspense>
    </div>
  );
}