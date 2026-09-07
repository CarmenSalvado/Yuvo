export async function parallelSearch({ objective, searchQueries, sessionId }) {
  const key = process.env.PARALLEL_API_KEY;
  if (!key) throw new Error("PARALLEL_API_KEY is missing.");
  const body = JSON.stringify({
    objective,
    search_queries: searchQueries,
    mode: "fast",
    max_chars_total: 18000,
    client_model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    session_id: sessionId,
    advanced_settings: { max_results: 8 },
  });
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch("https://api.parallel.ai/v1/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key },
        body,
        signal: AbortSignal.timeout(25_000),
      });
      if (response.ok) return response.json();
      lastError = new Error(`Parallel Search failed (${response.status}).`);
      if (response.status < 500) break;
    } catch (error) { lastError = error; }
  }
  throw lastError;
}
