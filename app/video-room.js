"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_CLIP_BYTES, MAX_CLIP_SECONDS, VIDEO_TYPES, videoContext } from "../lib/video.mjs";

function timestamp(seconds) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export default function VideoRoom({ report, idea }) {
  const [cuts, setCuts] = useState([]);
  const [pending, setPending] = useState(null);
  const [duration, setDuration] = useState(0);
  const [view, setView] = useState(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [signIn, setSignIn] = useState(false);
  const player = useRef(null);
  const controller = useRef(null);
  const latest = cuts.at(-1);
  const displayed = pending || view?.file || latest?.file;
  const feedback = pending ? null : (view || latest)?.feedback;

  useEffect(() => {
    if (!displayed) { setUrl(""); return; }
    const nextUrl = URL.createObjectURL(displayed);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [displayed]);
  useEffect(() => () => controller.current?.abort(), []);

  function attach(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    setError(""); setSignIn(false);
    if (!VIDEO_TYPES.includes(file.type)) { setError("Choose an MP4 or WebM video."); return; }
    if (!file.size || file.size > MAX_CLIP_BYTES) { setError("Choose a short export under 2 MB."); return; }
    setDuration(0); setPending(file); setView(null);
  }

  async function review(event) {
    event.preventDefault();
    if (busy || !pending || !duration) return;
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true); setError(""); setSignIn(false);
    try {
      const form = new FormData();
      form.set("video", pending);
      if (latest) form.set("previous", latest.file);
      form.set("duration", String(duration));
      form.set("idea", idea);
      form.set("context", JSON.stringify(videoContext(report)));
      const response = await fetch("/api/video", { method: "POST", body: form, signal: abort.signal });
      if (response.status === 401) { setSignIn(true); throw new Error("Your session expired. Sign in, then retry with this clip."); }
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Video review failed. Try again.");
      const cut = { number: (latest?.number || 0) + 1, file: pending, feedback: body };
      // ponytail: retain two cuts in memory; add project storage when cross-session history is needed.
      setCuts((previous) => [...previous.slice(-1), cut]);
      setView(cut); setPending(null);
    } catch (cause) {
      setError(cause.name === "AbortError" ? "Review cancelled. Your clip is still attached." : cause.message);
    } finally { setBusy(false); }
  }

  return (
    <section className="video-room report-section" id="video-room" aria-labelledby="video-room-heading">
      <div className="section-head"><p>06 / The next take</p><div><h2 id="video-room-heading">See your story take shape.</h2><span>Attach a cut. Find the moment to improve. Compare the next version.</span></div></div>
      <div className="cut-workspace">
        <div className="cut-toolbar"><span><img src="/brand/gemini.svg" width="26" height="26" alt="" />Gemini · Visual review</span><div className="cut-tabs" aria-label="Reviewed cuts">{cuts.map((cut) => <button type="button" key={cut.number} disabled={busy || Boolean(pending)} aria-pressed={!pending && (view || latest) === cut} onClick={() => { setView(cut); setError(""); }}>Cut {cut.number}</button>)}</div></div>
        {displayed ? <video key={url} ref={player} className="cut-player" src={url || undefined} controls playsInline preload="metadata" aria-label={pending ? "Attached cut preview" : `Cut ${(view || latest).number}`} onLoadedMetadata={(event) => {
          if (!pending) return;
          const seconds = event.currentTarget.duration;
          if (!Number.isFinite(seconds) || seconds <= 0 || seconds > MAX_CLIP_SECONDS) { setDuration(0); setError("Choose a clip up to 60 seconds long."); }
          else setDuration(seconds);
        }} onError={() => { setDuration(0); setError("This video cannot play in your browser. Try an H.264 MP4 export."); }} /> : <div className="cut-empty"><span className="cut-orbits" aria-hidden="true"><i /><i /><i /></span><h3>Your first cut goes here.</h3><p>Show Gemini what you made.</p></div>}
        <form className="cut-upload" onSubmit={review} aria-busy={busy}>
          <label htmlFor="cut-file">{latest ? "Attach your next cut" : "Attach your first cut"}</label>
          <input id="cut-file" type="file" accept={VIDEO_TYPES.join(",")} disabled={busy} onChange={attach} aria-describedby="cut-guidance cut-privacy" />
          <p id="cut-guidance">MP4 or WebM · Up to 60 seconds · 2 MB per clip</p>
          {pending && <p className="cut-filename">Ready: <b>{pending.name}</b> <button type="button" disabled={busy} onClick={() => { setPending(null); setView(latest || null); setError(""); }}>Remove</button></p>}
          {error && <p className="inline-error" role="alert">{error} {signIn && <a href="/sign-in" target="_blank" rel="noreferrer">Sign in ↗</a>}</p>}
          {pending && <div className="cut-actions"><button type="submit" className="primary-button" disabled={busy || !duration}>{busy ? "Gemini is watching…" : latest ? "Compare both cuts →" : "Review this cut →"}</button>{busy && <button type="button" className="sample-link" onClick={() => controller.current?.abort()}>Cancel</button>}</div>}
          <p id="cut-privacy">Review sends {latest ? "both clips" : "your clip"} to Gemini. Clips stay in this tab until you leave or reload.{report.demo ? " Research context is the prepared sample; video feedback is generated live." : ""}</p>
        </form>
        <div className="cut-status" role="status">{busy && <><span className="cut-orbits" aria-hidden="true"><i /><i /><i /></span><span>{latest ? "Watching both cuts and checking what changed…" : "Watching the footage against your story direction…"}</span></>}</div>
      </div>
      {feedback && <div className="cut-feedback">
        <p className="cut-feedback-note">Gemini’s visual reading. Check observations against your footage; audio is not reviewed.</p>
        <p className="cut-summary">{feedback.summary}</p>
        {feedback.comparison && <div className="cut-comparison"><b>What changed from the previous cut</b><p>{feedback.comparison}</p></div>}
        <ol className="cut-moments">{feedback.moments.map((moment, index) => <li key={index}><button type="button" aria-label={`Watch moment at ${timestamp(moment.seconds)}`} onClick={() => { if (player.current) { player.current.currentTime = moment.seconds; player.current.focus(); player.current.play().catch(() => {}); } }}>{timestamp(moment.seconds)} <span aria-hidden="true">↗</span></button><div><p>{moment.observation}</p><p><b>Try this</b> {moment.suggestion}</p></div></li>)}</ol>
        <div className="cut-next"><span aria-hidden="true">↗</span><div><b>For your next cut</b><p>{feedback.nextMove}</p></div></div>
      </div>}
    </section>
  );
}
