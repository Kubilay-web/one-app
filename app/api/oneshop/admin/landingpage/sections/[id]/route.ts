import { NextRequest, NextResponse } from "next/server";
import  db  from "@/app/lib/db";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const section = await db.landingPageSection.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: "asc" }
        }
      }
    });
    
    if (!section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(section);
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { error: "Failed to fetch section" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    
    const section = await db.landingPageSection.update({
      where: { id: params.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        active: body.active,
        order: body.order,
        data: body.data,
        updatedAt: new Date()
      },
      include: {
        images: true
      }
    });
    
    return NextResponse.json(section);
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Delete associated images first
    await db.landingPageImage.deleteMany({
      where: { sectionId: params.id }
    });
    
    // Delete the section
    await db.landingPageSection.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Section deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}