# ROADMAP

**This is the roadmap of the *repository*, not of Pi Network.**

**Status:** living document · **Last reviewed:** 2026-10-25 · **Horizon:** Q4 2026 → Q4 2027

> For what a *community-driven Pi developer roadmap* could look like as a governance object, see
> [`research/community-roadmap.md`](research/community-roadmap.md) (`RES-009`). This file is only about what
> gets written, reviewed, and published here.

---

## 0. What "done" means for a document

A document is not done when it is written. It is done when all four hold:

| Gate | Question | Failure mode it prevents |
|---|---|---|
| **G1 — Sourced** | Does every `FACT` have a link and a date in [`SOURCES.md`](SOURCES.md)? | Confident-sounding invention |
| **G2 — Labelled** | Is every claim labelled `FACT` / `ANALYSIS` / `PROPOSAL`? | Proposals read as announcements |
| **G3 — Falsifiable** | Does it say what evidence would overturn it? | Unfalsifiable essays |
| **G4 — Adoptable** | Could one developer act on it this month? | Research nobody can use |

Documents meeting all four: **17 of 17** at initial publication. That is a claim about the *first draft*, not a
permanent certificate: the 2026-10-25 review pass found six corrections, including a mis-stated network
passphrase in two documents, one mis-classified status, and one wrong cross-reference. Sources also drift —
which is what the review cycle below is for.

---

## 1. Publication phases

### Phase 0 — Foundation · **complete** (2026-10-25)

| Item | Status |
|---|---|
| Repository structure, licence, disclaimer, code of conduct | **done** |
| Claim taxonomy + labelling rules | **done** |
| Pinned source registry ([`SOURCES.md`](SOURCES.md)) | **done** |
| Twelve research documents (`RES-001`…`RES-012`) | **done** — all `draft` |
| Five proposals + template (`PR-001`…`PR-005`) | **done** — all `draft` |
| [`.github`](.github) issue/PR templates | **done** |

### Phase 1 — Review · **in progress** (2026-11 → 2027-01)

Goal: turn `draft` into `review`, then `stable`, with at least one outside reviewer per document.

| Work item | Owner | Target | Status |
|---|---|---|---|
| Independent research-quality review of all 17 documents | maintainers | 2026-10-25 | **done** — six corrections; see change log |
| Open one public comment thread per document | maintainers | 2026-11-15 | planned |
| Independent re-run of the RPC probe (`PR-001`) | volunteer | 2026-12-01 | planned |
| Verify every `S-nn` row: does the URL still say what we claim? | volunteer | 2026-12-15 | planned |
| First `stable` candidates: `RES-006`, `PR-001` | maintainers | 2027-01-15 | planned |
| Publish a change log of every correction made | maintainers | 2027-01-31 | planned |

### Phase 2 — Instrumentation · **planned** (2027-01 → 2027-06)

Goal: replace prose with measurements where measurement is cheap.

| Deliverable | Depends on | Notes |
|---|---|---|
| Public, self-hosted RPC probe + raw dataset | `PR-001` | Must publish raw JSON, not just a chart |
| `OpenAPI` description of the documented Platform API surface | `PR-002` | **Derived from public docs**, never from credentials |
| Ecosystem directory schema + a validator script | `PR-003` | Schema only; no hosted service required |
| Launch-disclosure JSON schema + example | `PR-004` | Aligned to `PiRC1` concepts; explicitly unofficial |
| Compute-verification reference sketch | `PR-005` | Simulated jobs, no real payments |

`ANALYSIS` — Phase 2 is where this repository stops being purely prose. The ordering is deliberate: a
schema is only worth writing after the argument for it has survived comment.

### Phase 3 — Hand-off · **planned** (2027-06 → 2027-12)

Goal: make the repository unnecessary for its most successful ideas.

| Deliverable | Success criterion |
|---|---|
| Each `stable` proposal has an **independent** implementer | Someone else's repo links back, not just ours |
| Public decision log with rejections and reasons | A reader can see *why* an idea died |
| Archived snapshots of every `FACT` as of each review | A 2028 reader can tell what changed |
| Translation of `README`, `VISION`, `RES-006` | Arabic first; other languages welcome |

`ANALYSIS` — A research repository that is still the only implementer of its own standards after a year has
failed quietly. Hand-off is the success metric.

---

## 2. Priority model

When two documents compete for attention, they are ranked by:

```
priority = impact × verifiability × adoptability
           ────────────────────────────────────
                     effort
```

| Factor | Question | Scale |
|---|---|---|
| **Impact** | How many builders or users are affected? | 1–5 |
| **Verifiability** | Can the claim be checked by an outsider? | 1–5 |
| **Adoptability** | Can one team implement it without permission? | 1–5 |
| **Effort** | Days of work, including review | 1–5 (inverted) |

Scores are recorded in the table below so that prioritisation is **arguable** rather than mysterious. The table
is sorted by score, descending; equal scores share a rank, so the ranks are 1–16 with gaps at ties.

| ID | Document | Impact | Verif. | Adopt. | Effort | Score | Rank |
|---|---|---|---|---|---|---|---|
| `RES-006` | Security standards | 5 | 5 | 5 | 2 | 62.5 | 1 |
| `PR-001` | RPC monitoring | 4 | 5 | 5 | 2 | 50.0 | 2 |
| `RES-002` | RPC infrastructure study | 4 | 5 | 4 | 2 | 40.0 | 3 |
| `RES-012` | Open questions | 3 | 4 | 5 | 2 | 30.0 | 4 |
| `PR-002` | Developer standards | 4 | 5 | 4 | 3 | 26.7 | 5 |
| `RES-005` | Missing developer tools | 4 | 4 | 4 | 3 | 21.3 | 6 |
| `PR-004` | Launchpad transparency | 5 | 4 | 3 | 3 | 20.0 | 7 |
| `RES-003` | Launchpad opportunities | 5 | 4 | 3 | 3 | 20.0 | 7 |
| `PR-003` | Ecosystem directory | 4 | 4 | 4 | 4 | 16.0 | 9 |
| `RES-008` | Open explorer | 3 | 4 | 4 | 4 | 12.0 | 10 |
| `RES-004` | Ecosystem index | 4 | 3 | 3 | 5 | 7.2 | 11 |
| `RES-009` | Community roadmap | 3 | 3 | 4 | 5 | 7.2 | 11 |
| `RES-011` | Smart-contract ecosystem | 3 | 3 | 3 | 4 | 6.8 | 13 |
| `RES-007` | Decentralized compute | 3 | 3 | 2 | 4 | 4.5 | 14 |
| `PR-005` | Decentralized services | 3 | 3 | 2 | 4 | 4.5 | 14 |
| `RES-010` | Ten-year scenarios | 3 | 2 | 3 | 4 | 4.5 | 14 |

> **The scores are `ANALYSIS`.** They are published so they can be disputed. A disagreement about a score is
> a legitimate issue: state which cell is wrong and why.

`ANALYSIS` — Note what the ranking implies. Security and measurement outrank every "vision" document. That is
intentional: a ten-year scenario is pleasant to write and hard to be wrong about in public, while a payment
verification checklist is unpleasant to write and immediately wrong in a useful way.

---

## 3. Review cycle

| Document class | Review interval | Trigger for early review |
|---|---|---|
| `FACT`-heavy (`RES-001`, `RES-002`, `RES-003`, `RES-011`) | **60 days** | Any new official blog post or protocol upgrade |
| Normative proposals (`PR-001`…`PR-005`) | **90 days** | Any implementation feedback |
| Scenarios and vision (`VISION`, `RES-010`, `RES-009`) | **180 days** | A scenario's leading indicator flips |
| Registry (`SOURCES`, `RES-012`) | **30 days** | Broken link, moved page, new RFC |

A document whose `last_reviewed` is overdue appears here until re-reviewed:

| Document | Last reviewed | Due | Overdue? |
|---|---|---|---|
| All (initial publication) | 2026-10-25 | see class intervals | no |

---

## 4. Explicitly out of scope

Recorded so that the scope does not creep by accident:

| Not on the roadmap | Why |
|---|---|
| A hosted dashboard with an SLA | That is an operations commitment, not research |
| A published "official" ranking of Pi apps | Incentive to game; see [`PR-003`](proposals/proposal-003-ecosystem-directory.md) |
| Any price, market, or trading analysis | [`DISCLAIMER.md`](DISCLAIMER.md) §2 |
| Contacting the Core Team on the community's behalf | We have no mandate to represent anyone |
| Deploying contracts that hold user funds | No custody, by principle |
| A general-purpose Pi news feed | News decays; this repository aims at durable documents |

---

## 5. How this roadmap changes

1. Anyone can propose a new document with an issue: `DOC: <title> — <one-line purpose>`.
2. It is accepted if it (a) is not already covered, (b) can be written with public evidence, and (c) has a
   named author willing to keep it reviewed.
3. Accepted items get an ID (`RES-0nn`) and appear in this file **before** the document exists, so that work
   in progress is visible.
4. Rejected items are listed with a reason. Silence is not a decision.

### Candidate studies (recorded before they exist)

Per rule 3 above, work in progress is visible. These three are **candidates**: no author has committed, so they
have no `RES-` ID yet. Each closes a gap identified in the 2026-10-25 review.

| Working title | Gap it closes | First step |
|---|---|---|
| Ledger cadence and finality on Pi | No public baseline for close intervals, so "lag" has no threshold | Sample 1,000 consecutive ledgers; publish the interval distribution |
| Pi Horizon divergences from upstream Stellar | Unknown whether Stellar docs, SDKs, and indexers transfer (`M-05` is only a seed) | Build an endpoint/behaviour matrix for both networks |
| PiRC1 allocation stress test | No public quantitative analysis of PiPower tiers, dilution, or liquidity locks | Simulate Design 1 and Design 2 under stated assumptions |

### Change log for this file

| Date | Change |
|---|---|
| 2026-10-25 | Initial roadmap: Phase 0 complete, Phases 1–3 planned |
| 2026-10-25 | Review pass complete: `M-04`/`M-05` added; passphrase, node-status, cross-reference and date corrections; three candidate studies recorded |
