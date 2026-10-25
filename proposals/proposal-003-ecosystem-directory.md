---
title: "PR-003 · An Open Ecosystem Directory"
doc_id: PR-003
type: proposal
status: draft
last_reviewed: 2026-10-25
evidence_cutoff: 2026-10-25
---

# PR-003 · An Open Ecosystem Directory

| Field | Value |
|---|---|
| **ID** | PR-003 |
| **Status** | Draft |
| **Author(s)** | anonymous contributor |
| **Created** | 2026-10-25 |
| **Last updated** | 2026-10-25 |
| **Comment period** | 14 days from first publication |
| **Related** | [`RES-004`](../research/pi-ecosystem-index.md) · [`PR-002`](proposal-002-developer-standards.md) |

> **Official status:** none. This document is a community proposal and has not been submitted to, reviewed by,
> or endorsed by Pi Network or the Pi Core Team. It does **not** describe how any existing Pi directory works.

---

## 1. Summary

A data model, submission process, and dispute procedure for a **verifiable** ecosystem directory: one that
records what is true and how it was checked, rather than what is popular.

The core claim: a directory's value is not its list. It is its **evidence trail and its willingness to publish
rejections**.

---

## 2. Problem

| Who is harmed | How | How you would notice |
|---|---|---|
| Users | Cannot distinguish live from demo, verified from self-declared | Apps fail after being recommended |
| Developers | Discovery is opaque | "How do I get listed?" has no answer |
| Researchers | No stable dataset | Every analysis re-scrapes a UI |
| Projects | Withdrawal of a listing is unexplained | Trust collapses silently |
| The ecosystem | Rankings reward staking, not usefulness | The visible list diverges from the useful list |

`FACT` — The existing Pi ecosystem surfaces each use a different and largely unpublished evidence model
([`RES-004`](../research/pi-ecosystem-index.md) §3.1). Staking influences app ranking (`S-27`), KYB verifies
businesses (`S-37`), and PiOS is a self-registered licence list (`S-13`). None of these is a general
verification method for "is this app what it claims to be".

`ANALYSIS` — That is not a defect in any one of them. It is a missing layer: a directory whose inclusion
criteria can be read, disputed, and re-derived by a third party.

---

## 3. Motivation

App creation is now cheap (`S-30`). When creation is cheap, the scarce good is **triage**. Users need to know
what is live; reviewers need to know what to look at; researchers need a dataset that does not change under
them.

A directory that publishes evidence makes all three cheaper. A directory that publishes rankings makes all
three worse.

---

## 4. Specification

### 4.1 Data model

| ID | Level | Requirement |
|---|---|---|
| DIR-1 | MUST | Every entry validates against `pi-ecosystem-entry/1` |
| DIR-2 | MUST | Every entry carries at least one evidence object with `url`, `retrieved`, and `supports` |
| DIR-3 | MUST | Every entry carries exactly one `status` from the closed vocabulary in §4.2 |
| DIR-4 | MUST | Every entry records `first_seen` and `last_verified` dates |
| DIR-5 | MUST | Entries are identified by a stable `entry_id` that survives metadata edits |
| DIR-6 | MUST | The dataset is published as a single machine-readable file with a content hash |
| DIR-7 | MUST NOT | An entry may be deleted; deprecation is a status, not a deletion |

### 4.2 Status vocabulary

| Status | Definition | Evidence required |
|---|---|---|
| `live-mainnet` | Publicly usable on Mainnet | Public URL + dated observation |
| `live-testnet` | Usable on Testnet only | URL + official Testnet statement |
| `beta-gated` | Live but restricted | Official statement of the gate |
| `rfc` | A proposal, not live | RFC link + date |
| `poc` | Demonstrated, not operated | Official statement describing a test |
| `announced` | Stated as coming, no artefact | The exact announcement + date |
| `deprecated` | Superseded or withdrawn | Notice, or documented absence |
| `unverified` | Widely claimed, not confirmable | Must say what could not be checked |
| `contested` | Two parties disagree, dispute open | Both positions, dated |

### 4.3 Submission

| ID | Level | Requirement |
|---|---|---|
| DIR-10 | MUST | Submission requires no account, payment, or personal data |
| DIR-11 | MUST | Submissions are validated automatically before human review |
| DIR-12 | MUST | A rejection states which rule failed and what would fix it |
| DIR-13 | MUST | Rejections are published, with the submitter anonymised unless they opt in |
| DIR-14 | SHOULD | A submission receives a first response within 14 days |

### 4.4 Verification

| ID | Level | Requirement |
|---|---|---|
| DIR-20 | MUST | A status change requires two reviewers, one of whom did not submit |
| DIR-21 | MUST | Verification results record the date and the method |
| DIR-22 | MUST | Entries expire after **180 days** without re-verification and become `stale` |
| DIR-23 | MUST | A `stale` entry remains visible and is labelled |
| DIR-24 | MUST NOT | A reviewer verify their own entry |

### 4.5 Ranking (if any)

| ID | Level | Requirement |
|---|---|---|
| DIR-30 | MUST | Any ordering is derived from **published signals only** |
| DIR-31 | MUST | The ordering algorithm and its inputs are documented |
| DIR-32 | MUST NOT | Payment, staking, or partnership influence ordering |
| DIR-33 | MUST NOT | A composite "quality score" be published |
| DIR-34 | SHOULD | A "recently changed status" view exist, independent of any ranking |

`ANALYSIS` — DIR-33 is the most important rule in this section. A single quality number is the most requested
and most corrupting feature a directory can add: it collapses many factual dimensions into one opinion, and
then the ecosystem optimises for the number.

### 4.6 Disputes

| ID | Level | Requirement |
|---|---|---|
| DIR-40 | MUST | Anyone may dispute an entry, with evidence, at no cost |
| DIR-41 | MUST | An open dispute sets `contested` until resolved |
| DIR-42 | MUST | Resolutions are published with reasons and dates |
| DIR-43 | MUST | Corrections are recorded on the entry, not silently applied |
| DIR-44 | MUST NOT | A dispute be resolved by the subject of the dispute alone |

### 4.7 Governance

| ID | Level | Requirement |
|---|---|---|
| DIR-50 | MUST | Editors disclose conflicts of interest per entry |
| DIR-51 | MUST | The maintainer list is public and current |
| DIR-52 | MUST NOT | Maintainers accept payment for inclusion, ordering, or status |
| DIR-53 | SHOULD | At least three independent maintainers exist before any ranking is enabled |

---

## 5. Non-goals

| Not solved | Why |
|---|---|
| Replacing existing official directories | It is complementary; official lists remain authoritative for membership |
| Judging quality, safety, or legality | Factual status only |
| Auditing apps | Verification checks claims, not behaviour |
| Ranking for rewards | DIR-32 |
| Hosting apps | Links only |
| Prices or token metrics | Out of scope permanently |

---

## 6. Rationale

| Decision | Reason |
|---|---|
| Evidence object per entry | Makes correction possible without trust |
| Closed status vocabulary | Free-text status cannot be compared |
| Expiry | Directories rot silently; expiry makes rot visible |
| Published rejections | The only defence against quiet pressure |
| No quality score | Any score becomes a target |
| Two-reviewer rule | Prevents unilateral listing or delisting |

---

## 7. Security considerations

| If a participant is malicious… | Then… | Control |
|---|---|---|
| A project submits a false claim | Users misled | DIR-2 evidence + DIR-20 review |
| A competitor disputes in bad faith | Harassment by process | Public evidence requirement; time-boxed resolution |
| A maintainer is bribed | Ranking corruption | DIR-32, DIR-50, DIR-52 |
| An entry is defaced | Misinformation | Content hash + signed releases |
| A malicious link is listed | Phishing | URL review; `unverified` default; no shorteners |
| A stale entry remains recommended | Harm after abandonment | DIR-22 expiry |

---

## 8. Architecture and reference implementation

A directory, a hash, and a review trail — no database:

| Component | Form | Why this form |
|---|---|---|
| **Entries** | `entries.json`, one array | Diffable, forkable, one logical commit per change |
| **Integrity** | `entries.json.sha256` published beside it | A consumer can detect a silent edit |
| **Intake** | `submissions/` | Keeps the reviewer's raw input separate from the accepted record |
| **Decisions** | `rejections/` and `disputes/` | A rejection is a public artefact, not a private email |
| **History** | `CHANGELOG.md`, append-only | Status changes are the interesting data |

```text
entries.json            # array of pi-ecosystem-entry/1
entries.json.sha256     # content hash, published separately
submissions/            # one file per submission (redacted if needed)
rejections/             # published rejection records
disputes/               # open and resolved, with evidence
CHANGELOG.md            # status transitions, dated, append-only
```

Validation is arithmetic and structural: every status in vocabulary, every evidence URL resolvable (at review
time), every date well-formed, no entry past expiry marked `live-*`.

---

## 9. Backwards compatibility

New dataset; nothing to break. Consumers should ignore unknown fields and MUST tolerate new statuses being
added in a minor schema version.

---

## 10. Alternatives

| Alternative | Why rejected |
|---|---|
| Scrape an existing directory | Inherits an unpublished evidence model; brittle |
| Crowd-vote listings | Sybil-prone; measures enthusiasm, not truth |
| Rank by staking | Already exists elsewhere; conflates capital with usefulness |
| A private curated list | Unauditable; impossible to dispute |
| A single quality score | Collapses facts into an opinion (DIR-33) |

---

## 11. Unresolved questions

| # | Question | Blocks adoption? |
|---|---|---|
| 1 | Which existing official surfaces should this link to rather than duplicate? (`OQ-004`, `OQ-020`) | No |
| 2 | Who funds hosting and review time without compromising DIR-52? | Yes, for a public instance |
| 3 | Should third-party apps be included, or infrastructure only? | Yes, for scope |
| 4 | What is the appeal path when a dispute is itself bad-faith? | No |
| 5 | Is `contested` sufficient, or is a `restricted` state needed for legal removals? | No |

---

## 12. Adoption path

| Step | Actor | Artefact |
|---|---|---|
| 1 | This repo | Publish schema + 24 verified entries ([`RES-004`](../research/pi-ecosystem-index.md) §4.4) |
| 2 | Any app | Submit with evidence |
| 3 | Any analyst | Re-derive a status from the evidence and publish agreement or disagreement |
| 4 | Any UI | Render the dataset without adding a score |
| 5 | Two instances | Independent directories agree on most entries — the real test |

---

## 13. References

| # | Source | Type | Date |
|---|---|---|---|
| `S-13` | PiOS registry (self-registered) | Official | retrieved 2026-10-25 |
| `S-27` | Directory staking / ranking | Official | 2026-06-18 |
| `S-30` | App Studio pricing | Official | 2026-08-17 |
| `S-31` | SoloHost permissionless publishers | Official | 2026-08-27 |
| `S-37` | KYB verified businesses | Official | retrieved 2026-10-25 |
| `RES-004` | Ecosystem map + status vocabulary | This repo | 2026-10-25 |

---

**Related:** [`RES-004`](../research/pi-ecosystem-index.md) · [`PR-002`](proposal-002-developer-standards.md) ·
[`RES-009`](../research/community-roadmap.md)
