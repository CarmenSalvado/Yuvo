"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event) {
    event.preventDefault();
    if (busy || !code.trim()) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      window.location.assign("/start");
    } catch (cause) { setError(cause.message || "Couldn't connect. Please try again."); setBusy(false); }
  }

  return <main className="access-page"><Link className="access-home" href="/">← Back to Yuvo</Link><section className="access-card"><span className="access-mark" aria-hidden="true">y</span><p className="section-label">A little clarity. A better story.</p><h1>You're in the<br /><em>right place.</em></h1><p>Enter your invite code to open Yuvo.</p><form onSubmit={signIn} aria-busy={busy}><label htmlFor="access-code">Access code</label><input id="access-code" name="code" type="password" autoComplete="one-time-code" autoCapitalize="none" spellCheck={false} maxLength={128} required readOnly={busy} value={code} onChange={(event) => { setCode(event.target.value); setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "access-error" : undefined} />{error && <p id="access-error" role="alert">{error}</p>}<button type="submit" className="primary-button" disabled={busy || !code.trim()}>{busy ? "Opening Yuvo…" : "Let's begin"}<span aria-hidden="true">→</span></button></form><Link href="/">Watch the demo first</Link></section></main>;
}
