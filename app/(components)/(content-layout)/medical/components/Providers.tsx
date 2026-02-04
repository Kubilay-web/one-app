"use client";
import SessionProvider from "@/app/SessionProvider";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </SessionProvider>
  );
}
