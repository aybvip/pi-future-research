---
title: "PR-002 · Baseline Standards for Pi Applications"
doc_id: PR-002
type: proposal
status: draft
last_reviewed: 2026-10-25
evidence_cutoff: 2026-10-25
---

# PR-002 · Baseline Standards for Pi Applications

| Field | Value |
|---|---|
| **ID** | PR-002 |
| **Status** | Draft |
| **Author(s)** | anonymous contributor |
| **Created** | 2026-10-25 |
| **Last updated** | 2026-10-25 |
| **Comment period** | 14 days from first publication |
| **Related** | [`RES-005`](../research/developer-tools.md) · [`RES-006`](../research/security-and-trust.md) |

> **Official status:** none. This document is a community proposal and has not been submitted to, reviewed by,
> or endorsed by Pi Network or the Pi Core Team. It is **not** a requirement for listing in any directory.

---

## 1. Summary

Three machine-checkable artefacts that make a Pi app reviewable:

1. **A manifest** (`pi-app.json`) declaring identity, permissions, and disclosures.
2. **A payment-integration profile** fixing the order of operations and the idempotency rules.
3. **An error taxonomy** so that clients and servers agree on what is retryable.

Each is small, each is independently adoptable, and each turns a folklore practice into a check.

---

## 2. Problem

| Who is harmed | How | How you would notice |
|---|---|---|
| Users | Cannot see what an app can do before granting access | Permissions are discovered by consequence |
| Reviewers | Every review starts from zero | Review quality depends on who reviews |
| Developers | Reinvent payment ordering; get it wrong | Double delivery, free goods |
| Integrators | Cannot tell a permanent error from a transient one | Blind retries |
| The ecosystem | No comparable baseline | "Is this app safe?" has no factual answer |

`FACT` — Official documentation already states the two governing rules: deliver only after a successful
`/complete` (`S-03`), and the blockchain is the only source of truth for exchanging Pi (`S-04`). What is
missing is a checkable implementation standard around them.

---

## 3. Motivation

`ANALYSIS` — App Studio and the SDK have made *creation* cheap. Review has not become cheaper, so the ratio of
apps to reviewed apps is worsening. A manifest costs an author ten minutes and saves a reviewer an hour; a
payment profile prevents a class of loss that cannot be fixed by a redeploy.

Standards that require a platform change do not ship. These three require only an author's decision.

---

## 4. Specification

### 4.1 The manifest

| ID | Level | Requirement |
|---|---|---|
| DEV-1 | MUST | An app publishes `pi-app.json` at its **origin root** (`/.well-known/pi-app.json` SHOULD be used if the root is unavailable) |
| DEV-2 | MUST | The manifest declares `schema`, `app_id`, `name`, `version`, `contact`, and `permissions` |
| DEV-3 | MUST | `permissions` enumerates every platform capability used, from a closed vocabulary |
| DEV-4 | MUST | The manifest declares `custody: "none"` unless the app holds user funds or keys, in which case it declares the arrangement and its jurisdiction |
| DEV-5 | MUST | The manifest links a public changelog |
| DEV-6 | MUST | The manifest declares whether the app uses smart contracts and, if so, their addresses and networks |
| DEV-7 | SHOULD | The manifest declares supported languages and regions |
| DEV-8 | MUST NOT | The manifest contain secrets, API keys, or personal data |

#### Permission vocabulary (initial)

| Permission | Meaning |
|---|---|
| `payments:user-to-app` | Charges the user (U2A) |
| `payments:app-to-user` | Pays the user (A2U) |
| `identity:username` | Reads the Pioneer username |
| `storage:device` | Uses device local storage (requires whitelist) |
| `share:files` | Invokes `Pi.shareFile` |
| `staking:read` | Reads app-specific staking data (requires whitelist) |
| `contracts:invoke` | Calls a smart contract |

#### Example

```json
{
  "schema": "pi-app-manifest/1",
  "app_id": "example.app",
  "name": "Example App",
  "version": "1.4.0",
  "contact": "security@example.app",
  "changelog": "https://example.app/changelog",
  "permissions": ["payments:user-to-app", "identity:username"],
  "custody": "none",
  "contracts": [],
  "languages": ["en", "ar"],
  "disclosures": {
    "data_retention_days": 30,
    "third_party_processors": ["payments"],
    "adult_content": false
  }
}
```

### 4.2 Payment integration profile

| ID | Level | Requirement |
|---|---|---|
| DEV-10 | MUST | The server approves a payment **before** the client prompts the user to sign |
| DEV-11 | MUST | The server verifies the transaction on the chain (destination, amount ≥ price, native asset, memo/payment identifier, validated ledger) **before** delivering value |
| DEV-12 | MUST | Value is delivered only after the platform completes the payment |
| DEV-13 | MUST | Every write is idempotent on a caller-supplied key; `payment_id` is unique per grant |
| DEV-14 | MUST | Client-supplied `amount`, `status`, and `txid` are treated as **claims**, never as authorisation |
| DEV-15 | MUST | The API key is used server-side only |
| DEV-16 | MUST NOT | A retry is issued for a permanent 4xx |
| DEV-17 | SHOULD | Retries are bounded (≤ 3) with exponential backoff and jitter |
| DEV-18 | SHOULD | The destination address is configuration, never request input |

Conformance test: reorder the steps so that delivery precedes on-chain verification, and the implementation
**must** fail closed. If it succeeds, it is non-conforming regardless of behaviour in the happy path.

### 4.3 Error taxonomy

| ID | Level | Requirement |
|---|---|---|
| DEV-20 | MUST | Errors are returned in a documented structure containing `code`, `retryable`, `message`, and `request_id` |
| DEV-21 | MUST | `retryable` is a boolean decided by the server, not inferred by the client from the status code alone |
| DEV-22 | MUST | `code` values are stable and never reused for a different meaning |
| DEV-23 | SHOULD | The taxonomy is published as a static page or JSON file |

```json
{ "code": "payment.already_completed", "retryable": false,
  "message": "This payment has already been fulfilled.",
  "request_id": "req_01J..." }
```

### 4.4 Versioning and deprecation

| ID | Level | Requirement |
|---|---|---|
| DEV-25 | MUST | The manifest's `schema` is versioned; a breaking change increments the major version |
| DEV-26 | MUST | A breaking change to any public endpoint is announced with a deprecation date |
| DEV-27 | SHOULD | Deprecation windows are ≥ 90 days |
| DEV-28 | SHOULD | The changelog records security-relevant changes without disclosing live vulnerabilities before a fix |

### 4.5 Conformance levels

| Level | Requires | Meaning |
|---|---|---|
| **Baseline** | DEV-1…8, DEV-20…22 | Reviewable app |
| **Payments** | Baseline + DEV-10…18 | Handles money to the standard's satisfaction |
| **Full** | Payments + DEV-25…28 | Maintainable over time |

---

## 5. Non-goals

| Not solved | Why |
|---|---|
| Quality or popularity | Not measurable, and ranking creates gaming incentives |
| Legal compliance (KYC, consumer law) | Jurisdiction-specific; out of scope |
| Smart-contract auditing | Separate discipline ([`RES-011`](../research/smart-contract-ecosystem.md)) |
| Mandating a framework or language | The standard is transport-level |
| Replacing platform requirements | It is additive and voluntary |

---

## 6. Rationale

| Decision | Reason |
|---|---|
| Manifest at a well-known path | Discoverable without a central registry |
| Closed permission vocabulary | Free-text permissions are uncheckable |
| `retryable` as a server-supplied boolean | Clients cannot know; guessing causes outages |
| Conformance by negative test | Happy-path demos prove nothing about ordering |
| No quality score | Any score becomes a target |
| Voluntary | A mandatory standard without authority is ignored; a voluntary one can spread |

---

## 7. Security considerations

| If a participant is malicious… | Then… | Control |
|---|---|---|
| An app publishes a false manifest | Permissions understated | Manifest is a claim; verification is separate ([`PR-003`](proposal-003-ecosystem-directory.md)) |
| An app replays a completion callback | Free goods | DEV-13 idempotency; unique `payment_id` |
| An app trusts a forged `txid` | Fraud | DEV-11 on-chain verification |
| A client manipulates `amount` | Underpayment | DEV-14 server-side price |
| A leaked key is reused | Full payment compromise | DEV-15; rotation runbook ([`RES-006`](../research/security-and-trust.md) M9) |
| An app hides custody | Users lose funds unknowingly | DEV-4 explicit `custody` declaration |

---

## 8. Architecture and reference implementation

Three layers, each independently adoptable:

| Layer | Runs where | Enforces |
|---|---|---|
| **Manifest** | In the repository, version-controlled | What the app declares it does |
| **Validator** | CI, on every change | That the declaration is well-formed and secret-free |
| **Payment test harness** | CI, against a sandbox or recorded fixtures | That delivery happens after on-chain verification, exactly once |

No layer requires a hosted service, which is what makes the standard adoptable by a solo developer.

```text
validator(manifest):
  - schema is a known version
  - required fields present and typed
  - every permission in the vocabulary
  - no field matches /(api[_-]?key|secret|passphrase)/i
  - contracts[] entries have network + address + code hash (if any)

paymentsTestSkeleton:
  given a pending payment
  when completion arrives with a valid txid
  then verifyOnChain() is called BEFORE deliver()
  and deliver() is called exactly once for two identical callbacks
  and deliver() is NOT called when destination mismatches
```

A CI recipe that runs `validator` plus the three payment tests satisfies **Baseline + Payments** for the
machine-checkable portion.

---

## 9. Backwards compatibility

| Existing behaviour | Effect | Migration |
|---|---|---|
| Apps with no manifest | Not conforming, still functional | Add a manifest; no code change |
| Apps that deliver before verification | Non-conforming; may be unsafe | Reorder; add tests |
| Free-text error bodies | Not conforming | Add `code`/`retryable`; keep old fields during transition |

---

## 10. Alternatives

| Alternative | Why rejected |
|---|---|
| A central registry of apps instead of a manifest | Central list rots; manifest lives with the app |
| Quality ratings | Gameable; conflates safety with popularity |
| Requiring a specific SDK/framework | Excludes valid stacks; raises the barrier |
| Relying on platform review alone | Does not scale with app creation; opaque to authors |
| A long checklist with no machine checks | Unenforced and inconsistent |

---

## 11. Unresolved questions

| # | Question | Blocks adoption? |
|---|---|---|
| 1 | Is there an official app identifier that a manifest should use? | Yes, for DEV-2 |
| 2 | Do platform capabilities have official names we should mirror? (`OQ-005`) | Partly |
| 3 | Is there an official error taxonomy to align with? (`OQ-013`) | Yes, for DEV-20 |
| 4 | Would a manifest be consumed by any directory, or is it self-declaration only? | No, but it affects uptake |
| 5 | Should `custody` include a required legal-entity field? | No |

---

## 12. Adoption path

| Step | Actor | Artefact |
|---|---|---|
| 1 | One app | Publishes `pi-app.json` |
| 2 | Any reviewer | Uses the manifest in a review |
| 3 | A tool author | Ships the validator + payment tests |
| 4 | A directory | Displays manifest-derived permissions ([`PR-003`](proposal-003-ecosystem-directory.md)) |
| 5 | Authors collectively | Treat non-conformance as a review finding, not a ban |

---

## 13. References

| # | Source | Type | Date |
|---|---|---|---|
| `S-02` | Pi Browser requirement; pre-signed transactions | Official | retrieved 2026-10-25 |
| `S-03` | Deliver after `/complete` | Official | retrieved 2026-10-25 |
| `S-04` | Chain as source of truth | Official | retrieved 2026-10-25 |
| `S-06` | `PaymentDTO` | Official | pinned 2024-08-28 |
| `S-07` | Three-phase payments | Official | retrieved 2026-10-25 |
| `S-09` | SDK 2.0.0 | Official | 2026-03-19 |
| `S-32` | Whitelisted capabilities | Official | 2026-09-04 |

---

**Related:** [`RES-006`](../research/security-and-trust.md) · [`RES-005`](../research/developer-tools.md) ·
[`PR-003`](proposal-003-ecosystem-directory.md)
