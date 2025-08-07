// app/layout.tsx
import "./globals.scss";
import ClientProviders from "./ClientProviders";
import { validateRequest } from "./auth";
import SessionProvider from "./SessionProvider";

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
        <SessionProvider value={session}>
          <ClientProviders>{children}</ClientProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
