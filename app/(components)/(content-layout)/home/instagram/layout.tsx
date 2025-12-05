"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/SessionProvider"; // Oturum bilgilerini almak için session provider'ı kullanıyoruz
import DesktopNav from "./components/DesktopNav";
import MobileNav from "./components/MobileNav";
import ThemeObserver from "./components/ThemeObserver";
import { Theme } from "@radix-ui/themes";
import localFont from "next/font/local";
import "@radix-ui/themes/styles.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true); // Loading durumunu kontrol etmek için state
  const [profileExists, setProfileExists] = useState<boolean | null>(null); // Profil durumu
  const router = useRouter();
  const { user } = useSession(); // Oturum bilgisi

  // Profil kontrolünü yapan effect
  useEffect(() => {
    if (!user?.email) {
      router.push("/login"); // Eğer kullanıcı yoksa login sayfasına yönlendir
      return;
    }

    // Profil kontrolünü başlatan asenkron fonksiyon
    const checkProfile = async () => {
      try {
        // API'yi çağırıyoruz
        const res = await fetch(`/api/instagram/profile?email=${user.email}`);
        const data = await res.json();

        console.log("API Response:", data); // API'den dönen yanıtı logla

        if (data.exists) {
          // Profil varsa sayfa içeriği render edilir
          setProfileExists(true);
        } else {
          // Profil yoksa, kullanıcıyı profil oluşturma sayfasına yönlendiriyoruz
          router.push("/home/instagram/createprofile");
        }
      } catch (error) {
        console.error("Error fetching profile", error);
        router.push("/home/instagram/createprofile"); // Hata durumunda da profil oluşturma sayfasına yönlendir
      } finally {
        // Loading'i false yapıyoruz, profil kontrolü tamamlandı
        setLoading(false);
      }
    };

    checkProfile(); // Profil kontrolünü başlatıyoruz
  }, [user, router]); // user veya router değiştiğinde çalışır

  return (
    <div lang="en">
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black dark:text-red-500`}
      >
        <Theme>
          {modal}
          <div className="flex min-h-screen dark:bg-gray-800 dark:text-gray-300">
            {/* <DesktopNav /> */}
            <div className="pb-24 ld:pb-4 pt-4 px-4 lg:px-8 flex justify-around w-full">
              <div className="w-full">
                <div>{children}</div>
              </div>
            </div>
          </div>
          {/* <MobileNav /> */}
        </Theme>
        <ThemeObserver />
      </div>
    </div>
  );
}
