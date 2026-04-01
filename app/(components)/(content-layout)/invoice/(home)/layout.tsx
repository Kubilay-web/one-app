import { validateRequest } from "@/app/auth";


import FloatingSocials from "../components/agency/FloatingSocials";
import Footer from "../components/frontend/footer";
import Navbar from "../components/dashboard/Navbar";

import React, { ReactNode } from "react";

export default async function AgencyLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <div>
      {/* <Navbar /> */}
      {children}
      <FloatingSocials />
      <Footer />
    </div>
  );
}
