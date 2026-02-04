import { SiteHeader } from "../components/site-header";
import Footer from "../components/Frontend/Footer";
import SessionProvider from "@/app/SessionProvider";
import { ReactNode } from "react";
import { validateRequest } from "@/app/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await validateRequest(); // SERVER

  return (
    <SessionProvider value={{ user }}>
      <SiteHeader />
      {children}
      <Footer />
    </SessionProvider>
  );
}
