import { validateRequest } from "@/app/auth";
import Header from "@/app/projects/components/dashboard/header/header";
import Sidebar from "@/app/projects/components/dashboard/sidebar/sidebar";
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
    redirect("/login");
    return;
  }

  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="flex h-full w-full">
      <Sidebar stores={stores} />
      <div className="ml-[300px] w-full">
        <Header />
        <div className="mt-[75px] w-full p-4">{children}</div>
      </div>
    </div>
  );
}
