# Yuvo hackathon film

English product demonstration, 131.73 seconds, 1920 × 1080 at 30 fps.

```sh
cd videos/yuvo-hackathon
npm run dev
npm run check
npm run render -- --quality high --fps 30 --workers 1 --low-memory-mode --video-frame-format png --output renders/yuvo-hackathon-final.mp4
```

The current CLI may clear the composition on the final encoded frame. After rendering, hold the preceding frame for that last 1/30 second (audio stays unchanged):

```sh
ffmpeg -y -i renders/yuvo-hackathon-final.mp4 -vf "trim=end_frame=3951,tpad=stop_mode=clone:stop_duration=0.033333333" -frames:v 3952 -c:v libx264 -preset fast -crf 15 -pix_fmt yuv420p -c:a copy -movflags +faststart renders/yuvo-hackathon-final-fixed.mp4
mv renders/yuvo-hackathon-final-fixed.mp4 renders/yuvo-hackathon-final.mp4
```

The CLI is pinned to HyperFrames 0.8.31. Rendering requires Chromium and FFmpeg. One worker streams output instead of retaining every Full HD frame on disk. The CC BY edition includes all required media and fonts; no provider credentials are needed. The review soundtrack uses the user-provided MP3 copied locally to `assets/cirrus-review.mp3` and excluded from Git. Studio and the command above now default to Electrodoodle (CC BY 4.0), used in motion revision 3.

Current export: `renders/yuvo-hackathon-final.mp4`, with Electrodoodle, a brand-first opening that moves from Yuvo to the idea and then the workspace, calmer cursor paths, visual feedback summaries and a side-by-side cut comparison.

Previous local exports: `renders/yuvo-hackathon-motion.mp4` uses Cirrus for review; `renders/yuvo-hackathon-motion-ccby.mp4` uses Funkorama with the attribution in `UPLOAD_DESCRIPTION.md`. Both include narration and interaction effects.

- `index.html` assembles seven editable scenes from `compositions/frames/`.
- `SCRIPT.md` and `narration.json` contain the English script and three Google TTS voice selections.
- `subtitles.en.srt` is the optional subtitle track. UI text stays unobstructed in the MP4.
- `CREDITS.md` records the stock footage, music license, voices and marks.
- `UPLOAD_DESCRIPTION.md` contains the accompanying description and required music attribution.

The app recordings contain actual Gemini 3.8 Flash and Parallel responses. Provider waiting intervals are condensed; final result frames are held while the narration finishes. Two shots enlarge the actual stock clips uploaded in the recording. The second clip is a different extract of the same location test, not a completed narrative film. The original landing animation remains a separate scripted preview.

The story is idea → video → next move. Live attachment footage establishes the workflow; large editorial summaries show the gap between the premise and the actual footage. A split comparison shows what changed between the two real cuts. The final recap uses three plain-language steps and readable integration logos. Music credits stay in the upload description.

Scenes retain their original timing. The opening and 0:54 handoffs match the exact incoming app frames; the other four seams use matched leftward motion. The cursor pauses before clicks, moves aside during typing and rests during review. There are no animated pointer presses or click rings.

Rendering is local. Publishing the film, changing repository visibility and submitting to Devpost are separate actions.
