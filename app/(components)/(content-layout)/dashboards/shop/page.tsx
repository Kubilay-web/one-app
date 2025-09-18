import React from "react";
import { validateRequest } from "@/app/auth";
import { notFound, redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await validateRequest();
  console.log("user", user);

  if (user?.role === "USER") {
    redirect("/");
  }

  if (user?.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (user?.role === "SELLER") {
    redirect("/dashboard/seller");
  }

  return <div>DashboardPage</div>;
}
