# Karate Chicken — Changelog

All notable releases. Version = service-worker cache + `?v=` asset version.

## v38 — 2025-11-19
- **Julius Caesar boss**: once past 5,000 pts, Caesar may appear — and only when the field is empty. He fights you alone (no other enemies spawn while he's up), hops side-to-side like a maniac, and pinwheel-flails his arms. 7 HP, toga + crimson sash + laurel wreath. "HERE COMES CAESAR!" / "ET TU, CHICKEN?!"
- New `caesar` recording slot in Sound Studio — record your own entrance audio (Roman fanfare synth as fallback)

## v37 — 2025-11-19
- Meatball tuned down per feedback: spawns ~25% of the time (was ~50%), and each hit rolls it much farther back (220 vs 100) so you get more time to react

## v36 — 2025-11-18
- **Giant Meatball boss**: once you pass 2,000 pts, a huge 8-HP rolling meatball (~50% of spawns) lumbers in at ~40% speed. Angry face, rotating speckles, low growl. "HERE COMES THE MEATBALL!" / "MEATBALL DOWN!" slow-mo payoff

## v33 — 2025-11-18
- Recorded voices installed: **lucy** (HERE COMES LUCY!), **jackpot**, **gameover**

## v32 — 2025-11-18
- **Lucy voice slot**: `lucy` recording plays on spawn ("HERE COMES LUCY!"), yip-yip bark synth fallback; added to `record.html` SOUND STUDIO

## v31 — 2025-11-18
- Lucy's ears redrawn fanning wide framing the face (per close-up photo)

## v30 — 2025-11-18
- Lucy redrawn more breed-accurately: silky ears past the chin, domed head, wide-set gentle eyes, feathered paws, plume tail

## v29 — 2025-11-18
- "HERE COMES LUCY!" warning much larger (48px)

## v28 — 2025-11-18
- **Boss swap**: boss fox replaced by **Lucy** — a ruby Cavalier King Charles (floppy ears, big dark eyes, harness, feathery tail; 5 HP). "HERE COMES LUCY!" / "LUCY DOWN!". Phragmites boss kept

## v27 — 2025-11-18
- Selfie now covers the **full chicken head** (2× circle, red headband tie at the edge)

## v26 — 2025-11-18
- **Become the Chicken**: 📸 button on the menu opens the front camera, 3-2-1 countdown, crops a square selfie, stores it locally, and your face replaces the chicken's head (red headband ring) in menu + gameplay — retake/remove anytime

## v25 — 2025-11-18
- Removed the computer-generated "yum" TTS voice; combo callouts use recorded `yum.webm`/`yumyum.webm` (soft chime fallback)

## v24 — 2025-11-18
- **Phragmites boss**: 50/50 boss spawns are now giant fox or a swaying reed cluster (6 HP, creeps at half speed, green leaf bursts)
- "HERE COMES THE PHRAGMITES!" spawn warning + "PHRAG DOWN!" slow-mo kill payoff

## v23 — 2025-11-18
- Boss encounters start after 12s of play (was 40s)

## v22 — 2025-11-18
- Badge icons enlarged (54px medal circles, 28px emoji)

## v21 — 2025-11-18
- Per-badge icons in the badge collection: 🩸 First Blood · 🎯 Sharpshooter · 🛡️ Flawless Kata · ⛓️ Chain Master · 🥚 Egg-splosion · 🦊 Jackpot! · 🔥 Dedicated
- Locked badges show 🔒 in a grey desaturated circle

## v20 — 2025-11-18
- **Boss fox**: rare 5-HP giant after 12s (~3%), ~1,000 pts for a clean kill, "⚠ BOSS!" / "BOSS DOWN!" events
- **HAJIME countdown**: 3-2-1-HAJIME! before every run
- **Heartbeat vignette**: pulsing red screen edge at 1 life

## v19 — 2025-11-18
- **Badge collection overlay**: BADGES button on the menu shows all 7 achievements earned/locked with unlock conditions
- **Death cam**: fatal hit triggers slow-mo zoomed on the killer before the over card
- **Day-of-week modifiers**: Lazy Sunday · Fox Frenzy · Iron Tuesday · Weasel Wednesday · Ki Thursday · Fox Friday · Golden Saturday — shown on the menu
- Leaderboard highlights your saved name in gold; save-name field prefills from last run

## v18 — 2025-11-18
- Removed two-player duel mode

## v17 — 2025-11-18
- **Seasonal hats**: pilgrim hat in November, santa hat in December
- Topbar 🎩 button cycles auto → forced → off (persisted)

## v16 — 2025-11-18
- Enhanced perfect-hit slow-mo: 33% speed, camera punch-in, pitch-dip on recorded impact sounds

## v15 — 2025-11-18
- **Mute button**: always-visible topbar toggle, silences synth + recordings, persisted
- **Golden fox**: rare jackpot enemy worth 500×mult
- **Achievements**: 7 unlockable badges
- **Reaction-time stat**: avg ring-entry-to-strike time on the over card
- **Rematch**: counter-challenge link button after beating a `?vs=` rival
- **Visits counter**: `/api/ping` on game start; menu shows "N visits today"
- Recorder slots added: `jackpot`, `gameover`

## v14 — 2025-11
- Score card share includes the challenge URL in the share payload and fallback hint
- Asset URLs versioned (`?v=`); nginx no-cache headers for code files — fixes stale-code on Android/PWA

## v13 — 2025-11
- Story button + welcome voice (`welcome.webm`) — plays after gate unlock, replayable from menu

## v10–v12 — 2025-11
- **Virality pack**: `?vs=NAME-SCORE` challenge links, generated PNG score cards, daily streaks, install button (A2HS), weekly Dojo Board + champion line, Open Graph preview card, perfect-hit slow motion
- Mobile PWA hardening: absolute API paths, SW bypasses `/api/`, network-first code fetch

## Earlier (v1–v9) — 2025-10/11
- Core game: one-thumb strike left/right, fox/badger/weasel enemies, combo multipliers, Ki meter + Golden Egg screen-clear
- Belts, Daily Kata (60s seeded) + Endless modes, Wordle-style segment share
- Client-side password gate
- Weekly leaderboard API (`/karate-chicken/api/scores`) on DigitalOcean
- Custom recorded sound slots + `record.html` in-browser recorder
- Offline PWA: service worker, manifest, icons
