import { validateRequest } from "@/app/auth";
import Sidebar from "../../../components/sidebar";
import db from "@/app/lib/db";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SellerStoreDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/shop");
    return;
  }

  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="flex gap-3 h-full w-full">
      <Sidebar stores={stores} />
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}
