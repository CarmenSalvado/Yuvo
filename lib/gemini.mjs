import { Gemini, InMemoryRunner, LlmAgent, isFinalResponse } from "@google/adk";

export function geminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_CLOUD_PROJECT);
}

export async function generateJson(prompt, responseSchema, { signal, parts = [] } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!geminiConfigured()) throw new Error("Configure Gemini credentials on the server.");
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const llm = new Gemini({ model, ...(key ? { apiKey: key, vertexai: false } : {
    vertexai: true,
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION || "global",
  }) });
  const timeout = AbortSignal.timeout(150_000);
  const deadline = signal ? AbortSignal.any([signal, timeout]) : timeout;
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      deadline.throwIfAborted();
      const agent = new LlmAgent({
        name: "yuvo_creative_agent",
        model: llm,
        outputSchema: responseSchema,
        generateContentConfig: {
          responseMimeType: "application/json",
          ...(model.startsWith("gemini-3") ? { thinkingConfig: { thinkingLevel: "LOW" } } : {}),
          maxOutputTokens: 8192,
          httpOptions: { timeout: 150_000, retryOptions: { attempts: 1 } },
        },
      });
      // ponytail: request-local sessions; use persistent storage if cross-device history is needed.
      const runner = new InMemoryRunner({ agent, appName: "yuvo" });
      const session = await runner.sessionService.createSession({ appName: "yuvo", userId: "creator" });
      let text;
      for await (const event of runner.runAsync({
        userId: session.userId,
        sessionId: session.id,
        newMessage: { role: "user", parts: [{ text: prompt }, ...parts] },
        abortSignal: deadline,
        runConfig: { maxLlmCalls: 1 },
      })) {
        if (isFinalResponse(event)) text = event.content?.parts?.filter((part) => !part.thought).map((part) => part.text || "").join("");
      }
      if (!text) throw new Error("Gemini returned no usable content.");
      return JSON.parse(text);
    } catch (error) {
      if (deadline.aborted) throw deadline.reason;
      lastError = new Error(error.status ? `Gemini request failed (${error.status}).` : "Gemini returned no usable response.");
      lastError.status = error.status;
      if (["TimeoutError", "AbortError"].includes(error.name)) lastError = error;
      if (error.status && error.status < 500) break;
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      break;
    }
  }
  throw lastError;
}
