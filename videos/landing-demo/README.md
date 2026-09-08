# Desktop walkthrough

52-second silent 1440 × 810 (16:9) HyperFrames composition for the website hero. A persistent application window sits over an iOS-inspired wallpaper. An animated pointer types a premise, chooses a direction, opens a file picker twice, attaches two video cuts and compares simulated feedback. Content comes from the prepared demo, not live research.

```sh
npm run check
npx hyperframes render --quality high --fps 30 --output ../../public/media/yuvo-research-demo.mp4
ffmpeg -y -ss 34 -i ../../public/media/yuvo-research-demo.mp4 -frames:v 1 -q:v 3 ../../public/media/yuvo-research-demo-poster.jpg
```

The app serves only the MP4 and poster. Manrope is copied from the app build, with its OFL license. Logos are copies of the official assets documented in `public/brand/SOURCES.md`. The repeated-image lint warning is intentional: logos appear in the working UI and research states. Typing uses the deterministic schedule in `assets/typing.js`.

The downloaded macOS cursor is unmodified; provenance is in assets/SOURCES.md. Click positions derive from the target elements.

Current edition matches Yuvo’s circle motif, pill buttons and pastel feedback cards. The video viewport is larger; finite GSAP arrivals animate the empty state, five-rule motif, file picker and feedback. Original typing and both attachment timings are preserved.

Typing research: [TypeIt usage](https://www.typeitjs.com/docs/vanilla/usage/) (`lifeLike`, variable speed) and [instance methods](https://www.typeitjs.com/docs/vanilla/instance-methods/) (pause, delete, type); also reviewed [Typed.js](https://github.com/mattboldt/typed.js). The render uses a small precomputed schedule in `assets/typing.js` on the existing GSAP clock, so seeking backward reproduces identical letters and corrections. No typing library is installed or run on its own timer. Test: `node --test ../../tests/demo-typing.test.mjs`.
