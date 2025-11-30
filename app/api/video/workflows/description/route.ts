import { PrismaClient } from "@prisma/client";
import { serve } from "@upstash/workflow/nextjs";
import { fetch } from "node-fetch";

const prisma = new PrismaClient();

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(
  async (context) => {
    const input = context.requestPayload as InputType;
    const { videoId, userId } = input;

    // 1. Video'yu veritabanından çek
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: userId,
      },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    // 2. Mux transkriptini al
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const transcript = await response.text();

    if (!transcript) {
      throw new Error("Transcript not available");
    }

    // 3. OpenAI API'yi kullanarak video açıklamasını oluştur
    const { body } = await context.api.openai.call(
      "generate-description",
      {
        token: process.env.OPENAI_API_KEY!,
        operation: "chat.completions.create",
        body: {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: DESCRIPTION_SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: transcript,
            },
          ],
        },
      }
    );

    const description = body.choices[0]?.message.content;

    if (!description) {
      throw new Error("Failed to generate description");
    }

    // 4. Video açıklamasını veritabanında güncelle
    await prisma.video.update({
      where: { id: video.id },
      data: {
        description: description,
      },
    });

    return { status: "success" };
  }
);
