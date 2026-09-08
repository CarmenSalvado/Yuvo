import { authorize } from "../../../lib/access.mjs";
import { cleanIdea, normalizeAudience } from "../../../lib/contracts.mjs";
import { generateJson, geminiConfigured } from "../../../lib/gemini.mjs";
import { audiencePrompt, audienceSchema } from "../../../lib/prompts.mjs";

export const maxDuration = 180;

export async function POST(request) {
  const denied = authorize(request);
  if (denied) return denied;
  if (!geminiConfigured()) return Response.json({ error: "Audience Room needs Gemini credentials on the server." }, { status: 503 });
  let status = 400;
  try {
    const body = await request.json();
    const previousIdea = cleanIdea(body.previousIdea);
    const currentIdea = cleanIdea(body.currentIdea);
    if (previousIdea === currentIdea) return Response.json({ error: "Revise the concept before testing this iteration." }, { status: 400 });
    if (!body.report || typeof body.report !== "object") throw new Error("Research context is missing.");
    status = 502;
    const audience = normalizeAudience(await generateJson(audiencePrompt(previousIdea, currentIdea, body.report), audienceSchema));
    return Response.json(audience);
  } catch (error) {
    return Response.json({ error: error.name === "TimeoutError" ? "The Audience Room timed out. Your draft is still here; try again." : error.status === 503 ? "Gemini is busy right now. Your draft is still here; try again." : error.message || "Audience Room failed." }, { status });
  }
}
