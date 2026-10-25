---
title: "The Open-Question Register"
doc_id: RES-012
type: research
status: draft
last_reviewed: 2026-10-25
evidence_cutoff: 2026-10-25
---

# RES-012 · The Open-Question Register

> **Claim types:** `FACT` — official, dated, linked · `ANALYSIS` — this repository's reasoning, fallible ·
> `PROPOSAL` — a suggestion with no official status.

---

## 1. Executive Summary

This is the most useful document in the repository and the least impressive to read. It is a list of things
**we do not know**, each with what would answer it.

Its purpose is to stop a specific failure: documents that are silent about their own gaps, so that a reader
cannot distinguish "verified" from "assumed". A register of ignorance is the cheapest available defence
against confident nonsense.

**Status at publication: 27 open · 0 resolved · 0 abandoned.**

---

## 2. Problem Statement

| Failure | Without a register | With a register |
|---|---|---|
| A consensus assumption is never stated | Every document silently depends on it | It has an ID, a date, and a blocking status |
| A question is answered in a chat thread | The answer is lost | It is recorded, with evidence |
| Two documents assume opposite answers | Readers cannot tell | The contradiction is visible as one `OQ` |
| Nobody knows what to work on | Effort goes to the loudest topic | The register is a work queue |

`ANALYSIS` — An `OQ` is not a complaint. It is a **specification for a piece of research**: question, why it
matters, what evidence would close it, and what it currently blocks.

---

## 3. Current State

### 3.1 How to close an open question

| Step | Requirement |
|---|---|
| 1 | Produce the evidence named in the "would be answered by" column |
| 2 | Add it to [`SOURCES.md`](../SOURCES.md) with a date and a pin if possible |
| 3 | Update every document that assumed the old answer |
| 4 | Move the row to §6 with the answer, the evidence, and the closing date |
| 5 | If the answer contradicts a `FACT` elsewhere, treat it as a correction ([`CONTRIBUTING.md`](../CONTRIBUTING.md) §5) |

**Questions are never deleted.** A closed question keeps its ID forever, so that a 2029 reader can tell what was
known in 2026.

### 3.2 Severity vocabulary

| Severity | Meaning |
|---|---|
| **Blocking** | A design decision in this repository is unsafe or unusable until answered |
| **High** | A document's main conclusion is conditional on it |
| **Medium** | Affects a recommendation, not a conclusion |
| **Low** | Would improve precision; nothing depends on it |

---

## 4. Proposed Solution — the register

### §4.1 Chain access and availability

| ID | Question | Why it matters | Would be answered by | Severity | Opened | Blocks |
|---|---|---|---|---|---|---|
| `OQ-001` | What are the published rate limits for the Mainnet and Testnet Horizon endpoints? | Client sizing and backoff are guesswork without them | An official limits page, or response headers observed consistently | High | 2026-10-25 | [`RES-002`](rpc-infrastructure.md), [`PR-001`](../proposals/proposal-001-rpc-monitoring.md) |
| `OQ-002` | Do Mainnet and Testnet share infrastructure and policy? | Testnet results may not predict production | An official statement, or correlated incident timing | Medium | 2026-10-25 | [`RES-002`](rpc-infrastructure.md) |
| `OQ-003` | How far back does Horizon retain history? | Determines whether an indexer can be rebuilt from source | Probing the oldest available ledger, dated | High | 2026-10-25 | [`RES-008`](blockchain-explorer.md) |
| `OQ-006` | What confirmation depth should be treated as final for a Pi payment? | Delivery timing and risk both depend on it | Official guidance, or observed ledger finality behaviour | **Blocking** | 2026-10-25 | [`RES-006`](security-and-trust.md) §5 |
| `OQ-019` | Does the official explorer expose a documented public data API? | Duplicating it would be waste; missing it is a gap | A docs page, or an official statement | Medium | 2026-10-25 | [`RES-008`](blockchain-explorer.md) |

> **`OQ-006` is not closed by `RES-013`.** The cadence study measures ledger-close intervals, not confirmation
> depth or reorg behaviour. A 5-second close interval is an input to how long inclusion *might* take; it is not
> a finality policy. See [`RES-013`](ledger-cadence.md) §3.4.

### §4.2 Platform, verification and access

| ID | Question | Why it matters | Would be answered by | Severity | Opened | Blocks |
|---|---|---|---|---|---|---|
| `OQ-004` | What exactly does a "verified app" badge attest to? | Users infer safety from a badge that may mean identity only | Published criteria from the platform | **Blocking** | 2026-10-25 | [`RES-006`](security-and-trust.md), [`RES-004`](pi-ecosystem-index.md) |
| `OQ-005` | What are the criteria for whitelisted capabilities (local storage, staking API)? | Access fairness and product planning | Published criteria, or a stated application process | High | 2026-10-25 | [`RES-005`](developer-tools.md) |
| `OQ-013` | Is there a documented, stable error-code taxonomy for the Platform API? | Retry logic cannot distinguish permanent from transient | An official error reference | High | 2026-10-25 | [`RES-005`](developer-tools.md) |
| `OQ-014` | Does the Platform API support webhooks or event delivery, or only polling? | Determines the architecture of every payment backend | Official docs or a sandbox experiment | High | 2026-10-25 | [`RES-005`](developer-tools.md) |
| `OQ-015` | Is there an official security contact or disclosure programme for Pi apps? | Disclosures currently have no destination | An official security page | High | 2026-10-25 | [`RES-006`](security-and-trust.md) §9 |
| `OQ-016` | Are Platform API keys scoped by permission (read-only vs payments)? | Blast radius of a leaked key | Official docs | High | 2026-10-25 | [`RES-006`](security-and-trust.md) |
| `OQ-020` | Does KYB verification cover app behaviour, or only business identity? | A verified business is not a verified app | Published KYB scope | Medium | 2026-10-25 | [`RES-004`](pi-ecosystem-index.md) |
| `OQ-023` | What are the retention obligations for KYC-derived data held by apps? | Legal exposure and privacy risk are both unquantified | Regulatory guidance per jurisdiction; platform terms | High | 2026-10-25 | [`RES-006`](security-and-trust.md) §4.2 |

### §4.3 Contracts

| ID | Question | Why it matters | Would be answered by | Severity | Opened | Blocks |
|---|---|---|---|---|---|---|
| `OQ-011` | Has the subscription contract's external audit produced a public report? | Determines whether it should hold value | A published report, linked from an official source | **Blocking** | 2026-10-25 | [`RES-011`](smart-contract-ecosystem.md) |
| `OQ-012` | Is the deployed contract reproducible from source with the stated toolchain? | Without it, "open source" is a claim | A documented rebuild matching the on-chain hash | High | 2026-10-25 | [`RES-011`](smart-contract-ecosystem.md) |
| `OQ-022` | What exactly did Protocol 28 change, and where is the primary source? | A sibling project reports ZK/privacy capability; unverified here | An official release note or protocol spec | High | 2026-10-25 | [`RES-011`](smart-contract-ecosystem.md), `SOURCES.md` §4 |
| `OQ-024` | Is the Pi node/consensus implementation open source? | Independent audit and fork risk depend on it | A public repository with a licence, or a statement | **Blocking** | 2026-10-25 | [`RES-001`](pi-network-future.md), [`RES-007`](decentralized-compute.md) |
| `OQ-010` | Is the Pi DEX live on Mainnet, and under what rules? | Affects liquidity assumptions in launch design | Official statement or on-chain observation | High | 2026-10-25 | [`RES-003`](launchpad-opportunities.md) |

### §4.4 Launchpad and tokens

| ID | Question | Why it matters | Would be answered by | Severity | Opened | Blocks |
|---|---|---|---|---|---|---|
| `OQ-008` | Who approves a project for the Launchpad, by what criteria, and are rejections recorded? | Determines whether launch access is meritocratic or discretionary | Published process | High | 2026-10-25 | [`RES-003`](launchpad-opportunities.md) |
| `OQ-009` | What is the PiPower formula, and is it fixed or per-launch? | Participants cannot compute their allocation in advance | PiRC1 at a pinned commit + clarification | **Blocking** | 2026-10-25 | [`RES-003`](launchpad-opportunities.md), [`PR-004`](../proposals/proposal-004-launchpad-transparency.md) |
| `OQ-025` | Will the Mainnet Launchpad reuse Design 1 unchanged, and when? | Any guidance written now may be obsolete | An official Mainnet release note | High | 2026-10-25 | [`RES-003`](launchpad-opportunities.md) |

### §4.5 Nodes and compute

| ID | Question | Why it matters | Would be answered by | Severity | Opened | Blocks |
|---|---|---|---|---|---|---|
| `OQ-007` | Is node participation permissioned, and does that affect compute eligibility? | The trust model of every compute design depends on it | Official node documentation | **Blocking** | 2026-10-25 | [`RES-007`](decentralized-compute.md), [`RES-001`](pi-network-future.md) |
| `OQ-017` | How, if at all, were the five-node PoC results verified? | "Completed a task" is not "produced a correct result" | An official technical write-up | **Blocking** | 2026-10-25 | [`RES-007`](decentralized-compute.md), [`PR-005`](../proposals/proposal-005-decentralized-services.md) |
| `OQ-018` | What prevents a client from publishing a job and never paying? | Without an answer, nodes cannot price risk | Published escrow/settlement terms | High | 2026-10-25 | [`RES-007`](decentralized-compute.md) |
| `OQ-026` | How is compensation for compute calculated and settled? | No node can compute expected return | Published terms or an example job invoice | High | 2026-10-25 | [`RES-007`](decentralized-compute.md) |

### §4.6 Governance and measurement

| ID | Question | Why it matters | Would be answered by | Severity | Opened | Blocks |
|---|---|---|---|---|---|---|
| `OQ-021` | Should a community roadmap live here, in a dedicated repo, or inside `PiRC`? | Determines where decisions accumulate | A decision by the people doing the work | Medium | 2026-10-25 | [`RES-009`](community-roadmap.md) |
| `OQ-027` | Which ecosystem indicators can be measured without platform-internal telemetry? | Scenario analysis is unverifiable otherwise | A feasibility check per indicator | High | 2026-10-25 | [`RES-010`](ten-year-scenarios.md) |

---

## 5. Architecture

The register is deliberately a **plain Markdown table set with no build step**. Anyone can read it, diff it,
or fork it without running code. The architecture below exists to keep it consistent as it grows, not to add
machinery.

### 5.1 Record schema

| Field | Type | Required | Rule |
|---|---|---|---|
| `ID` | `OQ-nnn` | yes | Monotonic, allocated once, **never reused** |
| `Question` | one sentence | yes | Answerable; if it needs "and", split it |
| `Why it matters` | one sentence | yes | Names the decision that changes |
| `Would be answered by` | evidence class | yes | An artefact, not a sentiment |
| `Severity` | enum | yes | `Blocking` · `High` · `Medium` · `Low` |
| `Opened` | `YYYY-MM-DD` | yes | Date the row first appeared |
| `Blocks` | links | yes | At least one document or proposal |
| `Owner` | handle | no | Absent means unowned, and that is stated, not implied |
| `Last checked` | `YYYY-MM-DD` | no | Set when someone re-verified that the question is still open |

### 5.2 ID allocation and lifecycle

```text
            ┌──────────┐   evidence found    ┌──────────┐
  new row ─▶│   open   │────────────────────▶│ resolved │
            └────┬─────┘                     └──────────┘
                 │ 12 months, no movement
                 ▼
            ┌──────────┐   cannot be answered publicly
            │  stale   │────────────────────▶┌────────────┐
            └────┬─────┘                     │ abandoned  │
                 │  re-verified                └────────────┘
                 └──▶ open
```

- **Split, do not edit.** If a question turns out to be two questions, keep the original ID for the first and
  allocate new IDs for the rest; record the split in the row.
- **Closure is a move, not a deletion.** A closed row keeps its ID, its answer, its evidence, and its closing
  date in §6.
- **`stale` is a warning, not a verdict.** It means nobody has checked, which is different from "unanswerable".

### 5.3 Registry layout

| Layer | Location | Purpose |
|---|---|---|
| Canonical rows | this file, §4.1–§4.6 | One table per domain; the only source of truth |
| Closure log | this file, §6 | Answers with evidence and dates |
| Abandonment log | this file, §7 | Why a question was dropped, so it is not silently reopened |
| Back-references | each `RES-0nn` / `PR-0nn` | A document that depends on an `OQ` links to it by ID |
| Evidence | [`SOURCES.md`](../SOURCES.md) | The only place a closure may point to |

There is intentionally no database, no JSON mirror, and no generated index: a second copy would drift, and a
drift between two "sources of truth" is worse than a long table.

### 5.4 Lint rules a future contributor may automate

These are stated so a script can be written later without changing the document's meaning:

1. Every `OQ-nnn` referenced anywhere in the repository exists in §4 or §6.
2. Every row in §4 has all required fields non-empty.
3. Every row in §6 links to at least one `S-nn` or `M-nn` row in `SOURCES.md`.
4. No ID appears in both §4 and §6.
5. Every `Blocking` row has an owner or an explicit `unowned` marker.

---

## 6. Resolved questions

*None yet. When a question closes, its row moves here with the answer, the evidence, the closing date, and the
list of documents updated.*

| ID | Answer | Evidence | Closed | Documents updated |
|---|---|---|---|---|
| — | — | — | — | — |

---

## 7. Abandoned questions

*Questions that cannot be answered with public information, and are therefore not worth tracking. Recorded so
that they are not silently reopened.*

| ID | Question | Why abandoned | Date |
|---|---|---|---|
| — | — | — | — |

---

## 8. Benefits and Risks

### 8.1 Benefits

| Benefit | Mechanism |
|---|---|
| Assumptions become visible | Every conditional design names its `OQ` |
| Work becomes discoverable | The register is a task list |
| Disagreement becomes precise | Two documents cannot quietly assume opposite answers |
| Future readers can judge the past | Closed questions keep their dates |

### 8.2 Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Register rot** — questions open for years | High | Quarterly review; an `OQ` older than 12 months is marked `stale` |
| **Questions too broad to close** | Medium | Rewrite as answerable sub-questions |
| **Register used as a wish list** | Medium | Every row needs a "would be answered by" |
| **False closure** — marked answered without evidence | High | Closure requires a `SOURCES.md` row |

---

## 9. Implementation Roadmap

The register only has value if questions actually close. This is the schedule this repository commits to, and
the gates that prevent a question from being quietly declared answered.

| Phase | Window | Work | Exit criterion |
|---|---|---|---|
| **R0 — freeze the schema** | 2026-10-25 (done) | Sections, fields, severity vocabulary, ID rule | This document published |
| **R1 — triage** | 2026-10-26 → 2026-11-08 | Assign severity review to a second reader; mark owners; split any row that hides two questions | Every row has a second-reader sign-off on severity |
| **R2 — resolve the blocking set** | 2026-11-09 → 2027-01-31 | Work the seven `Blocking` rows first: `OQ-006`, `OQ-004`, `OQ-011`, `OQ-024`, `OQ-007`, `OQ-017`, `OQ-009` | Each is either closed with evidence, or downgraded with a written reason |
| **R3 — steady state** | from 2027-02-01 | Quarterly review; re-verify `High` rows; mark untouched rows `stale` at 12 months | Review recorded with a date in §4 and §6 |

### 9.1 Gates

| Gate | Check | Failure behaviour |
|---|---|---|
| **G-R1** | A question's severity was agreed by someone other than its author | Row stays unowned; it is not counted as triaged |
| **G-R2** | A `Blocking` row has an owner or is explicitly marked `unowned` | The blocking count is reported as a known and stated gap, never as zero |
| **G-R3** | A closure cites at least one `S-nn`/`M-nn` row that existed before the closure | The row returns to §4 with its history intact |
| **G-R4** | A document affected by a closure is updated in the same change | The closure is reverted; a closure that leaves contradicting prose is not a closure |

### 9.2 Metrics worth reporting, and their limits

| Metric | Why it is useful | Why it misleads |
|---|---|---|
| Median age of open `OQ`s | Shows whether the register is alive | A long-lived question may simply be waiting on a platform decision |
| Share of `Blocking` rows closed | Tracks the highest-value work | Closing is gamed by downgrading severity — hence G-R1 |
| Questions closed per quarter | Effort signal | Favours easy questions over important ones |

No target is set for any of these. A register optimised for a closure count would close the wrong things.

---

## 10. Open Questions

This document is the register, so its own open questions are structural:

1. Should `OQ` IDs be reused if a question is split into several? (Proposal: never reuse; append suffixes.)
2. Should severity be reviewed by someone other than the author?
3. Is there a value in tracking questions that are *answered privately* but not publicly?
4. How should a question be handled when the only answer is "the platform has not decided"?

---

## 11. References

| # | Source | Type | Date |
|---|---|---|---|
| `SOURCES.md` §5 | The list of things this repository could not verify | This repo | 2026-10-25 |
| `S-52` | PiRC (venue for design questions) | Official (RFC) | retrieved 2026-10-25 |
| `S-24` | Launchpad Testnet status | Official | 2026-03-19 |
| `S-26` | Contract audit status | Official | 2026-04-17 |
| `S-29` | Compute PoC (5 nodes) | Official | 2026-08-14 |
| `S-31` | SoloHost beta; Node count | Official | 2026-08-27 |
| `S-32` | Whitelisted capabilities | Official | 2026-09-04 |

---

**Related:** every document in [`research/`](.) cites at least one `OQ` ·
[`CONTRIBUTING.md`](../CONTRIBUTING.md) §5 · [`SOURCES.md`](../SOURCES.md) §5
