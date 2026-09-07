const RELEVANCE = new Set(["closest", "nearby", "adjacent"]);

export function cleanIdea(value) {
  if (typeof value !== "string") throw new Error("Your concept must be text.");
  const idea = value.trim();
  if (idea.length < 30) throw new Error("Give us at least 30 characters to research.");
  if (idea.length > 3000) throw new Error("Keep the concept under 3,000 characters.");
  return idea;
}

export function normalizePlan(value) {
  const landscape = cleanQueries(value?.landscapeQueries);
  const friction = cleanQueries(value?.frictionQueries);
  if (landscape.length < 2 || friction.length < 2) throw new Error("Gemini returned an incomplete research plan.");
  return { landscapeQueries: landscape.slice(0, 3), frictionQueries: friction.slice(0, 3) };
}

export function normalizeFollowUp(value) {
  const queries = cleanQueries(value?.queries);
  if (queries.length < 2) throw new Error("Gemini returned an incomplete follow-up plan.");
  return queries.slice(0, 2);
}

function cleanQueries(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === "string").map((item) => item.trim().slice(0, 200)).filter(Boolean))];
}

export function normalizeSources(responses) {
  const byUrl = new Map();
  for (const response of responses) {
    for (const result of response?.results || []) {
      if (typeof result?.url !== "string" || !/^https?:\/\//.test(result.url)) continue;
      let parsed;
      try { parsed = new URL(result.url); } catch { continue; }
      if (!['http:', 'https:'].includes(parsed.protocol)) continue;
      const excerpts = Array.isArray(result.excerpts)
        ? result.excerpts.filter((item) => typeof item === "string" && item.trim()).slice(0, 3)
        : [];
      if (!excerpts.length || byUrl.has(parsed.href)) continue;
      byUrl.set(parsed.href, {
        id: byUrl.size + 1,
        title: typeof result.title === "string" && result.title.trim() ? result.title.trim() : parsed.hostname,
        url: parsed.href,
        excerpts,
        publishDate: result.publish_date || null,
      });
    }
  }
  return [...byUrl.values()].slice(0, 16);
}

export function normalizeReport(value, sources) {
  if (!value || typeof value !== "object") throw new Error("Gemini returned an invalid report.");
  const sourceIds = new Set(sources.map((source) => source.id));
  const refs = (ids) => Array.isArray(ids) ? [...new Set(ids.filter((id) => sourceIds.has(Number(id))).map(Number))].slice(0, 4) : [];
  const text = (input, fallback = "") => typeof input === "string" && input.trim() ? input.trim() : fallback;
  const items = (input, mapper, min = 1) => {
    const output = Array.isArray(input) ? input.map(mapper).filter(Boolean) : [];
    if (output.length < min) throw new Error("Gemini returned an incomplete report.");
    return output;
  };

  return {
    overview: text(value.overview, "The research surfaced several nearby creative territories."),
    clusters: items(value.clusters, (item) => item && text(item.name) ? ({
      name: text(item.name),
      summary: text(item.summary),
      relevance: RELEVANCE.has(item.relevance) ? item.relevance : "nearby",
      sourceIds: refs(item.sourceIds),
    }) : null, 3).slice(0, 6),
    saturated: items(value.saturated, (item) => item && text(item.pattern) ? ({
      pattern: text(item.pattern),
      why: text(item.why),
      sourceIds: refs(item.sourceIds),
    }) : null, 3).slice(0, 6),
    frictions: items(value.frictions, (item) => item && text(item.signal) ? ({
      signal: text(item.signal),
      detail: text(item.detail),
      sourceIds: refs(item.sourceIds),
    }) : null, 3).slice(0, 6),
    whitespace: items(value.whitespace, (item) => item && text(item.title) ? ({
      title: text(item.title),
      familiar: text(item.familiar),
      crowded: text(item.crowded),
      friction: text(item.friction),
      opportunity: text(item.opportunity),
      why: text(item.why),
      move: text(item.move),
      sourceIds: refs(item.sourceIds),
    }) : null, 2).slice(0, 4),
    sources,
  };
}

export function normalizeAudience(value) {
  const labels = ["Genre Fan", "Casual Viewer", "Story Nerd"];
  if (!Array.isArray(value?.perspectives)) throw new Error("Gemini returned invalid audience feedback.");
  const perspectives = labels.map((label) => {
    const match = value.perspectives.find((item) => item?.role === label);
    if (!match || [match.verdict, match.critique, match.comparison, match.nextMove].some((field) => typeof field !== "string" || !field.trim())) {
      throw new Error("Gemini returned incomplete audience feedback.");
    }
    return {
      role: label,
      verdict: match.verdict.trim(),
      critique: match.critique.trim(),
      comparison: match.comparison.trim(),
      nextMove: match.nextMove.trim(),
    };
  });
  return { consensus: typeof value.consensus === "string" ? value.consensus.trim() : "", perspectives };
}
