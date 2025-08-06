"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import "./globals.scss";
import { Provider } from "react-redux";
import store from "@/shared/redux/store";
import { Initialload } from "@/shared/layouts-components/contextapi";
import { useRouter } from 'next/navigation';  // Router kullanımı için ekledim

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [pageloading, setpageloading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [session, setSession] = useState(null);
  const router = useRouter();  // Next.js Router

  useEffect(() => {
    setIsClient(true);

    // Session'ı client-side çek
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        } else {
          setSession(null);
          router.push("/");  // Eğer session yoksa, anasayfaya yönlendir
        }
      } catch (error) {
        console.error("Session fetch error:", error);
        setSession(null);
        router.push("/");  // Hata durumunda anasayfaya yönlendir
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (session) {
      // Eğer session varsa, kullanıcıyı /dashboards/sales sayfasına yönlendir
      router.push("/social");
    }
  }, [session]);

  if (!isClient) return null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Initialload.Provider value={{ pageloading, setpageloading }}>
              {children}
            </Initialload.Provider>
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
