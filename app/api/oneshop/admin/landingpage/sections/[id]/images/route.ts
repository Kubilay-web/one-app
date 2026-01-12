import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

interface Params {
  params: { sectionId: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const images = await db.landingPageImage.findMany({
      where: { sectionId: params.sectionId },
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
    console.log("POST request body:", body);
    
    const image = await db.landingPageImage.create({
      data: {
        sectionId: params.sectionId,
        url: body.url,
        alt: body.alt || null,
        type: body.type || "gallery",
        order: body.order || 0,
        link: body.link || null,
        productSlug: body.productSlug || null,
        variantId: body.variantId || null,
        size: body.size || null,
      },
    });
    
    console.log("Created image:", image);
    return NextResponse.json(image);
  } catch (error: any) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { error: `Failed to add image: ${error.message}` },
      { status: 500 }
    );
  }
}