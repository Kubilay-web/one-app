import { validateRequest } from "@/app/auth";
import { SiteHeader } from "../components/site-header";
import Footer from "../components/Frontend/Footer";

import React, { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
  }
  return (
    <div className="">
      <SiteHeader session={user} />
      {children}
      <Footer />
    </div>
  );
}
