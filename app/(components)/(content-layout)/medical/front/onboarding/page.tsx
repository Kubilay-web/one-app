"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/SessionProvider";

export default function Page() {
  const  session  = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!session) {
      return; // Still loading, wait...
    }

    setIsChecking(false);

    if (session) {
      router.push(`/medical/onboarding/${session.user.id}`);
    }
  }, [session,router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <h2>
        {isChecking
          ? "Verifying Session please wait..."
          : "Verifying Session please wait..."}
      </h2>
    </div>
  );
}
