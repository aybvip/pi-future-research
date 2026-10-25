---
title: "PR-004 · Launch Transparency: a disclosure schema for Pi Launchpad projects"
doc_id: PR-004
type: proposal
status: draft
last_reviewed: 2026-10-25
evidence_cutoff: 2026-10-25
---

# PR-004 · Launch Transparency

| Field | Value |
|---|---|
| **ID** | PR-004 |
| **Status** | Draft |
| **Author(s)** | anonymous contributor |
| **Created** | 2026-10-25 |
| **Last updated** | 2026-10-25 |
| **Comment period** | 14 days from first publication |
| **Related** | [`RES-003`](../research/launchpad-opportunities.md) · `OQ-008`, `OQ-009`, `OQ-025` |

> **Official status:** none. This document is a community proposal and has not been submitted to, reviewed by,
> or endorsed by Pi Network or the Pi Core Team. It does **not** modify `PiRC1`, and it makes no claim about
> the Launchpad's Mainnet design, which was still pending at the evidence cut-off (`S-24`).

> **Not financial advice.** This schema exists to make facts comparable. It does not evaluate, rate, or
> recommend any launch. See [`DISCLAIMER.md`](../DISCLAIMER.md) §2.

---

## 1. Summary

A single machine-readable disclosure that every Launchpad project could publish before its sale: what the
product is, what the token does, how much exists, who holds it, what the pool looks like, and what the
participant's weighting depends on.

It is designed to be **partly machine-verifiable against the chain** and **honest about the part that is not**.

---

## 2. Problem

| Who is harmed | How | How you would notice |
|---|---|---|
| Participants | Cannot compare launches; must trust marketing pages with different shapes | Decisions made on presentation, not facts |
| Projects | Good projects cannot signal quality cheaply | The market rewards loudness |
| The ecosystem | No post-launch accountability | Abandoned projects leave no record |
| Analysts | No dataset | Every analysis is manual and incomparable |

`FACT` — The Launchpad's official design routes proceeds into liquidity rather than to the team (`S-53`), and
the first version ran on Testnet with a test token, with the design explicitly subject to change (`S-24`).
`ANALYSIS` — Because the team does not receive the raise, the usual diligence proxy ("they raised money, so
they are committed") disappears. A replacement — product evidence plus supply disclosure — is needed.

---

## 3. Motivation

`ANALYSIS` — Pi's launch design removes one conflict of interest and, in doing so, removes the information that
conflict used to carry. Disclosure is the cheapest replacement: it costs a project hours, not capital, and it
gives participants the only thing that makes two launches comparable — the same questions answered in the same
shape.

The schema is deliberately written now, while the Mainnet design is unsettled, because a schema is easier to
adapt than a norm.

---

## 4. Specification

### 4.1 Core requirements

| ID | Level | Requirement |
|---|---|---|
| LP-1 | MUST | A project publishes `launch-disclosure.json` **before** participation opens |
| LP-2 | MUST | The document validates against `pi-launch-disclosure/1` |
| LP-3 | MUST | Every numeric claim is accompanied by its unit and its basis (total, circulating, locked) |
| LP-4 | MUST | The disclosure is dated and versioned; edits create a new version with a changelog entry |
| LP-5 | MUST | The disclosure is hosted at a stable URL that does not require authentication |
| LP-6 | MUST | The disclosure states the PiPower rules **in effect for this launch**, by reference to a pinned PiRC1 revision or an explicit restatement |
| LP-7 | MUST NOT | The disclosure contain price projections, return estimates, or promotional language |

### 4.2 Required fields

| Field | Level | Type | Notes |
|---|---|---|---|
| `project.name`, `project.url` | MUST | string | Public, resolvable |
| `project.product_status` | MUST | enum | `live` / `beta` / `testnet` / `concept` |
| `project.product_evidence` | MUST | URL list | A user must be able to try it |
| `token.symbol`, `token.asset_id` | MUST | string | Issuer/contract identity |
| `token.utility` | MUST | string[] | What it does *inside the product* |
| `supply.total` | MUST | integer | Base units, with decimals stated |
| `supply.circulating_at_launch` | MUST | integer | Including the pool |
| `supply.locked` | MUST | array | `{beneficiary, amount, unlock_date, cliff}` |
| `pool.pi_amount` | MUST | integer | Pi committed to liquidity |
| `pool.token_amount` | MUST | integer | Token committed to liquidity |
| `pool.lock_duration` | MUST | duration | Or `none`, stated explicitly |
| `pool.withdrawal_authority` | MUST | object | Who may withdraw, under what condition |
| `participation.pi_power_rules` | MUST | object | Tiers, multipliers, snapshots |
| `participation.restrictions` | MUST | array | Jurisdictions, lockups, eligibility |
| `risks` | MUST | string[] | Concrete, not "crypto is volatile" |
| `reporting.commitment` | SHOULD | object | Cadence and fields for post-launch updates |
| `contacts.security`, `contacts.general` | MUST | string | Reachable |

### 4.3 Example (abridged)

```json
{
  "schema": "pi-launch-disclosure/1",
  "version": "1.0.0",
  "published_at": "2026-11-01",
  "project": {
    "name": "Example",
    "url": "https://example.app",
    "product_status": "live",
    "product_evidence": ["https://example.app/try"]
  },
  "token": {
    "symbol": "EXM",
    "asset_id": "EXM:G...",
    "utility": ["access to premium features", "in-app rewards"]
  },
  "supply": {
    "decimals": 7,
    "total": "1000000000000000",
    "circulating_at_launch": "200000000000000",
    "locked": [
      { "beneficiary": "team", "amount": "300000000000000",
        "unlock_date": "2027-11-01", "cliff": "12 months" }
    ]
  },
  "pool": {
    "pi_amount": "50000000000",
    "token_amount": "100000000000000",
    "lock_duration": "12 months",
    "withdrawal_authority": { "who": "none", "condition": "locked" }
  },
  "participation": {
    "pi_power_rules": { "pirc1_revision": "c50d516", "tiers": "as published" },
    "restrictions": ["jurisdiction list in project terms"]
  },
  "risks": [
    "token has no secondary market at launch",
    "pool lock expires 2027-11-01"
  ],
  "contacts": { "general": "hello@example.app", "security": "security@example.app" }
}
```

### 4.4 Verification mapping

| Field group | Machine-verifiable? | How |
|---|---|---|
| `supply.total` | Yes, for issued assets | Trustline/issuer state on chain |
| `supply.locked` | **Partly** | Only if lockup accounts are disclosed and identifiable |
| `pool.*` | Yes, if pool address disclosed | Ledger balance of the pool account |
| `token.asset_id` | Yes | Issuer/contract existence |
| `project.product_status` | No | Human check of the URL |
| `participation.pi_power_rules` | No | Document comparison against the pinned PiRC revision |
| `risks` | No | Human judgement |

`ANALYSIS` — This table is the proposal's most important artefact. It tells a verifier exactly where certainty
ends, which is precisely what a "verified" badge must communicate.

### 4.5 Post-launch reporting (recommended)

| ID | Level | Requirement |
|---|---|---|
| LP-10 | SHOULD | The project publishes a report at a stated cadence (monthly or quarterly) |
| LP-11 | SHOULD | Each report re-states the same fields as §4.2, with deltas |
| LP-12 | SHOULD | Pool changes are reported before or at the time they occur |
| LP-13 | MUST | If a project stops reporting, the disclosure is marked `stale` after two missed periods |

---

## 5. Non-goals

| Not solved | Why |
|---|---|
| Approving or rejecting a launch | Not our authority; not a directory's purpose |
| Rating or scoring a project | A score becomes a target |
| Verifying team identity | Separate discipline; platform/KYB territory |
| Legal compliance | Jurisdiction-specific |
| Price discovery | Out of scope permanently |
| Replacing `PiRC1` | It complements the RFC; it does not amend it |

---

## 6. Rationale

| Decision | Reason |
|---|---|
| One file, one shape | Comparability is the whole point |
| Denominators mandatory | Most opacity is a missing denominator |
| Pool fields prominent | In this design the pool *is* the founding asset |
| PiPower stated per launch | Rules may change between launches; a pointer alone is insufficient |
| Verification mapping published | Prevents "verified" from being read as "safe" |
| Post-launch reporting optional but dated | Encourages without pretending to enforce |

---

## 7. Security considerations

| If a participant is malicious… | Then… | Control |
|---|---|---|
| A project understates float | Participants misjudge dilution | On-chain supply check; `contradicted` state |
| A project hides withdrawal authority | Liquidity pulled at launch | Explicit `withdrawal_authority`; pool account disclosure |
| A project changes the disclosure after the sale | Participants relied on stale facts | Versioning + date + changelog (LP-4) |
| A verifier accepts a claim without checking | False assurance | Verification mapping (§4.4); multiple verifiers |
| A disclosure becomes a marketing page | Signal lost | LP-7; schema rejects prose fields in numeric slots |

---

## 8. Architecture and reference implementation

Two independent checks, because they fail differently:

| Check | Input | Catches | Misses |
|---|---|---|---|
| **Structural validator** | The disclosure file alone | Missing fields, impossible arithmetic, promotional language | A well-formed lie |
| **On-chain verifier** | Disclosure + ledger state | Supply and balance contradictions | Off-chain promises, vesting intent |

A disclosure is published with the result of both, and a `contradicted` result is published as prominently as
a `verified` one.

```text
validate(disclosure):
  - schema version known
  - all MUST fields present
  - numeric fields parse as integers with stated decimals
  - circulating + locked <= total
  - pool.token_amount <= circulating_at_launch
  - every locked entry has beneficiary, amount, unlock_date
  - no field matches /(apy|roi|guaranteed|moon|price target)/i

verify_onchain(disclosure):
  - resolve token.asset_id
  - compare supply.total to issuer state
  - if pool address disclosed: compare balances
  - emit {verified | partial | contradicted, ledger_ref}
```

The arithmetic checks cost nothing and catch the most common class of error: disclosures whose own numbers do
not add up.

---

## 9. Backwards compatibility

New format. While `PiRC1` remains an RFC, the schema is expected to change; breaking changes increment the major
version and keep the previous version valid for existing disclosures.

---

## 10. Alternatives

| Alternative | Why rejected |
|---|---|
| Free-form project pages | Not comparable; the current problem |
| A rating agency | Requires judgement and creates a target |
| Requiring disclosure by platform rule | Outside this proposal's authority; adopt voluntarily first |
| Disclosing only on-chain facts | Excludes product status, which is the main risk |
| A single long PDF per launch | Not machine-checkable; difficult to diff |

---

## 11. Unresolved questions

| # | Question | Blocks adoption? |
|---|---|---|
| 1 | Is the PiPower formula identical across launches? (`OQ-009`) | Yes, for `pi_power_rules` |
| 2 | Who approves launches, and would they consume this schema? (`OQ-008`) | No, but it determines reach |
| 3 | Will the Mainnet design reuse Design 1? (`OQ-025`) | No — schema is versioned |
| 4 | Should lockup account disclosure be required for `verified` status? | Yes, for the top verification level |
| 5 | What is the minimum "product evidence" for `product_status: live`? | Partly |

---

## 12. Adoption path

| Step | Actor | Artefact |
|---|---|---|
| 1 | This repo | Schema + validator + one worked example |
| 2 | One launch | Publishes voluntarily |
| 3 | An analyst | Verifies the on-chain subset and publishes the result |
| 4 | A UI | Displays the disclosure and verification state |
| 5 | Participants | Ask for the disclosure by default — the only durable enforcement |

---

## 13. References

| # | Source | Type | Date |
|---|---|---|---|
| `S-23` | Ecosystem-token design for Mainnet | Official | 2026-02-20 |
| `S-24` | Launchpad on Testnet; design subject to change | Official | 2026-03-19 |
| `S-52` | PiRC process | Official (RFC) | retrieved 2026-10-25 |
| `S-53` | PiRC1 — proceeds to liquidity; PiPower baseline | Official (RFC) | pinned 2026-02-20 |
| `S-51` | MiCA whitepaper | Official | 2025-11-27 |
| `RES-003` | Launchpad study | This repo | 2026-10-25 |

---

**Related:** [`RES-003`](../research/launchpad-opportunities.md) ·
[`RES-011`](../research/smart-contract-ecosystem.md) · [`PR-003`](proposal-003-ecosystem-directory.md)
