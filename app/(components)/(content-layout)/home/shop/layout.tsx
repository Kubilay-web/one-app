import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";

import SessionProvider from "./SessionProvider";
import Header from "@/app/projects/components/store/layout/header/header";
import CategoriesHeader from "@/app/projects/components/store/layout/categories-header/categories-header";
import Footer from "@/app/projects/components/store/layout/footer/footer";
import { Toaster } from "react-hot-toast";


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/");

  return (
    <SessionProvider value={session}>
      <div>
        <div>{children}</div>
        <Footer />
        <Toaster position="top-center" />
      </div>
    </SessionProvider>
  );
}
