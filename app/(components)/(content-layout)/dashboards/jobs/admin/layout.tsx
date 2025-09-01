import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/app/projects/components/jobportal/nav/adminnav/AdminNav";
import TopNav from "@/app/projects/components/jobportal/home/TopNav";
import { Toaster } from "react-hot-toast";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

//   if (user?.rolejob !== "ADMIN") redirect("/");

  return (
    <div>
      <TopNav />
      <AdminNav />
      {children}
      <Toaster position="top-right" />
    </div>
  );
}
