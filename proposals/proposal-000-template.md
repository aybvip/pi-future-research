---
title: "PR-000 · Proposal template"
doc_id: PR-000
type: proposal
status: template
last_reviewed: 2026-10-25
evidence_cutoff: 2026-10-25
---

# PR-000 · \<Title\>

| Field | Value |
|---|---|
| **ID** | PR-000 |
| **Status** | Draft |
| **Author(s)** | @handle (or "anonymous contributor") |
| **Created** | YYYY-MM-DD |
| **Last updated** | YYYY-MM-DD |
| **Comment period** | 14 days from first publication |
| **Supersedes** | — |
| **Superseded by** | — |

> **Official status:** none. This document is a community proposal and has not been submitted to, reviewed by,
> or endorsed by Pi Network or the Pi Core Team.

### How the RFC's sections map to this repository's nine-section shape

Proposals keep RFC numbering because reviewers expect it, but every one of the nine required sections has a
home. This table is the contract:

| Required section | Where it lives in a proposal |
|---|---|
| Executive Summary | §1 Summary |
| Problem Statement | §2 Problem (+ §5 Non-goals) |
| Current State | §3 Motivation (what exists today, dated `S-nn`) |
| Proposed Solution | §4 Specification |
| Architecture | §8 Architecture and reference implementation |
| Benefits and Risks | §6 Rationale + §7 Security considerations |
| Implementation Roadmap | §12 Adoption path |
| Open Questions | §11 Unresolved questions |
| References | §13 References |

If a proposal cannot fill one of these, it says so explicitly rather than deleting the section.

---

## 1. Summary

One paragraph. What is proposed, for whom, and what changes if it is adopted. No motivation yet — that is §3.

---

## 2. Problem

| Who is harmed | How | How you would notice |
|---|---|---|
| | | |

State the problem in terms a stranger can verify. "It is inefficient" is not a problem statement; "a developer
cannot tell whether a 500 means retry or abort" is.

---

## 3. Motivation

Why now? What changed in 2026 that makes this worth doing? Cite `S-nn` rows from
[`SOURCES.md`](../SOURCES.md). If nothing changed, say so honestly — the proposal may still be valid, but it
has no urgency.

---

## 4. Specification

Normative language: `MUST`, `SHOULD`, `MAY` (RFC 2119 semantics). **One requirement per line, one stable ID per
requirement.** IDs are never reused, even if a requirement is deleted.

| ID | Level | Requirement |
|---|---|---|
| X-1 | MUST | |
| X-2 | MUST | |
| X-3 | SHOULD | |
| X-4 | MAY | |

### 4.1 Conformance levels

| Level | Requires | For |
|---|---|---|
| Level 1 | | |
| Level 2 | | |
| Level 3 | | |

### 4.2 Formats and schemas

If the proposal defines a data format, put the JSON schema here, inline or linked, with a `schema` identifier
and a version. Include a **complete** example, not a fragment.

---

## 5. Non-goals

| Not solved | Why not |
|---|---|
| | |

A proposal with no non-goals is either trivial or unbounded. Both are problems.

---

## 6. Rationale

Why this design, and not the obvious alternatives? Record the reasoning so that a future reader does not have
to re-derive it.

---

## 7. Security considerations

| If a participant is malicious… | Then… | Control |
|---|---|---|
| | | |

Include: spoofing, replay, denial of service, data exposure, and — where money is involved — double-spend and
allowance abuse.

---

## 8. Architecture and reference implementation

A sketch is sufficient: pseudocode, a schema, a sequence diagram, or a link. State clearly whether it exists
and whether it is tested.

```text
(pseudocode / schema / sequence)
```

---

## 9. Backwards compatibility

| Existing behaviour | Effect of adoption | Migration path |
|---|---|---|
| | | |

If adoption breaks anyone, say who and how they recover.

---

## 10. Alternatives considered

| Alternative | Why rejected |
|---|---|
| Do nothing | |
| | |

---

## 11. Unresolved questions

Numbered, and each one blocking or non-blocking. Link to `OQ-nnn` in
[`RES-012`](../research/open-questions.md) if the question is general rather than proposal-specific.

| # | Question | Blocks adoption? |
|---|---|---|
| 1 | | |

---

## 12. Adoption path

Who would have to do what, concretely? A proposal without an adoption path is a wish.

| Step | Actor | Artefact |
|---|---|---|
| 1 | | |
| 2 | | |

---

## 13. References

| # | Source | Type | Date |
|---|---|---|---|
| `S-nn` | | | |

---

## Checklist before publishing

- [ ] Problem is verifiable, not rhetorical
- [ ] Every requirement has a stable ID and a level
- [ ] At least one alternative is recorded
- [ ] Security section names a malicious participant
- [ ] Non-goals are stated
- [ ] Unresolved questions are honest
- [ ] Adoption path names real actors, not "the community"
- [ ] "Official status: none" is present
