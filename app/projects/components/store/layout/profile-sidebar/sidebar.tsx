"use client";
import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileSidebar() {
  const pathname = usePathname();
  const path = pathname.split("/apps/shop/profile/")[1];
  const path_trim = path ? path.split("/")[0] : null;
  return (
    <div>
      <div className="w-full p-4 text-xs text-[#999]">
        <span>
          <Link href="/">Home</Link>
          <span className="mx-2">&gt;</span>
        </span>
        <span>
          <Link href="/profile">Account</Link>
          {pathname !== "/profile" && <span className="mx-2">&gt;</span>}
        </span>
        {path && (
          <span>
            <Link href={pathname} className="capitalize">
              {path_trim || path}
            </Link>
          </span>
        )}
      </div>
      <div className="bg-white">
        <div className="inline-block min-h-72 w-full py-3 lg:w-[296px]">
          <div className="flex h-9 items-center px-4 font-bold text-main-primary">
            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
              Account
            </div>
          </div>
          {/* Links */}
          {menu.map((item) => (
            <Link key={item.link} href={item.link}>
              <div
                className={cn(
                  "relative flex h-9 cursor-pointer items-center px-4 text-sm hover:bg-[#f5f5f5]",
                  {
                    "user-menu-item bg-[#f5f5f5]":
                      item.link &&
                      (pathname === item.link ||
                        (pathname.startsWith(item.link) &&
                          item.link !== "/profile")),
                  },
                )}
              >
                <span>{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const menu = [
  {
    title: "Overview",
    link: "/apps/shop/profile",
  },
  {
    title: "Orders",
    link: "/apps/shop/profile/orders",
  },
  {
    title: "Payment",
    link: "/apps/shop/profile/payment",
  },
  {
    title: "Shipping address",
    link: "/apps/shop/profile/addresses",
  },
  {
    title: "Reviews",
    link: "/apps/shop/profile/reviews",
  },
  {
    title: "History",
    link: "/apps/shop/profile/history/1",
  },
  {
    title: "Wishlist",
    link: "/apps/shop/profile/wishlist/1",
  },
  {
    title: "Following",
    link: "/apps/shop/profile/following/1",
  },
];
