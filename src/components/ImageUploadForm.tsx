import React, { useRef, useState } from "react";

interface Props {
  onProcess: (file: File, prompt: string) => void;
  isProcessing: boolean;
}

export default function ImageUploadForm({ onProcess, isProcessing }: Props) {
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (file && prompt) {
      onProcess(file, prompt);
    }
  }

  return (
    <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isProcessing}
        className="border p-2 rounded"
      />
      {preview && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded" />
      )}
      <input
        type="text"
        placeholder="Describe your new background..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        disabled={isProcessing}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={!file || !prompt || isProcessing}
        className="bg-blue-600 text-white rounded p-2 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Update Background"}
      </button>
    </form>
  );
}
