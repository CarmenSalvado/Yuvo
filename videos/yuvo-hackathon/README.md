# Yuvo hackathon film

89 seconds · 1920 × 1080 · 30 fps · English narration.

```sh
cd videos/yuvo-hackathon
npm run dev
npm run check
npm run render -- --quality high --fps 30 --workers 1 --no-low-memory-mode --browser-gpu --video-frame-format png --output renders/yuvo-hackathon-tight.mp4
```

Current export: `renders/yuvo-hackathon-tight.mp4`. The previous 100-second export remains in `renders/yuvo-hackathon-dopamine.mp4` for comparison. Renders are local and excluded from Git.

Six scenes follow one idea through live research, a creative direction, a first video review and a comparison. The source and Gemini overlays appear together at 0:27, then fade over the stationary app; the long evidence detour is removed. The comparison ends over moving footage, and the close uses the app’s yellow y mark with a centered Devpost credit. Colorful circles, kinetic titles, short particle bursts and camera moves connect the story. Redundant editorial pills and silent tails are removed. The cursor uses the original macOS arrow, moves aside during typing and targets actual controls.

The screen recordings use the redesigned app and real Gemini 3.8 Flash / Parallel responses. The report found **11 sources**. Two actual clips were submitted to Gemini: the location footage, then the same footage with a demolition deadline and conflicting room dialogue. Gemini detected the added text and the still-missing protagonist. Editorial panels summarize that feedback; they do not present a generated finished film. Provider waits are condensed.

- `index.html`, `film.css` and six referenced files in `compositions/frames/` are the editable composition.
- `assets/dopamine/` holds the recordings, actual uploaded clips, live response evidence and voice tracks.
- `SCRIPT.md`, `narration.json` and `STORYBOARD.md` describe the current cut.
- `subtitles.en.srt` contains optional English captions aligned from the generated audio with Gemini; `subtitle-cues.json` stores the same timings.
- `ledger.json` records the five directional seams.
- `CREDITS.md` and `UPLOAD_DESCRIPTION.md` contain media provenance and required music attribution.

The CLI stays pinned to **HyperFrames 0.8.31**. The latest-version upgrade probe failed with npm ETARGET for 0.8.32; the pinned version passed local checks. Chromium and FFmpeg are required. All source media needed for this cut is included; rerendering needs no provider credentials.

The soundtrack is Kevin MacLeod’s **Electrodoodle**, CC BY 4.0, with narration-aware level/EQ automation. Puck, Kore and Charon are generated Google Cloud Gemini TTS voices. Publication and Devpost submission are separate from rendering this file.

Validation of this timing revision: HyperFrames lint, runtime, layout and contrast checks pass without findings. Narration and subtitle cues follow the new scene positions. The two removed narration sentences are cut at a sentence boundary.

Final MP4 verified at 1920×1080, 30 fps, 89 seconds with AAC audio. Thirty-four decoded frames plus the closing logo handoff were checked. Audio measures −14.50 LUFS integrated / −1.05 dBTP. SHA-256: `8c1b553376d76400495e89877d621a7df717e112a1ff8b3e0f8ee9a16c157c78`.
