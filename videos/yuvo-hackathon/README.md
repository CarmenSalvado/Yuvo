# Yuvo hackathon film

English product demonstration, 131.71 seconds, 1920 × 1080 at 30 fps.

```sh
cd videos/yuvo-hackathon
npm run dev
npm run check
npm run render -- --variables '{"musicSource":"assets/funkorama.mp3"}' --quality high --fps 30 --workers 1 --low-memory-mode --video-frame-format png --output renders/yuvo-hackathon-motion-ccby.mp4
```

The CLI is pinned to HyperFrames 0.8.31. Rendering requires Chromium and FFmpeg. One worker streams output instead of retaining every Full HD frame on disk. The CC BY edition includes all required media and fonts; no provider credentials are needed. The review soundtrack uses the user-provided MP3 copied locally to `assets/cirrus-review.mp3` and excluded from Git. Studio defaults to that review track; the command above selects the bundled licensed alternative.

Local exports: `renders/yuvo-hackathon-motion.mp4` uses Cirrus for review; `renders/yuvo-hackathon-motion-ccby.mp4` uses Funkorama with the attribution in `UPLOAD_DESCRIPTION.md`. Both include narration and interaction effects.

- `index.html` assembles seven editable scenes from `compositions/frames/`.
- `SCRIPT.md` and `narration.json` contain the English script and three Google TTS voice selections.
- `subtitles.en.srt` is the optional subtitle track. UI text stays unobstructed in the MP4.
- `CREDITS.md` records the stock footage, music license, voices and marks.
- `UPLOAD_DESCRIPTION.md` contains the accompanying description and required music attribution.

The app recordings contain actual Gemini 3.8 Flash and Parallel responses. Provider waiting intervals are condensed; final result frames are held while the narration finishes. Two shots enlarge the actual stock clips uploaded in the recording. The second clip is a different extract of the same location test, not a completed narrative film. The original landing animation remains a separate scripted preview.

Motion revision 2 uses camera moves through the real recordings, evidence dots that become rooms and a video window, traveling provider connections and kinetic type. The narration and source results are unchanged. A small macOS pointer follows the actions; click, pop and short whoosh effects are mixed below speech. The text pointer is restricted to the input field.

Scenes: `01-hook`, `02-idea`, `03-direction`, `04-first-cut`, `05-next-cut`, `06-built`, `07-close`. The timing ledger records six matched-motion transitions.

Rendering is local. Publishing the film, changing repository visibility and submitting to Devpost are separate actions.
