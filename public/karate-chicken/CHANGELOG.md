# Karate Chicken — Changelog

All notable releases. Version = service-worker cache + `?v=` asset version.

## v80 — 2025-11-22
- THE JOKER: new boss at 20,000 pts — 20 hearts, flips sides mid-approach, WHY SO SERIOUS?! voice
- Karate Chicken dons the bat cowl while the Joker is on the field
- Joker added to guide, record page, and gate news

## v79 — 2025-11-22
- Explainer video now plays the recorded voiceover — tap to play, voice restarts each 15s loop

## v78 — 2025-11-22
- Menu gains "🎬 HOW TO PLAY — 15s" → animated explainer page
- Sound Studio can now record a voiceover while the explainer loops

## v77 — 2025-11-22
- Password screen now summarizes all recent changes (6-item list)

## v76 — 2025-11-22
- After the Mega Meatball, regular enemies move ~18% slower (post-boss cooldown)

## v75 — 2025-11-22
- Gate news list refreshed: anytime egg, Mega Meatball, meatball squad

## v74 — 2025-11-22
- Mega Meatball now retracts on every hit (knockback 40 → 200)

## v73 — 2025-11-22
- Dedicated badge changed: was "5 days in a row" → now "play 5× a day, 3 days in a row" (daily play counts tracked)

## v72 — 2025-11-22
- Earn every badge → the ANYTIME GOLDEN EGG: one free egg per game, usable with empty Ki

## v71 — 2025-11-22
- Golden Egg deals only half damage to the Mega Meatball — it survives and keeps rolling

## v70 — 2025-11-22
- Real recorded voices for the meatball squad and Mega Meatball replace the synth placeholders

## v69 — 2025-11-22
- Voices for the meatball squad ("HERE COME THE MEATBALLS!") and Mega Meatball — real audio files with TTS fallback

## v68 — 2025-11-22
- Meatball squad speed .8 → .6 (a little slower)

## v67 — 2025-11-22
- THE MEGA MEATBALL: final boss at 15,000 pts — 15 hearts, twice Karate Chicken's size, storms back in from the other side after 7 hearts fall, with its own voice

## v66 — 2025-11-22
- Meatball squad speed .42 → .8 (medium)

## v65 — 2025-11-22
- Caesar is now fast (1.15× — quickest enemy in the dojo) for his once-per-game 5k duel
- The 10k boss is now a squad: four meatballs roll in at once, two from each side, 8 hearts each

## v64 — 2025-11-22
- Fixed: pressing Enter in the password field launched a game instead of showing the menu
- DOJO NEWS popup now appears right after the password, before the menu

## v61–v63 — 2025-11-22
- Fixed frozen game for players on stale cached files (null-safe overlay logic)

## v60 — 2025-11-22
- Due to popular demand: the Laser Shark is completely removed — the Golden Egg clears the screen every time
- Meatballs no longer spawn randomly — one giant Meatball boss appears at 10,000 pts (solo duel, like Caesar)
- Caesar still arrives at 5,000 but only once per game
- New DOJO NEWS popup on the landing page announcing the shark's departure

## v59 — 2025-11-20
- Password gate now shows FRESH FROM THE DOJO — a running list of the 3 latest updates

## v58 — 2025-11-19
- Laser Shark volley: the cannon fires one beam at every enemy on screen simultaneously — all struck at once, each with its own zap, while the main beam keeps sweeping

## v57 — 2025-11-19
- Leaderboard reset for the new games — old board preserved in 🏛️ HALL OF LEGENDS (toggle button inside the dojo board)
- Meatballs are now rarer (~10% of spawn rolls instead of 25%)

## v56 — 2025-11-19
- Laser Shark zap is now instant — every enemy vaporizes the moment you press it; the shark's swim across is a victory lap

## v55 — 2025-11-19
- Meatball cap: never more than 2 rolling meatballs on screen at once

## v54 — 2025-11-19
- **New character: the iPhone 4 (2011)** — wanders onto the battlefield from time to time on tiny legs, does absolutely nothing, and wanders off. Faint marimba ding announces its arrival. Added to the Character Guide with a properly mocking backstory

## v53 — 2025-11-19
- Laser Shark now vaporizes the whole field at once — one simultaneous zap when the beam crosses center, instead of sweeping enemies one by one
- Menu button renamed: 📖 CHARACTER GUIDE

## v52 — 2025-11-19
- THE STORY button now opens the Character Guide — portraits of every character (drawn with the game's real sprite code) plus official backstories. Now always visible on the menu

## v51 — 2025-11-19
- Installed your recorded gate voice (`gate.webm`) and laser zap (`laser.webm`); new recordings added to service-worker precache for offline play

## v50 — 2025-11-19
- Password gate now speaks: "To enter my dojo, you need to know the password." — plays a `gate.*` recording if installed (new Sound Studio row), otherwise falls back to spoken TTS. Retries on first tap if autoplay blocks it

## v49 — 2025-11-19
- **Laser sound**: the shark now blasts a proper descending laser zap when it fires (synth built-in, new `laser` row in Sound Studio to record your own)

## v48 — 2025-11-19
- Game-over audio: your recorded `gameover.webm` plays on death (preloaded at boot so the first game over gets it)

## v47 — 2025-11-19
- Caesar now returns on a fixed schedule — every 5,000 pts (5k, 10k, 15k…) the field clears and he walks in. No more random repeat roll

## v46 — 2025-11-19
- Game over now names your killer: "VENI. VIDI. VICI." (Caesar), "MEATBALLED!", "LUCY GOT YOU!", "OUT-WEASELED!", "BADGERED TO DEATH!", "TANGLED IN THE PHRAGMITES!", "GREED KILLS!" — plus a 🦈 Laser Shark unlocked callout when you've beaten Caesar

## v45 — 2025-11-19
- 5,000 pts now triggers a proper boss entrance: whatever's on screen clears in a burst, then "HERE COMES CAESAR!" + recording play, then he walks in. No waiting for the field to empty

## v44 — 2025-11-19
- Caesar's debut is now guaranteed: the first time the field clears past 5,000 pts, he appears. Repeat visits keep the 40% roll

## v43 — 2025-11-19
- **Fix:** recording preload calls ran before the sfx code's `const`s existed (TDZ error) — `caesar`/`lucy`/`welcome` resolve never actually fired, so the recording never played. Moved below the audio block; Caesar's voice now plays on every spawn

## v42 — 2025-11-19
- "HERE COMES CAESAR!" now holds a full 2 seconds — Caesar enters right as it fades

## v41 — 2025-11-19
- Caesar's entrance now plays out fully before he walks in: "HERE COMES CAESAR!" + your recording, then ~1.4s later he appears (pause-safe)

## v40 — 2025-11-19
- Caesar's recorded entrance now preloads at boot (first spawn no longer falls back to synth), and his warning is full-size 48px "HERE COMES CAESAR!" like Lucy's

## v39 — 2025-11-19
- **Laser Shark**: after you beat Caesar, the Ki button turns into 🦈 SHARK. Full Ki summons a shark that flies across the dojo, head-mounted laser zapping every enemy in its path (75 pts each, ZAP! popups). HUD reads "LASER SHARK READY!"
- Recorded voice installed: **caesar**; lucy re-recorded

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
