import React from "react";
import joblogo from "@/public/assets/joblogo.png";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="shadow-sm">
      <nav className="max-w-5xl m-auto px-3 py-5 flex items-center justify-between">
        <Link href="/apps/jobportal" className="flex items-center gap-3">
          <Image src={joblogo} alt="job" width={40} height={40} />
          <span className=" font-bold tracking-tight text-xl">Flow Jobs</span>
        </Link>
        <Button asChild>
            <Link href="/apps/jobportal/jobs/new">Post a job</Link>
        </Button>
      </nav>
    </header>
  );
}
