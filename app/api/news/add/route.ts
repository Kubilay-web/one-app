import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import moment from "moment";
import { validateRequest } from "@/auth";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString() || "";
    const image = formData.get("image") as File;

    if (!title || !image) {
      return new Response(
        JSON.stringify({ message: "Title and image are required" }),
        { status: 400 },
      );
    }

    // Convert image Blob to Buffer (for Cloudinary)
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "news_images",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.end(buffer);
    });

    const writer = await prisma.writer.findUnique({
      where: { userId: user.id },
    });

    if (!writer) {
      return new Response(JSON.stringify({ message: "Writer not found" }), {
        status: 404,
      });
    }

    const news = await prisma.news.create({
      data: {
        writerId: writer.id,
        writerName: writer.penName,
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        category: writer.category,
        image: uploadResult.secure_url,
        description,
        date: moment().format("LL"),
        status: "pending",
        count: 0,
      },
    });

    return new Response(
      JSON.stringify({ message: "News Added Successfully", news }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding news:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
