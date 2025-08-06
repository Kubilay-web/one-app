import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs/promises";
import { Readable } from "stream";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid news ID" }, { status: 400 });
  }

  try {
    const news = await db.news.findUnique({
      where: { id },
    });

    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ news }, { status: 200 });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper to convert Blob to Buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// PUT /api/news/edit/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const news_id = params.id;

  if (!ObjectId.isValid(news_id)) {
    return NextResponse.json({ message: "Invalid news ID" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const oldImage = formData.get("old_image")?.toString() || "";
    const file = formData.get("new_image") as File | null;

    let imageUrl = oldImage;

    // Yeni dosya varsa Cloudinary'e yükle, eskiyi sil
    if (file && file.size > 0) {
      if (oldImage) {
        const parts = oldImage.split("/");
        const publicId = parts[parts.length - 1].split(".")[0];
        await cloudinary.uploader.destroy(`news_images/${publicId}`);
      }

      const buffer = await streamToBuffer(file.stream());
      const uploaded = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "news_images" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploaded.secure_url;
    }

    const updatedNews = await db.news.update({
      where: { id: news_id },
      data: {
        title: title.trim(),
        slug: title.trim().toLowerCase().split(" ").join("-"),
        description,
        image: imageUrl,
      },
    });

    return NextResponse.json(
      { message: "News Updated Successfully", news: updatedNews },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
