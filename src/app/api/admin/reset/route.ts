import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { resetSiteConfig } from "@/lib/config-storage";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول." }, { status: 401 });
  }

  try {
    const config = resetSiteConfig();
    return NextResponse.json({ success: true, config, message: "تمت استعادة الإعدادات الافتراضية بنجاح" });
  } catch (error) {
    console.error("Failed to reset config:", error);
    return NextResponse.json({ error: "فشل استعادة الإعدادات الافتراضية" }, { status: 500 });
  }
}
