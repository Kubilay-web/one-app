import { aboutData } from "../../data";
import { Section } from "../../types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NoSection from "./NoSection";

export default function SchoolAdmissionSection({
  section,
}: {
  section: Section | null | undefined;
}) {
  if (!section) {
    return <NoSection />;
  }
  const {
    backgroundColor,
    title,
    subtitle,
    description,
    studentImage,
    buttonText,
    buttonLink,
    linkType,
  }: {
    backgroundColor: string;
    title: string;
    subtitle: string;
    description: string;
    studentImage: string;
    buttonText: string;
    buttonLink: string;
    linkType: string;
  } = section.settings;

  return (
    <section
      id="admissions"
      style={{ backgroundColor: backgroundColor }}
      className=" text-white"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-64 md:h-auto">
            <Image
              src={studentImage || "/placeholder.svg"}
              alt="Student writing"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="mb-2">{subtitle}</p>
            <p className="mb-6">{description}</p>
            <Link
              style={{ color: backgroundColor }}
              href={buttonLink}
              className="bg-white  px-4 py-2 rounded inline-block w-max text-sm font-medium hover:opacity-90 transition"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
