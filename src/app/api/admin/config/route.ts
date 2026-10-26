import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getSiteConfig, saveSiteConfig } from "@/lib/config-storage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  const config = await getSiteConfig();
  return NextResponse.json(config);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await saveSiteConfig(body);
    return NextResponse.json({ success: true, config: updated, message: "Changes saved successfully" });
  } catch (error) {
    console.error("Failed to save config:", error);
    const msg = error instanceof Error ? error.message : "Failed to save changes";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
