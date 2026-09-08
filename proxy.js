import { NextResponse } from "next/server";
import { hasSession } from "./lib/access.mjs";

export function proxy(request) {
  if (!hasSession(request)) return NextResponse.redirect(new URL("/sign-in", request.url));
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/start/:path*"] };
