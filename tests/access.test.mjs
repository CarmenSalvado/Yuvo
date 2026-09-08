import test from "node:test";
import assert from "node:assert/strict";
import { createSession, validSession, validCode, authorize, allowAttempt, SESSION_SECONDS } from "../lib/access.mjs";
import { POST, DELETE } from "../app/api/session/route.js";

const origin = "http://localhost:3017";
process.env.ACCESS_CODE = "test-invite-code";
process.env.SESSION_SECRET = "test-secret-with-at-least-32-characters";
process.env.APP_ORIGIN = origin;
const request = (code, requestOrigin = origin) => new Request(`${origin}/api/session`, { method: "POST", headers: { origin: requestOrigin }, body: JSON.stringify({ code }) });

test("invite login rejects invalid credentials and origins, issues a bounded session, and signs out", async () => {
  assert.equal(validCode("wrong"), false);
  assert.equal((await POST(request("wrong"))).status, 401);
  assert.equal((await POST(request(process.env.ACCESS_CODE, "https://other.example"))).status, 403);
  const response = await POST(request(process.env.ACCESS_CODE));
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly; SameSite=Lax; Path=\//);
  const pair = cookie.split(";")[0];
  const token = pair.slice(pair.indexOf("=") + 1);
  assert.equal(validSession(token), true);
  assert.equal(validSession(`${token}x`), false);
  assert.equal(validSession(token, Date.now() + (SESSION_SECONDS + 1) * 1000), false);
  assert.equal(authorize(new Request(`${origin}/api/analyze`, { headers: { origin, cookie: pair } })), null);
  assert.equal(authorize(new Request(`${origin}/api/analyze`, { headers: { origin } })).status, 401);
  assert.equal(authorize(new Request(`${origin}/api/analyze`, { headers: { origin: "https://other.example", cookie: pair } })).status, 403);
  const logout = await DELETE(new Request(`${origin}/api/session`, { method: "DELETE", headers: { origin } }));
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/);
  const code = process.env.ACCESS_CODE;
  process.env.ACCESS_CODE = "rotated-invite-code";
  assert.equal(validSession(token), false);
  process.env.ACCESS_CODE = code;
});

test("missing config fails closed and repeated guesses are limited", () => {
  const secret = process.env.SESSION_SECRET;
  delete process.env.SESSION_SECRET;
  assert.equal(validCode(process.env.ACCESS_CODE), false);
  assert.throws(() => createSession());
  assert.equal(authorize(new Request(`${origin}/api/analyze`)).status, 503);
  process.env.SESSION_SECRET = secret;
  const now = Date.now() + 120_000;
  for (let i = 0; i < 30; i += 1) assert.equal(allowAttempt(now), true);
  assert.equal(allowAttempt(now), false);
  assert.equal(allowAttempt(now + 60_000), true);
});
