import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

interface RequestBody {
	text: string;
	voice_id: string;
	speed?: number;
}

export async function POST(req: Request) {
	try {
		if (!process.env.ELEVENLABS_API_KEY) {
			throw new Error("ELEVENLABS_API_KEY is missing from environment variables.");
		}

		const body: RequestBody = await req.json();
		const { text, voice_id, speed } = body;

		if (!text || !voice_id) {
			return NextResponse.json({ error: "Text and voice_id are required" }, { status: 400 });
		}

		const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

		const response = await client.textToSpeech.convert(voice_id, {
			output_format: "mp3_44100_128",
			text,
			model_id: "eleven_multilingual_v2",
			voice_settings: {
				stability: 0.75,
				speed: speed !== undefined ? speed : 1.0, // Use speed if present, otherwise default to 1.0
				similarity_boost: 0.75,
			},
		});

		const chunks: Uint8Array[] = [];
		for await (const chunk of response) {
			chunks.push(chunk);
		}
		const buffer = Buffer.concat(chunks);

		const base64Audio = buffer.toString("base64");

		return NextResponse.json({ audio: base64Audio });
	} catch (error) {
		console.error("Error in /api/tts:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "An unknown error occurred" },
			{ status: 500 }
		);
	}
}
