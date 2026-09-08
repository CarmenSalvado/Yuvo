# Yuvo hackathon film

English product demonstration, 131.71 seconds, 1920 × 1080 at 30 fps.

```sh
cd videos/yuvo-hackathon
npm run dev
npm run check
npm run render -- --quality high --fps 30 --workers 1 --low-memory-mode --video-frame-format png --output renders/yuvo-hackathon.mp4
```

The CLI is pinned to HyperFrames 0.8.31. Rendering requires Chromium and FFmpeg. The low-memory flag streams output instead of retaining every Full HD frame on disk. All media and fonts required for rendering are local; no provider credentials are needed to render.

- `index.html` assembles seven editable scenes from `compositions/frames/`.
- `SCRIPT.md` and `narration.json` contain the English script and three Google TTS voice selections.
- `subtitles.en.srt` is the optional subtitle track. UI text stays unobstructed in the MP4.
- `CREDITS.md` records the stock footage, music license, voices and marks.
- `UPLOAD_DESCRIPTION.md` contains the accompanying description and required music attribution.

The app recordings contain actual Gemini 3.8 Flash and Parallel responses. Provider waiting intervals are condensed; final result frames are held while the narration finishes. Two shots enlarge the actual stock clips uploaded in the recording. The second clip is a different extract of the same location test, not a completed narrative film. The original landing animation remains a separate scripted preview.

Scenes: `01-hook`, `02-idea`, `03-direction`, `04-first-cut`, `05-next-cut`, `06-built`, `07-close`. The timing ledger records six matched-motion transitions.

Rendering is local. Publishing the film, changing repository visibility and submitting to Devpost are separate actions.
