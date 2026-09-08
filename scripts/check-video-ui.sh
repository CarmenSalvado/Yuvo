#!/usr/bin/env bash
# UI integration check; provider responses are explicitly mocked, clips are real.
# Usage: bash scripts/check-video-ui.sh http://localhost:3017 /path/first.mp4 /path/second.mp4
set -euo pipefail
browser() { npx --yes agent-browser --session yuvo-video-check "$@"; }
trap 'browser close >/dev/null' EXIT
browser open "${1:-http://localhost:3017}/start"
browser snapshot -i
invite_code=$(node --env-file=.env.local --input-type=module -e 'process.stdout.write(process.env.ACCESS_CODE)')
browser find label 'Access code' fill "$invite_code"
unset invite_code
browser press Enter
browser wait '#idea'
browser find role button click --name 'View a sample report'
browser click '#tab-next'
browser wait '#cut-file'
browser eval 'document.querySelector("#video-room").scrollIntoView(); window.realFetch = window.fetch; window.videoCalls = []; window.failNext = true; window.fetch = async (url, options) => { if(url !== "/api/video") return window.realFetch(url, options); window.videoCalls.push(options.body); if(window.failNext) { window.failNext = false; return Response.json({error:"Test failure: retry the attached clip."},{status:502}); } return Response.json({summary:"Test feedback: a hallway fills the frame.", comparison:options.body.has("previous") ? "Test comparison: the second cut starts further down the hallway." : "", moments:[{seconds:1, observation:"Test observation: a doorway is visible.",suggestion:"Hold this frame."}],nextMove:"Test next move: hold the opening."}); }'
browser upload '#cut-file' "${2:?first clip required}"
browser wait '.cut-player'
browser wait --fn 'document.querySelector(".cut-player").readyState >= 1 && !document.querySelector(".cut-upload button[type=submit]").disabled'
browser eval 'window.attachedVideo = document.querySelector(".cut-player"); window.attachedVideo.muted = true; window.attachedVideo.play()'
browser click '#tab-research'
browser eval 'if (!window.attachedVideo.paused) throw Error("Hidden video kept playing")'
browser click '#tab-next'
browser eval 'if (document.querySelector(".cut-player") !== window.attachedVideo || !document.querySelector(".cut-filename")) throw Error("Switching tabs lost the attached video")'
browser find role button click --name 'Review this cut →'
browser wait '.cut-upload .inline-error'
browser eval 'if (!document.querySelector(".cut-filename")) throw Error("Lost clip after provider error")'
browser find role button click --name 'Review this cut →'
browser wait '.cut-feedback'
browser eval 'if (window.videoCalls.at(-1).get("video").size < 1 || window.videoCalls.at(-1).has("previous")) throw Error("Invalid first-cut payload")'
browser upload '#cut-file' "${3:?second clip required}"
browser wait --fn 'document.querySelector(".cut-player").readyState >= 1 && !document.querySelector(".cut-upload button[type=submit]").disabled'
browser find role button click --name 'Compare both cuts →'
browser wait '.cut-comparison'
browser eval 'const data = window.videoCalls.at(-1); if (!(data.get("video") instanceof File) || !(data.get("previous") instanceof File)) throw Error("Comparison is missing actual files"); if (document.querySelectorAll(".cut-tabs button").length !== 2) throw Error("Missing cut switcher")'
browser find role button click --name 'Watch moment at 0:01'
browser eval 'if(document.querySelector(".cut-player").currentTime < 1) throw Error("Timestamp did not seek"); document.querySelector(".cut-player").pause()'
browser eval 'document.querySelector(".cut-toolbar").scrollIntoView({block:"center", behavior:"instant"})'
browser find role button click --name 'Cut 1' --exact
browser eval 'if(document.querySelector(".cut-comparison")) throw Error("Feedback belongs to wrong cut")'
browser find role button click --name 'Cut 2' --exact
browser set viewport 390 844
browser eval 'document.querySelector("#video-room").scrollIntoView(); if(document.documentElement.scrollWidth > innerWidth) throw Error("Video room overflows mobile")'
browser screenshot /tmp/yuvo-video-mobile.png
browser set viewport 1440 1000
browser eval 'document.querySelector("#video-room").scrollIntoView()'
browser screenshot /tmp/yuvo-video-desktop.png
browser eval 'window.fetch = window.realFetch'
