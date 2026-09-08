"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DEMO_IDEA, DEMO_REPORT, DEMO_REVISION, DEMO_AUDIENCE } from "../lib/demo-report.mjs";
import VideoRoom from "./video-room";

const STEPS = [
  "Understanding your concept",
  "Mapping nearby creative territory",
  "Researching audience reactions",
  "Finding repeated friction",
  "Identifying potential whitespace",
];

function Arrow({ direction = "right" }) {
  return <span aria-hidden="true" className={`arrow arrow-${direction}`}>→</span>;
}

function Brand() {
  return (
    <div className="brand" aria-label="Yuvo home">
      <span className="brand-mark" aria-hidden="true">y</span>
      <span>Yuvo</span>
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand-button" href="/" aria-label="Yuvo home"><Brand /></Link>
      <a className="header-meta hackathon-link" href="https://agentic-cinema.devpost.com/" target="_blank" rel="noreferrer"><img src="/brand/devpost.svg" alt="Devpost" width="28" height="28" />Agentic Cinema <span>Parallel track ↗</span></a>
    </header>
  );
}

function Landing({ onStart, onDemo }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (preference.matches) video.pause();
      else video.play().catch(() => { /* The play button remains available when autoplay is blocked. */ });
    };
    const fullscreenChanged = () => setExpanded(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", fullscreenChanged);
    syncPlayback();
    preference.addEventListener("change", syncPlayback);
    return () => { preference.removeEventListener("change", syncPlayback); document.removeEventListener("fullscreenchange", fullscreenChanged); video.pause(); };
  }, []);

  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="hero-copy"><div className="color-dots" aria-hidden="true"><i /><i /><i /></div>
          <h1>Big idea.<br /><em>Better story.</em></h1>
          <p className="dek">Find a direction for your story. Make every draft a little stronger.</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/start" onClick={onStart}>Explore my idea <Arrow /></Link>
            <button className="sample-link" type="button" onClick={onDemo}><span className="link-label">View sample report</span> <Arrow /></button>
          </div>
      <div className="powered-by" aria-label="Technologies used">
        <a href="https://ai.google.dev/" target="_blank" rel="noreferrer"><img src="/brand/gemini.svg" alt="" width="30" height="30" /><b>Gemini</b></a>
        <a href="https://parallel.ai/" target="_blank" rel="noreferrer"><img className="parallel-logo" src="/brand/parallel.png" alt="Parallel" width="132" height="21" /></a>
      </div>
        </div>
        <figure className="hero-film">
          <button className="expand-demo" type="button" aria-label={expanded ? "Exit full screen" : "Watch demo full screen"} onClick={async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await videoRef.current.closest("figure").requestFullscreen(); } catch { window.open(videoRef.current.currentSrc, "_blank", "noopener"); } }}><span aria-hidden="true">⛶</span></button>
          <button className="demo-toggle" type="button" disabled={videoError} onClick={() => { if (playing) videoRef.current.pause(); else videoRef.current.play().catch(() => setPlaying(false)); }} aria-label={videoError ? "Preview unavailable" : playing ? "Pause demo video" : "Play demo video"}>
          <video ref={videoRef} className="demo-video" src="/media/yuvo-research-demo.mp4" poster="/media/yuvo-research-demo-poster.jpg" width="1440" height="810" muted loop playsInline preload="metadata" aria-label="Prepared demonstration: develop an idea, attach a first video, review simulated feedback, then attach a revised video for comparison" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setVideoError(true); setPlaying(false); }} />
          </button>
        </figure>
      </section>
      <Story onStart={onStart} />
    </main>
  );
}

function Story({ onStart }) {
  const trackRef = useRef(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setChapter(Number(entry.target.dataset.chapter));
      }
    }, { rootMargin: "-55% 0px -25% 0px" });
    trackRef.current.querySelectorAll(".paper-chapter").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="story-paper" aria-labelledby="story-heading">
      <a className="story-scroll" href="#story-heading" aria-label="Explore the story"><span aria-hidden="true">↓</span></a>
      <div className="paper-intro"><h2 id="story-heading">Good stories aren’t born.<br /><em>They’re made.</em></h2><p>Follow a little idea.<br />See what it could become.</p></div>
      <div className="paper-layout" ref={trackRef}>
        <div className="paper-stage" data-active-chapter={chapter}>
          <nav aria-label="The Yuvo story">
            {[['idea', 'The spark'], ['direction', 'The direction'], ['cut', 'The next take']].map(([id, label], index) => <a key={id} href={`#story-${id}`} aria-current={chapter === index ? "step" : undefined}><span>0{index + 1}</span>{label}</a>)}
          </nav>
          <div className="paper-panels">
            <div className="paper-panel" aria-hidden={chapter !== 0}><img className="editorial-art" src="/art/yuvo-idea-minimal.webp" width="1536" height="1024" loading="lazy" alt="A writer with a large pencil imagines a little house." /></div>
            <div className="paper-panel" aria-hidden={chapter !== 1}>
              <div className="direction-scene" aria-label="Parallel finds patterns. Gemini shapes a creative direction.">
                <div className="research-orb"><img src="/brand/parallel.png" alt="Parallel" width="112" height="18" /><p>Find the<br />pattern.</p></div>
                <div className="direction-orb"><span className="gemini-disc"><img src="/brand/gemini.svg" alt="Gemini" width="36" height="36" /></span><p>Make it<br />your own.</p></div>
                <span className="scene-connection" aria-hidden="true">↗</span>
                <i className="scene-satellite" aria-hidden="true" />
                <div className="direction-note"><span>A direction from our sample</span><strong>Give the memory five rules.</strong><div className="rule-dots" aria-hidden="true"><i /><i /><i /><i /><i /></div></div>
              </div>
            </div>
            <div className="paper-panel" aria-hidden={chapter !== 2}><img className="editorial-art" src="/art/yuvo-next-take-minimal.webp" width="1536" height="1024" loading="lazy" alt="A filmmaker connects two simple frames to improve the next cut." /></div>
          </div>
        </div>
        <div className="paper-chapters">
          <article className="paper-chapter" id="story-idea" data-chapter="0"><span className="chapter-number">01</span><h3>Start with<br />a what if.</h3><p>What if a woman could hear the memories of abandoned buildings?</p><p className="chapter-detail">Bring a premise. Yuvo researches the stories around it.</p></article>
          <article className="paper-chapter" id="story-direction" data-chapter="1"><span className="chapter-number">02</span><h3>Find your<br />own angle.</h3><p>The familiar parts reveal an opening. Give the building’s memory five rules it can’t break.</p><p className="chapter-detail">Parallel finds the evidence. Gemini turns it into a creative direction.</p></article>
          <article className="paper-chapter" id="story-cut" data-chapter="2"><span className="chapter-number">03</span><h3>One cut.<br />Then a better one.</h3><p>Attach a scene. Look at a specific moment. Bring the next version and compare.</p><p className="chapter-detail">See the two-cut workflow in our video preview.</p><span className="preview-label">Video workflow · Concept demo</span></article>
        </div>
      </div>
      <div className="paper-ending"><h2>Your next draft starts<br />with a little clarity.</h2><Link className="primary-button" href="/start" onClick={onStart}>Let’s find it <Arrow /></Link></div>
    </section>
  );
}

function submitOnShortcut(event) {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    event.currentTarget.form.requestSubmit();
  }
}

function PremisePanel({ idea, setIdea, onAnalyze, onDemo, error, loading }) {
  const ready = idea.trim().length >= 30;
  return (
    <aside className="premise-panel">
      <Link href="/" className="brand-button"><Brand /></Link>
      <form aria-busy={loading} onSubmit={(event) => { event.preventDefault(); if (ready && !loading) onAnalyze(); }}>
        <div className="premise-label"><label htmlFor="idea">Your premise</label><span>{idea.length.toLocaleString()} / 3,000</span></div>
        <textarea id="idea" aria-describedby={error ? "idea-guidance idea-error" : "idea-guidance"} onKeyDown={submitOnShortcut} minLength={30} maxLength={3000} required readOnly={loading} value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="A woman can speak to abandoned buildings. Their memories are incomplete." />
        <p id="idea-guidance">At least 30 characters. ⌘ / Ctrl + Enter to send.</p>
        {error && <p id="idea-error" className="inline-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit" disabled={!ready || loading}>{loading ? "Researching…" : "Research my idea"}<Arrow /></button>
      </form>
      <button className="sample-link" type="button" disabled={loading} onClick={() => setIdea(DEMO_IDEA)}>Use an example</button>
      <div className="workspace-engines">
        <div><img src="/brand/gemini.svg" alt="" width="30" height="30" /><span>Gemini<small>Plans & critiques</small></span></div>
        <div><span><img src="/brand/parallel.png" alt="Parallel" width="112" height="18" /><small>Searches the live web</small></span></div>
      </div>
      <button className="sample-link" type="button" disabled={loading} onClick={onDemo}><span className="link-label">View a sample report</span> <Arrow /></button>
    </aside>
  );
}

function Start() {
  return <main className="workspace-empty"><h1>Creative field report</h1><div><span className="empty-orbits" aria-hidden="true"><i /><i /><i /></span><h2>Every story starts somewhere.</h2><p>Add a premise to find nearby stories and room for a different direction.</p></div></main>;
}

function Loading({ step, queries, evidence }) {
  return (
    <main className="loading-page">
      <section className="loading-title">
        <p className="kicker">Research agent in the field</p>
        <h1>Following the<br /><em>creative signal.</em></h1>
        <p>We’re looking for comparable stories, audience reactions, and useful openings.</p>
      </section>
      <section className="research-console" aria-live="polite">
        <div className="console-head"><span>Live research</span><span>{evidence ? `${evidence} sources surfaced` : "In progress"}</span></div>
        <ol className="steps">
          {STEPS.map((label, index) => <li key={label} className={index < step ? "done" : index === step ? "active" : ""}>
            <span className="step-index">{index < step ? "✓" : `0${index + 1}`}</span>
            <span>{label}</span>{index === step && <i className="step-pulse" />}
          </li>)}
        </ol>
        {queries.length > 0 && <div className="query-ticker"><p>Search angles dispatched</p><div>{queries.map((query) => <span key={query}>{query}</span>)}</div></div>}
      </section>
    </main>
  );
}

function SourceRefs({ ids, sources }) {
  if (!ids?.length) return null;
  return <span className="source-refs">{ids.map((id) => {
    const source = sources.find((item) => item.id === id);
    return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer" title={source.title}>[{id}]</a> : null;
  })}</span>;
}

function Landscape({ report }) {
  return (
    <div className="landscape-map">
      {report.clusters.map((cluster) => <article className="cluster-node" data-proximity={cluster.relevance} key={cluster.name}>
        <span>{cluster.relevance}</span><h3>{cluster.name}</h3><p>{cluster.summary}</p><SourceRefs ids={cluster.sourceIds} sources={report.sources} />
      </article>)}
    </div>
  );
}

function SectionHead({ number, label, title, note }) {
  return <div className="section-head"><p>{number} / {label}</p><div><h2>{title}</h2>{note && <span>{note}</span>}</div></div>;
}

function AudienceRoom({ report, iteration, previousIdea, setIteration, audience, onTest, testing, error }) {
  return (
    <section className="audience-section" id="audience-room">
      <SectionHead number="05" label="Iteration lab" title="Audience Room" note="Three synthetic perspectives—not predictions" />
      <div className="audience-intro">
        <div><p className="kicker">Test the next draft</p><h3>Change the premise.<br />Pressure-test the move.</h3></div>
        <form className="iteration-box" aria-busy={testing} onSubmit={(event) => { event.preventDefault(); if (!testing && iteration.trim().length >= 30 && iteration.trim() !== (report.demo ? report.idea : previousIdea).trim()) onTest(); }}>
          <label htmlFor="iteration">Current iteration</label>
          <textarea id="iteration" aria-describedby={error ? "iteration-guidance iteration-error" : "iteration-guidance"} aria-invalid={Boolean(error)} onKeyDown={submitOnShortcut} minLength={30} required readOnly={testing} value={iteration} onChange={(event) => setIteration(event.target.value)} maxLength={3000} />
          <p id="iteration-guidance" className="idea-guidance">{report.demo ? "The prepared example includes one revision and three illustrative perspectives." : "Revise the premise to compare drafts. At least 30 characters."}</p>
          {error && <p id="iteration-error" className="room-error" role="alert">{error}</p>}
          {report.demo && <button className="sample-link" type="button" disabled={testing} onClick={() => setIteration(DEMO_REVISION)}><span className="link-label">Use the sample revision</span> <Arrow /></button>}
          <button className="light-button" type="submit" title="Submit revision (⌘ / Ctrl + Enter)" disabled={testing || iteration.trim().length < 30 || iteration.trim() === (report.demo ? report.idea : previousIdea).trim()}>{testing ? "Perspectives are reading…" : (report.demo ? "View sample feedback" : "Test this iteration")} <Arrow /></button>
        </form>
      </div>
      {audience && <div className="audience-output">
        <p className="synthetic-note">{report.demo ? "Prepared sample feedback for the sample revision. Not generated live." : "Synthetic perspectives informed by the audience signals found during research."}</p>
        <div className="audience-grid">{audience.perspectives.map((voice, index) => <article key={voice.role}>
          <div className="voice-top"><span>0{index + 1}</span><h4>{voice.role}</h4></div>
          <p className="verdict">“{voice.verdict}”</p><p>{voice.critique}</p>
          <div className="voice-detail"><b>What changed</b><p>{voice.comparison}</p></div>
          <div className="voice-detail"><b>Next move</b><p>{voice.nextMove}</p></div>
        </article>)}</div>
        {audience.consensus && <p className="consensus"><b>Room consensus</b>{audience.consensus}</p>}
      </div>}
    </section>
  );
}

function Report({ report, onReset }) {
  const [iteration, setIteration] = useState(report.idea);
  const [previousIdea, setPreviousIdea] = useState(report.idea);
  const [audience, setAudience] = useState(null);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");

  async function testIteration() {
    if (testing) return;
    if (report.demo) {
      if (iteration.trim() !== DEMO_REVISION) { setAudience(null); setError("Use the sample revision to view prepared feedback, or start a live analysis to test your own idea."); return; }
      setError(""); setAudience(DEMO_AUDIENCE); setPreviousIdea(DEMO_REVISION);
      return;
    }
    setTesting(true); setError("");
    try {
      const response = await fetch("/api/audience", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ previousIdea, currentIdea: iteration, report }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Audience Room failed.");
      setAudience(body);
      setPreviousIdea(iteration);
    } catch (cause) { setError(cause.message); }
    finally { setTesting(false); }
  }

  return (
    <main className="report-page">
      {report.demo && <div className="demo-banner"><span>Prepared sample</span>This report is illustrative and did not run live research. <button type="button" onClick={onReset}>Run your own analysis</button></div>}
      {report.partial && <div className="partial-banner">Partial research: one search angle failed. Conclusions are intentionally narrow.</div>}
      <section className="report-hero">
        <div className="report-heading"><h1>Creative field report</h1><a href="#sources">{report.sources.length} sources</a></div>
        <p className="report-overview">{report.overview}</p>
        <aside className="report-opening"><p className="section-label"><img src="/brand/gemini.svg" alt="" width="24" height="24" />Potential opening</p><h2>{report.whitespace[0].title}</h2><p>{report.whitespace[0].opportunity}</p><a href="#opportunities">Explore this direction <Arrow /></a></aside>
        <div className="next-draft"><p className="section-label">Try this in your next draft</p><p>{report.whitespace[0].move}</p><a className="sample-link" href="#video-room">Review your first cut <Arrow /></a></div>
        <details className="original-premise"><summary>Analyzed premise</summary><p>{report.idea}</p></details>
      </section>

      <nav className="report-navigation" aria-label="Report sections">
        <a href="#landscape">Landscape</a><a href="#patterns">Patterns</a><a href="#friction">Friction</a><a href="#opportunities">Opportunities</a><a href="#audience-room">Revise your idea</a><a href="#video-room">Review your video</a><a href="#sources">Sources</a>
      </nav>
      <section className="report-section landscape-section" id="landscape">
        <SectionHead number="01" label="Creative landscape" title="The territory around your idea" note="Qualitative proximity, based on surfaced sources" />
        <Landscape report={report} />
      </section>

      <section className="report-section patterns-section" id="patterns">
        <SectionHead number="02" label="Saturated territory" title="What keeps recurring" note="Common in the research—not a count of the internet" />
        <div className="pattern-list">{report.saturated.map((item, index) => <article key={item.pattern}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.pattern}</h3><p>{item.why} <SourceRefs ids={item.sourceIds} sources={report.sources} /></p></article>)}</div>
      </section>

      <section className="report-section friction-section" id="friction">
        <SectionHead number="03" label="Audience friction" title="Where nearby stories lose people" note="Recurring qualitative signals, not audience statistics" />
        <div className="friction-grid">{report.frictions.map((item) => <article key={item.signal}><h3>{item.signal}</h3><p>{item.detail}</p><SourceRefs ids={item.sourceIds} sources={report.sources} /></article>)}</div>
      </section>

      <section className="whitespace-section" id="opportunities">
        <SectionHead number="04" label="Potential whitespace" title="Make your move here" note="Opportunities derived from patterns + friction" />
        <div className="whitespace-list">{report.whitespace.map((item, index) => <article key={item.title}>
          <div className="opportunity-index"><span>{String(index + 1).padStart(2, "0")}</span> Potential opening</div>
          <div className="opportunity-body"><h3>{item.title}</h3><p className="opportunity">{item.opportunity}</p><p className="why"><b>Why this follows</b>{item.why} <SourceRefs ids={item.sourceIds} sources={report.sources} /></p></div>
          <div className="territory-stack"><p><span>Familiar</span>{item.familiar}</p><p><span>Crowded</span>{item.crowded}</p><p><span>Friction</span>{item.friction}</p><p className="move"><span>Your next move</span>{item.move}</p></div>
        </article>)}</div>
      </section>

      <AudienceRoom report={report} iteration={iteration} previousIdea={previousIdea} setIteration={(value) => { setIteration(value); setAudience(null); setError(""); }} audience={audience} onTest={testIteration} testing={testing} error={error} />
      <VideoRoom report={report} idea={previousIdea} />

      <section className="sources-section" id="sources">
        <details><summary><span>Research evidence</span><b>{report.sources.length} sources surfaced</b><span className="details-plus">+</span></summary>
          <div className="sources-list">{report.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}><span>[{source.id}]</span><div><b>{source.title}</b><small>{new URL(source.url).hostname.replace("www.", "")}</small><p>{source.excerpts[0]}</p></div><Arrow /></a>)}</div>
        </details>
        <p>Based on the sources analyzed. Yuvo does not establish originality or predict real audience behavior.</p>
      </section>
    </main>
  );
}

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [queries, setQueries] = useState([]);
  const [evidence, setEvidence] = useState(0);
  const [error, setError] = useState("");
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try { const saved = sessionStorage.getItem("howitwent-report"); if (saved) { const savedReport = JSON.parse(saved); setReport(savedReport); setIdea(savedReport.idea); } } catch { /* corrupted session state is disposable */ }
  }, []);

  async function analyze() {
    if (loading || idea.trim().length < 30) return;
    setLoading(true); setError(""); setStep(0); setQueries([]); setEvidence(0); setReport(null);
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea }) });
      if (response.status === 401) { window.location.assign("/sign-in"); return; }
      if (!response.ok) { const body = await response.json(); throw new Error(body.error || "Research could not start."); }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const lines = buffer.split("\n"); buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);
          if (event.type === "status") setStep(event.step);
          if (event.type === "plan") setQueries(event.queries);
          if (event.type === "evidence") setEvidence(event.count);
          if (event.type === "error") throw new Error(event.message);
          if (event.type === "done") {
            setReport(event.report);
            sessionStorage.setItem("howitwent-report", JSON.stringify(event.report));
          }
        }
        if (done) break;
      }
    } catch (cause) { setError(cause.message || "Research failed."); }
    finally { setLoading(false); }
  }

  async function signOut() {
    try {
      const response = await fetch("/api/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Could not sign out. Please try again.");
      sessionStorage.removeItem("howitwent-report");
      window.location.assign("/");
    } catch (cause) { setError(cause.message); }
  }

  function reset() { setReport(null); setLoading(false); setError(""); sessionStorage.removeItem("howitwent-report"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function showDemo() { setIdea(DEMO_IDEA); setError(""); setReport(DEMO_REPORT); sessionStorage.setItem("howitwent-report", JSON.stringify(DEMO_REPORT)); router.push("/start"); }

  if (pathname === "/start") return (
    <div className="workspace-desktop">
      <div className="workspace-window">
        <header className="window-toolbar"><div className="window-lights" aria-hidden="true"><i /><i /><i /></div><Link href="/">Yuvo / Your creative space</Link><div className="window-actions"><button type="button" disabled={loading} onClick={reset}>↻ Reset</button><button type="button" disabled={loading} onClick={signOut}>Sign out</button></div></header>
        <div className="workspace-body">
          <PremisePanel idea={idea} setIdea={(value) => { setIdea(value); setError(""); }} onAnalyze={analyze} onDemo={showDemo} error={error} loading={loading} />
          <div className="workspace-results" aria-busy={loading}>
            {loading ? <Loading step={step} queries={queries} evidence={evidence} /> : report ? <Report key={`${report.idea}:${report.researchedAt || "sample"}`} report={report} onReset={reset} /> : <Start />}
          </div>
        </div>
      </div>
    </div>
  );

  return <div className="app-shell"><Header /><Landing onStart={reset} onDemo={showDemo} /><footer><Brand /><p>Research by Parallel · Analysis by Gemini</p></footer></div>;
}
