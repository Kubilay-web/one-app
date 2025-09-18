import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import Header from "@/app/projects/components/dashboard/header/header";
import Sidebar from "@/app/projects/components/dashboard/sidebar/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user?.role !== "ADMIN") redirect("/");

  return (
    <div className="h-full w-full">
      <Sidebar isAdmin />
      <div className="ml-[300px]">
        <Header />
        <div className="mt-[75px] w-full p-4">{children}</div>
      </div>
    </div>
  );
}
