// app/layout.tsx
import "./globals.scss";
import ClientProviders from "./ClientProviders";

export const metadata = {
  title: "My App",
  description: "Awesome app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
