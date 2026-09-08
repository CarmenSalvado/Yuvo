// ponytail: short clips travel inline; use direct storage uploads for larger cuts.
export const MAX_CLIP_BYTES = 2_000_000;
export const MAX_CLIP_SECONDS = 60;
export const VIDEO_TYPES = ["video/mp4", "video/webm"];

export function videoContext(report) {
  return {
    prepared: report.demo === true,
    overview: report.overview,
    frictions: report.frictions?.map(({ signal, detail }) => ({ signal, detail })),
    openings: report.whitespace?.map(({ title, opportunity, move }) => ({ title, opportunity, move })),
  };
}

export const videoSchema = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    comparison: { type: "STRING" },
    moments: { type: "ARRAY", minItems: 1, maxItems: 4, items: {
      type: "OBJECT",
      properties: { seconds: { type: "NUMBER" }, observation: { type: "STRING" }, suggestion: { type: "STRING" } },
      required: ["seconds", "observation", "suggestion"],
    } },
    nextMove: { type: "STRING" },
  },
  required: ["summary", "comparison", "moments", "nextMove"],
};

export function normalizeVideo(value, duration, comparing) {
  const text = (input) => {
    if (typeof input !== "string" || !input.trim() || input.length > 2000) throw new Error("Gemini returned incomplete video feedback. Try again.");
    return input.trim();
  };
  if (!Array.isArray(value?.moments) || value.moments.length < 1 || value.moments.length > 4) throw new Error("Gemini returned no usable video moments. Try again.");
  return {
    summary: text(value.summary),
    comparison: comparing ? text(value.comparison) : "",
    moments: value.moments.map((moment) => {
      if (!moment || !Number.isFinite(moment.seconds) || moment.seconds < 0 || moment.seconds >= duration) throw new Error("Gemini returned a timestamp outside this cut. Try again.");
      return { seconds: moment.seconds, observation: text(moment.observation), suggestion: text(moment.suggestion) };
    }).sort((a, b) => a.seconds - b.seconds),
    nextMove: text(value.nextMove),
  };
}
