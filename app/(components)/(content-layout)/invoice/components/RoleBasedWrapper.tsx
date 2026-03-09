
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import NotAuthorized from "./NotAuthorized";
import { UserRole } from "@prisma/client";
import { validateRequest } from "@/app/auth";

// type Role = "USER" | "ADMIN";

interface Props {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default async function RoleBasedWrapper({
  children,
  allowedRoles,
}: Props) {
  const {user} = await validateRequest();
  const userRole = user?.role as UserRole;

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(userRole)) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
}
