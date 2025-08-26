import { NextResponse } from "next/server";
import db from "@/app/lib/db"



export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Filtreleri query parametrelerinden al
    const categories = url.searchParams.get("categories")?.split(",") || [];
    const jobTypes = url.searchParams.get("jobTypes")?.split(",") || [];
    const experience = url.searchParams.get("experience")?.split(",") || [];
    const qualifications = url.searchParams.get("qualifications")?.split(",") || [];
    const skills = url.searchParams.get("skills")?.split(",") || [];
    const salaryRange = url.searchParams.get("salaryRange")?.split(",").map(Number) || [];

    // Prisma where objesi
    const where: any = {};

    if (categories.length) where.jobCategoryId = { in: categories };
    if (jobTypes.length) where.jobTypeId = { in: jobTypes };
    if (experience.length) where.jobExperienceId = { in: experience };
    if (qualifications.length) where.educationId = { in: qualifications };
    if (skills.length) where.Jobskill = { some: { name: { in: skills } } };
    if (salaryRange.length === 2) {
      where.min_salary = { gte: salaryRange[0] };
      where.max_salary = { lte: salaryRange[1] };
    }

    const jobs = await db.jobs.findMany({
      where,
      include: {
        company: true,
        job_category: true,
        job_role: true,
        job_experience: true,
        education: true,
        job_type: true,
        salary_type: true,
        city: true,
        state: true,
        country: true,
        jobtags: true,
        Job_benfits: true,
        Jobskill: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}





// ✅ Yeni iş ilanı oluştur
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const job = await db.jobs.create({
      data: {
        title: body.title,
        slug: body.slug,
        vacancies: body.vacancies,
        min_salary: body.min_salary ?? 0,
        max_salary: body.max_salary ?? 0,
        custom_salary: body.custom_salary ?? 0,
        deadline: body.deadline ? new Date(body.deadline) : null,
        description: body.description,
        status: body.status ?? "pending",
        apply_on: body.apply_on ?? "app",
        apply_email: body.apply_email,
        apply_url: body.apply_url,
        featured: body.featured ?? false,
        highlight: body.highlight ?? false,
        fetaured_until: body.fetaured_until ? new Date(body.fetaured_until) : null,
        highlight_until: body.highlight_until ? new Date(body.highlight_until) : null,
        companyId: body.companyId,
        jobCategoryId: body.jobCategoryId,
        jobRoleId: body.jobRoleId,
        jobExperienceId: body.jobExperienceId,
        educationId: body.educationId,
        jobTypeId: body.jobTypeId,
        salaryTypeId: body.salaryTypeId,
        cityId: body.cityId,
        stateId: body.stateId,
        countryId: body.countryId,
        address: body.address,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
