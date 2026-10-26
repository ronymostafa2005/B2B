import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateCredentials, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!validateCredentials(email, password)) {
      return NextResponse.json(
        { success: false, error: "Incorrect sign-in details. Please check the client email and password." },
        { status: 401 }
      );
    }

    const token = createSessionToken(email);

    // Set cookie using next/headers cookies() for maximum compatibility with Server Components
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // Keep false on localhost so browser attaches it on HTTP
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    const response = NextResponse.json({
      success: true,
      token,
      email: email.trim().toLowerCase(),
      message: "Signed in successfully",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: "An error occurred while signing in" }, { status: 500 });
  }
}
