const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function generateJson(prompt, responseSchema, { signal } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is missing.");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `${GEMINI_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.35,
          },
        }),
        signal: signal || AbortSignal.timeout(45_000),
      });
      if (!response.ok) throw new Error(`Gemini request failed (${response.status}).`);
      const body = await response.json();
      const text = body?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("");
      if (!text) throw new Error("Gemini returned no usable content.");
      return JSON.parse(text);
    } catch (error) {
      lastError = error;
      if (attempt === 0) continue;
      break;
    }
  }
  throw lastError;
}
