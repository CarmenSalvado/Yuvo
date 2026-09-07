import { cleanIdea, normalizeAudience } from "../../../lib/contracts.mjs";
import { generateJson } from "../../../lib/gemini.mjs";
import { audiencePrompt, audienceSchema } from "../../../lib/prompts.mjs";

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) return Response.json({ error: "Audience Room needs GEMINI_API_KEY on the server." }, { status: 503 });
  try {
    const body = await request.json();
    const previousIdea = cleanIdea(body.previousIdea);
    const currentIdea = cleanIdea(body.currentIdea);
    if (previousIdea === currentIdea) return Response.json({ error: "Revise the concept before testing this iteration." }, { status: 400 });
    if (!body.report || typeof body.report !== "object") throw new Error("Research context is missing.");
    const audience = normalizeAudience(await generateJson(audiencePrompt(previousIdea, currentIdea, body.report), audienceSchema));
    return Response.json(audience);
  } catch (error) {
    return Response.json({ error: error.name === "TimeoutError" ? "The Audience Room timed out." : error.message || "Audience Room failed." }, { status: 400 });
  }
}
