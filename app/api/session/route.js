import { accessConfigured, allowAttempt, createSession, sameOrigin, sessionCookie, validCode } from "../../../lib/access.mjs";

export async function POST(request) {
  if (!accessConfigured()) return Response.json({ error: "Demo access is not configured yet." }, { status: 503 });
  if (!sameOrigin(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  if (!allowAttempt()) return Response.json({ error: "Too many attempts. Try again in a minute." }, { status: 429, headers: { "Retry-After": "60" } });
  try {
    const body = await request.text();
    if (body.length > 1024 || !validCode(JSON.parse(body).code)) return Response.json({ error: "That code doesn't match. Try again." }, { status: 401 });
    return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(createSession()), "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Enter a valid access code." }, { status: 400 });
  }
}

export async function DELETE(request) {
  if (!sameOrigin(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(), "Cache-Control": "no-store" } });
}
