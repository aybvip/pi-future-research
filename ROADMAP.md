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

Documents meeting all four: **18 of 18** after [`RES-013`](research/ledger-cadence.md) (17 of 17 at initial
publication). That is a claim about the *first draft*, not a permanent certificate: the 2026-10-25 review pass
found seven corrections, including a mis-stated network passphrase in two documents, one mis-classified status,
one wrong cross-reference, and one claim that promoted an ecosystem-token **design** to a live Mainnet feature.
Sources also drift — which is what the review cycle below is for.

---

## 1. Publication phases

### Phase 0 — Foundation · **complete** (2026-10-25)

| Item | Status |
|---|---|
| Repository structure, licence, disclaimer, code of conduct | **done** |
| Claim taxonomy + labelling rules | **done** |
| Pinned source registry ([`SOURCES.md`](SOURCES.md)) | **done** |
| Twelve initial research documents (`RES-001`…`RES-012`) | **done** — all `draft` |
| `RES-013` — ledger cadence, measured on 1,000 Mainnet ledgers | **done** — `draft`; dataset and scripts published |
| Five proposals + template (`PR-001`…`PR-005`) | **done** — all `draft` |
| [`.github`](.github) issue/PR templates | **done** |

### Phase 1 — Review · **in progress** (2026-11 → 2027-01)

Goal: turn `draft` into `review`, then `stable`, with at least one outside reviewer per document.

| Work item | Owner | Target | Status |
|---|---|---|---|
| Independent research-quality review of all 17 initial documents | maintainers | 2026-10-25 | **done** — seven corrections; see change log |
| External re-run of `RES-013` cadence scripts | volunteer | 2026-11-15 | planned |
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
| Ledger-cadence dataset + re-runnable fetch/compute scripts | `RES-013` | **Shipped** 2026-10-25; extend to 7 days before using it as a threshold |
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
is sorted by score, descending; equal scores share a rank, so rank values have gaps at ties.

| ID | Document | Impact | Verif. | Adopt. | Effort | Score | Rank |
|---|---|---|---|---|---|---|---|
| `RES-006` | Security standards | 5 | 5 | 5 | 2 | 62.5 | 1 |
| `PR-001` | RPC monitoring | 4 | 5 | 5 | 2 | 50.0 | 2 |
| `RES-002` | RPC infrastructure study | 4 | 5 | 4 | 2 | 40.0 | 3 |
| `RES-013` | Ledger cadence (measured) | 4 | 5 | 4 | 2 | 40.0 | 3 |
| `RES-012` | Open questions | 3 | 4 | 5 | 2 | 30.0 | 5 |
| `PR-002` | Developer standards | 4 | 5 | 4 | 3 | 26.7 | 6 |
| `RES-005` | Missing developer tools | 4 | 4 | 4 | 3 | 21.3 | 7 |
| `PR-004` | Launchpad transparency | 5 | 4 | 3 | 3 | 20.0 | 8 |
| `RES-003` | Launchpad opportunities | 5 | 4 | 3 | 3 | 20.0 | 8 |
| `PR-003` | Ecosystem directory | 4 | 4 | 4 | 4 | 16.0 | 10 |
| `RES-008` | Open explorer | 3 | 4 | 4 | 4 | 12.0 | 11 |
| `RES-004` | Ecosystem index | 4 | 3 | 3 | 5 | 7.2 | 12 |
| `RES-009` | Community roadmap | 3 | 3 | 4 | 5 | 7.2 | 12 |
| `RES-011` | Smart-contract ecosystem | 3 | 3 | 3 | 4 | 6.8 | 14 |
| `RES-007` | Decentralized compute | 3 | 3 | 2 | 4 | 4.5 | 15 |
| `PR-005` | Decentralized services | 3 | 3 | 2 | 4 | 4.5 | 15 |
| `RES-010` | Ten-year scenarios | 3 | 2 | 3 | 4 | 4.5 | 15 |

> **The scores are `ANALYSIS`.** They are published so they can be disputed. A disagreement about a score is
> a legitimate issue: state which cell is wrong and why.

`ANALYSIS` — The table scores 17 of the 18 documents. [`RES-001`](research/pi-network-future.md) is the
umbrella research document and is not in the execution queue; the rows above are the documents competing for
attention. The 18 of 18 gate count in §0 includes it.

`ANALYSIS` — Note what the ranking implies. Security and measurement outrank every "vision" document. That is
intentional: a ten-year scenario is pleasant to write and hard to be wrong about in public, while a payment
verification checklist is unpleasant to write and immediately wrong in a useful way.

---

## 3. Review cycle

| Document class | Review interval | Trigger for early review |
|---|---|---|
| `FACT`-heavy (`RES-001`, `RES-002`, `RES-003`, `RES-011`, `RES-013`) | **60 days** | Any new official blog post, protocol upgrade, or dataset re-run |
| Normative proposals (`PR-001`…`PR-005`) | **90 days** | Any implementation feedback |
| Scenarios and vision (`VISION`, `RES-010`, `RES-009`) | **180 days** | A scenario's leading indicator flips |
| Registry (`SOURCES`, `RES-012`) | **30 days** | Broken link, moved page, new RFC |

A document whose `last_reviewed` is overdue appears here until re-reviewed:

| Document | Last reviewed | Due | Overdue? |
|---|---|---|---|
| All (initial publication + `RES-013`) | 2026-10-25 | see class intervals | no |

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

Per rule 3 above, work in progress is visible. These two are **candidates**: no author has committed, so they
have no `RES-` ID yet. Each closes a gap identified in the 2026-10-25 review. The first candidate from that
list, ledger cadence, was accepted and published as [`RES-013`](research/ledger-cadence.md) on 2026-10-25.

| Working title | Gap it closes | First step |
|---|---|---|
| Pi Horizon divergences from upstream Stellar | Unknown whether Stellar docs, SDKs, and indexers transfer (`M-05` is only a seed) | Build an endpoint/behaviour matrix for both networks |
| PiRC1 allocation stress test | No public quantitative analysis of PiPower tiers, dilution, or liquidity locks | Simulate Design 1 and Design 2 under stated assumptions |

### Change log for this file

| Date | Change |
|---|---|
| 2026-10-25 | Initial roadmap: Phase 0 complete, Phases 1–3 planned |
| 2026-10-25 | Review pass complete: `M-04`/`M-05` added; passphrase, node-status, ecosystem-token status, cross-reference and date corrections; three candidate studies recorded |
| 2026-10-25 | `RES-013` published: 1,000-ledger cadence dataset, `M-06`, scripts and validation; candidate study converted to a document; priority table and counts updated |
