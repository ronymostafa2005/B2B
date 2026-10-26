import crypto from "crypto";

export const CLIENT_CREDENTIALS = {
  email: "bbagency36@gmail.com",
  password: "Mm12Go@#$",
};

const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || "b2b_agency_ultra_secure_secret_2026_key_9938";
export const AUTH_COOKIE_NAME = "b2b_client_session";

export interface SessionData {
  email: string;
  iat: number;
  exp: number;
}

export function validateCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;
  return (
    email.trim().toLowerCase() === CLIENT_CREDENTIALS.email.toLowerCase() &&
    password === CLIENT_CREDENTIALS.password
  );
}

export function createSessionToken(email: string): string {
  const payload: SessionData = {
    email: email.trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionData | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  if (signature !== expectedSig) return null;

  try {
    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload: SessionData = JSON.parse(payloadJson);

    if (Date.now() > payload.exp) return null;
    if (payload.email !== CLIENT_CREDENTIALS.email.toLowerCase()) return null;

    return payload;
  } catch {
    return null;
  }
}
