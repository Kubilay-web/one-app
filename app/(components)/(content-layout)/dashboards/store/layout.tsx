import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import "./index.css";
import SessionProvider from "@/app/SessionProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/");

  return (
    <div className="bg-gray-50 min-h-screen admin-shop">
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          {children}
        </div>
      </div>
    </div>
  );
}
