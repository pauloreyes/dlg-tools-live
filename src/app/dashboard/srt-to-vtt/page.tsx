import SrtToVtt from "@/components/srt-to-vtt";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SRT to VTT Converter",
  description: "Convert SRT subtitles to VTT format",
};

export default function VoiceOver() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Convert SRT to VTT
        </h1>
        <SrtToVtt />
      </div>
    </main>
  );
}
