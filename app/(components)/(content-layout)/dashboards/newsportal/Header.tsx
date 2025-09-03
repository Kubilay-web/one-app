import Image from "next/image";
import React from "react";
import UserButton from "@/app/projects/components/UserButton";

const Header = () => {
  return (
    <div className="fixed top-4 z-50 w-[calc(100vw-250px)] pl-4">
      <div className="flex h-[70px] w-full items-center justify-between rounded bg-[#f1f1fb] p-4">
        <input
          type="text"
          placeholder="search"
          className="h-10 rounded-md border border-gray-300 px-3 py-2 outline-0 focus:border-blue-500"
        />

        <div className="mr-4">
          <div className="flex gap-x-2">
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
