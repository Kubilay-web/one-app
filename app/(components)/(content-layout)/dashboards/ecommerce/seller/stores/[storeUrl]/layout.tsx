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
    <div className="flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-6 h-full w-full">
      {/* Sidebar - Mobilde tam genişlik, Desktop'ta sabit genişlik */}
      <div className="w-full lg:w-64 xl:w-72 2xl:w-80 flex-shrink-0">
        <Sidebar stores={stores} />
      </div>

      {/* Ana içerik - Kalan tüm alanı kaplar */}
      <div className="flex-1 min-w-0">
        {" "}
        {/* min-w-0: flex overflow sorununu çözer */}
        <div className="h-full">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
