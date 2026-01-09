import { NextRequest, NextResponse } from "next/server";
import  db  from "@/app/lib/db";

export async function GET() {
  try {
    const sections = await db.landingPageSection.findMany({
      orderBy: { order: "asc" },
      include: {
        images: {
          orderBy: { order: "asc" }
        }
      }
    });
    
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const section = await db.landingPageSection.create({
      data: {
        type: body.type,
        title: body.title,
        subtitle: body.subtitle,
        active: body.active ?? true,
        order: body.order ?? 0,
        data: body.data ?? {}
      },
      include: {
        images: true
      }
    });
    
    return NextResponse.json(section);
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}