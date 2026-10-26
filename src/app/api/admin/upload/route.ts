import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { put } from "@vercel/blob";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED_EXT = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".mp4", ".mov", ".webm"];

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file selected" }, { status: 400 });
    }

    const originalName = file.name || "upload.png";
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type (${ext}). Supported: png, jpg, jpeg, webp, svg, gif, mp4, mov, webm` },
        { status: 400 }
      );
    }

    const cleanBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const fileName = `uploads/${cleanBase}_${Date.now()}${ext}`;

    // Use Vercel Blob if available, otherwise fall back to base64 data URL
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(fileName, file, { access: "public" });
      return NextResponse.json({
        success: true,
        url: blob.url,
        fileName: blob.pathname,
        size: file.size,
        message: "File uploaded successfully",
      });
    }

    // Fallback: return base64 data URL (works everywhere, no storage needed)
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName,
      size: file.size,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "An error occurred while uploading the file" }, { status: 500 });
  }
}
