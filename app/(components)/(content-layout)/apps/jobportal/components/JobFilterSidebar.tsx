import prisma from "@/app/lib/prisma";
import { jobFilterSchema, JobFilterValues } from "../lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";

async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());
  const parsed = await jobFilterSchema.parseAsync(values); // ✅ async parse

  const { q, jobTypeId, cityId } = parsed;

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(jobTypeId && { jobTypeId }),
    ...(cityId && { cityId }),
  });

  console.log(formData.get("q") as String)

  redirect(`/apps/jobportal/job/?${searchParams.toString()}`);
}

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

export default async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  // ✅ JobTypes dropdown için async
  const jobTypes = await prisma.jobtype.findMany({
    select: { id: true, name: true },
  });

  // ✅ Distinct şehirler async
  const locations = await prisma.jobs.findMany({
    select: { city: { select: { id: true, name: true } } },
    distinct: ["cityId"],
  });

  const distinctCities = locations
    .map(({ city }) => (city ? { id: city.id, name: city.name } : null))
    .filter((c): c is { id: string; name: string } => Boolean(c));

  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          {/* 🔍 Search */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues.q}
            />
          </div>

          {/* 🔽 Job Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="jobTypeId">Job Type</Label>
            <Select
              id="jobTypeId"
              name="jobTypeId"
              defaultValue={defaultValues.jobTypeId || ""}
            >
              <option value="">All types</option>
              {jobTypes.map((jt) => (
                <option key={jt.id} value={jt.id}>
                  {jt.name}
                </option>
              ))}
            </Select>
          </div>

          {/* 📍 Location (City) */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cityId">City</Label>
            <Select
              id="cityId"
              name="cityId"
              defaultValue={defaultValues.cityId || ""}
            >
              <option value="">All cities</option>
              {distinctCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Select>
          </div>

          <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
