import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import Sidebar from "../components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user?.roleshop !== "ADMIN") redirect("/");

  return (
    <div className="flex gap-3 h-full w-full">
      <Sidebar isAdmin />
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}
