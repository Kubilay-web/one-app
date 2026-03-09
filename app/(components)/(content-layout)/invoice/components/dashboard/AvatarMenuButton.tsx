"use client";
import { useSession } from "@/app/SessionProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../../components/ui/sheet";


import { getInitials } from "../../lib/generateInitials";


import { LogOut } from "lucide-react";

// import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AvatarMenuButton() {
  const {user} = useSession();
  const initials = getInitials(user.username ?? "");
  const router = useRouter();
  // async function handleLogout() {
  //   try {
  //     await signOut();
  //     router.push("/login");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar>
          <AvatarImage src={user.avatarUrl ?? ""} alt={user.username ?? ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center space-x-3 pb-3 border-b ">
            <Avatar>
              <AvatarImage src={user?.avatarUrl ?? ""} alt={user.username ?? ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="">
              <h2 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
                {user?.username}
              </h2>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="flex space-x-6 items-center py-6">
            <Button
              className="w-full"
              // onClick={() => handleLogout()}
              variant={"outline"}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
