import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { resetSiteConfig } from "@/lib/config-storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const config = await resetSiteConfig();
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, config, message: "Settings restored to defaults successfully" });
  } catch (error) {
    console.error("Failed to reset config:", error);
    return NextResponse.json({ error: "Failed to restore default settings" }, { status: 500 });
  }
}
