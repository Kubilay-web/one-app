import React from "react";
import { validateRequest } from "@/app/auth";
import { notFound, redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await validateRequest();

  if (user?.roleshop === "USER") {
    redirect("/");
  }

  if (user?.roleshop === "ADMIN") {
    redirect("/dashboards/ecommerce/admin");
  }

  if (user?.roleshop === "SELLER") {
    redirect("/dashboards/ecommerce/seller");
  }

  return <div></div>;
}
