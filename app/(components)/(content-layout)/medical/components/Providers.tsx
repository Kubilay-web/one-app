"use client";

import SessionProvider from "@/app/SessionProvider";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import { Session, User } from "lucia";
import { HMSRoomProvider } from "@100mslive/react-sdk";

export default function Providers({
  children,
  session,
  user,
}: {
  children: ReactNode;
  session: Session | null;
  user: User | null;
}) {
  return (
    <>
      <HMSRoomProvider>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </HMSRoomProvider>
    </>
  );
}
