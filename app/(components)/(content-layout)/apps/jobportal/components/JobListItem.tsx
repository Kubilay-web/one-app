import React from "react";
import { Job } from "@prisma/client";
import Image from "next/image";
import companylogoPlaceholder from "@/public/assets/company-logo-placeholder.png";
import { Banknote, Briefcase, Clock, Globe2, MapPin } from "lucide-react";
import { formatMoney, relativeDate } from "@/app/lib/utils";
import Badge from "./Badge";

interface JobListItemProps {
  job: Job & {
    job_type?: { name: string }; // job_type nesnesinin name özelliğini de al
    job_category?: { name: string }; // job_category nesnesinin name özelliğini de al
    job_role?: { name: string }; // job_role nesnesinin name özelliğini de al
  };
}

export default function JobListItem({
  job: {
    title,
    companyName,
    job_type,
    locationType,
    address,
    min_salary,
    max_salary,
    companyLogoUrl,
    createdAt,
  },
}: JobListItemProps) {
  return (
    <article className="flex gap-3 border border-gray-500 rounded-lg p-5 hover:bg-slate-200">
      <Image
        src={companyLogoUrl || companylogoPlaceholder}
        alt="company logo"
        width="100"
        height="100"
        className="rounded-lg self-center"
      />
      <div className="flex-grow space-y-3">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-textmuted">{companyName}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin size={16} className="shrink-0" />
            {address}
          </p>
          <p className="flex items-center gap-1.5">
            <Globe2 size={16} className="shrink-0" />
            {address || "worldwide"}
          </p>
          <p className="flex items-center gap-1.5">
            <Banknote size={16} className="shrink-0" />
            {formatMoney(min_salary)} - {formatMoney(max_salary)}
          </p>
          <p className="flex items-center gap-1.5 sm:hidden">
            <Clock size={16} className="shrink-0" />
            {relativeDate(createdAt)}
          </p>
        </div>
      </div>
      <div className="hidden sm:flex flex-col shrink-0 items-end justify-between">
        {/* <Badge>{job_type?.name}</Badge>  */}
        <span className="flex items-center gap-1.5 text-textmuted">
          <Clock size={16} />
          {relativeDate(createdAt)}
        </span>
      </div>
    </article>
  );
}
