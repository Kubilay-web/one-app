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
    <div className="flex flex-col gap-10 md:flex-row h-full w-full">
      {/* Sidebar */}

      <div className="w-full md:w-64 flex-shrink-0">
        <Sidebar stores={stores} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </div>
  );
}
