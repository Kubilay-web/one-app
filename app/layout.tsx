"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import "./globals.scss";
import { Provider } from "react-redux";
import store from "@/shared/redux/store";
import { Initialload } from "@/shared/layouts-components/contextapi";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // React Query client initialization
  const [queryClient] = useState(() => new QueryClient());

  // Pageloading state (initially false)
  const [pageloading, setpageloading] = useState(false);

  // Hydration error can be avoided with a client-side effect
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the client-side state after the component has mounted
    setIsClient(true);
  }, []);

  if (!isClient) {
    // To prevent rendering on the server-side during hydration
    return null;
  }

  return (
    <html lang="en">
      <head>{/* Buraya meta, title, link gibi global head elemanları */}</head>
      <body>
        {/* Wrap providers with client-side state management */}
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
