"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/SessionProvider";

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // We check session only
    if (session === undefined) return; // still loading

    setIsChecking(false);

    if (session) {
      router.push(`/medical/onboarding/${session.user.id}`);
    }
  }, [session, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <h2>
        {isChecking ? "Verifying session, please wait..." : "Redirecting..."}
      </h2>
    </div>
  );
}
