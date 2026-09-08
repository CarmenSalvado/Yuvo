import test from "node:test";
import assert from "node:assert/strict";
import { createSession } from "../lib/access.mjs";
import { MAX_CLIP_BYTES, normalizeVideo, videoContext } from "../lib/video.mjs";
import { DEMO_REPORT } from "../lib/demo-report.mjs";
import { POST } from "../app/api/video/route.js";
import { generateJson } from "../lib/gemini.mjs";

test("video review sends actual clips and context, compares cuts, and rejects invalid input and provider output", async () => {
  const keys = ["ACCESS_CODE", "SESSION_SECRET", "APP_ORIGIN", "GEMINI_API_KEY"];
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const originalFetch = global.fetch;
  Object.assign(process.env, { ACCESS_CODE: "test-invite-code", SESSION_SECRET: "test-secret-with-at-least-32-characters", APP_ORIGIN: "http://localhost", GEMINI_API_KEY: "test-key" });
  const headers = { origin: "http://localhost", cookie: `yuvo_session=${createSession()}` };
  const bytes = Buffer.from([0, 0, 0, 24, ...Buffer.from("ftypisom"), 0, 0, 0, 1]);
  const clip = new File([bytes], "cut.mp4", { type: "video/mp4" });
  const feedback = { summary: "A building entrance is visible.", comparison: "The second cut starts closer to the doorway.", moments: [{ seconds: 2, observation: "A doorway fills the frame.", suggestion: "Hold before the cut." }], nextMove: "Give the doorway a beat." };
  let captured;
  global.fetch = async (_url, options) => {
    captured = JSON.parse(options.body);
    return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(feedback) }] } }] });
  };
  const form = (video = clip, previous) => {
    const data = new FormData();
    data.set("video", video);
    if (previous) data.set("previous", previous);
    data.set("duration", "10");
    data.set("idea", DEMO_REPORT.idea);
    data.set("context", JSON.stringify(videoContext(DEMO_REPORT)));
    return data;
  };
  const request = (body, overrides = headers) => new Request("http://localhost/api/video", { method: "POST", headers: overrides, body });
  try {
    assert.equal((await POST(request(form(), {}))).status, 401);
    assert.equal((await POST(request(form(), { ...headers, origin: "https://other.test" }))).status, 403);
    const first = await POST(request(form()));
    assert.equal(first.status, 200);
    assert.equal((await first.json()).comparison, "");
    let parts = captured.contents[0].parts;
    assert.equal(parts.filter((p) => p.inlineData).length, 1);
    assert.equal(parts[2].inlineData.data, bytes.toString("base64"));
    assert.equal(parts[2].inlineData.mimeType, "video/mp4");
    assert.equal(captured.generationConfig.temperature, undefined);
    assert.equal(captured.generationConfig.thinkingConfig.thinkingLevel, "LOW");
    await assert.rejects(generateJson("Cancelled request", {}, { signal: AbortSignal.abort(new DOMException("Timed out", "TimeoutError")) }), { name: "TimeoutError" });
    assert.ok(parts[0].text.includes(DEMO_REPORT.idea));
    assert.ok(parts[0].text.includes('"prepared":true'));
    assert.ok(parts[0].text.includes("VISUAL-ONLY review"));
    const next = new File([bytes, "different frames"], "next.mp4", { type: "video/mp4" });
    const comparison = await POST(request(form(next, clip)));
    assert.equal(comparison.status, 200);
    assert.equal((await comparison.json()).comparison, feedback.comparison);
    parts = captured.contents[0].parts;
    assert.equal(parts[1].text, "PREVIOUS CUT");
    assert.equal(parts[3].text, "CURRENT CUT");
    assert.equal(parts[2].inlineData.data, bytes.toString("base64"));
    assert.notEqual(parts[4].inlineData.data, parts[2].inlineData.data);
    assert.equal((await POST(request(form(clip, clip)))).status, 400);
    assert.equal((await POST(request(form(new File(["fake"], "bad.mp4", { type: "video/mp4" }))))).status, 400);
    assert.equal((await POST(request(form(new File([new Uint8Array(MAX_CLIP_BYTES + 1)], "large.mp4", { type: "video/mp4" }))))).status, 413);
    const invalidTime = form(); invalidTime.set("duration", "61");
    assert.equal((await POST(request(invalidTime))).status, 400);
    const oversizedBody = new Blob([new Uint8Array(MAX_CLIP_BYTES * 2 + 50_001)]);
    assert.equal((await POST(request(oversizedBody, { ...headers, "content-type": "multipart/form-data; boundary=test" }))).status, 413);
    assert.throws(() => normalizeVideo({ ...feedback, moments: [{ ...feedback.moments[0], seconds: 10 }] }, 10, true), /timestamp/);
    assert.throws(() => normalizeVideo({ ...feedback, moments: [] }, 10, true), /moments/);
    assert.throws(() => normalizeVideo({ ...feedback, comparison: "" }, 10, true), /incomplete/);
    global.fetch = async () => Response.json({ error: { message: "private provider details" } }, { status: 500 });
    const failed = await POST(request(form()));
    assert.equal(failed.status, 502);
    assert.ok(!(await failed.text()).includes("private provider details"));
  } finally {
    global.fetch = originalFetch;
    for (const [key, value] of Object.entries(original)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});
