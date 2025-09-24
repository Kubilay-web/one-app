"use client"; // Eğer bu bileşen client-side ise (örn: pathname kullanıyorsanız)

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { BiNews } from "react-icons/bi";
import { PiUsersFill } from "react-icons/pi";
import { FaHouseUser } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { Button } from "@/app/projects/components/ui/button";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/app/(components)/(authentication-layout)/authentication/actions";
import "./style.css"

const Sidebar = ({ user }) => {
  const pathname = usePathname();
  const queryClient = useQueryClient(); // Burada useQueryClient doğru şekilde kullanılıyor

  const role = user?.role;
  console.log("role--->", role);

  return (
    <div className="h-screen general-sidebar w-[250px] bg-[#dadaff]">
      <div className="flex h-[70px] items-center justify-center">
        <Link href="/">
          <Image
            className="h-[35px] w-[190px] object-contain"
            src="https://i.ibb.co.com/WcB36Jq/mainlogo.png"
            alt="Main Logo"
            width={190}
            height={35}
          />
        </Link>
      </div>
      <ul className="flex flex-col gap-y-1 px-3 font-medium">
        {role === "ADMIN" ? (
          <>
            <SidebarItem
              href="/dashboard/newsportal/admin"
              icon={<MdDashboard />}
              label="Dashboard"
              active={pathname === "/dashboard/newsportal/admin"}
            />
            <SidebarItem
              href="/dashboard/newsportal/addwriter"
              icon={<MdDashboard />}
              label="Add Writer"
              active={pathname === "/dashboard/newsportal/addwriter"}
            />
            <SidebarItem
              href="/dashboard/newsportal/writers"
              icon={<PiUsersFill />}
              label="Writers"
              active={pathname === "/dashboard/newsportal/writers"}
            />
          </>
        ) : (
          <>
            <SidebarItem
              href="/dashboard/newsportal/writer"
              icon={<MdDashboard />}
              label="Dashboard"
              active={pathname === "/dashboard/newsportal/writer"}
            />
            <SidebarItem
              href="/dashboard/newsportal/createnews"
              icon={<IoMdAdd />}
              label="Add News"
              active={pathname === "/dashboard/newsportal/createnews"}
            />
          </>
        )}

        <SidebarItem
          href="/dashboard/newsportal/news"
          icon={<BiNews />}
          label="News"
          active={pathname === "/dashboard/newsportal/news"}
        />

        <SidebarItem
          href="/dashboard/newsportal/profile"
          icon={<FaHouseUser />}
          label="Profile"
          active={pathname === "/dashboard/newsportal/profile"}
        />
        {/* 
        <SidebarItem>
          <Button
            onClick={() => {
              queryClient.clear();
              logout();
            }}
            className="base-medium w-fit !bg-transparent px-4 py-3"
          >
            <LogOut className="size-5 text-black dark:text-white" />
            <span className="text-dark300_light900">Logout</span>
          </Button>
        </SidebarItem> */}
      </ul>
    </div>
  );
};

const SidebarItem = ({ href, icon, label, active }: any) => {
  return (
    <li>
      <Link
        href={href}
        className={`px-3 ${
          active ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"
        } flex w-full items-center justify-start gap-x-2 rounded-lg py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20`}
      >
        <span className="text-[18px]">{icon}</span>
        <span className="text-[18px]">{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
