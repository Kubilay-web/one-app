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
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data = await res.json();
          if (!data) {
            router.push("/"); // Session boşsa anasayfaya yönlendir
          }
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Session kontrol hatası:", error);
        router.push("/");
      } finally {
        setSessionChecked(true);
      }
    };

    setIsClient(true);
    checkSession();
  }, [router]);


  if (!isClient || !sessionChecked) {
    return null;
  }

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
