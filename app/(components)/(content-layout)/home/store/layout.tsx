import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import "./store.css";
import SessionProvider from "@/app/SessionProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ShopContextProvider from './context/ShopContext'


export const revalidate = 300;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/");

  return (
    <SessionProvider value={session}>
      <ShopContextProvider>
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] shop-container">
          <Navbar />
          <div>{children}</div>
          <Toaster position="top-center" />
        </div>
      </ShopContextProvider>
    </SessionProvider>
  );
}
