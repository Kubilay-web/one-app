import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    console.log("Updating image ID:", params.id);
    console.log("Update data:", body);

    // Gelen verileri kontrol et
    const updateData: any = {
      url: body.url,
      alt: body.alt,
      type: body.type,
      order: body.order,
    };

    // Link alanlarını ekle (eğer varsa)
    if (body.link !== undefined) updateData.link = body.link || null;
    if (body.productSlug !== undefined) updateData.productSlug = body.productSlug || null;
    if (body.variantId !== undefined) updateData.variantId = body.variantId || null;
    if (body.size !== undefined) updateData.size = body.size || null;

    const updatedImage = await db.landingPageImage.update({
      where: { id: params.id },
      data: updateData,
    });
    
    console.log("Successfully updated image:", updatedImage);
    
    return NextResponse.json(updatedImage);
  } catch (error: any) {
    console.error("Error updating image:", error);
    
    // Database hatasını daha detaylı logla
    if (error.code) {
      console.error("Database error code:", error.code);
    }
    
    return NextResponse.json(
      { 
        error: `Failed to update image: ${error.message}`,
        details: error.code || "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Deleting image ID:", params.id);
    
    await db.landingPageImage.delete({
      where: { id: params.id },
    });
    
    console.log("Successfully deleted image:", params.id);
    
    return NextResponse.json({ 
      success: true,
      message: "Image deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: `Failed to delete image: ${error.message}` },
      { status: 500 }
    );
  }
}