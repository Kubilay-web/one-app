// app/layout.tsx
import "./globals.scss";
import ClientProviders from "./ClientProviders";
import { validateRequest } from "./auth";
import SessionProvider from "./SessionProvider";
import { LayoutProvider } from "./(components)/(content-layout)/home/onesocial/context/useLayoutContext";


export const metadata = {
  title: "My App",
  description: "Awesome app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <LayoutProvider>
          <SessionProvider value={session}>
            <ClientProviders>{children}</ClientProviders>
          </SessionProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
