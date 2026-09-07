import test from "node:test";
import assert from "node:assert/strict";

const source = (id) => ({ title: `Source ${id}`, url: `https://example.com/${id}`, excerpts: [`Evidence ${id}`] });
const cited = { sourceIds: [1] };

function geminiResponse(value) {
  return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(value) }] } }] });
}

test("analysis and Audience Room complete the grounded happy path", async () => {
  const originalFetch = global.fetch;
  const originalParallel = process.env.PARALLEL_API_KEY;
  const originalGemini = process.env.GEMINI_API_KEY;
  process.env.PARALLEL_API_KEY = "test-parallel";
  process.env.GEMINI_API_KEY = "test-gemini";
  const calls = [];

  global.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes("api.parallel.ai")) {
      const index = calls.filter((call) => call.url.includes("api.parallel.ai")).length;
      return Response.json({ results: [1, 2, 3].map((item) => source(`${index}-${item}`)) });
    }
    const prompt = JSON.parse(options.body).contents[0].parts[0].text;
    if (prompt.includes("planning stage")) return geminiResponse({
      landscapeQueries: ["supernatural cozy mysteries", "sentient building fiction", "place memory stories"],
      frictionQueries: ["cozy mystery complaints", "supernatural rules criticism", "mystery payoff reviews"],
    });
    if (prompt.includes("rigorous creative intelligence")) return geminiResponse({
      overview: "A compact grounded synthesis.",
      clusters: [1, 2, 3].map((n) => ({ name: `Cluster ${n}`, summary: "Nearby territory.", relevance: n === 1 ? "closest" : "nearby", ...cited })),
      saturated: [1, 2, 3].map((n) => ({ pattern: `Pattern ${n}`, why: "It recurs in surfaced evidence.", ...cited })),
      frictions: [1, 2, 3].map((n) => ({ signal: `Friction ${n}`, detail: "A recurring qualitative complaint.", ...cited })),
      whitespace: [1, 2].map((n) => ({ title: `Opportunity ${n}`, familiar: "Mystery", crowded: "Convenient powers", friction: "Weak payoff", opportunity: "Use a strict clue rule.", why: "It answers the cited friction.", move: "Write the rule into episode one.", ...cited })),
    });
    if (prompt.includes("synthetic perspectives")) return geminiResponse({
      consensus: "The revision strengthens the researched mechanic.",
      perspectives: ["Genre Fan", "Casual Viewer", "Story Nerd"].map((role) => ({ role, verdict: "Sharper than the first pass.", critique: "The change answers a surfaced weakness.", comparison: "The new rule is explicit.", nextMove: "Test it in the first clue." })),
    });
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const { POST: analyze } = await import("../app/api/analyze/route.js");
    const idea = "A young detective can hear incomplete memories held by abandoned buildings.";
    const response = await analyze(new Request("http://localhost/api/analyze", { method: "POST", body: JSON.stringify({ idea }) }));
    const events = (await response.text()).trim().split("\n").map(JSON.parse);
    const done = events.find((event) => event.type === "done");
    assert.equal(response.status, 200);
    assert.equal(calls.filter((call) => call.url === "https://api.parallel.ai/v1/search").length, 2);
    assert.equal(done.report.queries.length, 6);
    assert.equal(done.report.sources.length, 6);
    assert.equal(done.report.whitespace.length, 2);

    const { POST: audience } = await import("../app/api/audience/route.js");
    const audienceResponse = await audience(new Request("http://localhost/api/audience", { method: "POST", body: JSON.stringify({
      previousIdea: idea,
      currentIdea: `${idea} Their memories follow three strict physical rules.`,
      report: done.report,
    }) }));
    const room = await audienceResponse.json();
    assert.equal(audienceResponse.status, 200);
    assert.deepEqual(room.perspectives.map((item) => item.role), ["Genre Fan", "Casual Viewer", "Story Nerd"]);
  } finally {
    global.fetch = originalFetch;
    if (originalParallel === undefined) delete process.env.PARALLEL_API_KEY; else process.env.PARALLEL_API_KEY = originalParallel;
    if (originalGemini === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = originalGemini;
  }
});
