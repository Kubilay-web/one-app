import React from "react";
import moment from "moment";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import Image from "next/image";
import HeaderCategory from "./HeaderCategory";

const Header = () => {
  return (
    <header className="bg-[#333333] text-[#cccccc]">
      <div className="flex items-center justify-between border-b border-[#444444] px-5 py-2 lg:px-8">
        <span className="text-sm font-medium">{moment().format("LLLL")}</span>

        <div className="flex space-x-2">
          <a
            href=""
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2045ea] transition duration-200 hover:bg-slate-500"
          >
            <FaFacebookF />
          </a>

          <a
            href=""
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5271ff] transition duration-200 hover:bg-slate-500"
          >
            <FaTwitter />
          </a>

          <a
            href=""
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff5157] transition duration-200 hover:bg-slate-500"
          >
            <FaYoutube />
          </a>
        </div>
      </div>

      <div
        style={{
          backgroundImage: `url("/assets/news-portal/assets/header-bg.jpg")`,
        }}
        className="bg-cover bg-center py-6 text-center"
      >
        <div className="flex flex-col items-center justify-between space-y-6 px-5 md:flex-row md:space-y-0 lg:px-8">
          <div className="flex w-full flex-col items-center space-y-3 md:w-4/12 md:items-start">
            <Image
              className="h-full w-[200px]"
              alt="logo"
              src="/assets/news-portal/assets/logo.png"
              width={303}
              height={66}
              priority
            />
            <h2 className="text-md md:text-md text-center font-semibold tracking-wide text-[#cccccc] md:text-left">
              Media that rocks your world
            </h2>
          </div>

          <div className="hidden w-full justify-end md:flex md:w-8/12">
            <Image
              className="h-auto max-w-full"
              alt="add"
              src="/assets/news-portal/assets/add.png"
              width={728}
              height={90}
              priority
            />
          </div>
        </div>
      </div>

      <HeaderCategory />
    </header>
  );
};

export default Header;
