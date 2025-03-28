import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

export async function POST(req: Request) {
  try {
    // Ensure API key exists
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is missing from environment variables.");
    }

    // Parse request body
    const { text, voice_id } = await req.json();
    if (!text || !voice_id) {
      return NextResponse.json({ error: "Text and voice_id are required" }, { status: 400 });
    }

    // Initialize ElevenLabs client
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

    // Request audio stream from ElevenLabs
    const response = await client.textToSpeech.convert(voice_id, {
      output_format: "mp3_44100_128",
      text,
      model_id: "eleven_multilingual_v2",
    });

    // Convert ReadableStream to Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Convert Buffer to Base64
    const base64Audio = buffer.toString("base64");

    // Return Base64-encoded audio
    return NextResponse.json({ audio: base64Audio });
  } catch (error) {
    console.error("Error in /api/tts:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
