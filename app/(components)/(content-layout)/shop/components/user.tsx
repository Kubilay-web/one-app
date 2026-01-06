"use client";

import { SimpleProduct } from "@/app/lib/types";
import Image from "next/image";
import UserAvatar from "@/app/projects/components/UserAvatar";
import Link from "next/link";
import { Button } from "@/app/projects/components/ui/button";
import { validateRequest } from "@/app/auth";
import { useEffect, useState } from "react";
import { UserInfo } from "@/app/queries/user";

export default function HomeUserCard() {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [user, setUser] = useState<any>(null);

  // ürünleri client-side API'den çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/featured-products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Ürünleri çekerken hata oluştu:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await UserInfo();
      setUser(userData);
    };

    fetchUser();
  }, []);

  const role = user?.role;

  return (
    <div className="relative hidden h-full overflow-hidden rounded-md bg-white shadow-sm min-[1170px]:block">
      <div
        className="h-full rounded-md bg-no-repeat pb-9"
        style={{
          backgroundImage: "url(/assets/images/user-card-bg.avif)",
          backgroundSize: "100% 101px",
        }}
      >
        {/*User info */}
        <div className="h-[76px] w-full">
          <div className="mx-auto cursor-pointer">
            <Image
              src={user ? user.avatarUrl : UserAvatar}
              alt=""
              width={48}
              height={48}
              className="absolute left-1/2 top-2 h-12 w-12 -translate-x-1/2 rounded-full object-cover"
            />
          </div>
          <div className="absolute top-16 h-5 w-full cursor-pointer text-center font-bold capitalize text-black">
            {user ? user.username?.toLowerCase() : "Welcome to GoShop"}
          </div>
        </div>
        {/* User links */}
        <div className="mt-4 flex h-[100px] w-full items-center justify-center gap-x-4">
          <Link href="/profile">
            <span
              className="relative mx-auto block h-12 w-12 bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/user.webp)",
              }}
            />
            <span className="max-h-7 w-full text-center text-xs text-main-primary">
              Account
            </span>
          </Link>
          <Link href="/profile/orders">
            <span
              className="relative mx-auto block h-12 w-12 bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/orders.webp)",
              }}
            />
            <span className="max-h-7 w-full pl-1 text-center text-xs text-main-primary">
              Orders
            </span>
          </Link>
          <Link href="/profile/wishlist">
            <span
              className="relative mx-auto block h-12 w-12 bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/wishlist.png)",
              }}
            />
            <span className="max-h-7 w-full text-center text-xs text-main-primary">
              Wishlist
            </span>
          </Link>
        </div>
        {/* Action btn */}
        <div className="w-full px-2">
          {user ? (
            <div className="w-full">
              {role === "ADMIN" ? (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/dashboard/admin"}>
                    Switch to Admin Dashboard
                  </Link>
                </Button>
              ) : role === "SELLER" ? (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/dashboard/seller"}>
                    Switch to Seller Dashboard
                  </Link>
                </Button>
              ) : (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/seller/apply"}>Apply to become a seller</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="flex w-full justify-between gap-x-4">
              <Button variant="orange-gradient">
                <Link href="/sign-up">Join</Link>
              </Button>
              <Button variant="gray">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
