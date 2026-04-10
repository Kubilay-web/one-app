// import { validateRequest } from "@/app/auth";
// import { redirect } from "next/navigation";
// import Sidebar from "../components/sidebar";

// export default async function Layout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user } = await validateRequest();

//   // Admin kontrolü örneği
//   // if (user?.roleshop !== "ADMIN") redirect("/");

//   return (
//     <div className="flex flex-col gap-10 md:flex-row h-full w-full">
//       {/* Sidebar */}

//       <div className="w-full md:w-64 flex-shrink-0">
//         <Sidebar isAdmin />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-4 overflow-auto">{children}</div>
//     </div>
//   );
// }







import { validateRequest } from "@/app/auth";
import Sidebar from "../components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  // // Show message if not admin
  // if (user?.roleshop !== "ADMIN") {
  //   return (
  //     <div className="flex items-center justify-center w-full h-screen">
  //       <h1 className="text-xl font-semibold text-red-500">
  //         Only roleshop admin can access this page
  //       </h1>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col gap-10 md:flex-row h-full w-full">
      <div className="w-full md:w-64 flex-shrink-0">
        <Sidebar isAdmin />
      </div>

      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </div>
  );
}