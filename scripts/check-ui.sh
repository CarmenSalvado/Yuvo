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
browser find role button click --name 'Use an example'
browser eval 'if (document.querySelector("button[type=submit]").disabled) throw Error("Example premise rejected")'
browser eval 'window.shortcutSubmitted = false; document.querySelector("#idea").form.addEventListener("submit", event => { event.preventDefault(); event.stopImmediatePropagation(); window.shortcutSubmitted = true; }, {once:true}); document.querySelector("#idea").focus()'
browser press Control+Enter
browser eval 'if (!window.shortcutSubmitted) throw Error("Premise shortcut did not submit")'
browser find role button click --name 'View a sample report'
browser wait '#audience-room'
browser set viewport 390 844
browser eval 'if (document.documentElement.scrollWidth > innerWidth) throw Error("Horizontal overflow"); if ([...document.querySelectorAll(".report-navigation a")].some(a => !document.querySelector(a.hash))) throw Error("Broken section link"); if (!document.querySelector(".light-button").disabled) throw Error("Unchanged revision accepted")'
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

browser find role button click --name 'Sign out'
browser wait '.landing-hero'
browser open "${1:-http://localhost:3000}/start"
browser wait '#access-code'
browser eval '(async () => { const r = await fetch("/api/analyze", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({idea:"A sufficiently long story premise for testing access."})}); if(r.status!==401) throw Error("Signed-out research was not blocked"); })()'
