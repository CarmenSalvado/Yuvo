import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import blobs from "blobs/v2/index.js";

const shapes = [
  { name: "spark", seed: "yuvo-spark", fill: "#ffda45", extraPoints: 2 },
  { name: "coral", seed: "yuvo-coral", fill: "#ff927b", extraPoints: 3 },
  { name: "blue", seed: "yuvo-blue", fill: "#8bcff5", extraPoints: 1 },
];
const face = '<g fill="none" stroke="#252b38" stroke-width="5" stroke-linecap="round"><path d="M104 117v3m40-3v3M110 142q18 18 36 0"/></g>';
const wrap = (content, width = 256, height = 256) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${content}</svg>\n`;
const figures = shapes.map(({ name, seed, fill, extraPoints }) => {
  const path = blobs.svgPath({ seed, extraPoints, randomness: 2, size: 256 });
  assert(!/NaN|Infinity/.test(path) && path.startsWith("M"));
  const body = `<path d="${path}" fill="${fill}"/>`;
  writeFileSync(new URL(`../public/art/yuvo-${name}.svg`, import.meta.url), wrap(body + face));
  if (name === "spark") writeFileSync(new URL("../public/art/yuvo-pebble.svg", import.meta.url), wrap(body));
  return body + face;
});
writeFileSync(new URL("../public/art/yuvo-friends.svg", import.meta.url), wrap(
  `<g transform="translate(8 30) rotate(-8 128 128)">${figures[0]}</g><g transform="translate(220 70) scale(.8) rotate(8 128 128)">${figures[1]}</g><g transform="translate(385 115) scale(.6)">${figures[2]}</g>`, 560, 320,
));
