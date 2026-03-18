"use client";
import { cn } from "../lib/utils";
import useSchoolStore from "../store/school";
// import useSchoolStore from "../store/school";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({
	variant = "light",
	size = "md",
	href = "/management",
}: {
	variant?: "dark" | "light";
	size?: "sm" | "md" | "lg";
	href?: string;
}) {
	const { school } = useSchoolStore();
	if (variant === "light") {
		return (
			<Link href={href} className="flex items-center space-x-2">
				{/* <div className="bg-blue-500 rounded-full p-1 md:hidden">
          <span className="font-bold text-xl text-white">
            <GraduationCap
              className={cn("w-6 h-6", size === "lg" && "w-10 h-10")}
            />
          </span>
        </div> */}
				<Image
					alt={school?.name ?? "School Pro"}
					src={school?.logo ?? "/management/images/logo.png"}
					width={500}
					height={150}
					className="w-44"
				/>
			</Link>
		);
	} else {
		return (
			<Link href={"/management"} className="flex items-center space-x-2">
				{/* <div className="bg-white rounded-full p-1 md:hidden">
					<span className="text-blue-800 font-bold text-xl">
						<GraduationCap />
					</span>
				</div> */}
				<Image
					alt={school?.name ?? "School Pro"}
					src={school?.logo ?? "/management/images/logo.png"}
					width={500}
					height={150}
					className="w-44"
				/>
			</Link>
		);
	}
}
