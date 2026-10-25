---
title: "PR-001 · A Community Pi RPC Monitoring Standard"
doc_id: PR-001
type: proposal
status: draft
last_reviewed: 2026-10-25
evidence_cutoff: 2026-10-25
---

# PR-001 · A Community Pi RPC Monitoring Standard

| Field | Value |
|---|---|
| **ID** | PR-001 |
| **Status** | Draft |
| **Author(s)** | anonymous contributor |
| **Created** | 2026-10-25 |
| **Last updated** | 2026-10-25 |
| **Comment period** | 14 days from first publication |
| **Related** | [`RES-002`](../research/rpc-infrastructure.md) · `OQ-001`, `OQ-002`, `OQ-003` |

> **Official status:** none. This document is a community proposal and has not been submitted to, reviewed by,
> or endorsed by Pi Network or the Pi Core Team. It does **not** define an official SLA, and it does not claim
> to measure one.

---

## 1. Summary

A specification for measuring and publishing the health of Pi's chain-access endpoints: what to measure, how to
measure it, how to publish the raw data, and what may never be claimed from it.

The output of conformance is **evidence**, not a verdict. A conforming publisher produces data that two
independent parties can compare and disagree about productively.

---

## 2. Problem

| Who is harmed | How | How you would notice |
|---|---|---|
| App developers | Cannot distinguish their bug from an upstream fault | Debugging sessions that end in "it works now" |
| New builders | Cannot size retry budgets or capacity | Over-engineered clients, or surprise failures |
| Researchers | Cannot cite any reliability figure | Every claim is anecdotal and undated |
| The ecosystem | Outages are rediscovered socially each time | Repeated "is the API down?" threads |

`FACT` — As of 2026-10-25 this repository could not find published rate limits, an availability target, a
status page, or an incident log for `api.mainnet.minepi.com` or `api.testnet.minepi.com`
([`SOURCES.md`](../SOURCES.md) §5).

---

## 3. Motivation

The missing artefact is not an API — it is a **definition**. Two developers saying "the API was slow" are
usually measuring different things: time-to-first-byte, time-to-full-body, a retried request that eventually
succeeded, or a request that failed but was repeated by a framework.

Once the definition is fixed, measurement becomes comparable, and comparison is what makes an incident
corroborable. This is the same function DNS and NTP monitoring serve: unglamorous, standardised, and load-bearing.

---

## 4. Specification

### 4.1 Scope

| In scope | Out of scope |
|---|---|
| Read-only `GET` probes of `S-60` and `S-61` | Load testing |
| Metric definitions and publication | Predicting operator capacity |
| Raw-data formats | Operating a commercial monitoring service |
| Incident classification rules | Attributing causes to operators |
| Vantage-point disclosure | Probing authenticated Platform API endpoints |

### 4.2 Probes

| ID | Level | Requirement |
|---|---|---|
| RPC-1 | MUST | A probe issues **only** `GET` requests and performs **no** state-changing operation |
| RPC-2 | MUST | A probe identifies itself with a stable, documented User-Agent |
| RPC-3 | MUST | A probe samples at most **1 request per minute per endpoint per vantage point** |
| RPC-4 | MUST | A probe applies a documented timeout; the default SHOULD be 10 s |
| RPC-5 | MUST | A probe records `attempt = 1` for the measured attempt; retries are separate records |
| RPC-6 | MUST | A probe records its vantage point identifier and a coarse region |
| RPC-7 | MUST | A probe verifies its clock offset and discards samples with offset > 1 s |
| RPC-8 | SHOULD | A probe measure at least `/` and `/ledgers?order=desc&limit=1` |

### 4.3 Metric definitions

| ID | Level | Requirement |
|---|---|---|
| RPC-10 | MUST | **Probe success** is defined as: HTTP 200, a parseable body, within the timeout |
| RPC-11 | MUST | **Latency** is time to full response body; retries MUST NOT be folded into it |
| RPC-12 | MUST | **Ledger lag** is `probe_start_time − latest_ledger.closed_at`, in seconds |
| RPC-13 | MUST | Every failed sample carries exactly one **error class** (see §4.4) |
| RPC-14 | MUST | Aggregates are reported per vantage point and per UTC hour |
| RPC-15 | MUST NOT | A percentile is reported when n < 100 for the reported window |
| RPC-16 | MUST NOT | A single "uptime %" is published as a headline figure |

### 4.4 Error classes

| Class | Trigger |
|---|---|
| `timeout` | No complete response within the timeout |
| `dns` | Name resolution failure |
| `tls` | Certificate or handshake failure |
| `http_4xx` | 4xx other than 429 |
| `http_429` | 429 |
| `http_5xx` | 5xx |
| `bad_json` | 200 with unparseable body |
| `empty_body` | 200 with a body that is empty or structurally wrong |
| `clock_unreliable` | Sample discarded due to clock offset |

`ANALYSIS` — The distinction between `http_429` and `http_5xx` is the single most useful classification here:
one means "slow down", the other means "something is broken". Clients that conflate them either hammer an
outage or back off from a healthy service.

### 4.5 Publication

| ID | Level | Requirement |
|---|---|---|
| RPC-20 | MUST | Publish **raw samples**, append-only, in the format of §4.6 |
| RPC-21 | MUST | Publish the methodology, timeout, interval, and probe versions alongside the data |
| RPC-22 | MUST | Publish vantage points separately; merged figures MUST NOT be the primary artefact |
| RPC-23 | MUST | Publish a content hash or immutable object ID per published batch |
| RPC-24 | MUST | Publish the coverage window; gaps MUST be visible, not interpolated |
| RPC-25 | SHOULD | Publish aggregates as **derived** artefacts, regenerable from raw |

### 4.6 Sample format

```json
{
  "schema": "pi-rpc-probe/1",
  "probe_id": "eu-west-1-a",
  "probe_version": "1.0.0",
  "region": "eu-west",
  "target": "https://api.mainnet.minepi.com",
  "path": "/ledgers?order=desc&limit=1",
  "started_at": "2026-10-25T09:14:03.112Z",
  "duration_ms": 187,
  "http_status": 200,
  "outcome": "ok",
  "error_class": null,
  "ledger": { "sequence": 12345678, "closed_at": "2026-10-25T09:13:57Z", "lag_seconds": 6 },
  "clock_offset_ms": 12,
  "attempt": 1,
  "probe_sha256": "…"
}
```

Field rules:

| Field | Rule |
|---|---|
| `lag_seconds` | Recomputed at publish time; disagreement with the stored value is a bug |
| `attempt` | Always `1` in published samples |
| `error_class` | `null` iff `outcome = "ok"` |
| `probe_sha256` | Hash of the probe implementation, so methodology is verifiable |

### 4.7 Incident classification

| ID | Level | Requirement |
|---|---|---|
| RPC-30 | MUST | An incident is declared only when ≥ 3 consecutive samples fail, or lag exceeds a published threshold for ≥ 3 samples, at one vantage point |
| RPC-31 | MUST | An incident record states: start, end, affected target, vantage points, sample count, and error classes |
| RPC-32 | MUST NOT | An incident record attributes a cause |
| RPC-33 | MUST | Incident records are append-only, including corrections |

### 4.8 Conformance levels

| Level | Requires |
|---|---|
| **Probe** | RPC-1…8, RPC-10…13 |
| **Publisher** | Probe + RPC-14…16, RPC-20…25 |
| **Incident log** | Publisher + RPC-30…33 |

---

## 5. Non-goals

| Not solved | Why |
|---|---|
| Publishing an SLA | Only the operator can offer a commitment |
| Measuring operator capacity | Would require load testing, which is abusive |
| Explaining outages | Causation requires internal information |
| Monitoring the authenticated Platform API | Would require credentials and could disturb production |
| Replacing an official status page | This is a substitute for its absence, not an equivalent |

---

## 6. Rationale

| Decision | Reason |
|---|---|
| Raw data first | Aggregates can hide methodology; raw data cannot |
| No headline uptime % | The most cited and least informative number in monitoring |
| Per-vantage-point reporting | Merging hides regional failure, which is the common case |
| `n ≥ 100` rule | p95 of 20 samples is theatre |
| 1 req/min | Enough to detect an incident; too little to cause one |
| No cause attribution | an outsider cannot know, and a wrong cause is worse than none |

---

## 7. Security considerations

| If a participant is malicious… | Then… | Control |
|---|---|---|
| A publisher fabricates samples | Data appears to show an outage that did not happen | `probe_sha256` + raw samples + independent re-runs |
| A publisher edits history | An incident disappears | Append-only + content hashes + mirrors |
| A prober floods an endpoint | Self-inflicted denial of service | RPC-3 rate limit; no load testing |
| A prober probes private endpoints | Credential or data exposure | Scope restricted to public read paths |
| A prober leaks user data | Privacy harm | No user data in probe output |

---

## 8. Architecture and reference implementation

Four components, deliberately separable so none of them has to trust another:

| Component | Responsibility | State it holds |
|---|---|---|
| **Probe runner** | Issues one unretried `GET` per interval and timestamps it | None between runs |
| **Sample store** | Append-only JSONL, one file per vantage point per day | Raw samples |
| **Sealer / publisher** | Batches hourly, hashes, publishes data + manifest | Only the current batch |
| **Consumer verifier** | Recomputes a batch hash and re-derives the published metrics | Nothing |

The interfaces are files, not an API, so a publisher cannot retroactively change what a consumer already
observed.

```text
every 60 s, per vantage point:
  t0 = now_utc(); assert |clock_offset| <= 1 s
  r  = GET target/path  (timeout 10 s, attempt 1, no retry)
  t1 = now_utc()
  if r.status == 200 and parses:
      ledger = latest_ledger(r)
      sample(outcome="ok", duration_ms=t1-t0, lag_seconds=t0-ledger.closed_at)
  else:
      sample(outcome="fail", error_class=classify(r, t1-t0))
  append_jsonl(sample)
hourly:
  seal batch -> sha256 -> publish (raw + manifest)
```

Acceptance test that must fail if the implementation is wrong: **inject a 3-sample timeout run and assert that
an incident is declared, then inject a single timeout and assert that it is not.**

---

## 9. Backwards compatibility

Nothing existing is replaced. A publisher may add fields (forward-compatible) but MUST NOT remove or redefine
fields within `pi-rpc-probe/1`. A breaking change requires `pi-rpc-probe/2` and a migration note.

---

## 10. Alternatives

| Alternative | Why rejected |
|---|---|
| Wait for an official status page | Indefinite; meanwhile no data exists |
| Publish only aggregates | Unfalsifiable; hides methodology |
| Measure with a third-party SaaS and publish screenshots | Not raw data; not reproducible; vendor lock-in |
| Probe from a single cloud region | Regionally biased; unusable for corroboration |
| Include a synthetic "uptime score" | Encourages false precision and false claims |

---

## 11. Unresolved questions

| # | Question | Blocks adoption? |
|---|---|---|
| 1 | What lag threshold counts as an incident? Needs a baseline of normal ledger cadence (`OQ-006` adjacent) | Yes, for the incident log |
| 2 | Are `/ledgers` reads cheap enough to poll at 1/min indefinitely? (`OQ-001`) | Partly |
| 3 | Should the Testnet publisher be a separate conformance profile? (`OQ-002`) | No |
| 4 | Who hosts the canonical raw archive, and how is it funded? | Yes, for a public publisher |
| 5 | Is a 10 s timeout appropriate given unpublished limits? | No — it is configurable |

---

## 12. Adoption path

| Step | Actor | Artefact |
|---|---|---|
| 1 | Any volunteer | One probe, 7-day pilot, published raw data |
| 2 | A second volunteer | Independent probe at a second vantage point |
| 3 | Both | A joint methodology note comparing results |
| 4 | A researcher | A citation of the dataset instead of an anecdote |
| 5 | Optionally the operator | An official status page that makes this redundant — the best outcome |

`ANALYSIS` — Step 5 is the success condition. A community monitoring standard that is still necessary after two
years has not succeeded; it has only compensated.

---

## 13. References

| # | Source | Type | Date |
|---|---|---|---|
| `S-60` | Mainnet Horizon endpoint | Official | retrieved 2026-10-25 |
| `S-61` | Testnet Horizon endpoint | Official | retrieved 2026-10-25 |
| `S-05` | Horizon usage examples | Official | retrieved 2026-10-25 |
| `M-01` | `protocol_version = 28` via live read | Measurement | 2026-10-18 |
| `RES-002` | RPC infrastructure study | This repo | 2026-10-25 |
| `SOURCES.md` §5 | Unverified properties (limits, SLA, status page) | This repo | 2026-10-25 |

---

**Related:** [`RES-002`](../research/rpc-infrastructure.md) · [`RES-001`](../research/pi-network-future.md) ·
[`RES-008`](../research/blockchain-explorer.md)
