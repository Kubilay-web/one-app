import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await validateRequest();
  if (!user) {
    redirect(`/medical`);
  }
  return (
    <div className="">
      {children}
      <Toaster position="top center" />
    </div>
  );
}
