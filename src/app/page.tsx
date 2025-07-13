
"use client";
import { useState } from "react";
import ImageUploadForm from "../components/ImageUploadForm";


export default function Home() {
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleProcess(file: File, prompt: string) {
    setIsProcessing(true);
    setError(null);
    setResultUrl(null);
    setOriginalUrl(null);
    try {
      setOriginalUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", prompt);
      const res = await fetch("/api/background", {
        method: "POST",
        body: formData,
      });
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        let msg = data.error || "Failed to process image";
        if (msg.includes('rembg')) {
          msg += "\nPossible reasons: rembg model is sleeping, unavailable, or rate-limited. Try again later or use a different segmentation model.";
        } else if (msg.includes('background')) {
          msg += "\nPossible reasons: background generation model is sleeping, unavailable, or rate-limited. Try again later or use a different text-to-image model.";
        } else {
          msg += "\nIf this persists, check your Hugging Face API key, model status, or try a smaller image.";
        }
        setError(msg);
        return;
      }
      if (!res.ok) {
        setError("Failed to process image");
        return;
      }
      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-8 bg-gradient-to-br from-gray-50 to-blue-100">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700 drop-shadow">Creative Image Background Updater</h1>
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <ImageUploadForm onProcess={handleProcess} isProcessing={isProcessing} />
        {error && <div className="text-red-600 font-medium whitespace-pre-line bg-red-50 border border-red-200 rounded p-3">{error}</div>}
        {(originalUrl || resultUrl) && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-4">
            {originalUrl && (
              <div className="flex flex-col items-center">
                <span className="text-gray-500 mb-2">Original</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original" className="rounded-lg shadow-md max-w-xs max-h-80 border border-gray-200" />
              </div>
            )}
            {resultUrl && (
              <div className="flex flex-col items-center">
                <span className="text-blue-600 mb-2 font-semibold">Result</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Result" className="rounded-lg shadow-md max-w-xs max-h-80 border-2 border-blue-300" />
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="mt-10 text-gray-400 text-sm">&copy; {new Date().getFullYear()} Creative Image App</footer>
    </div>
  );
}
