

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const Jimp = (await import("jimp")).default;
  const BG_MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"; // text-to-image
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const prompt = formData.get("prompt") as string;

  if (!file || !prompt) {
    return NextResponse.json({ error: "Missing file or prompt" }, { status: 400 });
  }

  // Step 1: Remove background using Hugging Face API
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);
  
  // Use Hugging Face's background removal model
  const rembgRes = await fetch("https://api-inference.huggingface.co/models/briaai/RMBG-1.4", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/octet-stream"
    },
    body: inputBuffer
  });

  if (!rembgRes.ok) {
    const error = await rembgRes.text();
    console.error("Background removal error:", error);
    return NextResponse.json({ error: "Background removal failed: " + error }, { status: rembgRes.status });
  }

  const rembgOutput = Buffer.from(await rembgRes.arrayBuffer());
  const personBase64 = rembgOutput.toString("base64");

  // Step 2: Generate new background from prompt
  const bgPayload = {
    inputs: prompt,
    options: { wait_for_model: true }
  };
  const bgRes = await fetch(`https://api-inference.huggingface.co/models/${BG_MODEL_ID}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bgPayload)
    }
  );
  const bgContentType = bgRes.headers.get("content-type") || "";
  if (!bgRes.ok || bgContentType.includes("text/html")) {
    const error = await bgRes.text();
    console.error("background error:", error);
    return NextResponse.json({ error: "background: " + error }, { status: bgRes.status });
  }
  // bgRes returns an image (arraybuffer)
  const bgBuffer = Buffer.from(await bgRes.arrayBuffer());

  // Step 3: Composite person onto background using Jimp
  const [bgJimp, personJimp] = await Promise.all([
    Jimp.read(bgBuffer),
    Jimp.read(Buffer.from(personBase64, "base64"))
  ]);
  // Resize person to fit background (preserve aspect ratio)
  const scale = Math.min(bgJimp.bitmap.width / personJimp.bitmap.width, bgJimp.bitmap.height / personJimp.bitmap.height);
  const pw = personJimp.bitmap.width * scale;
  const ph = personJimp.bitmap.height * scale;
  const px = (bgJimp.bitmap.width - pw) / 2;
  const py = (bgJimp.bitmap.height - ph) / 2;
  // Always resize by width, calculate height to preserve aspect ratio
  const newWidth = Math.round(pw);
  personJimp.resize(newWidth, Jimp.AUTO);
  bgJimp.composite(personJimp, px, py);
  // Jimp getBuffer as Promise
  const outBuffer = await new Promise<Buffer>((resolve, reject) => {
    bgJimp.getBuffer('image/png', (err: Error | null, buf: Buffer | undefined) => {
      if (err || !buf) reject(err);
      else resolve(buf);
    });
  });
  return new NextResponse(outBuffer, {
    headers: { "Content-Type": "image/png" }
  });
}
