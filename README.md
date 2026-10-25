# pi-future-research

**Open, dated, falsifiable research on where the Pi Network platform could go next — and what would have to be true for each direction to work.**

[![Docs](https://img.shields.io/badge/content-12%20studies%20%2B%205%20proposals-2ea44f)](#document-map)
[![Evidence](https://img.shields.io/badge/evidence-4%20reproducible%20measurements-blue)](#live-measurements)
[![Status](https://img.shields.io/badge/status-living%20document-lightgrey)](#maintenance)
[![License](https://img.shields.io/badge/license-CC%20BY%204.0-lightgrey)](LICENSE)
[![Not affiliated](https://img.shields.io/badge/affiliation-unofficial-orange)](#disclaimer)

> **Unofficial.** This repository is not affiliated with, endorsed by, or operated by Pi Network,
> SocialChain Inc., or the Pi Core Team. Everything here is community research, analysis, or proposal
> unless it is explicitly quoted from an official source — in which case the source and date are given.

---

## The short version

Pi has, as of 2026, the pieces of a platform: a Stellar-derived Layer 1, a mobile-first app platform, a
payments API, a node network claiming 420,000+ runners, a testnet smart-contract layer, a Launchpad, and a
generative app builder.

What it does **not** have in public is a large body of **written, dated, falsifiable research** about how
those pieces fit together, where they break, and what would have to be true for each next step to work.

This repository is that body of writing. It is deliberately **document-heavy and code-light**: 12 research
documents and 5 RFC-style proposals, built so that a disagreement can be settled with evidence rather than
with volume.

**Three things you can do with it:**

| Goal | Start with | What you get |
|---|---|---|
| Ship a Pi app that handles money correctly | [`RES-006`](research/security-and-trust.md) → [`PR-002`](proposals/proposal-002-developer-standards.md) | 15 mandatory controls, conformance tests, a manifest format |
| Stop arguing about reliability and measure it | [`RES-002`](research/rpc-infrastructure.md) → [`PR-001`](proposals/proposal-001-rpc-monitoring.md) | Metric definitions, ledger-lag model, a probe spec anyone can run |
| Challenge a claim with evidence | [`RES-012`](research/open-questions.md) | 27 numbered open questions, each answerable |

---

## Start here, by role

| You are… | Read, in order | Because |
|---|---|---|
| **An app developer shipping payments** | [`RES-006`](research/security-and-trust.md) → [`RES-005`](research/developer-tools.md) → [`PR-002`](proposals/proposal-002-developer-standards.md) | The failure modes are boring and expensive; the controls are concrete |
| **Building an indexer or infrastructure** | [`RES-002`](research/rpc-infrastructure.md) → [`RES-008`](research/blockchain-explorer.md) → [`PR-001`](proposals/proposal-001-rpc-monitoring.md) | What is documented, what is only observable, and what nobody publishes |
| **Launching or analysing a token** | [`RES-003`](research/launchpad-opportunities.md) → [`PR-004`](proposals/proposal-004-launchpad-transparency.md) | How PiRC1 routes proceeds, and what a disclosure can and cannot verify |
| **Running nodes or building on compute** | [`RES-007`](research/decentralized-compute.md) → [`PR-005`](proposals/proposal-005-decentralized-services.md) | A five-node PoC is not a market; the difference is verification |
| **A researcher or a skeptic** | [`RES-012`](research/open-questions.md) → [`SOURCES.md`](SOURCES.md) | The open-question register and the evidence registry, including what could not be verified |
| **Proposing a standard** | [`RES-009`](research/community-roadmap.md) → [`PR-000`](proposals/proposal-000-template.md) | A process that records rejections, and a template with no escape hatches |

If you have **ten minutes**: read [`VISION.md`](VISION.md), then the Executive Summary and Open Questions of
[`RES-001`](research/pi-network-future.md) and [`RES-010`](research/ten-year-scenarios.md).

---

## What is actually different here

Most "Pi ecosystem" writing is either a directory or a forecast. This repository tries to be neither.

1. **Measurements, not only quotations.** Four rows in [`SOURCES.md`](SOURCES.md) §3 were produced by reading
   live endpoints, and anyone can re-run them with `curl`. See [Live measurements](#live-measurements).
2. **"Not found" is a recorded result.** [`SOURCES.md`](SOURCES.md) §5 lists seven properties this repository
   could not verify. A document may say *we could not determine this*; it may not imply the opposite.
3. **Proposals can fail a test.** Each one defines a negative or conformance test — for example, reorder
   [`PR-002`](proposals/proposal-002-developer-standards.md)'s payment steps so that delivery precedes on-chain
   verification, and a conforming implementation **must** fail closed.
4. **Rejections are first-class.** [`RES-009`](research/community-roadmap.md) and
   [`PR-003`](proposals/proposal-003-ecosystem-directory.md) require publishing refused items with reasons.
   Neither publishes a composite quality score, because a score becomes a target.
5. **No price content, ever.** No predictions, no targets, no trading. See [`DISCLAIMER.md`](DISCLAIMER.md).

---

## Live measurements

These are the rows a stranger can reproduce without trusting the author. Full methodology and caveats:
[`SOURCES.md`](SOURCES.md) §3.

| ID | What was measured | Date | What it shows | What it does **not** show |
|---|---|---|---|---|
| `M-01` | Mainnet `protocol_version = 28` | 2026-10-18 | Protocol 28 was live before the reported completion date | When the upgrade actually completed |
| `M-02` | No per-unit origin field on native Pi payments | 2026-10-18 | Provenance is not carried per unit at the ledger level | That no off-chain provenance exists |
| `M-04` | Passphrases `Pi Network` / `Pi Testnet`; protocol 28 on both; `history_elder_ledger = 2` | 2026-10-25 | Mainnet and Testnet are separate networks; both report history from ledger 2 | That every historical ledger is retrievable at any cost |
| `M-05` | Mainnet reports `28.0.1-a70eb47…` / `stellar-core 28.0.1`; Testnet reports `pi-horizon-28.0.1-d8f98fd` | 2026-10-25 | The two networks report different build identities | That Mainnet is unmodified Stellar — a build string is not a consensus proof |
| `M-03` | A probe methodology, not yet run at scale | planned | — | — |

Reproduce the cheapest one:

```bash
curl -s https://api.mainnet.minepi.com/ | grep -E 'network_passphrase|protocol_version|history_elder_ledger'
```

---

## Document map

### Orientation

| ID | Document | Question it answers |
|---|---|---|
| — | [`VISION.md`](VISION.md) | What would a mature Pi infrastructure actually look like? |
| — | [`ROADMAP.md`](ROADMAP.md) | What is *this repository* publishing, and in what order? |
| — | [`SOURCES.md`](SOURCES.md) | Which official sources does every document rest on, and at which revision? |
| — | [`CONTRIBUTING.md`](CONTRIBUTING.md) | How do I add, correct, or challenge something? |
| — | [`DISCLAIMER.md`](DISCLAIMER.md) | What is this repository *not* liable for? |

### Research (`research/`)

| ID | Document | Topic |
|---|---|---|
| `RES-001` | [`pi-network-future.md`](research/pi-network-future.md) | 01 — The future of Pi Network infrastructure |
| `RES-002` | [`rpc-infrastructure.md`](research/rpc-infrastructure.md) | Horizon/RPC access: what is known, what is measurable |
| `RES-003` | [`launchpad-opportunities.md`](research/launchpad-opportunities.md) | 03 — The future of Pi Launchpad |
| `RES-004` | [`pi-ecosystem-index.md`](research/pi-ecosystem-index.md) | 04 — Pi ecosystem infrastructure map |
| `RES-005` | [`developer-tools.md`](research/developer-tools.md) | 05 — Missing developer tools |
| `RES-006` | [`security-and-trust.md`](research/security-and-trust.md) | 06 — Security standards for Pi applications |
| `RES-007` | [`decentralized-compute.md`](research/decentralized-compute.md) | 07 — Decentralized computing: opportunities and limits |
| `RES-008` | [`blockchain-explorer.md`](research/blockchain-explorer.md) | 08 — An open Pi blockchain data layer |
| `RES-009` | [`community-roadmap.md`](research/community-roadmap.md) | 09 — A community-driven developer roadmap |
| `RES-010` | [`ten-year-scenarios.md`](research/ten-year-scenarios.md) | 10 — Ten-year scenarios for the ecosystem |
| `RES-011` | [`smart-contract-ecosystem.md`](research/smart-contract-ecosystem.md) | Soroban on Pi: what exists, what is missing |
| `RES-012` | [`open-questions.md`](research/open-questions.md) | The open-question register (`OQ-nnn`) |

### Proposals (`proposals/`)

| ID | Proposal | Status |
|---|---|---|
| `PR-000` | [`proposal-000-template.md`](proposals/proposal-000-template.md) | Template |
| `PR-001` | [`proposal-001-rpc-monitoring.md`](proposals/proposal-001-rpc-monitoring.md) | Draft |
| `PR-002` | [`proposal-002-developer-standards.md`](proposals/proposal-002-developer-standards.md) | Draft |
| `PR-003` | [`proposal-003-ecosystem-directory.md`](proposals/proposal-003-ecosystem-directory.md) | Draft |
| `PR-004` | [`proposal-004-launchpad-transparency.md`](proposals/proposal-004-launchpad-transparency.md) | Draft |
| `PR-005` | [`proposal-005-decentralized-services.md`](proposals/proposal-005-decentralized-services.md) | Draft |

> **Status legend:** `Draft` — open for comment · `Review` — comment period closed, revision in progress ·
> `Stable` — no known blocking objections (still not official) · `Superseded` — replaced, kept for history ·
> `Withdrawn` — rejected or abandoned, with reasons kept.

Proposals keep RFC numbering (§1 Summary … §13 References) because reviewers expect it; the mapping to the
nine required sections is in [`proposal-000-template.md`](proposals/proposal-000-template.md). Nothing here is
submitted to `PiRC` or to the Core Team unless a proposal says so explicitly, and none currently does.

---

## The evidence standard

Every substantive statement is one of three kinds. The label is not decoration — it tells you how much weight
the sentence can carry.

| Label | Meaning | How to use it |
|---|---|---|
| **`FACT`** | Stated by an official Pi source, or measured directly, with a link and a date | Safe to cite — cite the *source*, not this repository |
| **`ANALYSIS`** | This repository's reasoning from those facts. It can be wrong | Challenge it with a better argument or newer data |
| **`PROPOSAL`** | A design suggestion originating here. No official status whatsoever | Adopt, fork, improve, or ignore |

Facts carry a confidence note when the source is secondary or the date is uncertain. An unconfirmed date is
written as unconfirmed — not rounded into a false certainty.

---

## Facts this repository currently rests on

A compressed, dated snapshot. Full quotes and pins are in [`SOURCES.md`](SOURCES.md).

| # | Fact | Source | Date |
|---|---|---|---|
| 1 | Open Network launched; Enclosed-Network firewall removed; CEX/onramp integrations enabled | [Pi blog](https://minepi.com/blog/open-network/) | launch 2025-02-20 (post dated 2025-02-19) |
| 2 | Ecosystem token design released on Mainnet, on Open Network's first anniversary | [Pi blog](https://minepi.com/blog/pi-launchpad/) | 2026-02-20 |
| 3 | `PiRC1` (Ecosystem Token Design / Launchpad) and `PiRC2` (Subscription Contract API) published as **RFCs** | [PiNetwork/PiRC](https://github.com/PiNetwork/PiRC) | 2026-02-20 · 2026-04-17 |
| 4 | First smart-contract capability (subscriptions, Soroban) on **Testnet**, under external audit | [Pi blog](https://minepi.com/blog/subscriptions-smart-contract) | 2026-04-17 |
| 5 | Launchpad initial version released as a Pi App on **Testnet** with a test token | [Pi blog](https://minepi.com/blog/pi-launchpad/) | 2026-03-19 |
| 6 | Pi Node 0.6.2: UPnP port automation, port checker, unlisted SoloHost apps, draft/unlisted/listed states | [Pi blog](https://minepi.com/blog/pi-node-0-6-2/) | 2026-08-14 |
| 7 | Initial distributed-computing test through a SoloHost app, with five volunteer Node runners | [Pi blog](https://minepi.com/blog/pi-node-0-6-2/) | 2026-08-14 |
| 8 | `420,000+` Pi Node runners; SoloHost open permissionless publisher flow, still **beta** | [Pi blog](https://minepi.com/blog/new-solohost-apps/) | 2026-08-27 |
| 9 | Developer docs consolidated at `docs.minepi.com`; local storage, Staking Data API, `Pi.shareFile` | [Pi blog](https://minepi.com/blog/dev-capabilities-documentation/) | 2026-09-04 |
| 10 | `60+ million` Pioneers claimed by the developer site | [minepi.com/developers](https://minepi.com/developers/) | retrieved 2026-10-25 |
| 11 | Protocol version `28` observed on Mainnet via a live Horizon read, and re-observed 2026-10-25 | `M-01`, `M-04` | 2026-10-18 · 2026-10-25 |
| 12 | MiCA whitepaper published; Pi described as the "native, fungible digital asset" | [PDF](https://minepi.com/wp-content/uploads/2025/11/MiCA-Whitepaper-Pi-1.pdf) | 2025-11-27 |

Two of these deserve a warning label:

- **#11** — a secondary source reports the Protocol 28 Mainnet *upgrade completion* on 2026-10-23, which does
  not line up cleanly with `protocol_version = 28` reads on 2026-10-18 and 2026-10-25. Treat the completion
  *date* as unconfirmed. The safe statement is: *protocol 28 has been observable on Mainnet since at least
  2026-10-18.*
- **#2 / #5** — "released" means *shipped to a network or storefront*, not *feature-complete*. The Launchpad
  is on Testnet and its Mainnet status was still pending at the evidence cut-off. Do not read "released" as
  "live for users' money".

---

## The next three studies

These are not written yet. They are listed because each one would convert a current weakness — opinion,
unmeasured behaviour, unexamined math — into something checkable. Open an issue if you want to take one.

| Working title | Why it matters | First concrete step | Done when |
|---|---|---|---|
| **Ledger cadence and finality on Pi** | Every payment UX depends on what "confirmed" means; no public baseline exists for close intervals or variance, so "lag" has no threshold | Sample 1,000 consecutive ledgers, publish the interval distribution and gaps | A stranger can compute the same distribution from your raw data |
| **How far Pi's Horizon diverges from upstream Stellar** | Determines whether Stellar docs, SDKs, and indexers transfer — the single most practical question for developers | Build an endpoint/behaviour matrix for both networks against upstream Horizon | Every difference is reproduced with a request and a response |
| **A PiRC1 allocation stress test** | The Launchpad's Mainnet design is pending; there is no public quantitative analysis of PiPower tiers, dilution, or liquidity lockups | Simulate Design 1 and Design 2 under stated assumptions; publish the model and its inputs | A reader can change an assumption and see which conclusion survives |

---

## What is missing — and good first contributions

Honest gaps, in order of how much they limit the repository:

| Gap | Consequence | Effort to improve |
|---|---|---|
| No shipped datasets — the measurements are few and narrow | "Research" still reads as commentary in places | Medium |
| No reference implementation of any proposal | Proposals are reviewable but not yet runnable | Large |
| English only | Excludes much of Pi's actual user base, including Arabic speakers | Medium |
| One maintainer, zero independent contributors | Bus factor of one; no external review yet | Small (one review) |
| No automated link/claim checking | Stale links and silent source edits are possible | Small |

### Good first issues

| Task | Why it helps | Effort |
|---|---|---|
| Add a JSON Schema file for `pi-app.json` | Turns [`PR-002`](proposals/proposal-002-developer-standards.md) from prose into something CI can validate | S |
| Add a JSON Schema and validator tests for `pi-launch-disclosure/1` | Makes [`PR-004`](proposals/proposal-004-launchpad-transparency.md) implementable | S |
| Run the [`PR-001`](proposals/proposal-001-rpc-monitoring.md) probe for 7 days and publish raw JSONL | Creates the first public reliability dataset | M |
| Re-derive one [`RES-004`](research/pi-ecosystem-index.md) status from its evidence and file a dispute | Tests whether the status vocabulary actually works | S |
| Translate [`VISION.md`](VISION.md) and [`RES-006`](research/security-and-trust.md) into Arabic | Extends the audience the research is about | M |
| Add a link-checker workflow | Catches the most common decay mode in a dated repository | S |
| Answer one `OQ-nnn` with evidence | The register only compounds if questions close | M |
| Measure ledger close intervals over 1,000 ledgers | Seeds the first study in the table above | M |

---

## Contributing

**Corrections are more valuable than additions.** A pull request that removes a wrong sentence is worth more
than one that adds a new essay.

- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) first — it defines the claim rules, the nine-section shape, and
  the review process.
- One claim per issue, with evidence attached.
- Use the issue templates: correction, new source, open question, proposal.
- No price talk, no referral links, no token promotion.
- By participating you agree to [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

If you are unsure where to start, pick a row from [Good first issues](#good-first-issues) and open an issue
saying you are taking it. That is the intended workflow, not a hostile act.

---

## Maintenance

Each document carries a header with `status`, `last_reviewed`, and `evidence_cutoff`. A document whose
`last_reviewed` is more than **90 days** old is flagged in [`ROADMAP.md`](ROADMAP.md) for re-verification.
Sources change silently — that is precisely why every claim here is dated.

Current snapshot: **12 research documents · 5 proposals · 27 open questions · 4 reproducible measurements ·
last full review 2026-10-25**.

---

## Disclaimer

Unofficial and independent. No financial, legal, or investment advice. No custody, no keys, no wallet
interaction. Nothing here is an offer to sell or a solicitation to buy any asset. Read the full
[`DISCLAIMER.md`](DISCLAIMER.md).

---

## License

Text © the contributors, licensed under **CC BY 4.0** — reuse with attribution.
Code snippets are additionally available under **MIT**. See [`LICENSE`](LICENSE).
