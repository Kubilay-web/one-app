import { NextRequest, NextResponse } from "next/server";
import db  from "@/app/lib/db";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const images = await db.landingPageImage.findMany({
      where: { sectionId: params.id },
      orderBy: { order: "asc" }
    });
    
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    
    const image = await db.landingPageImage.create({
      data: {
        sectionId: params.id,
        url: body.url,
        alt: body.alt || "",
        type: body.type || "gallery",
        order: body.order || 0
      }
    });
    
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error adding image:", error);
    return NextResponse.json(
      { error: "Failed to add image" },
      { status: 500 }
    );
  }
}