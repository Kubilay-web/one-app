"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Toaster position="top-center" /> 
      {children}
    </div>
  );
}
