"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import { UserInfo } from "@/app/queries/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // useRouter for client-side navigation

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUser = async () => {
      const userData = await UserInfo();
      setUser(userData);
    };

    fetchUser();
  }, []); // Empty dependency array ensures this runs once on mount

  // useEffect(() => {
  //   // Redirect based on user role, but only after user data is set
  //   if (user?.role === "WRITER") {
  //     router.push("/dashboard/newsportal/writer");
  //   } else if (user?.role === "ADMIN") {
  //     router.push("/dashboard/newsportal");
  //   }
  // }, [user, router]); // Re-run this when user changes

  if (!user) {
    return <div>Loading...</div>; // Show a loading state while user data is being fetched
  }

  return (
    <div className="min-w-screen min-h-screen bg-slate-400">
      <Sidebar user={user} />
      <div className="ml-[250px] min-h-[100vh] w-[calc(100vw-268px)]">
        <Header />
        <div className="p-4">
          <div className="pt-[85px]">{children}</div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
