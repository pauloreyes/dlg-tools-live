import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

const fetchVoices = async (): Promise<{
  voices: { voice_id: string; name: string }[];
}> => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not set");
    }

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
    const voices = await client.voices.getAll(); // Use the SDK

    return {
      voices: voices.voices
        .filter((voice) => voice.name !== undefined)
        .map((voice) => ({
          voice_id: voice.voice_id,
          name: voice.name as string,
        })),
    }; // Filter out voices with undefined names and map to required type
  } catch (error: unknown) {
    console.error("Error in /api/get-voice:", error);

    // More informative error response (especially for SDK errors)
    if (error instanceof Error) {
      throw new Error(error.message);
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      // Check if it has a message property
      throw new Error((error as { message: string }).message);
    } else {
      throw new Error("An unknown error occurred while fetching voices");
    }
  }
};

export async function GET() {
  try {
    const voices = await fetchVoices();
    return NextResponse.json(voices);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch voices" },
      { status: 500 }
    );
  }
}
