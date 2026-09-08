# Yuvo — implementation review

Reviewed against the official Devpost MCP rules, submission fields, judging criteria, key dates and latest announcements on 2026-09-08. This is a technical audit, not a submission or acceptance of terms.

Sources: [Official rules](https://agentic-cinema.devpost.com/rules), [requirements](https://agentic-cinema.devpost.com/), [updates](https://agentic-cinema.devpost.com/updates).

## Implementation decisions

| Area | Evidence in this repository | Remaining work |
| --- | --- | --- |
| Google Cloud + Gemini + Agent Builder | `lib/gemini.mjs` executes `LlmAgent` through `InMemoryRunner` from the official Google ADK. Model: `gemini-3.8-flash`. Cloud Run uses Vertex AI with its dedicated workload service account. | ADK runtime deployed on Cloud Run and live verified. This is not a managed Agent Engine resource; final interpretation of the Agent Builder requirement belongs to the organizers. |
| Parallel Search at runtime | `lib/parallel.mjs` calls the Search API. `app/api/analyze/route.js` runs six planned angles and a bounded follow-up when coverage is weak. | Hosted ADK → Vertex AI → Parallel → report succeeds: six queries, 15 sources, 14 seconds in the verification run. |
| Functional media workflow | Idea → research → premise revision → attached video → timestamped critique → revised-video comparison. | Video API validation and desktop/mobile UI checks pass. Real Gemini calls reviewed one clip and compared two actual clips. The revised visual-only review and comparison both passed against actual clips on the hosted app, approximately six seconds each. |
| Matching demonstration | The final 131.7-second film records the working app, live research and two actual video attachments. The 52-second landing video remains scripted. | Full HD motion revision in `videos/yuvo-hackathon/renders/yuvo-hackathon-final.mp4`; include its music attribution when publishing before submission. |
| Source and runnable delivery | Root MIT license is present and recognized by GitHub. Setup and test instructions are in README. | GitHub repository is currently private. The app is hosted and verified at https://yuvo-530653958920.europe-west1.run.app. Make the source public before submission. |
| Access | Shared-code login, signed cookie, origin checks, protected workspace/APIs. | Hosted login and protected APIs verified; share the invite with judges privately. No personal account system is needed for this demo. |
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

The new `yuvo-cinema-20260908` project could not be linked to billing because of the linked-project quota. No projects were deleted. Yuvo now uses isolated resources in the existing billed `research-479400` project: Cloud Run service `yuvo`, service account `yuvo-runtime`, and three `yuvo-*` Secret Manager secrets. The service account has Vertex AI user access and secret-specific access. Local credentials stay outside the repository; deployed requests use the workload identity.

## Open questions for organizers

Ask how the AI-tooling restriction applies to development assistance and pre-generated artwork. ADK on Cloud Run is now implemented; disclose the exact architecture in the submission. No message has been sent. Use the event discussion forum or support@devpost.com.

The Devpost website prevails over this implementation checklist. Final eligibility is the organizer's decision.

## Latest verification — 2026-09-08

- Eight tests pass with the actual ADK runner and mocked provider transport. Build and dependency audit pass (zero reported vulnerabilities).
- Hosted invite login succeeds; unauthenticated video requests return 401.
- Hosted research: six queries, 15 sources, 14 seconds. Audience Room: 200, 15 seconds.
- Hosted visual-only video review and two-cut comparison: both 200, approximately six seconds each. Responses inspect visible footage and identify missing story elements without invented audio observations.
- Browser recording uses real live responses. The first and revised stock clips are visibly attached and played; timestamps seek the attached video. No provider interception or prepared-response substitution is used in the recording.
- Film refinement — 2026-09-09: `videos/yuvo-hackathon/renders/yuvo-hackathon-final.mp4`, 131.734 seconds, 1920×1080, 30 fps, H.264/AAC. Electrodoodle (CC BY 4.0) replaces the review soundtrack. The opening introduces the Yuvo wordmark before the idea and the interface. Actual rendered frames inspected for both app-window handoffs, real attachment, agentic video understanding explanation, premise-versus-footage feedback, cut comparison and official Cloud Run icon. Mix: −13.22 LUFS / −1.02 dBTP. Composition checks report zero errors or warnings; all six seams pass (two matching app frames and four leftward transitions). The last frame repeats the closing image to work around the CLI end-boundary clear; reproduction command is in the film README. English SRT and music attribution accompany the source. The original landing video remains a scripted preview.
- No existing cloud projects have been deleted. No Devpost submission, repository visibility change or YouTube upload has been performed.
