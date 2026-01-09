import { NextRequest, NextResponse } from "next/server";
import  db  from "@/app/lib/db";

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    
    const image = await db.landingPageImage.update({
      where: { id: params.id },
      data: {
        url: body.url,
        alt: body.alt,
        type: body.type,
        order: body.order,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await db.landingPageImage.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Image deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}