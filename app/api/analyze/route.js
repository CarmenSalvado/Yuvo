import { cleanIdea, normalizeFollowUp, normalizePlan, normalizeReport, normalizeSources } from "../../../lib/contracts.mjs";
import { generateJson } from "../../../lib/gemini.mjs";
import { parallelSearch } from "../../../lib/parallel.mjs";
import { followUpPrompt, followUpSchema, planPrompt, planSchema, reportPrompt, reportSchema } from "../../../lib/prompts.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  if (!process.env.PARALLEL_API_KEY || !process.env.GEMINI_API_KEY) {
    return Response.json({ error: "Live research needs PARALLEL_API_KEY and GEMINI_API_KEY on the server." }, { status: 503 });
  }

  let idea;
  try {
    idea = cleanIdea((await request.json()).idea);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        emit({ type: "status", step: 0, label: "Understanding your concept" });
        const plan = normalizePlan(await generateJson(planPrompt(idea), planSchema));
        emit({ type: "plan", queries: [...plan.landscapeQueries, ...plan.frictionQueries] });
        emit({ type: "status", step: 1, label: "Mapping nearby creative territory" });

        const sessionId = `storyfield_${crypto.randomUUID()}`;
        const searches = await Promise.allSettled([
          parallelSearch({
            objective: `Find works, tropes, themes, mechanics, and critical discussion closely surrounding this creative concept: ${idea}`,
            searchQueries: plan.landscapeQueries,
            sessionId,
          }),
          parallelSearch({
            objective: `Find recurring criticism, complaints, disappointments, and unmet audience expectations around creative territory adjacent to: ${idea}`,
            searchQueries: plan.frictionQueries,
            sessionId,
          }),
        ]);
        emit({ type: "status", step: 2, label: "Researching audience reactions" });

        const successful = searches.filter((result) => result.status === "fulfilled").map((result) => result.value);
        const partial = successful.length < searches.length;
        let sources = normalizeSources(successful);
        if (!sources.length) throw new Error("Parallel returned no usable sources, so no analysis was generated.");
        let allQueries = [...plan.landscapeQueries, ...plan.frictionQueries];
        if (sources.length < 5) {
          try {
            const followUpQueries = normalizeFollowUp(await generateJson(followUpPrompt(idea, sources), followUpSchema));
            emit({ type: "plan", queries: [...allQueries, ...followUpQueries] });
            const followUp = await parallelSearch({
              objective: `Fill weak evidence gaps around adjacent works and recurring criticism for this creative concept: ${idea}`,
              searchQueries: followUpQueries,
              sessionId,
            });
            successful.push(followUp);
            sources = normalizeSources(successful);
            allQueries = [...allQueries, ...followUpQueries];
          } catch { /* weak follow-up evidence must not discard usable primary research */ }
        }
        emit({ type: "evidence", count: sources.length, partial });
        emit({ type: "status", step: 3, label: "Finding repeated friction" });
        const rawReport = await generateJson(reportPrompt(idea, sources, partial), reportSchema);
        emit({ type: "status", step: 4, label: "Identifying potential whitespace" });
        const report = normalizeReport(rawReport, sources);
        emit({ type: "done", report: { ...report, idea, partial, researchedAt: new Date().toISOString(), queries: allQueries } });
      } catch (error) {
        emit({ type: "error", message: error.name === "TimeoutError" ? "Research timed out. Please try again." : error.message || "Research failed." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" } });
}
