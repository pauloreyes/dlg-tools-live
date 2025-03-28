import TTS from "@/components/tts";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Voice Generator",
    description: "Generate voice from text",
};

export default function VoiceOver() {
    return (
        <main className="min-h-screen bg-gray-100 flex flex-grow items-center justify-center">
            <div className="w-full text-center h-full max-w-lg">
                <h1 className="text-3xl font-bold mb-8">Paulo&apos;s Voice Generator</h1>
                <TTS />
            </div>
        </main>
    );
}
