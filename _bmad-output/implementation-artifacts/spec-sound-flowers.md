---
title: 'Звуковые цветки — адаптация игры LogoToti'
type: 'feature'
created: '2026-11-15'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** LogoToti already lists «Звуковые цветы», but there is no route or implemented game. The reference project contains a four-flower voice-training concept, while the existing app already provides sound selection, shared game chrome, audio preference, speech synthesis, and a speech recognition wrapper.

**Approach:** Add a self-contained LogoToti game route that takes the selected `soundId`, presents four reference-inspired flowers and their original animal/parrot visual assets where available, and offers independently selectable loud, quiet, short-burst, and sustained exercises. Analyze microphone audio with Web Audio for level and timing, and use browser speech recognition where available to verify the selected sound. Preserve the existing sound preference and confirm before leaving so progress is not lost accidentally.

## Boundaries & Constraints

**Always:** Inspect and adapt assets/logic from `/Users/ll402/Downloads/звуковые-цветы`; do not copy the old app wholesale. Keep the current sound selector and route parameter flow. Keep other games unchanged. Use shared audio preference; disabling output must not disable microphone input. Require both a sound match and mode-specific acoustic evidence to pass; never count button press or silence as success. Keep tasks selectable in any order, allow replaying Toti's prompt, show progress, handle unsupported APIs/mic permission errors in clear Russian, and make the game touch-friendly in portrait and landscape with safe areas and reduced-motion support. Do not label legacy Kesha recordings as Toti recordings.

**Ask First:** None anticipated.

**Never:** Replace reference animals with emoji where suitable source art exists; create a CSS-drawn replacement parrot; rewrite the app, alter sound selection, or modify other games; present loudness/duration heuristics as clinically reliable phoneme assessment.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Valid sound route; supported mic and SpeechRecognition; user performs selected exercise | Correct sound and corresponding level/timing evidence satisfy that flower; mark it complete and preserve progress when another is chosen | N/A |
| WRONG_MODE | Sound recognized but loudness/duration/pulse pattern does not meet selected flower condition | Do not pass; explain the specific mode condition and allow retry | Clear retry prompt; do not treat silence as quiet speech |
| MISSING_API | Speech recognition, Web Audio, or microphone unavailable/denied | Keep flowers and instructions usable; do not falsely award an acoustic task | Explain required permission/support and offer retry where appropriate |
| EXIT_ACTIVE | User requests back while game has progress | Show themed confirmation; stay preserves progress, confirmed exit returns to sound's game list | N/A |

</frozen-after-approval>

## Code Map

- `src/App.jsx` — route dispatch and shared header visibility for standalone game pages.
- `src/data/games.js` — game card metadata and category association.
- `src/pages/GameSelectionPage/GameSelectionPage.jsx` — existing navigation builds category-based game paths.
- `src/components/GameChrome/GameChrome.jsx` — shared game header, audio toggle, and exit confirmation.
- `src/utils/audioPreference.js` and `src/utils/speechSynthesis.js` — app-wide sound preference and TTS.
- `src/utils/speechRecognition.js` — existing Russian speech recognition wrapper; can accept an externally owned stream.
- `/Users/ll402/Downloads/звуковые-цветы/src/` — reference game behavior, art, character, and audio-analysis implementation to inspect and selectively adapt.

## Tasks & Acceptance

**Execution:**
- [x] Inspect the reference source, identify flower animals/parrot assets and licensing/availability constraints, and adapt only reusable assets and game-specific visuals.
- [x] Add `src/games/SoundFlowers/SoundFlowers.jsx` and `.css` for four selectable flowers, sound-driven prompts/examples, Toti dialogue/replay, mic interaction, per-flower progress, completion, settings/audio controls, responsive layout, and confirmed exit.
- [x] Add or extend a focused audio-analysis utility for mic acquisition, ambient baseline, adaptive level and voiced-interval measurement; combine with speech recognition only where supported and require mode-specific criteria.
- [x] Register route and hide generic header on this game route in `src/App.jsx`; ensure metadata in `src/data/games.js` routes to the new game without changing selection flow.
- [x] Verify production build and inspect all changed paths for unsupported API and cleanup behavior.

**Acceptance Criteria:**
- Given any valid selected `soundId`, when the game opens, then all four exercises use that sound without another sound selector.
- Given any flower, when selected or replay is requested, then the corresponding Russian Toti instruction is visible and is spoken only when app sound is enabled.
- Given speech that matches the selected sound but fails the flower's level or timing requirement, when analysis ends, then the flower remains incomplete and the user receives mode-specific retry feedback.
- Given four successful exercises in any order, when the last is completed, then all four show completion and Toti gives the finish message.
- Given denied microphone access or unsupported required browser capabilities, when the user starts listening, then a useful message appears and no flower is falsely awarded.
- Given active progress, when back is requested, then cancellation stays in-game without resetting progress and confirmation exits to the selected sound's game list.
- Given mobile viewport/orientation changes, when the game is displayed, then four touch targets, mentor, and microphone controls remain usable without horizontal scrolling or overlapping controls.

## Verification

**Commands:**
- `npm run build` — expected: Vite production build succeeds.

**Manual checks (if no CLI):**
- Open route using a selected sound, select each flower, replay prompts, inspect progress/completion and back-confirm flow; verify layout in narrow portrait and landscape.
- In a supported HTTPS browser, grant microphone permission and test sound match plus each mode's acoustic threshold; separately test denial/unsupported API messaging. Browser speech recognition and actual microphone behavior require a real browser/device; a build cannot validate them.

## Suggested Review Order

**Game flow and sound verification**

- Start at the routed game component to see how selected sound, mentor, and exercise states connect.
  [`SoundFlowers.jsx:30`](../../src/games/SoundFlowers/SoundFlowers.jsx#L30)
- Review the combined audio capture, recognition gate, and mode-specific RMS/duration/burst rules.
  [`soundFlowerAnalyzer.js:9`](../../src/utils/soundFlowerAnalyzer.js#L9)
- Check route registration and generic-header suppression for the standalone game.
  [`App.jsx:17`](../../src/App.jsx#L17)

**Visual adaptation and responsive controls**

- Compare inline animal/parrot illustrations and responsive flower presentation to the reference.
  [`SoundFlowers.css:1`](../../src/games/SoundFlowers/SoundFlowers.css#L1)
- Confirm the game card copy identifies all four practice modes.
  [`games.js:12`](../../src/data/games.js#L12)
