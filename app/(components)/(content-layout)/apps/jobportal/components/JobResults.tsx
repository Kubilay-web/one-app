import { cn } from "@/app/lib/utils";
import { JobFilterValues } from "../validation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import JobListItem from "./JobListItem";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.DATABASE_URL || "mongodb://localhost:27017";
const DB_NAME = "jobportal";

interface JobResultsProps {
  filterValues: JobFilterValues;
  page?: number;
}

export default async function JobResults({
  filterValues,
  page = 1,
}: JobResultsProps) {
  const { q, type, location } = filterValues;
  const jobsPerPage = 6;
  const skip = (page - 1) * jobsPerPage;

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection("jobs");

  const filters: any = { status: "active" };

  if (q && q.trim() !== "") {
    const regex = new RegExp(q.trim(), "i");
    filters.$or = [
      { title: { $regex: regex } },
      { description: { $regex: regex } },
      { "company.name": { $regex: regex } },
    ];
  }

  if (type) filters.jobTypeId = type;
  if (location) filters.cityId = location;

  const totalResults = await collection.countDocuments(filters);

  const jobs = await collection
    .find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(jobsPerPage)
    .toArray();

  await client.close();

  return (
    <div className="grow space-y-4">
      {jobs.length === 0 && (
        <p className="m-auto text-center">
          Hiç iş bulunamadı. Filtreleri değiştirmeyi deneyin.
        </p>
      )}

      {jobs.map((job) => (
        <Link key={job._id.toString()} href={`/jobs/${job.slug}`} className="block">
          <JobListItem job={job} />
        </Link>
      ))}

      {jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / jobsPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: JobFilterValues;
}

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, type, location },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(type && { type }),
      ...(location && { location }),
      page: page.toString(),
    });

    return `/apps/jobportal/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible"
        )}
      >
        <ArrowLeft size={16} />
        Önceki sayfa
      </Link>

      <span className="font-semibold">
        Sayfa {currentPage} / {totalPages}
      </span>

      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible"
        )}
      >
        Sonraki sayfa
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
