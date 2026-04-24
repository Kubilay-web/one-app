// app/dashboards/admin/layout.tsx (Server Component)
import { validateRequest } from "@/app/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: AdminLayoutProps) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "WRITER") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">
            Access Denied
          </h1>
          <p className="mb-6 text-gray-500">
            You need admin privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
