# Patient Recruitment — Engagement Concepts

Tactile, phone-first mockups applying the engagement playbook proven in
[Karate Chicken](../karate-chicken/) to clinical trial patient recruitment.

**Hypothesis:** recruitment sites lose most interested patients not to
incompatibility but to *friction* (long forms) and *decay* (weeks of silence
before first contact). Game mechanics that work on casual players fix both.

## Mockups (open on a phone)

| Demo | File | What it replaces | Mechanics ported |
|------|------|------------------|------------------|
| **A · TrialFit** | `trialfit.html` | 15-field web intake form | swipe cards (yes/no/not-sure), card tilt, stamps, progress dots, match-score ring, confetti |
| **B · Research Rounds** | `rounds.html` | the silent gap between interest and first site contact | daily streak flame, 15-second tap game, journey progress map, "did you know" reward card |
| **C · Research Hero** | `hero.html` | word-of-mouth, made shareable | camera → 3-2-1 countdown → selfie on hero avatar → branded PNG share card |

## Karate Chicken → recruitment mapping

- **Swipe/tap input** → zero-typing answers; completion rate >> long forms
- **3-2-1 countdown** → anticipation before a commitment moment (selfie, CTA)
- **Streaks** → daily return habit through the interest→visit dead zone
- **Progress map** → patients see where they are in the funnel; anxiety drops
- **Selfie avatar** → personalization = ownership ("it's *my* trial")
- **Share card** → participant-generated social proof; referrals are the
  cheapest enrollment channel
- **Recorded voice / confetti rewards** → small dopamine hits at milestones

## Suggested pilot metric

Run TrialFit A/B against the current intake form for one study for 2 weeks:
**pre-screen completion rate**, time-on-flow, and click-through to
"talk to the study team." If completion lifts >25%, justify a Rounds pilot
to measure **interest→visit show rate**.

All three demos are dependency-free, run offline, and store state only in
`localStorage`.
