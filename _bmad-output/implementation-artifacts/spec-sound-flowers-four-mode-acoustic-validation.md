---
title: 'Звуковые цветки — проверка режимов произношения'
type: 'feature'
created: '2026-11-15'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The existing game combines selected-sound recognition with Web Audio, but its mode checks rely on broad RMS thresholds and interval timing that may not reliably distinguish quiet from silence or demonstrate distinct short/long target phonation. Feedback also does not clearly separate a sound mismatch from the right sound performed in the wrong way.

**Approach:** Preserve the existing sentence-category speech recognition integration and the four-flower flow. Refine the analyzer to use speech recognition as evidence for the selected target and adaptive Web Audio voice segments for mode criteria: loud, quiet-but-voiced, multiple short separated bursts, and one sustained voiced segment. Make pass decisions conjunctive and route mismatch vs mode-specific failure into clear Toti feedback while retaining per-flower counters and three-failure self-assessment.

## Boundaries & Constraints

**Always:** Study `src/pages/SentencesPage/SentencesPage.jsx`, `src/utils/speechRecognition.js`, and current SoundFlowers implementation before edits. Keep other games and the sentence page unchanged. Preserve route-selected target, one-row layout, Toti, animal art, success state and independent per-flower counters. Use the real mic stream with `getUserMedia`; use shared speech recognition (same target/transcript/error semantics as Sentences) and Web Audio together. Calibrate a background noise floor before classifying voiced frames; silence/noise alone never counts as voice. Loud/soft gates must be distinct, short requires at least three discrete short intervals with actual pauses, and long requires one uninterrupted interval over minimum duration. Technical errors, permission failures and no voiced signal are not failed attempts. Correct target + correct acoustic mode is the only automatic pass. Keep current manual aid available after three valid failed attempts. Distinguish estimates from phoneme truth; browser recognition cannot reliably validate isolated sustained consonants, so document that limitation.

**Ask First:** None anticipated.

**Never:** Use volume or duration alone to award target correctness; count a timer, noise, arbitrary recognition transcript, or no-speech as success; claim clinical recognition precision or physical testing that was not performed; modify the sentence game or other games.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| TARGET_MODE_PASS | Target sound recognized and Web Audio features satisfy selected flower | Complete only that flower; show success mark/animation and Toti praise | N/A |
| TARGET_WRONG_MODE | Voiced signal exists and target recognized but mode feature fails | Do not complete; provide that mode’s specific cue and count one failed attempt | Three failures expose the existing manual self-assessment |
| WRONG_TARGET | Non-target speech/noise or transcript does not match selected sound | Do not complete; tell child to try the target sound again | Count only when audio-bearing speech was captured and no technical error occurred |
| SILENCE | No voiced energy above adaptive noise floor | No success and no failure-count increment | Friendly request to speak closer / try again |
| TECH_ERROR | Permission denied, unsupported recognition/API, service/network/device failure | Show usable Russian error, preserve counters and progress | Allow retry after issue is resolved |

</frozen-after-approval>

## Code Map

- `src/pages/SentencesPage/SentencesPage.jsx` — reference pattern for shared recognition start, transcript, feedback and error handling.
- `src/utils/speechRecognition.js` — shared recognition matching and stream callback wrapper.
- `src/utils/soundFlowerAnalyzer.js` — combined mic lifecycle, target recognition, adaptive Web Audio metrics and mode gates.
- `src/games/SoundFlowers/SoundFlowers.jsx` — success/failure UI, per-flower retry counts and Toti messages.

## Tasks & Acceptance

**Execution:**
- [x] Update `src/utils/soundFlowerAnalyzer.js` to estimate noise from initial frames, track voice-active intervals with bounded silence gaps, summarize peak/mean voiced RMS and per-segment durations, and return explicit target match, voice-detected, mode result, and diagnostic reason. Do not change APIs consumed by other games unless needed; maintain correct release/unmount cleanup.
- [x] Update `src/games/SoundFlowers/SoundFlowers.jsx` to distinguish wrong-target feedback from correct-target/wrong-mode feedback; use the exact requested mode cues, praise successful completion, and preserve three-attempt counts/manual completion. Technical failures and no voice remain non-counting.
- [x] Preserve or refine `src/games/SoundFlowers/SoundFlowers.css` only if needed for success/error feedback; maintain prior one-row four-flower layout and other visuals.
- [x] Add automated tests for every matrix row using `src/utils/soundFlowerEvaluation.test.js`.
- [x] Run `node --test src/utils/soundFlowerEvaluation.test.js` and `npm run build`; inspect threshold/segment logic and resource cleanup. Microphone gate scenarios were not hardware tested.

**Acceptance Criteria:**
- Given a selected target and wrong-target audio, when the mic attempt ends, then the flower is not awarded and Toti asks the child to say the needed sound.
- Given the selected target with low RMS on the loud flower, when the attempt ends, then it fails the loud criterion and receives «Попробуй произнести звук громче!».
- Given the selected target with audible RMS below the calibrated quiet threshold, when attempted on quiet, then it may pass quiet but silence cannot pass; a louder signal must fail quiet with the quieter cue.
- Given the selected target in short mode, when a single continuous sound is spoken, then it fails; at least three discrete short target attempts with pauses must satisfy the acoustic gate.
- Given the selected target in long mode, when only short bursts are captured, then it fails; one sustained voiced segment must meet the long duration criterion.
- Given any mode, when target matching and the corresponding acoustic criterion both pass, then exactly one flower completes and Toti praises the child.
- Given permission/service/technical errors or no voiced signal, when the attempt ends, then no failure count increases.

## Verification

**Commands:**
- `npm run build` — expected: production build succeeds.

**Manual checks (if no CLI):**
- On HTTPS with supported microphone and SpeechRecognition, test each mode with target and wrong sound, including silence, background noise, single long sound in short mode, short burst in long mode, permission denial, and retry counts.
- This session has no reported connected test microphone; do not mark acoustic conditions as hardware-verified based on build/static inspection.
