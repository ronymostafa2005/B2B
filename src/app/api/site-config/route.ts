import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/config-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = getSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to load site config:", error);
    return NextResponse.json({ error: "Failed to load site configuration" }, { status: 500 });
  }
}
