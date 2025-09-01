import { validateRequest } from "@/app/auth";
import { Toaster } from "react-hot-toast";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  return (
    <div>
      {children}
      <Toaster position="top-right" />
    </div>
  );
}
