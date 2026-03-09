
import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  const {user} = await validateRequest();
  if (!user) {
    redirect("/login?returnUrl=/checkout");
  }
  return <div>{children}</div>;
}
