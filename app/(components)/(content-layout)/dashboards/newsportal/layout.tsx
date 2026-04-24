// "use client";

// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import { Toaster } from "react-hot-toast";
// import { UserInfo } from "@/app/queries/user";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // useRouter for client-side navigation
// import "./style.css"

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any>(null);
//   const router = useRouter(); // Router for navigation

//   useEffect(() => {
//     // Fetch user data when the component mounts
//     const fetchUser = async () => {
//       const userData = await UserInfo();
//       setUser(userData);
//     };

//     fetchUser();
//   }, []); // Empty dependency array ensures this runs once on mount

//   // useEffect(() => {
//   //   // Redirect based on user role, but only after user data is set
//   //   if (user?.role === "WRITER") {
//   //     router.push("/dashboards/newsportal/writer");
//   //   } else if (user?.role === "ADMIN") {
//   //     router.push("/dashboards/newsportal");
//   //   }
//   // }, [user, router]); // Re-run this when user changes

//   if (!user) {
//     return <div>Loading...</div>; // Show a loading state while user data is being fetched
//   }

//   return (
//     <div className="min-h-screen general-news flex bg-slate-400">
//       {/* <Sidebar user={user} /> */}
//       <div>
//         {/* <Header /> */}
//         <div className="p-4">
//           <div className="pt-[85px]">{children}</div>
//         </div>
//       </div>
//       <Toaster position="top-center" />
//     </div>
//   );
// }









"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import { UserInfo } from "@/app/queries/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

type User = {
  role?: string;
  [key: string]: any;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserInfo();
        setUser(userData);
      } catch (error) {
        console.error("User fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

 
  return (
    <div className="min-h-screen general-news flex bg-slate-400">
     
      {/* <Sidebar user={user} />  */}

      <div className="flex-1">
        {/* <Header /> */}

        <div className="p-4">
          <div className="pt-[85px]">{children}</div>
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}