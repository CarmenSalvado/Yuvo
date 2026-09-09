# Yuvo hackathon film

100 seconds · 1920 × 1080 · 30 fps · English narration.

```sh
cd videos/yuvo-hackathon
npm run dev
npm run check
npm run render -- --quality high --fps 30 --workers 1 --no-low-memory-mode --browser-gpu --video-frame-format png --output renders/yuvo-hackathon-dopamine.mp4
```

Current export: `renders/yuvo-hackathon-dopamine.mp4`. The previous 131-second export remains in `renders/yuvo-hackathon-final.mp4` for comparison. Renders are local and excluded from Git.

Six scenes follow one idea through live research, a creative direction, a first video review and a comparison. Colorful circles, kinetic titles, short particle bursts and camera moves connect the story. The cursor uses the original macOS arrow, moves aside during typing and targets actual controls.

The screen recordings use the redesigned app and real Gemini 3.8 Flash / Parallel responses. The report found **11 sources**. Two actual clips were submitted to Gemini: the location footage, then the same footage with a demolition deadline and conflicting room dialogue. Gemini detected the added text and the still-missing protagonist. Editorial panels summarize that feedback; they do not present a generated finished film. Provider waits are condensed.

- `index.html`, `film.css` and six referenced files in `compositions/frames/` are the editable composition.
- `assets/dopamine/` holds the recordings, actual uploaded clips, live response evidence and voice tracks.
- `SCRIPT.md`, `narration.json` and `STORYBOARD.md` describe the current cut.
- `subtitles.en.srt` contains optional English captions aligned from the generated audio with Gemini; `subtitle-cues.json` stores the same timings.
- `ledger.json` records the five directional seams.
- `CREDITS.md` and `UPLOAD_DESCRIPTION.md` contain media provenance and required music attribution.

The CLI stays pinned to **HyperFrames 0.8.31**. The latest-version upgrade probe failed with npm ETARGET for 0.8.32; the pinned version passed local checks. Chromium and FFmpeg are required. All source media needed for this cut is included; rerendering needs no provider credentials.

The soundtrack is Kevin MacLeod’s **Electrodoodle**, CC BY 4.0, with narration-aware level/EQ automation. Puck, Kore and Charon are generated Google Cloud Gemini TTS voices. Publication and Devpost submission are separate from rendering this file.

Validation on 2026-09-09: the app build and all eight automated tests pass, along with the desktop/mobile UI and two-cut upload checks. The film passes HyperFrames lint, runtime, layout and contrast checks and all five numeric seam checks. Thirty-three decoded MP4 frames were checked, including every boundary and the final frame; the brief empty entrance at 1:26 was corrected before delivery. The final export is exactly 100 seconds with AAC audio, measured at −14.68 LUFS integrated and −1.01 dBTP. SHA-256: `8a7efae7f4d40d6ccc328bf89d2db4393afe62f5f541d6c874804943155ce6e4`.
