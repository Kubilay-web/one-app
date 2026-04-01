

import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import { ColorTipBanner } from "../components/ColorTip";

import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { validateRequest } from "@/app/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const {user} = await validateRequest();



  // if (!user) {
  //   redirect("/login");
  // }

  return (
    // <div className="min-h-screen flex bg-slate-50/30">
    //   <ColorTipBanner />
    //   {/* Fixed Sidebar */}
    //   <aside className="z-40 h-screen hidden md:block">
    //     {/* <Sidebar role={user.role} session={user} /> */}
    //   </aside>

    //   {/* Main Content */}
    //   <main className="flex-1 md:ml-[20px] lg:ml-[50px] transition-all duration-300">
    //     {/* <Navbar session={user} /> */}
    //     <div className="p-4 lg:p-6 bg-white/50 backdrop-blur-sm min-h-[calc(100vh-60px)]">
    //       <div className="max-w-7xl mx-auto">{children}</div>
    //     </div>
    //   </main>
    // </div>


   <div className="bg-slate-50/30">
     {children}
    </div>
  );
}
