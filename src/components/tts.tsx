"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";

const TTS = () => {
	const [text, setText] = useState("");
	const [speedSpeech, setSpeedSpeech] = useState(100);
	const [selectedVoice, setSelectedVoice] = useState("9BWtsMINqrJLrRacOk9x");
	const [isGenerating, setIsGenerating] = useState(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [voices, setVoices] = useState<{ voice_id: string; name: string }[]>([]);
	const [history, setHistory] = useState<
		{ text: string; audioBase64: string; voiceName: string }[]
	>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const handleSpeedChange = (newValue: number[]): void => {
		setSpeedSpeech(newValue[0]);
		console.log("Slider value changed:", newValue[0]);
	};

	useEffect(() => {
		const storedVoice = localStorage.getItem("selectedVoice");
		if (storedVoice) setSelectedVoice(storedVoice);

		const storedHistory = localStorage.getItem("ttsHistory");
		if (storedHistory) setHistory(JSON.parse(storedHistory));
	}, []);

	useEffect(() => {
		localStorage.setItem("selectedVoice", selectedVoice);
	}, [selectedVoice]);

	useEffect(() => {
		localStorage.setItem("ttsHistory", JSON.stringify(history));
	}, [history]);

	useEffect(() => {
		const fetchVoices = async () => {
			try {
				const response = await fetch("/api/get-voice");
				if (!response.ok) {
					throw new Error("Failed to fetch voices");
				}
				const data = await response.json();
				if (data.voices) {
					setVoices(data.voices);
				} else {
					throw new Error("No voices received");
				}
			} catch (error) {
				console.error("Failed to fetch voices:", error);
			}
		};
		fetchVoices();
	}, []);

	const isValidBase64 = (str: string) => {
		try {
			return btoa(atob(str)) === str;
		} catch {
			return false;
		}
	};

	const handleGenerateAudio = async () => {
		if (!text.trim()) {
			setError("Text is required!");
			return;
		}

		setIsGenerating(true);
		setError(null);

		try {
			const response = await fetch("/api/tts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text, voice_id: selectedVoice, speed: speedSpeech / 100 }),
			});

			const data: { audio: string; error?: string } = await response.json();

			if (!response.ok) {
				setError(data.error || "Generation failed.");
				return;
			}

			const audioBase64 = data.audio;
			if (!isValidBase64(audioBase64)) {
				throw new Error("Invalid base64 audio data");
			}
			const audioBlob = new Blob(
				[Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))],
				{ type: "audio/mpeg" }
			);
			const audioUrl = URL.createObjectURL(audioBlob);
			setAudioUrl(audioUrl);

			const voiceName = voices.find((v) => v.voice_id === selectedVoice)?.name || "Unknown";

			setHistory((prevHistory) => {
				const newHistory = [{ text, audioBase64, voiceName }, ...prevHistory].slice(0, 10);
				return newHistory;
			});
		} catch (error: unknown) {
			setError((error as Error).message || "An error occurred.");
			console.error("Error generating audio:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md'>
			<div className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Select VO Actor
					</label>
					<select
						value={selectedVoice}
						onChange={(e) => setSelectedVoice(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded-md'
					>
						{voices.map((voice) => (
							<option key={voice.voice_id} value={voice.voice_id}>
								{voice.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Enter Text
					</label>
					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder='Enter text to generate audio'
						className='w-full p-2 border border-gray-300 rounded-md'
					/>
				</div>

				{error && <div className='text-red-500 text-sm'>{error}</div>}

				<div className='flex gap-2'>
					<button
						onClick={handleGenerateAudio}
						disabled={isGenerating || !text.trim()}
						className={`flex-1 px-4 py-2 rounded-full text-white ${
							isGenerating || !text.trim() ? "bg-gray-400" : "bg-blue-500"
						}`}
					>
						{isGenerating ? "Generating..." : "Generate Audio"}
					</button>
				</div>

				<div className='flex items-center'>
					<span className='mr-2'>Speed</span>
					<div className='flex-grow'>
						<Slider
							defaultValue={[33]}
							min={70}
							max={120}
							step={1}
							value={[speedSpeech]}
							onValueChange={handleSpeedChange}
						/>
					</div>
					<span className='ml-2'>{speedSpeech}</span>
				</div>

				<div>
					<audio ref={audioRef} controls src={audioUrl || ""} className='w-full' />
				</div>

				{history.length > 0 && (
					<div className='mt-4'>
						<h3 className='text-sm font-medium text-gray-700 mb-2'>History</h3>
						<ul className='space-y-2'>
							{history.map((item, index) => {
								if (!isValidBase64(item.audioBase64)) {
									console.error("Invalid base64 audio data in history");
									return null;
								}
								const audioBlob = new Blob(
									[
										Uint8Array.from(atob(item.audioBase64), (c) =>
											c.charCodeAt(0)
										),
									],
									{ type: "audio/mpeg" }
								);
								const audioUrl = URL.createObjectURL(audioBlob);
								return (
									<li
										key={index}
										className='flex justify-between items-center p-2 border rounded-md'
									>
										<span className='text-sm flex-1' title={item.text}>
											{item.voiceName}: {item.text.substring(0, 30)}...
										</span>
										<div className='flex items-center gap-2'>
											<button
												onClick={() => {
													if (audioRef.current) {
														if (audioRef.current.src === audioUrl) {
															if (audioRef.current.paused) {
																audioRef.current.play();
															} else {
																audioRef.current.pause();
															}
														} else {
															audioRef.current.src = audioUrl;
															audioRef.current.play();
														}
													}
												}}
												className='px-2 py-1 bg-blue-500 text-white rounded-md'
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 24 24'
													fill='currentColor'
													className='w-6 h-6'
												>
													<path d='M15 6.75a.75.75 0 0 0-.75.75V18a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75H15ZM20.25 6.75a.75.75 0 0 0-.75.75V18c0 .414.336.75.75.75H21a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75h-.75ZM5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L5.055 7.061Z' />
												</svg>
											</button>
											<a
												href={audioUrl}
												download={`audio_${index}.mp3`}
												className='px-2 py-1 bg-green-500 text-white rounded-md'
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 24 24'
													fill='currentColor'
													className='size-6'
												>
													<path d='M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z' />
													<path
														fill-rule='evenodd'
														d='m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087ZM12 10.5a.75.75 0 0 1 .75.75v4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72v-4.94a.75.75 0 0 1 .75-.75Z'
														clip-rule='evenodd'
													/>
												</svg>
											</a>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default TTS;
