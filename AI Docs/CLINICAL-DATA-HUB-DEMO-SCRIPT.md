# Clinical Data Hub — 30-Minute Demo Script & Talking Points

**Demo URL:** https://yourmark.ai/clinical-data-hub/
**Password:** `endo2026` (share in advance or on-screen)
**Note:** Gate is session-based per browser tab — log in once during setup, it stays open for the demo.

---

## The Story Arc (memorize this spine)

> "A Phase 3 program with six studies has data trapped in six places. Nobody can answer a simple question — *how is the program enrolling?* — without a week of manual pulls. We fix that with three agents, not three dashboards."

**Three agents = three acts:**
1. **Ingestion Agent** — gets the data out of every platform (API or file)
2. **Identity Resolution Agent** — figures out who's the same person across studies
3. **Insight Agent** — answers questions in plain language, instantly

The dashboard is not the product. The dashboard is the *window* — the agents are the product.

---

## Script (with timings)

### 0:00–0:04 — Hook: The Question Nobody Can Answer
- Open with a question, not a slide: *"Quick — right now, how many subjects are enrolled across your whole endometriosis program? Not one study — all six."*
- Let it land. Then: *"In most organizations that answer takes a week: export from the EDC, reconcile spreadsheets, email three vendors. By the time you have it, it's stale."*
- Introduce the situation from the case study: six studies, subject/site/visit/lab data on separate platforms, some API, some file-only, subjects moving between studies.
- *"So we built a Clinical Data Hub. Three agents do the work. Let me show you."*

### 0:04–0:09 — Act 1: Ingestion Agent (Unified Data Foundation)
- Show the pipeline strip — point at study chips: *"Each of these is a different platform. EDC with an API. ePRO that only ships files. Lab feeds. Safety extracts."*
- Key line: *"The Ingestion Agent doesn't care how the data arrives. Where there's an API it polls; where there isn't it picks up file drops. Everything lands in one canonical schema — subject, site, visit, lab."*
- Point at the API/File badges — this detail shows you read the problem closely.

### 0:09–0:14 — Act 2: Identity Resolution Agent (the "aha" moment)
- *"Here's the hard part most vendors skip. The same patient is 'Subject 301-041' in one platform and '306-012' in another. Different IDs, different vendors, same human."*
- Scroll to the **Subjects Matched Across Studies** table. Pick one row: *"SUBJ-0005 — enrolled in ENDO-301, completed, rolled into the long-term extension ENDO-306. Two platform IDs, one master record."*
- Key line: *"If you can't resolve identity across studies, every program-level number you report is wrong. This agent is why the numbers on this page can be trusted."*
- Click the **"How many subjects moved between studies?"** question → the agent computes it live.

### 0:14–0:22 — Act 3: The Executive View (what leaders actually asked for)
Walk the three deliverables from the brief, top to bottom:
- **KPIs:** *"Program-level answers at a glance — unique subjects across all six studies, currently enrolled, completed, drop-off rate, last month's enrollment. Notice it says 'unique subjects' — counted once, not once per platform."*
- **Enrollment rate by study/site/month:** stacked chart → *"The shape of the program. Two pivotal trials ramped early, extension studies pick up as subjects roll over — that's the program lifecycle in one picture."*
- **Drop-off by study + over time:** *"Leaders don't just want a number, they want to know where retention breaks. The cumulative lines show exactly which study's curve steepens and when."*
- **Enrollment by site:** *"Site performance for the CRO conversation — who's carrying the program."*
- **Live filter demo** (do this, don't just describe): click ENDO-302 chip → every chart recomputes → *"Any question scoped to a study or site is a click, not a ticket."*

### 0:22–0:26 — The Insight Agent (answers in minutes → answers in seconds)
- *"Everything so far is still manual exploration. The Insight Agent turns the linked model into a question-answering service."*
- Click each preset question live:
  - *"Which study has the highest drop-off?"* → computed answer appears
  - *"Which site enrolls fastest?"* → answer with % of program
  - *"Enrollments last month?"* → number + leading study
- Key line: *"In production this is a natural-language box — 'show me sites trending below target' — this prototype uses preset questions, but you just watched it compute real answers against the model in milliseconds."*

### 0:26–0:30 — Close: Value, Honesty, Path
- **Value recap in one sentence:** *"One connected data layer, subjects matched once, and program answers in minutes — that's what the team asked for, and that's what this does."*
- **Be honest about the prototype (builds trust):** *"All data here is mocked — deterministic, so the demo is reproducible. The architecture is what matters: ingestion, identity resolution, insight."*
- **Path to production:** *"Real deployment points the Ingestion Agent at the actual platforms — Medidata, Veeva, lab vendors — same pattern, real connectors. Identity resolution gains fuzzy matching and steward review. Insight Agent gets a governed LLM over the model with audit trails — GxP-ready."*
- **Finish with a question back:** *"If your team had this tomorrow, what's the first question you'd ask it?"* — turns the demo into a conversation.

---

## Talking Points / Objection Handling

**"Isn't this just a dashboard?"**
- The dashboard is 10% of it. The value is the agent layer: ingestion normalizes 6 incompatible sources, identity resolution creates the trustworthy subject index. A dashboard over unlinked data is just a faster way to be wrong.

**"We already have an EDC / CTMS."**
- So does every sponsor — that's the problem. The hub doesn't replace them, it sits above them and answers the questions *between* them: "a subject moved from the pivotal trial into the extension — show me her journey."

**"Our data quality is a mess."**
- That's exactly why you start with agents doing the reconciliation — humans can't reconcile six platforms at program scale. The hub surfaces the mess; today you just don't see it.

**"Why agents instead of a normal ETL pipeline?"**
- ETL is a batch job that breaks silently. Agents observe, match, and answer continuously — the drop-off line moves while you watch; the Insight Agent is asked questions nobody anticipated when a report template was designed.

**"Security/compliance?"**
- Prototype is public-demo gated; production is per your validated environment — SSO, role-based access, audit logging, PHI handling per 21 CFR Part 11 expectations.

**The three numbers to repeat:** 6 studies → 1 linked model → answers in minutes.

---

## Setup Checklist (before the meeting)

- [ ] Open https://yourmark.ai/clinical-data-hub/ — enter password `endo2026` (stays unlocked for the tab session)
- [ ] Have the case-study PDF handy to reference their own problem statement
- [ ] Practice the two click-throughs: ENDO-302 chip filter + the three Q&A buttons
- [ ] If screen-sharing: zoom browser to ~125% so charts read at distance
- [ ] Backup: local copy works offline at `public/clinical-data-hub/index.html` (open the file directly; the python server at localhost:8791 also serves it)
