import test from "node:test";
import assert from "node:assert/strict";
import { cleanIdea, normalizeSources } from "../lib/contracts.mjs";

test("trust boundaries reject short concepts and unsafe sources", () => {
  assert.throws(() => cleanIdea("too short"));
  const sources = normalizeSources([{ results: [
    { title: "Good", url: "https://example.com/a", excerpts: ["Evidence"] },
    { title: "Duplicate", url: "https://example.com/a", excerpts: ["More"] },
    { title: "Unsafe", url: "javascript:alert(1)", excerpts: ["No"] },
    { title: "Malformed", url: "http://", excerpts: ["No"] },
  ] }]);
  assert.deepEqual(sources.map(({ id, title, url }) => ({ id, title, url })), [
    { id: 1, title: "Good", url: "https://example.com/a" },
  ]);
});
