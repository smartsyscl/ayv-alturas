import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: (() => {
      const fd = new FormData();
      fd.append("file", dataUrl);
      fd.append("upload_preset", uploadPreset!);
      return fd;
    })(),
  });

  const cloudinaryRes = await res.json();
  if (cloudinaryRes.secure_url) {
    return NextResponse.json({ url: cloudinaryRes.secure_url });
  } else {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}