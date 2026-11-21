---
title: 'LogoToti Games — completion, Speech Ladder recognition, and Back buttons'
type: 'feature'
created: '2026-11-19'
status: 'done'
route: 'dispatch'
baseline_commit: 'NO_VCS'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Completion experiences, microphone recognition in Speech Ladder, and Back button behavior vary across LogoToti Games, making rewards feel inconsistent, phoneme practice unreliable, and navigation difficult to use on touch devices.

**Approach:** Preserve the existing React/router/game architecture while standardizing a reusable, game-themed completion experience, improving Speech Ladder's real microphone recognition and consonant matching, and consolidating compact accessible Back controls. Keep game-specific copy and routes; when no next activity is defined, the next-game action opens that sound's existing game-selection route rather than inventing a sequence.

## Boundaries & Constraints

**Always:** Study existing game completion, recognition, navigation and CSS before edits. Keep per-game mechanics, target sound route data, Toti and existing destinations intact. Completion UI must offer Home, next activity, and replay; when no next activity is in the current scenario, use the existing sound's game-selection page. Replay must reset game state and microphone resources and guard double activation. Speech Ladder must use real microphone input and selected phoneme evidence, never timers/noise as success; allow consonant-only evidence when the task is a consonant-vowel syllable, while preserving hard/soft distinctions and rejecting unrelated phonemes. Recognition/service/mic errors must allow retry without game progress corruption. Back controls remain compact, consistently styled, touch-friendly and preserve their existing navigation or active-game exit confirmation behavior. No claims of hardware verification without actual device tests.

**Never:** Rewrite the app or unrelated game mechanics; create a sequential next-game route that does not exist (the existing game-selection page is the fallback destination); treat a fixed timer or arbitrary audio activity as a recognized phoneme; weaken target matching so unrelated sounds count; remove existing exit confirmations.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| GAME_COMPLETE | Game reaches its existing completion condition | Themed celebration appears with Home, next activity or existing game-selection destination, and replay; no repeated activation | Preserve completion state until action |
| REPLAY | Completion action selected | Same game starts cleanly with counters/results/mic reset | Ignore double activation while navigating |
| LADDER_CONSONANT | Target syllable such as РЭ/РЕ; child says Р | Accept exact target consonant evidence and advance once | Reject unrelated consonant |
| LADDER_SYLLABLE | Target syllable; child says full syllable | Accept and advance once | Preserve hard/soft matching rules |
| MIC_RETRY | Failed recognition followed by another press | One active capture; retry available with friendly feedback | Stop/release prior tracks and recognition before next attempt |
| BACK_TOUCH | User taps category/game Back control | One tap navigates to existing destination; control has adequate hit target and no overlay | Keep active-game confirmation semantics |
| MIC_UNAVAILABLE | Permission/API/recognition failure | Friendly retry message; no unintended progress | No technical details shown to child |

</frozen-after-approval>

## Code Map

- `src/App.jsx` — route table, game routes and shared shell.
- `src/games/*/*.jsx` and colocated CSS — game completion state and game-specific reset/navigation.
- `src/games/SpeechLadder/SpeechLadder.jsx` / `.css` — ladder capture, phoneme matching, feedback and controls.
- `src/utils/speechRecognition.js` — shared Web Speech wrapper and syllable matching; preserve callers.
- `src/utils/soundFlowerAnalyzer.js` — shared-stream Web Audio + SpeechRecognition pattern to inspect/reuse where appropriate.
- `src/components/GameResult/GameResult.jsx` / `.css` — existing reusable score completion UI consumed by Words, Sentences and Speech Ladder.
- `src/components/BackButton/BackButton.jsx` / `.css` — shared Back control used by content and game-selection pages.
- `src/pages/CategorySelectionPage/CategorySelectionPage.jsx` / `.css` — category back layout; `bottom: 60px` offsets following content upward into the preceding control's paint/hit region.
- `src/pages/GameSelectionPage/GameSelectionPage.jsx` / `.css` — explicit category return route; global Header also has a separate history-based Back button.
- `src/components/GameChrome/GameChrome.jsx` / `.css` — standalone game header and confirmed exit behavior.

## Tasks & Acceptance

**Execution:**
- [x] Inventory all completion flows and integrate a reusable responsive themed completion component across score-based results and bespoke victories (VowelFlower, SoundPath); add SoundFlowers completion if its four exercises currently lack terminal affordance. Supply game-themed copy, Home, game-selection fallback/valid next action, replay reset, and double-activation guard.
- [x] Trace Speech Ladder capture/matching against existing utilities. Prevent overlapping starts during asynchronous permission/start; preserve stream cleanup and friendly errors. Generalize consonant-only recognition for consonant-vowel targets without weakening exact-word mode or accepting unrelated/hard-soft-confused phonemes.
- [x] Consolidate Back button presentation across all route Back controls; preserve game-local previous-step controls and active-game exit confirmation. Fix category-page overlap caused by upward content offsets; ensure adequate hit target and no pointer interception. Ensure category content remains scrollable on short mobile screens so all categories remain reachable.
- [x] Add automated tests for syllable/consonant matching, exact-word isolation, completion decision/navigation cases and retry lifecycle where feasible; run tests and production build.

## Implementation Notes

- Standardized score results and game victories around themed completion actions, using existing Home and game-selection routes. Added a four-exercise completion result to SoundFlowers.
- Speech Ladder now accepts exact isolated target consonants for consonant-vowel syllables, prevents duplicate step progression and concurrent permission/start attempts, and exposes only friendly retry guidance.
- Shared BackButton now has a 44px hit target and focus styling; removed upward relative offsets on the category screen.
- Added Node tests for consonant/syllable match boundaries, exact-word isolation, and completion next-action fallback.
- Verification: `node --test src/utils/*.test.js` passed (12 tests); `npm run build` succeeded.

**Acceptance Criteria:**
- Given any game reaches completion, when its result is shown, then the child sees a themed celebratory UI and Home, replay, and next activity/game-selection actions that use existing routes.
- Given replay is activated, when the game restarts, then all game progress, answer and mic state is reset once.
- Given Speech Ladder targets a consonant-vowel syllable, when the selected consonant alone or full syllable is recognized, then the current step advances once; unrelated consonants do not pass and exact-word matching remains unchanged.
- Given microphone errors or failed recognition, when the child retries, then friendly guidance appears and a fresh attempt can begin without leaked streams or stale progress.
- Given the category screen or any section displays Back, when used on touch or desktop, then it is compact, consistently styled and reliably activates the original destination.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `node --test src/utils/*.test.js` — expected: focused utility and edge-case tests pass.
- `npm run build` — expected: Vite production build succeeds.

**Manual checks:**
- Run each game to completion, test Home/next/replay including double taps; exercise Speech Ladder with hard/soft consonants, consonant-only/full syllables and retries; tap Back controls at mobile viewport widths. Browser microphone and WebView behavior require physical/supported browser testing.
