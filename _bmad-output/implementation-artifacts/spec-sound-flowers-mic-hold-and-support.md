---
title: 'Звуковые цветки — удержание микрофона, масштаб и помощь'
type: 'feature'
created: '2026-11-15'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The existing Sound Flowers game already requests microphone input and combines Web Audio measurements with browser speech recognition, but listening currently runs for a fixed window from a click. The flower layout is too small, and repeated failures do not provide a per-flower self-confirmation aid.

**Approach:** Keep the existing game, visuals, Toti, routes, and acoustic/speech checks. Change mic interaction to press-and-hold capture with release-triggered evaluation, enlarge flower cells and art responsively, and add independent per-flower failure counts with a visible «Я произнёс правильно» aid after three actual failed evaluations.

## Boundaries & Constraints

**Always:** Study and preserve `SoundFlowers.jsx`, its CSS, and `soundFlowerAnalyzer.js` before editing. Use real `getUserMedia`, Web Audio and existing speech recognition; no simulated recognition. Evaluate only after press/release, release and clean up once, and prevent duplicate scoring. A failure means a completed attempt where target recognition or mode audio evidence fails; microphone permission, API, or technical errors do not increment attempts. Keep sound-match AND mode-specific acoustic checks, including multiple distinct short utterances; never pass noise/silence. Keep help counts independent per flower and reveal fallback only at 3 failures; fallback completes only that flower and is not a recognition claim. Preserve Toti and current animation, prompt, color and route behavior. Never describe any mode as physically tested unless it was actually tested with mic on hardware.

**Ask First:** None anticipated.

**Never:** Rewrite the game, relax sound verification to volume-only, replace the existing animals/parrot, or add click-only/manual completion before three failed attempts.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| PRESS_RELEASE | Pointer/touch starts on mic then releases | Capture begins on press, audio/speech checks run on real input, release finalizes once and produces one result | Pointer cancel, release outside button, and unmount stop tracks and do not double-score |
| TECH_ERROR | Permission denied, API unsupported, device error, or no stream | Show a clear Russian permission/support message; do not increment that flower’s failure count | Allow retry after permission is granted |
| MODE_FAILURE | Audio-bearing attempt has wrong sound or mode criteria | Increment only the selected flower’s counter and show retry feedback | No failure increment for technical errors or empty/no-signal capture |
| THIRD_FAILURE | Selected flower reaches three failed attempts | Reveal the themed «Я произнёс правильно» action for that flower only | Keep unavailable on other flowers until their own third failure |
| SELF_CONFIRM | User confirms after threshold | Complete flower once, animate/check it, and retain other flowers’ counters | Repeated presses have no additional effect |
| LARGE_LAYOUT | Desktop/mobile portrait/landscape | Four large, proportional flowers and readable animals remain separated, with Toti and controls unobscured | Adapt to 2×2 or 2-column mobile layouts; no horizontal scroll |

</frozen-after-approval>

## Code Map

- `src/games/SoundFlowers/SoundFlowers.jsx` — exercise selection, prompt flow, microphone UI, results, completion, Toti.
- `src/games/SoundFlowers/SoundFlowers.css` — flower grid/art dimensions, animation and responsive layout.
- `src/utils/soundFlowerAnalyzer.js` — microphone/Web Audio capture, analysis, start/stop lifecycle.
- `src/utils/speechRecognition.js` — existing recognition wrapper and stream handling.

## Tasks & Acceptance

**Execution:**
- [x] Update `src/utils/soundFlowerAnalyzer.js` to expose press-start/release-stop capture, finalize collected real audio and speech results exactly once, and release Web Audio/recognition/MediaStream on release, cancel, and unmount.
- [x] Update `src/games/SoundFlowers/SoundFlowers.jsx` to use pointer/touch/mouse hold semantics, per-flower failed-attempt counters, technical-error exclusion, third-failure self-confirmation, and one-time success feedback while preserving existing copy/character and game state.
- [x] Update `src/games/SoundFlowers/SoundFlowers.css` to enlarge proportional flower art and cells, create separated 2×2 desktop composition and adaptive mobile layouts, and animate help/success without shrinking Toti.
- [x] Verify production build; inspect state and event cleanup; exercise browser permission/errors where a live browser/device is available and report what was actually tested.

**Acceptance Criteria:**
- Given a supported device with microphone permission, when the child holds the mic button and speaks, then real audio capture starts; when released, that single attempt is evaluated using sound recognition and the selected flower’s acoustic rule.
- Given a wrong sound, invalid mode pattern, or detected speech that fails the exercise, when the attempt finalizes, then only that flower’s failure count increases once.
- Given a technical/mic failure or no voice signal, when the attempt ends, then no failure is counted and the interface explains the issue.
- Given the third audio-bearing failed attempt for one flower, when its result is shown, then the self-confirm action appears under that flower; it is absent for flowers below three failures.
- Given eligible self-confirmation, when pressed, then that flower is completed exactly once with success feedback and visual marker.
- Given desktop and small/mobile viewports, when the game renders, then four enlarged proportional flowers are distinct and tappable, Toti remains readable, and no horizontal scrolling or overlap occurs.

## Verification

**Commands:**
- `npm run build` — expected: production build succeeds.

**Manual checks (if no CLI):**
- On HTTPS/localhost in a supported browser, grant microphone access, verify input signal and hold/release, test all four tasks, permission denial, and pointer cancellation. Repeat in target mobile WebViews; Web Speech API support varies.
- Confirm actual device-tested modes in final report. If no physical/browser mic session is available, explicitly state microphone modes remain unverified; do not infer from build success.
