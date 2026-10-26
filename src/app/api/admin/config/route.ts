import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getSiteConfig, saveSiteConfig } from "@/lib/config-storage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول كعميل أولاً." }, { status: 401 });
  }

  const config = getSiteConfig();
  return NextResponse.json(config);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول كعميل أولاً." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = saveSiteConfig(body);
    return NextResponse.json({ success: true, config: updated, message: "تم حفظ التعديلات بنجاح" });
  } catch (error) {
    console.error("Failed to save config:", error);
    return NextResponse.json({ error: "فشل حفظ التعديلات" }, { status: 500 });
  }
}
