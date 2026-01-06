import React from "react";
import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import db from "@/app/lib/db";

export default async function SellerDashboardPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
  }

  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  console.log("stores",stores)

  if (stores.length === 0) {
    redirect("/dashboards/ecommerce/seller/stores/new");
    return;
  }

  redirect(`/dashboards/ecommerce/seller/stores/${stores[0].url}`);

  return <div>SellerPage</div>;
}
