
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";


import { ourFileRouter } from "@/app/api/onemedical/uploadthing/core";

import { OnboardingContextProvider } from "./context/context";


import Providers from "./components/Providers";
import ThemeProvider from "../realestate/providers/theme-provider";
import { siteConfig } from "./config/site";

// import { ourFileRouter } from "~/app/api/uploadthing/core";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en" suppressHydrationWarning>
      <div className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>
          <OnboardingContextProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </OnboardingContextProvider>
        </Providers>
      </div>
    </div>
  );
}
