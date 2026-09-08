import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

test("demo typing has pauses, a correction and repeatable forward/reverse seeking", async () => {
  const context = vm.createContext({});
  vm.runInContext(await readFile(new URL("../videos/landing-demo/assets/typing.js", import.meta.url), "utf8"), context);
  const states = context.buildTypingSequence();
  assert.equal(JSON.stringify(states), JSON.stringify(context.buildTypingSequence()));
  assert.ok(states.at(-1).t < 9.5, "Leave time to read before clicking Research");
  assert.equal(states.at(-1).text, "A woman can speak to abandoned buildings. Their memories are incomplete.");
  const gaps = states.slice(2).map((state, index) => state.t - states[index + 1].t);
  assert.ok(Math.max(...gaps) > .4 && Math.min(...gaps) < .08);
  assert.ok(states.some((state, index) => index > 0 && state.text.length < states[index - 1].text.length));
  const before = JSON.stringify(context.typingAt(states, 3));
  assert.equal(context.typingAt(states, 25).text, states.at(-1).text);
  assert.equal(context.typingAt(states, 51).text, "");
  assert.equal(JSON.stringify(context.typingAt(states, 3)), before);
  assert.equal(context.typingAt(states, 0).caret, false);
  assert.equal(context.typingAt(states, 25).caret, false);
});
