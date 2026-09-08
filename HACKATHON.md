# Yuvo — implementation review

Reviewed against the official Devpost MCP rules, submission fields, judging criteria, key dates and latest announcements on 2026-09-08. This is a technical audit, not a submission or acceptance of terms.

Sources: [Official rules](https://agentic-cinema.devpost.com/rules), [requirements](https://agentic-cinema.devpost.com/), [updates](https://agentic-cinema.devpost.com/updates).

## Implementation decisions

| Area | Evidence in this repository | Remaining work |
| --- | --- | --- |
| Google Cloud + Gemini + Agent Builder | `lib/gemini.mjs` imports and calls the official `@google/genai` SDK. Model: `gemini-3.8-flash`, selected by the user. Supports a Developer API key or Vertex AI with ADC. | Agent Builder is not deployed or verified. Do not equate a model API call with a completed Agent Builder integration. |
| Parallel Search at runtime | `lib/parallel.mjs` calls the Search API. `app/api/analyze/route.js` runs six planned angles and a bounded follow-up when coverage is weak. | The complete Gemini → Parallel → report chain succeeded: six queries, 16 normalized sources, no partial branch, approximately 99 seconds. An earlier attempt returned provider HTTP 503. |
| Functional media workflow | Idea → research → premise revision → attached video → timestamped critique → revised-video comparison. | Video API validation and desktop/mobile UI checks pass. Real Gemini calls reviewed one clip and compared two actual clips. The first review hallucinated audio in a silent clip; the revised prompt and UI explicitly scope this version to visual feedback, but follow-up requests returned Gemini HTTP 503, so the revised visual-only prompt still needs a successful live recheck. |
| Matching demonstration | The 52-second landing video is explicitly scripted. | Record the working application for the final submission; retain concept labels for prepared material. |
| Source and runnable delivery | Root MIT license is present and recognized by GitHub. Setup and test instructions are in README. | GitHub repository is currently private. Current app changes are uncommitted and unpublished. No hosted judging URL is verified. |
| Access | Shared-code login, signed cookie, origin checks, protected workspace/APIs. | Give judges a working code and verify the hosted flow. No personal account system is needed for this demo. |
| AI tooling and asset provenance | GPT Image illustrations and Codex-assisted implementation are documented; no third-party AI API is called by the runtime. | The rules restrict other AI tooling. Scope for development tools and existing generated assets requires organizer clarification; changing runtime providers alone does not resolve this. User has deferred the demo/assets discussion. |
| Third-party rights | Pexels clip and macOS cursor sources, logos and font attribution are recorded. | Attribution is not blanket permission. Review stock footage/cursor usage and logo context for the final video. Prefer original footage and a native recorded cursor. |
| New work | First local commit and GitHub creation are 2026-09-07. | This supports timing, but cannot establish that all underlying work was newly created. |

## Delivery checks

- Public app URL, public source repository with OSI license, reproducible setup and completed Devpost form.
- Demo: up to three minutes, public YouTube/Vimeo, actual product footage, English or English subtitles. Written submission and app support English.
- Track: Parallel. Other partner integrations are not required for this track; Replit hosting is specific to the Replit track.
- Up to four eligible team members. Confirm individual eligibility, work ownership, residence and employment restrictions before submission.
- Required form details include submitter type, organization or N/A, country, government employment, team size, new/existing status, track, repository, hosted URL, Google Cloud products and all other tools. Do not invent personal answers.
- Deadline: September 9, 2026 at 21:00 UTC / 23:00 Europe/Madrid. Rules and MCP agree on this cutoff; judging dates differ between the legal text and structured calendar, so verify those separately if needed.

## What to optimize

Technical implementation, design, impact and idea quality are equally weighted after the eligibility/functionality screening. Demonstrate one evidenced creative decision and an observable change between cuts. More animation or additional integrations do not substitute for that complete loop.

## Google Cloud status

Created `yuvo-cinema-20260908` and `yuvo-runtime` service account with the Vertex AI user role. Vertex AI and Gemini Developer APIs are enabled. Billing linkage failed because the account reached its linked-project quota. A restricted Gemini Developer API key is stored only in ignored `.env.local`; it does not establish a billed Vertex AI or Agent Builder deployment. No existing projects have been deleted. The deletion scope is awaiting the user's explicit answer.

## Open questions for organizers

Ask whether the listed Google Gen AI SDK with Vertex AI satisfies their Agent Builder requirement, and how the AI-tooling restriction applies to development assistance and pre-generated artwork. No message has been sent. Use the event discussion forum or support@devpost.com.

The Devpost website prevails over this implementation checklist. Final eligibility is the organizer's decision.

## Verification at this commit

- `npm test`: 8 passing tests, including actual request construction with one/two inline videos, input/authentication boundaries, Gemini 3.8 configuration, cancellation deadlines and safe provider errors. Provider responses are mocked in automated tests.
- `npm run build` and `git diff --check`: pass.
- Browser checks: invite login/logout, sample report/revision, keyboard shortcuts, mobile overflow; real clip selection/playback, retry after a mocked failure, two-cut switching and timestamp seeking at 390px and 1440px.
- Live Gemini 3.8: initial text response succeeded after 114 seconds; complete research succeeded in 99 seconds with 6 queries and 16 sources; initial single-video review succeeded in 107 seconds; initial two-video comparison succeeded in 37 seconds.
- Live follow-ups: Audience Room and the revised visual-only video prompt returned HTTP 503 after bounded retries. This is still a release limitation; do not describe the entire live demo as consistently verified. API errors retain the user's draft or attachment and have no prepared-result fallback.
- Secrets and generated thumbnail caches are excluded from the commit. No cloud projects have been deleted, and no deployment or Devpost submission has been performed.
