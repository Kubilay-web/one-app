// app/ClientProviders.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import store from "@/shared/redux/store";
import { Initialload } from "@/shared/layouts-components/contextapi";
import { useRouter } from "next/navigation";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [pageloading, setpageloading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        } else {
          setSession(null);
          router.push("/");
        }
      } catch (error) {
        console.error("Session fetch error:", error);
        setSession(null);
        router.push("/");
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (session) {
      router.push("/social");
    }
  }, [session]);

  if (!isClient) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Initialload.Provider value={{ pageloading, setpageloading }}>
          {children}
        </Initialload.Provider>
      </Provider>
    </QueryClientProvider>
  );
}
