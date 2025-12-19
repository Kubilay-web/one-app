"use client";

import React from "react";
import Ecommercefooter from "@/shared/layouts-components/ecommercefooter/ecommercefooter";
import Ecommerceheader from "@/shared/layouts-components/ecommerceheader/ecommerceheader";
import { Toaster } from "react-hot-toast";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div className="landing-page-wrapper">
        <div className="main-content landing-main ecommerce-main">
          {children}
        </div>
      </div>
    </div>
  );
}
