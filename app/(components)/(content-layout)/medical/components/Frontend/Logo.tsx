import Image from "next/image";
import Link from "next/link";
import React from "react";


export default function Logo() {
  return (
    <Link href="/medical" className="mr-6 flex items-center space-x-2">
      <Image alt="Medical Logo" src="/onemedical/logo.jpg" width={50} height={50} className="h-8 lg:h-12 w-auto" />
    </Link>
  );
}
