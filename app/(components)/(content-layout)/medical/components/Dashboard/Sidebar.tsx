"use client";
import {
  AlarmClock,
  Bell,
  ExternalLink,
  Globe,
  Home,
  LineChart,
  Mail,
  Package,
  Package2,
  Power,
  Settings,
  ShoppingCart,
  User2,
  Users,
} from "lucide-react";

import Link from "next/link";
import React from "react";


import { Button } from "../../components/ui/button";
import LogoutButton from "./LogoutButton";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";

// import { signOut } from "next-auth/react";


import generateSlug from "../../utils/generateSlug";
import { useSession } from "@/app/SessionProvider";

export default function Sidebar() {

  const session=useSession();
  const user=session.user;
  const role = user?.rolemedical;


  const id = user.id;
  const slug = generateSlug(user.username ?? "");
  const pathname = usePathname();
  const roles = {
    USER: [
      { title: "Dashboard", path: "/medical/dashboard", icon: Home },
      {
        title: "My Appointments",
        path: "/medical/dashboard/user/appointments",
        icon: AlarmClock,
      },
      { title: "Doctors", path: "/medical/dashboard/user/doctors", icon: Users },
      { title: "Inbox", path: "/medical/dashboard/user/inbox", icon: Mail },
      {
        title: "Settings",
        path: "/medical/dashboard/user/settings",
        icon: Settings,
      },
    ],
    ADMIN: [
      { title: "Dashboard", path: "/medical/dashboard", icon: Home },
      { title: "Services", path: "/medical/dashboard/services", icon: Users },
      { title: "Specialties", path: "/medical/dashboard/specialties", icon: Users },
      { title: "Symptoms", path: "/medical/dashboard/symptoms", icon: Users },
      { title: "Doctors", path: "/medical/dashboard/doctors", icon: Users },
      { title: "Patients", path: "/medical/dashboard/patients", icon: Users },
      { title: "Appointments", path: "/medical/dashboard/appointments", icon: Users },
      {
        title: "Settings",
        path: "/medical/dashboard/settings",
        icon: Settings,
      },
    ],
    DOCTOR: [
      { title: "Dashboard", path: "/medical/dashboard", icon: Home },
      {
        title: "Appointments",
        path: "/medical/dashboard/doctor/appointments",
        icon: AlarmClock,
      },
      { title: "Patients", path: "/medical/dashboard/doctor/patients", icon: Users },
      { title: "Inbox", path: "/medical/dashboard/doctor/inbox", icon: Mail },
      {
        title: "Profile",
        path: `/medical/dashboard/doctor/profile/${id}`,
        icon: User2,
      },
      {
        title: "Live Preview",
        path: `/medical/doctors/${slug}?id=${id}`,
        icon: ExternalLink,
      },
      {
        title: "Settings",
        path: "/medical/dashboard/doctor/settings",
        icon: Settings,
      },
    ],
  };

  let sideBarLinks = roles[user?.rolemedical] || [];
  // const sideBarLinks = [
  //   {
  //     name: "Dashboard",
  //     path: "/dashboard",
  //     icon: Home,
  //   },

  //   {
  //     name: "Products",
  //     path: "/dashboard/products",
  //     icon: Package,
  //   },
  //   {
  //     name: "Orders",
  //     path: "/dashboard/orders",
  //     icon: ShoppingCart,
  //     badgeCount: 6,
  //   },
  //   {
  //     name: "Customers",
  //     path: "/dashboard/customers",
  //     icon: Users,
  //   },
  //   {
  //     name: "Analytics",
  //     path: "/dashboard/analytics",
  //     icon: LineChart,
  //   },
  //   {
  //     name: "Settings",
  //     path: "/dashboard/settings",
  //     icon: Settings,
  //   },
  //   {
  //     name: "Online",
  //     path: "/",
  //     icon: Globe,
  //   },
  // ];
  const router = useRouter();
  // async function handleLogout() {
  //   await signOut();
  //   router.push("/login");
  // }
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/medical" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sideBarLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.path ? " bg-muted text-primary  " : ""
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                  {/* {item.badgeCount && (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      {item.badgeCount}
                    </Badge>
                  )} */}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button size="sm" className="w-full">
            <Power className="w- h-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
