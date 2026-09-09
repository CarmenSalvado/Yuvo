export const planSchema = {
  type: "OBJECT",
  properties: {
    landscapeQueries: { type: "ARRAY", items: { type: "STRING" }, minItems: 3, maxItems: 3 },
    frictionQueries: { type: "ARRAY", items: { type: "STRING" }, minItems: 3, maxItems: 3 },
  },
  required: ["landscapeQueries", "frictionQueries"],
};

export function planPrompt(idea) {
  return `You are the planning stage of a research agent for filmmakers. Decompose this concept into exactly six web searches: three for comparable works, themes, tropes and creative clusters; three for reviews, criticism, community complaints and unmet audience expectations. Queries must each be concise (3-6 words), meaningfully different, and contain concrete searchable terms. Do not judge originality.\n\nCONCEPT:\n${idea}`;
}

export const followUpSchema = {
  type: "OBJECT",
  properties: { queries: { type: "ARRAY", items: { type: "STRING" }, minItems: 2, maxItems: 2 } },
  required: ["queries"],
};

export function followUpPrompt(idea, sources) {
  return `A web search for this story concept returned weak coverage. Create exactly two new 3-6 word queries that fill the biggest missing evidence gaps without repeating the earlier angles. Prefer criticism, reviews, or a concrete adjacent storytelling mechanic.\n\nCONCEPT:\n${idea}\n\nSOURCES SO FAR:\n${sources.map((source) => source.title).join("; ")}`;
}

const citedItem = {
  type: "OBJECT",
  properties: { sourceIds: { type: "ARRAY", items: { type: "INTEGER" } } },
};

export const reportSchema = {
  type: "OBJECT",
  properties: {
    overview: { type: "STRING" },
    clusters: { type: "ARRAY", minItems: 3, maxItems: 6, items: { ...citedItem, properties: {
      name: { type: "STRING" }, summary: { type: "STRING" }, relevance: { type: "STRING", enum: ["closest", "nearby", "adjacent"] }, sourceIds: citedItem.properties.sourceIds,
    }, required: ["name", "summary", "relevance", "sourceIds"] } },
    saturated: { type: "ARRAY", minItems: 3, maxItems: 6, items: { ...citedItem, properties: {
      pattern: { type: "STRING" }, why: { type: "STRING" }, sourceIds: citedItem.properties.sourceIds,
    }, required: ["pattern", "why", "sourceIds"] } },
    frictions: { type: "ARRAY", minItems: 3, maxItems: 6, items: { ...citedItem, properties: {
      signal: { type: "STRING" }, detail: { type: "STRING" }, sourceIds: citedItem.properties.sourceIds,
    }, required: ["signal", "detail", "sourceIds"] } },
    whitespace: { type: "ARRAY", minItems: 2, maxItems: 4, items: { ...citedItem, properties: {
      title: { type: "STRING" }, familiar: { type: "STRING" }, crowded: { type: "STRING" }, friction: { type: "STRING" }, opportunity: { type: "STRING" }, why: { type: "STRING" }, move: { type: "STRING" }, sourceIds: citedItem.properties.sourceIds,
    }, required: ["title", "familiar", "crowded", "friction", "opportunity", "why", "move", "sourceIds"] } },
  },
  required: ["overview", "clusters", "saturated", "frictions", "whitespace"],
};

export function reportPrompt(idea, sources, partial) {
  const evidence = sources.map((source) => `[${source.id}] ${source.title}\n${source.url}\n${source.excerpts.join("\n")}`).join("\n\n");
  return `You are a rigorous creative intelligence analyst. Synthesize the supplied web evidence around a story concept for an independent filmmaker. Identify creative clusters, recurring/common territory, audience or critic friction, then derive specific creative whitespace. Whitespace must follow logically from both nearby patterns and friction, not be random idea generation. Be concise, candid, constructive, and editorial in tone. Use everyday language a filmmaker can act on immediately: no academic jargon or abstract category names. Keep each opening title to 3–7 plain words, each opportunity to two short sentences, and each next move to one concrete action.

Rules:
- Never claim originality, exhaustive internet coverage, statistical certainty, or that an idea has never existed.
- Say "research suggests", "sources surfaced", or "recurring signal" where appropriate.
- Treat reviews and discussions as qualitative signals, not representative data.
- Cite only the bracketed numeric source IDs supplied. Every substantive item should cite at least one relevant source when evidence allows.
- Do not introduce named works or audience claims absent from the evidence.
- ${partial ? "Only part of the planned research succeeded. Explicitly keep claims narrow and evidence-calibrated." : "Cross-check themes across the supplied evidence."}

CONCEPT:
${idea}

WEB EVIDENCE:
${evidence}`;
}

export const audienceSchema = {
  type: "OBJECT",
  properties: {
    consensus: { type: "STRING" },
    perspectives: { type: "ARRAY", minItems: 3, maxItems: 3, items: { type: "OBJECT", properties: {
      role: { type: "STRING", enum: ["Genre Fan", "Casual Viewer", "Story Nerd"] },
      verdict: { type: "STRING" }, critique: { type: "STRING" }, comparison: { type: "STRING" }, nextMove: { type: "STRING" },
    }, required: ["role", "verdict", "critique", "comparison", "nextMove"] } },
  },
  required: ["consensus", "perspectives"],
};

export function audiencePrompt(previousIdea, currentIdea, report) {
  const context = JSON.stringify({ overview: report.overview, saturated: report.saturated, frictions: report.frictions, whitespace: report.whitespace });
  return `Create exactly three concise synthetic perspectives on a revised story concept: Genre Fan, Casual Viewer, and Story Nerd. These are critical lenses, not predictions of real behavior. Each must explicitly compare the current iteration with the previous idea and connect its critique to the researched saturated territory, audience friction, or whitespace. Avoid generic praise. The nextMove must be one specific revision action.

PREVIOUS IDEA:\n${previousIdea}\n\nCURRENT ITERATION:\n${currentIdea}\n\nRESEARCH CONTEXT:\n${context}`;
}
