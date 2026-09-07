"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DEMO_IDEA, DEMO_REPORT } from "../lib/demo-report.mjs";

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
    <div className="brand" aria-label="Storyfield home">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>Storyfield</span>
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand-button" href="/" aria-label="Storyfield home"><Brand /></Link>
      <div className="header-meta">
        <span className="live-dot" />
        <span>Live web research by Parallel</span>
        <span className="header-rule" />
        <span>Agentic Cinema / 2026</span>
      </div>
    </header>
  );
}

function Landing({ onStart, onDemo }) {
  const landingRef = useRef(null);

  useEffect(() => {
    const root = landingRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = root.querySelectorAll("[data-reveal]");
    root.dataset.motion = "ready";

    if (reducedMotion) {
      revealItems.forEach((item) => { item.dataset.visible = "true"; });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.visible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));

    const hero = root.querySelector(".landing-hero");
    const sphere = root.querySelector(".hero-sphere-track");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame;

    function followPointer(event) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - .5) * 28;
        const y = ((event.clientY - bounds.top) / bounds.height - .5) * 20;
        sphere.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    }

    function resetPointer() {
      sphere.style.transform = "translate3d(0, 0, 0)";
    }

    if (finePointer) {
      hero.addEventListener("pointermove", followPointer);
      hero.addEventListener("pointerleave", resetPointer);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      hero?.removeEventListener("pointermove", followPointer);
      hero?.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <main className="landing" ref={landingRef}>
      <section className="landing-hero">
        <div className="hero-orbits" aria-hidden="true"><i /><i /><i /></div>
        <div className="hero-sphere-scroll" aria-hidden="true"><div className="hero-sphere-track"><div className="hero-sphere" /></div></div>
        <div className="hero-copy">
          <p className="eyebrow"><span>Creative territory</span><span>Field research / 2026</span></p>
          <h1><span>Find the</span><span>whitespace</span><span><em>around your story.</em></span></h1>
          <Link className="hero-cta" href="/start" onClick={onStart}>Start with your premise <Arrow /></Link>
          <p className="dek">Map what’s already resonating, what audiences are tired of, and where your concept can move differently.</p>
        </div>
        <p className="hero-note"><span>Story intelligence</span>For filmmakers who would rather know before they shoot.</p>
      </section>

      <section className="method-section" aria-labelledby="method-title">
        <div className="method-intro" data-reveal="wipe">
          <p className="section-label">02 / The method</p>
          <h2 id="method-title">Research before<br />you rewrite.</h2>
          <p>Gemini plans the investigation. Parallel searches the live web. Every useful conclusion stays attached to its evidence.</p>
        </div>
        <div className="method-strip" aria-label="How Storyfield works">
          <article data-reveal="rise" style={{ "--reveal-order": 0 }}><span>01</span><h3>Describe</h3><p>Paste the premise you are actually considering.</p></article>
          <article data-reveal="rise" style={{ "--reveal-order": 1 }}><span>02</span><h3>Research</h3><p>Map comparable work and real audience friction.</p></article>
          <article data-reveal="rise" style={{ "--reveal-order": 2 }}><span>03</span><h3>Find signals</h3><p>Separate familiar territory from useful openings.</p></article>
          <article data-reveal="rise" style={{ "--reveal-order": 3 }}><span>04</span><h3>Make your move</h3><p>Pressure-test the next version before production.</p></article>
        </div>
        <div className="sample-row" data-reveal="rise">
          <span>Want to see the finished field report?</span>
          <button className="sample-link" type="button" onClick={onDemo}>Explore the prepared sample <Arrow /></button>
        </div>
      </section>
      <p className="truth-note">Storyfield maps surrounding territory. It does not certify originality or predict audiences.</p>
    </main>
  );
}

function Start({ idea, setIdea, onAnalyze, error }) {
  const ready = idea.trim().length >= 30;

  return (
    <main className="start-page" data-ready={ready}>
      <nav className="start-navigation" aria-label="Research navigation">
        <Link href="/">← Back to home</Link>
        <span>01 / Premise <span aria-hidden="true">—</span> 02 / Field report</span>
      </nav>
      <section className="premise-section" aria-labelledby="start-title">
        <div className="premise-intro">
          <p className="section-label">A new investigation</p>
          <h1 id="start-title">Every story starts<br />with a <em>what if.</em></h1>
          <p>Bring your premise. Find the stories around it, the patterns audiences notice, and room to make it your own.</p>
          <div className="start-deliverables">
            <p className="section-label">Inside your field report</p>
            <p><span>01</span> Nearby stories & creative territory</p>
            <p><span>02</span> Audience friction & recurring patterns</p>
            <p><span>03</span> New directions, backed by sources</p>
          </div>
        </div>
        <div className="start-editor">
        <div className="premise-status" role="status">
          <span>{ready ? "✦ Ready to explore" : "✦ Your next big what if"}</span>
          <span>{ready ? "Let’s find your opening." : "Start with a spark."}</span>
        </div>
        <div className="idea-desk">
          <div className="desk-topline">
            <label id="idea-label" htmlFor="idea">Describe your story</label>
            <span>{idea.length.toLocaleString()} / 3,000</span>
          </div>
          <textarea id="idea" aria-describedby="idea-guidance" maxLength={3000} value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="What if every lie left behind a frequency only one sound editor could hear?" />
          <progress className="premise-progress" max={30} value={Math.min(idea.trim().length, 30)} aria-label="Minimum premise length" />
          <p className="idea-guidance" id="idea-guidance">A character, a conflict, a world. A few sentences are enough. Minimum 30 characters.</p>
          <div className="desk-actions">
            <button className="preset" type="button" onClick={() => setIdea(DEMO_IDEA)}>
              <span className="preset-play">+</span><span><b>Use the sample premise</b>Cozy mystery × sentient buildings</span>
            </button>
            <button className="primary-button" type="button" disabled={!ready} onClick={onAnalyze}>
              Find my whitespace <Arrow />
            </button>
          </div>
          {error && <p className="inline-error" role="alert">{error}</p>}
        </div>
        <p className="start-footnote">Your premise is the starting point. Every useful signal comes with evidence.</p>
        </div>
      </section>
    </main>
  );
}

function Loading({ step, queries, evidence }) {
  return (
    <main className="loading-page">
      <section className="loading-title">
        <p className="kicker">Research agent in the field</p>
        <h1>Following the<br /><em>creative signal.</em></h1>
        <p>Gemini planned the investigation. Parallel is searching the live web from several angles.</p>
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
      <div className="map-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className="idea-node"><span>Your idea</span><p>{report.idea.split(".")[0]}.</p></div>
      {report.clusters.map((cluster, index) => <article className={`cluster-node node-${index + 1}`} key={cluster.name}>
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
        <div className="iteration-box">
          <label htmlFor="iteration">Current iteration</label>
          <textarea id="iteration" value={iteration} onChange={(event) => setIteration(event.target.value)} maxLength={3000} />
          <button className="light-button" type="button" onClick={onTest} disabled={testing || iteration.trim() === previousIdea.trim()}>{testing ? "Perspectives are reading…" : "Test this iteration"} <Arrow /></button>
          {error && <p className="room-error" role="alert">{error}</p>}
        </div>
      </div>
      {audience && <div className="audience-output">
        <p className="synthetic-note">Synthetic perspectives informed by the audience signals found during research.</p>
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
        <div className="report-number"><span>Field report</span><strong>№ 01</strong></div>
        <div className="report-lead"><p className="kicker">Creative territory / {report.sources.length} relevant sources surfaced</p><h1>See what surrounds<br /><em>your next draft.</em></h1><p>{report.overview}</p></div>
      </section>
      <section className="concept-strip"><span>Original concept</span><p>{report.idea}</p><button type="button" onClick={onReset}>New analysis <Arrow /></button></section>

      <section className="report-section landscape-section">
        <SectionHead number="01" label="Creative landscape" title="The territory around your idea" note="Qualitative proximity, based on surfaced sources" />
        <Landscape report={report} />
      </section>

      <section className="report-section patterns-section">
        <SectionHead number="02" label="Saturated territory" title="What keeps recurring" note="Common in the research—not a count of the internet" />
        <div className="pattern-list">{report.saturated.map((item, index) => <article key={item.pattern}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.pattern}</h3><p>{item.why} <SourceRefs ids={item.sourceIds} sources={report.sources} /></p></article>)}</div>
      </section>

      <section className="report-section friction-section">
        <SectionHead number="03" label="Audience friction" title="Where nearby stories lose people" note="Recurring qualitative signals, not audience statistics" />
        <div className="friction-grid">{report.frictions.map((item) => <article key={item.signal}><div className="friction-mark">×</div><h3>{item.signal}</h3><p>{item.detail}</p><SourceRefs ids={item.sourceIds} sources={report.sources} /></article>)}</div>
      </section>

      <section className="whitespace-section">
        <SectionHead number="04" label="Potential whitespace" title="Make your move here" note="Opportunities derived from patterns + friction" />
        <div className="whitespace-list">{report.whitespace.map((item, index) => <article key={item.title}>
          <div className="opportunity-index">Opportunity {String(index + 1).padStart(2, "0")}</div>
          <div className="opportunity-body"><h3>{item.title}</h3><p className="opportunity">{item.opportunity}</p><p className="why"><b>Why this follows</b>{item.why} <SourceRefs ids={item.sourceIds} sources={report.sources} /></p></div>
          <div className="territory-stack"><p><span>Familiar</span>{item.familiar}</p><p><span>Crowded</span>{item.crowded}</p><p><span>Friction</span>{item.friction}</p><p className="move"><span>Your next move</span>{item.move}</p></div>
        </article>)}</div>
      </section>

      <AudienceRoom report={report} iteration={iteration} previousIdea={previousIdea} setIteration={setIteration} audience={audience} onTest={testIteration} testing={testing} error={error} />

      <section className="sources-section">
        <details><summary><span>Research evidence</span><b>{report.sources.length} sources surfaced</b><span className="details-plus">+</span></summary>
          <div className="sources-list">{report.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}><span>[{source.id}]</span><div><b>{source.title}</b><small>{new URL(source.url).hostname.replace("www.", "")}</small><p>{source.excerpts[0]}</p></div><Arrow /></a>)}</div>
        </details>
        <p>Based on the sources analyzed. Storyfield does not establish originality or predict real audience behavior.</p>
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
    try { const saved = sessionStorage.getItem("storyfield-report"); if (saved) setReport(JSON.parse(saved)); } catch { /* corrupted session state is disposable */ }
  }, []);

  async function analyze() {
    setLoading(true); setError(""); setStep(0); setQueries([]); setEvidence(0); setReport(null);
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea }) });
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
            sessionStorage.setItem("storyfield-report", JSON.stringify(event.report));
          }
        }
        if (done) break;
      }
    } catch (cause) { setError(cause.message || "Research failed."); }
    finally { setLoading(false); }
  }

  function reset() { setReport(null); setLoading(false); setError(""); sessionStorage.removeItem("storyfield-report"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function showDemo() { setIdea(DEMO_IDEA); setError(""); setReport(DEMO_REPORT); sessionStorage.setItem("storyfield-report", JSON.stringify(DEMO_REPORT)); router.push("/start"); }

  const content = pathname === "/start"
    ? loading ? <Loading step={step} queries={queries} evidence={evidence} /> : report ? <Report report={report} onReset={reset} /> : <Start idea={idea} setIdea={setIdea} onAnalyze={analyze} error={error} />
    : <Landing onStart={reset} onDemo={showDemo} />;

  return <div className="app-shell"><Header />{content}<footer><Brand /><p>Creative territory, mapped with Gemini reasoning and Parallel web research.</p><span>Made for filmmakers who would rather know before they shoot.</span></footer></div>;
}
