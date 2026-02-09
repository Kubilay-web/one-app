

import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {


  const {user}=await validateRequest();
  if (!user) {
    redirect(`/medical/login?returnUrl=/onboarding`);
  }
  return <div className="">{children}</div>;
}
