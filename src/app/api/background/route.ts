

import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const Jimp = (await import("jimp")).default;
  const REMBG_MODEL_ID = "dandansai/rembg";
  const BG_MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"; // text-to-image
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const prompt = formData.get("prompt") as string;

  if (!file || !prompt) {
    return NextResponse.json({ error: "Missing file or prompt" }, { status: 400 });
  }

  // Step 1: Remove background (extract person) using local rembg
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);
  // Update this path to your actual rembg.exe location if needed
  const rembgPath = "C:\\Users\\rjros\\AppData\\Roaming\\Python\\Python313\\Scripts\\rembg.exe";
  const rembg = spawn(rembgPath, ["i", "-", "-"]);

  // Pipe input image to rembg stdin
  rembg.stdin.write(inputBuffer);
  rembg.stdin.end();

  // Collect output from rembg stdout
  const outputChunks: Buffer[] = [];
  for await (const chunk of rembg.stdout) {
    outputChunks.push(chunk as Buffer);
  }
  const rembgOutput = Buffer.concat(outputChunks);

  // Check for errors
  let rembgError = "";
  for await (const chunk of rembg.stderr) {
    rembgError += chunk.toString();
  }
  const exitCode: number = await new Promise((resolve) => rembg.on("close", resolve));
  if (exitCode !== 0 || !rembgOutput.length) {
    console.error("rembg error:", rembgError);
    return NextResponse.json({ error: "rembg: " + rembgError }, { status: 500 });
  }

  // rembg returns a PNG with transparent background
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
  const aspect = personJimp.bitmap.width / personJimp.bitmap.height;
  const newWidth = Math.round(pw);
  personJimp.resize(newWidth, Jimp.AUTO);
  const newHeight = personJimp.bitmap.height;
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
