import { ReactNode } from "react";
import Header from "@/app/projects/components/store/layout/header/header";
import ProfileSidebar from "@/app/projects/components/store/layout/profile-sidebar/sidebar";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="mx-auto flex max-w-container flex-col gap-4 p-2 lg:flex-row">
        <ProfileSidebar />
        <div className="w-full flex-1 lg:mt-12">{children}</div>
      </div>
    </div>
  );
}
