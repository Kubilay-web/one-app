import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import CandidateNav from "@/app/projects/components/jobportal/nav/candidatenav/CandidateNav";
import TopNav from "@/app/projects/components/jobportal/nav/TopNav";
import { Toaster } from "react-hot-toast";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

//   if (user?.rolejob !== "CANDIDATE") redirect("/");

  return (
    <div>
      <TopNav />
      <CandidateNav />
      <Toaster position="top-center" />
      {children}
    </div>
  );
}
