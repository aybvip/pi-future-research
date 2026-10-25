# CONTRIBUTING

**Last reviewed:** 2026-10-25

Thank you for reading closely enough to want to change something. This repository is only useful if it is
**correctable**, so the contribution process is designed around one question:

> *What evidence would change your mind, and where is it?*

If you can answer that, you can contribute here — whether you are agreeing, disagreeing, or deleting.

---

## 0. The four highest-value contributions

Ranked by value, not by effort:

| Rank | Contribution | Why it is worth more |
|---|---|---|
| 1 | **A correction with a pinned source** | A wrong `FACT` poisons every document that cites it |
| 2 | **A falsification** of an `ANALYSIS` | Turns an argument into a testable one |
| 3 | **A measurement** anyone can re-run | Converts opinion into data |
| 4 | **A new document or proposal** | Useful — but only after 1–3 are healthy |

A pull request that **removes** a confident but unsupported paragraph is a good pull request. Say so in the
description; it will be merged quickly.

---

## 1. Ground rules

1. **One claim per issue.** An issue arguing five points will be answered on one of them and ignored on four.
2. **No price talk.** Not "undervalued", not "when listing", not "market cap". Out of scope by policy
   ([`DISCLAIMER.md`](DISCLAIMER.md)).
3. **No promotion.** No referral links, no "check out my app" issues, no token shilling.
4. **No rumours as facts.** "Someone said on Telegram" is not evidence. If it matters, it becomes an
   `OQ-nnn` open question in [`research/open-questions.md`](research/open-questions.md).
5. **Assume good faith, argue with evidence.** Reviewers will ask "what would falsify this?" — that is the
   house style, not hostility. See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
6. **English for documents.** Arabic (or any language) is welcome in issues, discussions, and translations.
   The documents are English so that they have one canonical text to correct.

---

## 2. The claim taxonomy (non-negotiable)

Every substantive sentence in a document is one of three types. Contributions must keep the labels honest.

| Label | You may use it when… | You must provide |
|---|---|---|
| `FACT` | An official Pi source says it, or you measured it yourself | A link **and** a date; a pin (commit/SHA-256) if possible |
| `ANALYSIS` | You are reasoning *from* labelled facts | The facts you reason from, cited by `S-nn` |
| `PROPOSAL` | You are suggesting something that does not exist | An explicit "not official" framing and at least one risk |

### 2.1 The three mistakes this taxonomy exists to prevent

| Mistake | Example | Why it is rejected |
|---|---|---|
| **Laundering a proposal as a fact** | "Pi will launch a DEX on Mainnet in Q1" (nobody said that) | Attribution to the Core Team without a source is fabrication |
| **Laundering an analysis as a fact** | "The API is rate-limited to 100 req/min" (nobody published that) | An invented number becomes a cited number within a week |
| **Laundering a secondary source as primary** | Citing a news article for an official decision | The article may be wrong; the primary source is one link away |

### 2.2 The "unconfirmed" convention

If a date or value is uncertain, write it as uncertain — do not round it into confidence.

```markdown
`FACT (unconfirmed date)` — Protocol 28 is reported complete on 2026-10-23 by a secondary source.
This conflicts with a `protocol_version = 28` read on 2026-10-18. See [`SOURCES.md`](SOURCES.md) §4.
```

Tidy stories are the enemy. A recorded contradiction is a feature.

---

## 3. Adding or editing a research document

### 3.1 Template

Every file in `research/` follows the same nine-section shape. Do not reorder it — readers rely on the
predictability.

```markdown
---
title: "..."
doc_id: RES-0NN
type: research
status: draft | review | stable | superseded
last_reviewed: YYYY-MM-DD
evidence_cutoff: YYYY-MM-DD
---

# RES-0NN · Title

> **Claim types:** `FACT` (official, dated) · `ANALYSIS` (ours, fallible) · `PROPOSAL` (not official).

## 1. Executive Summary
## 2. Problem Statement
## 3. Current State
## 4. Proposed Solution
## 5. Architecture
## 6. Benefits and Risks
## 7. Implementation Roadmap
## 8. Open Questions
## 9. References
```

The one intentional exception is [`research/open-questions.md`](research/open-questions.md) (`RES-012`): because
it *is* the register, it inserts §5 Architecture (record schema and lifecycle) and two append-only logs — §6
Resolved and §7 Abandoned — before the standard closing sections. Do not copy that shape into a normal research
document; if a document needs a log, it belongs in `RES-012`.

### 3.2 Requirements for a new research document

- [ ] Every `FACT` maps to a row in [`SOURCES.md`](SOURCES.md) — **add the row** if it is missing.
- [ ] `Current State` distinguishes **what exists** from **what is announced** from **what is proposed**.
- [ ] `Benefits and Risks` has a **real** risks column. A document with no risks is marketing.
- [ ] `Open Questions` contains at least one question the author cannot answer.
- [ ] `References` lists sources with dates.
- [ ] `evidence_cutoff` is today's date, not the date you started writing.
- [ ] No sentence begins "Pi will…" unless it quotes an official source.

### 3.3 Editing an existing document

Keep the diff small. If you change a fact, also:

1. update the `last_reviewed` date,
2. update the affected row in `SOURCES.md` if the source changed,
3. note the change in the pull request description (**not** silently in prose).

If your edit contradicts another document here, say which one and why. Cross-document consistency is
reviewed manually because there is no build step that can check it.

---

## 4. Adding a proposal

Proposals live in `proposals/` and use [`proposal-000-template.md`](proposals/proposal-000-template.md).

### 4.1 Lifecycle

```
Draft ──▶ Review ──▶ Stable
  │          │
  │          └──▶ Draft (revised)
  └──▶ Withdrawn
              ▲
       any stage ──▶ Superseded (by PR-nnn)
```

| Status | Meaning | Who moves it |
|---|---|---|
| `Draft` | Open for comment; expect breaking changes | Author |
| `Review` | Comment period closed; author is resolving objections | Author, after ≥14 days of comment |
| `Stable` | No known blocking objections. **Still not official.** | Maintainers |
| `Superseded` | Replaced by a later proposal; kept for history | Maintainers |
| `Withdrawn` | Not pursued; **the reasons stay in the document** | Author |

> **`Stable` never means "adopted".** No proposal in this repository can become official by merging here.
> Adoption would require the relevant party — a platform team, a node operator group, an app community — to
> implement it independently.

### 4.2 What a proposal must contain

| Section | Required content |
|---|---|
| **Summary** | What is proposed, for whom, and what changes if adopted |
| **Problem** | Who is harmed today, and how you would notice |
| **Motivation** | What exists today (dated `S-nn`) and why now |
| **Specification** | Normative language: `MUST` / `SHOULD` / `MAY`, one requirement per line |
| **Non-goals** | What this proposal deliberately does not solve |
| **Security considerations** | What breaks if a participant is malicious |
| **Architecture and reference implementation** | Components and their trust boundaries; a sketch, schema, or link — not necessarily working code |
| **Alternatives** | At least one, and why it was rejected |
| **Unresolved questions** | What would block adoption |
| **Adoption path** | Who would have to do what, concretely, for this to matter |

Proposals keep RFC numbering, so the nine required sections are distributed rather than renamed — the exact
mapping is in [`proposal-000-template.md`](proposals/proposal-000-template.md). A proposal that cannot fill one
of them says so explicitly instead of deleting the section.

### 4.3 The adoption honesty rule

Every proposal must contain this line, filled in truthfully:

```markdown
**Official status:** none. This document is a community proposal and has not been submitted to,
reviewed by, or endorsed by Pi Network or the Pi Core Team.
```

Exception: if it **has** been submitted somewhere, say where, with a link and a date.

---

## 5. Challenging a claim (the falsification workflow)

The preferred way to disagree is to make the claim testable.

1. **Find the sentence.** Quote it exactly, with the file and heading.
2. **Name the type.** Is it a `FACT` (so: wrong source, or stale), an `ANALYSIS` (so: bad inference), or a
   `PROPOSAL` (so: bad design)?
3. **State the disproof.** A link, a measurement, a command someone can run, or a logical contradiction.
4. **Say what should replace it.**

### Issue template

```markdown
**Document:** research/rpc-infrastructure.md
**Sentence:** "…"
**Claim type:** FACT | ANALYSIS | PROPOSAL
**Why it is wrong:** <evidence, with a URL and a retrieval date>
**Suggested replacement:** "…"
**Would you like to open the PR?** yes / no
```

If your challenge is about a **measurement**, include the exact command and its output. If it is about a
**source**, include the commit or the timestamp. "I disagree" without either is a conversation, not a
correction — still welcome, but it will be routed to `research/open-questions.md` instead of changing a
document.

---

## 6. Review process

| Step | What happens | Typical time |
|---|---|---|
| 1 | Issue opened, labelled `correction` / `proposal` / `question` / `source` | — |
| 2 | A maintainer checks the claim type and asks for evidence if missing | 7 days |
| 3 | PR opened (by anyone — the reporter is encouraged) | — |
| 4 | Review: does it keep labels honest, cite sources, and stay in scope? | 14 days |
| 5 | Merge, or a written rejection with reasons | — |

**Rejections are recorded, not deleted.** A rejected proposal keeps its document and gains a `Withdrawn`
status with the reasoning. That is how a community avoids re-litigating the same idea every six months.

### 6.1 Review checklist (used by maintainers)

- [ ] Claim labels are correct and not laundered
- [ ] Every `FACT` has a source + date, and the source appears in `SOURCES.md`
- [ ] No price, no promotion, no referral link
- [ ] Risks section is real
- [ ] No sentence attributes intent to the Core Team without a quotation
- [ ] Cross-links resolve
- [ ] `last_reviewed` / `evidence_cutoff` updated

---

## 7. Style guide

| Rule | Reason |
|---|---|
| Short sentences. One idea per sentence. | Research is read by tired people |
| Tables for anything with more than three parallel items | Scannable; forces consistency |
| Define a term on first use | "RPC", "SLA", "PiPower" are not universal |
| No emoji in document bodies | Keeps diffs readable and archival |
| Dates as `YYYY-MM-DD` | Sortable, unambiguous |
| Quote official text in a blockquote **with a link** | Separates their words from ours |
| Prefer "we could not determine X" over silence | Silence reads as certainty |
| Metric units and plain numbers | "420,000+", not "420k+" in normative text |

### 7.1 Words to avoid

| Avoid | Use instead | Why |
|---|---|---|
| "will launch", "is going to" | "is announced to", "we propose" | Prediction dressed as fact |
| "official" (about this repo) | "community", "unofficial" | Misattribution |
| "guaranteed", "risk-free" | nothing — delete the sentence | False |
| "everyone knows" | a citation | Appeal to consensus |
| "just", "simply" | nothing | Hides real complexity |

---

## 8. What gets closed without discussion

- Price or trading content.
- Requests to add a token, referral code, or "partnership" announcement.
- Claims about the Core Team's private intentions with no source.
- "Is Pi a scam?" — answered in scope terms by [`DISCLAIMER.md`](DISCLAIMER.md); not a research topic.
- Security disclosures involving a **live** vulnerability in a third-party app: **do not open a public issue.**
  Report privately to the affected party first. See §9.

---

## 9. Security issues

This repository contains no executable code and no infrastructure. Even so:

- If you find a **vulnerability in a Pi app or service**, report it to that party privately. Do not publish
  proof-of-concept exploits here.
- If you find a **flaw in a recommendation made here** (for example, a checklist step that is wrong and would
  cause an app to accept an invalid payment), that is a **high-priority correction**. Open an issue titled
  `SECURITY: <document> — <one-line summary>` **without** exploit details, and a maintainer will arrange a
  private channel.
- Never include real API keys, passphrases, or user data in an issue or PR.

---

## 10. Licence of contributions

By contributing you agree that:

- text contributions are licensed **CC BY 4.0**, and
- code contributions are licensed **MIT**,

without additional terms. See [`LICENSE`](LICENSE). Do not paste content you do not have the right to
license — including large excerpts from copyrighted articles. Quote briefly and link.

---

## 11. First contribution?

Good first issues:

1. Pick an `OQ-nnn` in [`research/open-questions.md`](research/open-questions.md) and write what evidence
   would answer it.
2. Add a missing source row to [`SOURCES.md`](SOURCES.md) — with a pin.
3. Take a sentence labelled `ANALYSIS` and try to falsify it. Report either outcome; both are useful.
4. Fix a broken link. Unglamorous, genuinely helpful.

Open an issue saying which one you are taking, so two people do not duplicate it.
