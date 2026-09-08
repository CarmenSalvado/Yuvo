#!/usr/bin/env bash
# Run against a local server: bash scripts/check-ui.sh http://localhost:3017
set -euo pipefail
browser() { npx --yes agent-browser --session howitwent-check "$@"; }
trap 'browser close >/dev/null' EXIT
browser open "${1:-http://localhost:3000}"
browser eval 'sessionStorage.clear()'
browser find role link click --name 'Explore my idea'
browser wait '#access-code'
browser find label 'Access code' fill invalid-test-code
browser press Enter
browser wait '#access-error'
browser eval 'if (document.querySelector("#access-code").getAttribute("aria-invalid") !== "true") throw Error("Missing code error state")'
invite_code=$(node --env-file=.env.local --input-type=module -e 'process.stdout.write(process.env.ACCESS_CODE)')
browser find label 'Access code' fill "$invite_code"
unset invite_code
browser eval 'if (document.querySelector("#access-error")) throw Error("Stale code error")'
browser press Enter
browser wait '#idea'
browser eval 'if (!document.querySelector(".workspace-window .premise-panel textarea")) throw Error("Missing workspace premise panel"); if (!document.querySelector("button[type=submit]").disabled) throw Error("Empty premise accepted")'
browser find role button click --name 'Write your idea'
browser eval 'if (document.activeElement.id !== "idea") throw Error("Welcome action did not focus the premise")'
browser find role button click --name 'Use an example'
browser eval 'if (document.querySelector("button[type=submit]").disabled) throw Error("Example premise rejected")'
browser eval 'window.shortcutSubmitted = false; document.querySelector("#idea").form.addEventListener("submit", event => { event.preventDefault(); event.stopImmediatePropagation(); window.shortcutSubmitted = true; }, {once:true}); document.querySelector("#idea").focus()'
browser press Control+Enter
browser eval 'if (!window.shortcutSubmitted) throw Error("Premise shortcut did not submit")'
browser eval 'window.researchFetch = window.fetch; window.fetch = async (url, options) => url !== "/api/analyze" ? window.researchFetch(url, options) : new Response(new ReadableStream({start(controller) { window.researchStream = controller; window.researchEvent = event => controller.enqueue(new TextEncoder().encode(JSON.stringify(event) + "\n")); window.researchEvent({type:"plan", queries:["UI test: nearby stories"]}); window.researchEvent({type:"evidence", count:13}); window.researchEvent({type:"status", step:3}); }}))'
browser find role button click --name 'Research my idea'
browser wait '.research-stage'
browser eval 'if (document.querySelector(".research-copy h2").textContent !== "Finding what’s missing." || document.querySelectorAll(".research-progress .done").length !== 3 || document.querySelector(".research-searches-heading b").textContent !== "13") throw Error("Research state is not reflected in the UI"); window.researchEvent({type:"status", step:4})'
browser wait --fn 'document.querySelector(".research-copy h2").textContent === "Shaping your own angle."'
browser eval 'window.researchStream.close(); window.fetch = window.researchFetch'
browser wait '.start-stage'
browser find role button click --name 'View a sample report'
browser wait '#panel-direction'
browser eval 'if (document.querySelectorAll(".report-navigation [role=tab]").length !== 3) throw Error("Expected three report stages"); if (document.querySelector(".report-context").open) throw Error("Research context should start collapsed")'
browser click '.report-context summary'
browser eval 'if (!document.querySelector(".report-context").open || !document.querySelector(".report-context p").textContent.trim()) throw Error("Research context cannot be read")'
browser click '#tab-direction'
browser press ArrowRight
browser eval 'if (document.activeElement.id !== "tab-research" || document.querySelector("#panel-research").hidden || !document.querySelector("#panel-direction").hidden) throw Error("Keyboard navigation did not switch panels")'
browser click '#patterns summary'
browser eval 'if (!document.querySelector("#patterns").open) throw Error("Research cannot expand")'
browser click '#tab-direction'
browser find role button click --name 'Recurring patterns'
browser eval 'if (document.querySelector("#panel-research").hidden || !document.querySelector("#patterns").open || document.activeElement !== document.querySelector("#patterns summary")) throw Error("Research shortcut did not open its findings")'
browser click '#tab-direction'
browser find role button click --name 'Review your first cut'
browser wait '#cut-file'
browser eval 'if (document.querySelectorAll("[role=tabpanel]:not([hidden])").length !== 1 || document.querySelector("#panel-next").hidden) throw Error("Next take did not replace report")'
browser find role button click --name 'Test a premise'
browser wait '#iteration'
browser set viewport 390 844
browser eval 'if (document.documentElement.scrollWidth > innerWidth) throw Error("Horizontal overflow"); if (!document.querySelector(".light-button").disabled) throw Error("Unchanged revision accepted")'
browser find label 'Current iteration' fill short
browser eval 'if (!document.querySelector(".light-button").disabled) throw Error("Short revision accepted")'
browser find label 'Current iteration' fill 'A retired projectionist discovers that every missing frame records a future crime.'
browser eval 'if (document.querySelector(".light-button").disabled) throw Error("Valid revision rejected")'
browser find role button click --name 'View sample feedback'
browser eval 'if (!document.querySelector(".room-error")) throw Error("Prepared feedback shown for an unsupported draft")'
browser find role button click --name 'Use the sample revision'
browser eval 'document.querySelector("#iteration").focus()'
browser press Control+Enter
browser eval 'if (document.querySelectorAll(".audience-grid article").length !== 3) throw Error("Missing sample perspectives"); if (!document.querySelector(".synthetic-note").textContent.includes("Not generated live")) throw Error("Missing demo label")'
browser find role button click --name 'Use the sample revision'
browser find role button click --name 'View sample feedback'
browser eval 'if (document.querySelectorAll(".audience-grid article").length !== 3) throw Error("Sample cannot be replayed")'

browser eval 'window.savedDraft = document.querySelector("#iteration").value'
browser click '#tab-research'
browser click '#tab-next'
browser eval 'if (document.querySelector("#iteration").value !== window.savedDraft || !document.querySelector("#iteration").checkVisibility() || document.querySelectorAll(".audience-grid article").length !== 3) throw Error("Switching views lost draft or feedback")'

browser set media light reduced-motion
browser eval 'if ([...document.querySelectorAll(".workspace-window *")].some(el => getComputedStyle(el).animationName !== "none")) throw Error("Reduced motion still animates")'
browser find role button click --name 'Sign out'
browser wait '.landing-hero'
browser open "${1:-http://localhost:3000}/start"
browser wait '#access-code'
browser eval '(async () => { const r = await fetch("/api/analyze", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({idea:"A sufficiently long story premise for testing access."})}); if(r.status!==401) throw Error("Signed-out research was not blocked"); })()'
