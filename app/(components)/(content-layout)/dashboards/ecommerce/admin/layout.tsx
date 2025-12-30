import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import Sidebar from "../components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  // Admin kontrolü örneği
  // if (user?.roleshop !== "ADMIN") redirect("/");

  return (
    <div className="flex flex-col gap-10 md:flex-row h-full w-full">
      {/* Sidebar */}

      <div className="w-full md:w-64 flex-shrink-0">
        <Sidebar isAdmin />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </div>
  );
}
