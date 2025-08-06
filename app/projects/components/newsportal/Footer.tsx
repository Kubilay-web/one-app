import React from "react";
import Image from "next/image";
import Gallery from "./news/Gallery";
import Category from "./Category";
import RecentNewsFooter from "./news/RecentNewsFooter";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1919]">
        <div className="grid w-full grid-cols-1 gap-12 px-4 py-10 md:px-8 lg:grid-cols-4">
          <div className="w-full">
            <div className="flex w-full flex-col gap-y-[14px]">
              <Image
                className=""
                width={200}
                height={100}
                src="/assets/news-portal/assets/logo.png"
                alt="logo"
              />
              <h2 className="text-justify text-slate-300">
                Easynews24.com is one of the popular Indian news portal. It has
                begun with commitment of fearless, investigative, informative
                and independent journalism. This online portal has started to
                provide real time news updates with maximum use of modern
                technology from May 10th 2023.
              </h2>
            </div>
          </div>

          <Gallery />
          <div>
            <Category titleStyle="text-white" />
          </div>
          <RecentNewsFooter />
        </div>
      </div>

      <div className="bg-[#262323]">
        <div className="flex flex-col items-center justify-between gap-3 px-4 py-5 md:flex-row md:px-8">
          <div className="flex items-center justify-start gap-y-2 text-gray-300">
            <span>Copyright @ 2024</span>
            <Link href={"#"}>Learn with Easylearingbd</Link>
          </div>

          <div className="flex gap-x-[4px]">
            <a
              href="#"
              className="flex h-[35px] w-[37px] items-center justify-center bg-slate-600 text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="flex h-[35px] w-[37px] items-center justify-center bg-slate-600 text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="flex h-[35px] w-[37px] items-center justify-center bg-slate-600 text-white"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
