import React from "react";
import Link from "next/link";
import Image from "next/image";

import { ServiceWithDoctorProfileCount } from "../../../actions/services";

export default function ServiceCard({
  service,
}: {
  service: ServiceWithDoctorProfileCount;
}) {
  return (
    <Link
      href={`/medical/service/${service.slug}`}
      className="rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 duration-300 flex items-center gap-4 overflow-hidden px-2"
    >
      <Image
        src={service.imageUrl}
        width={1170}
        height={848}
        alt={service.title}
        className="w-14 h-14 object-contain aspect-video"
      />
      <div className="flex flex-col w-2/3 py-4">
        <h2 className="text-base font-medium">{service.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {service._count.doctorProfiles} Doctors Available
        </p>
      </div>
    </Link>
  );
}