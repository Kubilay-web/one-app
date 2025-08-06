import Image from "next/image";
import Link from "next/link";
import React from "react";

const SimpleNewsCard = ({ item, type }) => {
  return (
    <div className="group relative">
      <div className="overflow-hidden">
        <div
          className={`${type ? "h-[270px] sm:h-[470px]" : "h-[228px]"} duration-[1s] w-full transition-all group-hover:scale-[1.1]`}
        >
          <Image className="" layout="fill" src={item.image} alt="images" />
        </div>
      </div>

     
      <div className="invisible absolute left-0 top-0 block h-full w-full cursor-pointer bg-white opacity-5 transition-all duration-300 group-hover:visible"></div>
      <div className="absolute bottom-4 left-5 flex flex-col items-start justify-start gap-y-2 font-semibold text-white">
        <div className="rounded-md bg-[#c80000] px-[6px] py-[2px] text-[13px]">
          {item.category}
        </div>
        <Link href={`/news/${item.slug}`} className="text-xl">
          {item.title}
        </Link>
        <div className="flex gap-x-2 text-sm font-medium">
          <span>{item.date}</span>
          <span>By {item.writerName}</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleNewsCard;
