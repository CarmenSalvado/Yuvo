import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("landing motion is one-shot and reduced-motion safe", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.js", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /observer\.unobserve\(entry\.target\)/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("premise entry lives on its own route", async () => {
  const [page, startRoute] = await Promise.all([
    readFile(new URL("../app/page.js", import.meta.url), "utf8"),
    readFile(new URL("../app/start/page.js", import.meta.url), "utf8"),
  ]);

  assert.match(page, /href="\/start"/);
  assert.match(page, /pathname === "\/start"/);
  assert.match(startRoute, /from "\.\.\/page"/);
});
