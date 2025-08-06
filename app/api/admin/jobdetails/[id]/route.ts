import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const jobId = params.id;

    // İş ilanını getir
    const job = await prisma.jobs.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "No jobs found" }, { status: 404 });
    }

    // İlgili diğer verileri getir
    const jobTag = await prisma.jobtag.findFirst({
      where: { jobId: job.id },
    });

    const benefits = await prisma.benfits.findFirst({
      where: { companyId: job.companyId },
    });

    const jobSkills = await prisma.jobskill.findFirst({
      where: { jobId: job.id },
    });

    return NextResponse.json({
      job,
      jobTag,
      benefits,
      jobSkills,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
