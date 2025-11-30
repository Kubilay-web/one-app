import { PrismaClient } from '@prisma/client';
import { serve } from '@upstash/workflow/nextjs';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// Başlık oluşturma için OpenAI sistem promptu
const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(
  async (context) => {
    const input = context.requestPayload as InputType;
    const { videoId, userId } = input;

    // 1. Video bilgisini çek
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: userId,
      },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    // 2. Transkripti almak için Mux API'sini kullan
    const transcriptUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(transcriptUrl);
    const transcript = await response.text();

    if (!transcript) {
      throw new Error("Transcript not found");
    }

    // 3. OpenAI API'si ile başlık oluştur
    const openAIResponse = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        prompt: `${TITLE_SYSTEM_PROMPT}\n${transcript}`,
        max_tokens: 60,  // Başlık için uygun token uzunluğu
      }),
    });

    const openAIData = await openAIResponse.json();
    const title = openAIData.choices[0]?.text?.trim();

    if (!title) {
      throw new Error("Title generation failed");
    }

    // 4. Video başlığını güncelle
    await prisma.video.update({
      where: {
        id: video.id,
      },
      data: {
        title: title || video.title,  // Yeni başlık veya mevcut başlık
      },
    });

    return { status: 'success', title };
  }
);
