import { validateRequest } from "@/app/auth";
import NavBar from "../components/Dashboard/NavBar";
import Sidebar from "../components/Dashboard/Sidebar";



import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default async function Layout({ children }: { children: ReactNode }) {

  const {user}=await validateRequest();
  
  if (!user) {
    redirect("/");
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar session={user} />
      <div className="flex flex-col">
        <NavBar session={user} />
        <div className="flex min-h-screen w-full flex-col">{children}</div>
      </div>
        <Toaster position="top center"/>
    </div>
  );
}
