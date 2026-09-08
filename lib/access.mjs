import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "yuvo_session";
export const SESSION_SECONDS = 8 * 60 * 60;
const digest = (value) => createHash("sha256").update(value).digest();
const same = (a, b) => timingSafeEqual(digest(a), digest(b));

export function accessConfigured() {
  try {
    const origin = new URL(process.env.APP_ORIGIN);
    const secureOrigin = origin.protocol === "https:" || (origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname));
    return secureOrigin && origin.origin === process.env.APP_ORIGIN && (process.env.ACCESS_CODE?.length || 0) >= 12 && (process.env.SESSION_SECRET?.length || 0) >= 32;
  } catch { return false; }
}

export function validCode(code) {
  return accessConfigured() && typeof code === "string" && code.length <= 128 && same(code.trim(), process.env.ACCESS_CODE);
}

function signature(payload) {
  return createHmac("sha256", process.env.SESSION_SECRET).update(`${payload}.${process.env.ACCESS_CODE}`).digest("base64url");
}

export function createSession(now = Date.now()) {
  if (!accessConfigured()) throw new Error("Access is not configured.");
  const payload = `${Math.floor(now / 1000) + SESSION_SECONDS}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${signature(payload)}`;
}

export function validSession(token, now = Date.now()) {
  if (!accessConfigured() || typeof token !== "string" || token.length > 256) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f0-9]{32}$/.test(parts[1])) return false;
  const expires = Number(parts[0]);
  const seconds = Math.floor(now / 1000);
  return expires > seconds && expires <= seconds + SESSION_SECONDS && same(parts[2], signature(`${parts[0]}.${parts[1]}`));
}

export function hasSession(request) {
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return validSession(cookie?.slice(SESSION_COOKIE.length + 1));
}

export function sameOrigin(request) {
  return request.headers.get("origin") === process.env.APP_ORIGIN;
}

export function authorize(request) {
  if (!accessConfigured()) return Response.json({ error: "Demo access is not configured yet." }, { status: 503 });
  if (!hasSession(request)) return Response.json({ error: "Please sign in with your access code." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  return null;
}

export function sessionCookie(token = "") {
  const secure = process.env.APP_ORIGIN?.startsWith("https://") ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${token ? SESSION_SECONDS : 0}${secure}`;
}

// ponytail: per-process limit for this demo; use a shared limiter before multiple replicas.
let attempts = 0;
let windowStart = 0;
export function allowAttempt(now = Date.now()) {
  if (now - windowStart >= 60_000) { attempts = 0; windowStart = now; }
  attempts += 1;
  return attempts <= 30;
}
