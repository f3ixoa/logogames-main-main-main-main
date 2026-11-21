---
title: 'Звуковые цветки — один ряд и распознавание как в предложениях'
type: 'feature'
created: '2026-11-15'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The current flower grid is 2×2 even on mobile, while the requested composition is a compact single row. The game currently uses a separate Web Audio + recognition flow, while the Sentences category already uses the app’s shared `startSpeechRecognition` helper and status/error/transcript handling.

**Approach:** Preserve the existing game and adapt its four flowers into one proportional horizontal row at all breakpoints, sizing the flower illustrations to fit without clipping or horizontal scrolling. Align SoundFlowers recognition lifecycle and feedback with the Sentences page’s use of `startSpeechRecognition`, `isSpeechRecognitionSupported`, exact-word matching, permission/error display, transcript feedback, and retry semantics; retain Web Audio mode-specific loudness/duration/burst checks alongside the selected sound match, plus the existing per-flower third-failure self-assessment.

## Boundaries & Constraints

**Always:** First inspect `src/pages/SentencesPage/SentencesPage.jsx` and shared recognition utilities, and base the integration on their actual working pattern. Preserve the selected route sound, four modes, Toti text/voice, animals, existing success animations, individual failure counts and fallback behavior. Use real microphone permission/capture and recognition; combine target match with the exercise’s Web Audio evidence. Keep independent stream ownership, cleanup, error messages and no-score behavior on permission/technical errors or no audio. Keep one-row presentation on phone, tablet, and desktop with no horizontal scrolling, proportionate visuals and touch targets. Do not modify other games or the sentence game. Clearly report that only builds/static code can be verified unless a live microphone/device test is actually performed.

**Ask First:** None anticipated.

**Never:** Replace recognition with a timer, simulated transcript, random result or acoustic-only pass; break the shared recognition API for other games; return to a 2×2 grid on narrow screens; remove the three-failure manual self-assessment.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| RECOGNITION | Valid sound selection and supported browser; child speaks target | Shared recognition helper reports transcript/match; Web Audio also checks selected mode before passing | Display live transcript and actual helper errors; do not award absent match |
| PERMISSION | User denies mic or browser lacks recognition | Show clear permission/support guidance; preserve flower completion and attempt counters | Retry after permission or supported browser is available |
| MODE_AUDIO | Target recognized but loud/soft/short/long evidence fails | Do not pass and count one audio-bearing failed attempt for that flower | No count for empty signal or technical failures |
| THIRD_FAILURE | Three actual unsuccessful attempts on one mode | Show «Я произнёс правильно» only for that flower; self-assessment completes once | Other flower counters and completion state remain unchanged |
| ONE_ROW | Narrow phone, tablet or desktop widths | All four flowers remain in one row, each visible and tappable, no horizontal scroll | Adapt flower artwork/gaps/button labels proportionally without clipping |

</frozen-after-approval>

## Code Map

- `src/pages/SentencesPage/SentencesPage.jsx` — established browser recognition setup, transcript display, error handling, retries and outcomes.
- `src/utils/speechRecognition.js` — shared Web Speech wrapper, mic permission and sound/word match behavior.
- `src/games/SoundFlowers/SoundFlowers.jsx` — current per-flower interactions, counters, helper UI and result flow.
- `src/utils/soundFlowerAnalyzer.js` — real microphone capture and Web Audio mode-specific measurements.
- `src/games/SoundFlowers/SoundFlowers.css` — current grid, flower sizing and responsive rules.

## Tasks & Acceptance

**Execution:**
- [x] Reconcile `src/utils/soundFlowerAnalyzer.js` / `src/games/SoundFlowers/SoundFlowers.jsx` with the Sentence page’s actual `startSpeechRecognition` pattern, ensuring match is based on the target pronunciation and the helper’s transcript/error callbacks are surfaced. Keep a shared stream only if the wrapper’s existing `stream` option is necessary to combine Web Audio and recognition; avoid duplicate permission prompts and stop resources once.
- [x] Keep `src/games/SoundFlowers/SoundFlowers.jsx` Web Audio mode gates, per-flower counters, third-failure self-assessment, and success preservation intact while adapting transcript, recognition errors, and listening feedback to the sentence-page conventions.
- [x] Change `src/games/SoundFlowers/SoundFlowers.css` to four columns at all viewports, with fluid but sufficiently large square flowers, animal art and controls; prevent overflow at 320px and keep Toti separate and readable.
- [x] Run `npm run build`; inspect helper use and route-selected target behavior. Test on a live supported mic only if available, and distinguish that from build/static verification.

**Acceptance Criteria:**
- Given a sound chosen before entering the game, when a child speaks while holding the flower mic control, then the shared sentence-category recognition path receives the selected sound and real microphone input.
- Given a recognized target but an unmet mode acoustic criterion, when the attempt ends, then the flower does not complete and the per-flower failure count increments exactly once.
- Given permission denial, unsupported recognition, technical recognition failure, or no signal, when the attempt ends, then the user sees a useful message and no failure count increments.
- Given three audio-bearing unsuccessful attempts on one flower, when its result appears, then only that flower displays the self-assessment button and pressing it completes it once without resetting other progress.
- Given supported screen widths from 320px through desktop, when the game renders, then exactly four flowers appear side-by-side in one row without clipping, overlap or horizontal page scrolling.

## Verification

**Commands:**
- `npm run build` — expected: successful Vite production build.

**Manual checks (if no CLI):**
- Compare recording/permission/transcript/error handling to `SentencesPage.jsx` and exercise the selected sound in supported HTTPS browser with microphone access.
- Check 320px phone, wider phone, tablet and desktop layout; confirm one row, readable controls and no horizontal scroll.
- Browser speech recognition and mobile WebView behavior require actual target devices; report exactly which conditions were physically exercised.

## Suggested Review Order

**Recognition flow and exercise gate**

- Begin with the game interaction and per-flower state to see the shared recording flow in context.
  [`SoundFlowers.jsx:30`](../../src/games/SoundFlowers/SoundFlowers.jsx#L30)
- Follow real microphone acquisition, shared recognition callbacks, and Web Audio mode checks.
  [`soundFlowerAnalyzer.js:9`](../../src/utils/soundFlowerAnalyzer.js#L9)
- Compare the reused permission, transcript, and result conventions with the existing sentence workflow.
  [`SentencesPage.jsx:290`](../../src/pages/SentencesPage/SentencesPage.jsx#L290)

**One-row layout**

- Check four-column sizing and narrow-screen controls while retaining square artwork and animal visibility.
  [`SoundFlowers.css:1`](../../src/games/SoundFlowers/SoundFlowers.css#L1)
