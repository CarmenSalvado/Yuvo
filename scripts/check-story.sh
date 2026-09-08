#!/usr/bin/env bash
# Run against a local production server: bash scripts/check-story.sh http://localhost:3017
set -euo pipefail
browser() { npx --yes agent-browser --session yuvo-story-check "$@"; }
trap 'browser close >/dev/null' EXIT
browser open "${1:-http://localhost:3000}"
for size in '1440 1000' '390 844' '320 640'; do
  browser set viewport $size
  browser eval '(async () => {
    const stage = document.querySelector(".paper-stage");
    const chapters = [...document.querySelectorAll(".paper-chapter")];
    for (const index of [0, 1, 2, 1, 0]) {
      chapters[index].scrollIntoView({behavior: "instant"});
      for (let attempt = 0; attempt < 40 && stage.dataset.activeChapter !== String(index); attempt++) await new Promise(resolve => setTimeout(resolve, 25));
      if (stage.dataset.activeChapter !== String(index)) throw Error(`Wrong chapter after scroll: ${index}`);
      if (stage.querySelectorAll(".paper-panel[aria-hidden=false]").length !== 1) throw Error("Ambiguous visible scene");
      if (stage.querySelector("[aria-current]").hash !== `#${chapters[index].id}`) throw Error("Navigation out of sync");
      const rect = stage.getBoundingClientRect();
      if (rect.top < -1 || rect.bottom > innerHeight) throw Error("Pinned scene leaves the viewport");
      const panel = stage.querySelector(".paper-panel[aria-hidden=false]").getBoundingClientRect();
      await new Promise(resolve => setTimeout(resolve, 800));
      for (const child of stage.querySelectorAll(".paper-panel[aria-hidden=false] .direction-scene > :not([aria-hidden])")) {
        const bounds = child.getBoundingClientRect();
        if (bounds.height && (bounds.top < panel.top || bounds.bottom > panel.bottom)) throw Error("Research text escapes the scene");
      }
    }
    if (document.documentElement.scrollWidth > innerWidth) throw Error("Horizontal overflow");
    for (const img of stage.querySelectorAll("img")) {
      await img.decode();
      if (!img.naturalWidth) throw Error("Missing illustration");
    }
  })()'
done
browser set media light reduced-motion
browser eval 'if (!document.querySelector("video").paused) throw Error("Autoplay ignores reduced motion"); if (getComputedStyle(document.querySelector(".paper-panel")).transitionDuration !== "0s") throw Error("Scene animation ignores reduced motion"); if (getComputedStyle(document.querySelector(".research-orb")).animationName !== "none") throw Error("Circles ignore reduced motion")'
