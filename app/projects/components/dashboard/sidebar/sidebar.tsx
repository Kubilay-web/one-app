import { FC } from "react";
import { validateRequest } from "@/auth";
import Logo from "@/components/logo/logo";
import UserInfo from "./user-info";
import SidebarNavAdmin from "./nav-admin";
import {
  adminDashboardSidebarOptions,
  SellerDashboardSidebarOptions,
} from "@/constants/data";
import { Store } from "@prisma/client";
import SidebarNavSeller from "./nav-seller";
import StoreSwitcher from "./store-switcher";

interface SidebarProps {
  isAdmin?: boolean;
  stores?: Store[];
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin, stores }) => {
  // Fetch user information from validateRequest
  const { user } = await validateRequest();

  return (
    <div className="fixed bottom-0 left-0 top-0 flex h-screen w-[300px] flex-col border-r p-4">
      <Logo width="100%" height="180px" />
      <span className="mt-3"></span>
      {user && <UserInfo user={user} />}
      {!isAdmin && stores && <StoreSwitcher stores={stores} />}
      {isAdmin ? (
        <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller menuLinks={SellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default Sidebar;
