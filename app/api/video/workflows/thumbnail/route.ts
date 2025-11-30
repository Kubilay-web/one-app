import { PrismaClient } from '@prisma/client';
import { serve } from '@upstash/workflow/nextjs';
import cloudinary from 'cloudinary';
import { fetch } from 'node-fetch';

const prisma = new PrismaClient();

// Cloudinary'yi yapılandırma
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to generate a visually engaging thumbnail for the video. Follow these guidelines:
- Ensure the thumbnail is visually appealing and fits the context of the video.
- Include keywords or visuals related to the video content.
- Make it look like a standard video thumbnail with some creativity.
- Focus on delivering a unique and professional design.`;

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(
  async (context) => {
    const input = context.requestPayload as InputType;
    const { videoId, userId, prompt } = input;

    // 1. Video'yu veritabanından çek
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: userId,
      },
    });

    if (!video) {
      throw new Error('Video not found');
    }

    // 2. OpenAI API'si ile Thumbnail oluşturmak için DALL-E'yi kullan
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: DESCRIPTION_SYSTEM_PROMPT + "\n" + prompt,
        n: 1,
        model: 'dall-e-3',
        size: '1024x1024',
      }),
    });

    const body = await response.json();
    const tempThumbnailUrl = body.data[0]?.url;

    if (!tempThumbnailUrl) {
      throw new Error('Error generating image');
    }

    // 3. Önceki thumbnail'ı Cloudinary üzerinden sil
    if (video.thumbnailKey) {
      try {
        await cloudinary.v2.uploader.destroy(video.thumbnailKey);
      } catch (error) {
        console.error('Error deleting old thumbnail:', error);
      }

      await prisma.video.update({
        where: {
          id: video.id,
        },
        data: {
          thumbnailKey: null,
          thumbnailUrl: null,
        },
      });
    }

    // 4. Yeni thumbnail'ı Cloudinary'ye yükle
    const uploadResult = await cloudinary.v2.uploader.upload(tempThumbnailUrl, {
      public_id: `video-thumbnail-${video.id}`, // Uniqueness için video ID'sini kullanıyoruz
      folder: 'video-thumbnails',
      overwrite: true,
    });

    if (!uploadResult?.secure_url || !uploadResult?.public_id) {
      throw new Error('Error uploading thumbnail to Cloudinary');
    }

    // 5. Veritabanında video kaydını güncelle
    await prisma.video.update({
      where: {
        id: video.id,
      },
      data: {
        thumbnailUrl: uploadResult.secure_url,
        thumbnailKey: uploadResult.public_id,
      },
    });

    return { status: 'success', thumbnailUrl: uploadResult.secure_url };
  }
);
