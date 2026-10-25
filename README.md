# pi-future-research

**Open research, proposals, and roadmaps for the Pi Network ecosystem.**

[![Docs](https://img.shields.io/badge/content-research%20%2B%20proposals-2ea44f)](#document-map)
[![Status](https://img.shields.io/badge/status-living%20document-blue)](#maintenance)
[![License](https://img.shields.io/badge/license-CC%20BY%204.0-lightgrey)](LICENSE)
[![Not affiliated](https://img.shields.io/badge/affiliation-unofficial-orange)](#disclaimer)

> **Unofficial.** This repository is not affiliated with, endorsed by, or operated by Pi Network,
> SocialChain Inc., or the Pi Core Team. Everything here is community research, analysis, or proposal
> unless it is explicitly quoted from an official source — in which case the source and date are given.

---

## Why this repository exists

Pi has, as of 2026, the pieces of a platform: a Stellar-derived Layer 1, a mobile-first app platform,
a payments API, a node network of 420,000+ machines, a testnet smart-contract layer, a Launchpad, and a
generative app builder. What it does **not** yet have in public is a large body of **written, dated,
falsifiable research** about where that platform could go next — and what would have to be true for each
direction to work.

This repository is that body of writing. It is deliberately **document-heavy and code-light**.

It is built on three rules:

1. **Separate the fact from the forecast.** Every document labels each claim as `FACT`, `ANALYSIS`, or
   `PROPOSAL`, and every fact carries a source and a date.
2. **Date everything.** A claim without a date is a rumour. Sources are pinned where pinning is possible.
3. **Make disagreement cheap.** If a claim here is wrong, there is a named place to say so, with evidence —
   see [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## What this repository is, and is not

| It **is** | It is **not** |
|---|---|
| A citable record of the ecosystem's state, with dates | An official Pi Network publication |
| A set of RFC-style proposals anyone may adopt, fork, or reject | A promise about Pi's roadmap |
| A place where an argument must show its evidence | A price, trading, or investment forum |
| A map of open questions worth working on | A directory of every app that exists |
| Written to be **falsified** | Written to be agreed with |

**There are no price predictions in this repository, and none will be accepted.** See
[`DISCLAIMER.md`](DISCLAIMER.md).

---

## Claim types (read this before quoting anything here)

Every substantive statement is one of three kinds. The label is not decoration — it tells you how much
weight the sentence can carry.

| Label | Meaning | How to use it |
|---|---|---|
| **`FACT`** | Stated by an official Pi source, or measured directly, with a link and a date | Safe to cite — cite the *source*, not this repository |
| **`ANALYSIS`** | This repository's reasoning from those facts. It can be wrong | Challenge it with a better argument or newer data |
| **`PROPOSAL`** | A design suggestion originating here. No official status whatsoever | Adopt, fork, improve, or ignore |

Facts also carry a **confidence note** when the source is secondary or the date is uncertain. An
unconfirmed date is written as unconfirmed — not rounded into a false certainty.

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
| `RES-008` | [`blockchain-explorer.md`](research/blockchain-explorer.md) | 08 — An open Pi blockchain explorer |
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

## Three ways to read this repository

**If you have ten minutes.** Read [`VISION.md`](VISION.md), then the *Executive Summary* and *Open
Questions* of [`RES-001`](research/pi-network-future.md) and [`RES-010`](research/ten-year-scenarios.md).

**If you build on Pi.** Read [`RES-006`](research/security-and-trust.md) (security checklist),
[`RES-005`](research/developer-tools.md) (tooling gaps), and [`PR-002`](proposals/proposal-002-developer-standards.md).

**If you want to argue with something.** Start at [`research/open-questions.md`](research/open-questions.md),
pick an `OQ-nnn`, and open an issue with evidence. That is the intended workflow, not a hostile act.

---

## Facts this repository currently rests on

A compressed, dated snapshot. Full quotes and pins are in [`SOURCES.md`](SOURCES.md).

| # | Fact | Source | Date |
|---|---|---|---|
| 1 | Open Network launched; Enclosed-Network firewall removed; CEX/onramp integrations enabled | [Pi blog](https://minepi.com/blog/open-network/) | 2025-02-20 |
| 2 | Ecosystem token design released on Mainnet, on Open Network's first anniversary | [Pi blog](https://minepi.com/blog/pi-launchpad/) | 2026-02-20 |
| 3 | `PiRC1` (Ecosystem Token Design / Launchpad) and `PiRC2` (Subscription Contract API) published as **RFCs** | [PiNetwork/PiRC](https://github.com/PiNetwork/PiRC) | 2026-02-20 · 2026-04-17 |
| 4 | First smart-contract capability (subscriptions, Soroban) on **Testnet**, under external audit | [Pi blog](https://minepi.com/blog/subscriptions-smart-contract) | 2026-04-17 |
| 5 | Launchpad initial version released as a Pi App on **Testnet** with a test token | [Pi blog](https://minepi.com/blog/pi-launchpad/) | 2026-03-19 |
| 6 | Pi Node 0.6.2: UPnP port automation, port checker, unlisted SoloHost apps, draft/unlisted/listed states | [Pi blog](https://minepi.com/blog/pi-node-0-6-2/) | 2026-08-14 |
| 7 | Initial distributed-computing test through a SoloHost app, with five volunteer Node runners | [Pi blog](https://minepi.com/blog/pi-node-0-6-2/) | 2026-08-14 |
| 8 | `420,000+` Pi Node runners; SoloHost open permissionless publisher flow, still **beta** | [Pi blog](https://minepi.com/blog/new-solohost-apps/) | 2026-08-27 |
| 9 | Developer docs consolidated at `docs.minepi.com`; local storage, Staking Data API, `Pi.shareFile` | [Pi blog](https://minepi.com/blog/dev-capabilities-documentation/) | 2026-09-04 |
| 10 | `60+ million` Pioneers claimed by the developer site | [minepi.com/developers](https://minepi.com/developers/) | retrieved 2026-10-25 |
| 11 | Protocol version `28` observed on Mainnet via a live Horizon read | [pi-fungibility `PRIOR-ART.md`](https://github.com/aybvip/pi-fungibility) | measured 2026-10-18 |
| 12 | MiCA whitepaper published; Pi described as the "native, fungible digital asset" | [PDF](https://minepi.com/wp-content/uploads/2025/11/MiCA-Whitepaper-Pi-1.pdf) | 2025-11-27 |

Two of these deserve a warning label:

- **#11** — a secondary source reports the Protocol 28 Mainnet *upgrade completion* on 2026-10-23, which
  does not line up cleanly with a `protocol_version = 28` read on 2026-10-18. Treat the completion *date* as
  unconfirmed. The safe statement is: *protocol 28 has been observable on Mainnet since at least 2026-10-18.*
- **#2 / #5** — "released" means *shipped to a network or storefront*, not *feature-complete*. The Launchpad
  is on Testnet and its Mainnet status was still pending at the evidence cut-off. Do not read "released" as
  "live for users' money".

---

## Maintenance

Each document carries a header with `status`, `last_reviewed`, and `evidence_cutoff`. A document whose
`last_reviewed` is more than **90 days** old is flagged in [`ROADMAP.md`](ROADMAP.md) for re-verification.
Sources change silently — that is precisely why every claim here is dated.

Current snapshot: **17 documents · last full review 2026-10-25**.

---

## Contributing

Corrections are more valuable than additions. A pull request that removes a wrong sentence is worth more
than one that adds a new essay.

- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) first.
- One claim per issue; evidence attached.
- No price talk, no referral links, no token promotion.
- By participating you agree to [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

## Disclaimer

Unofficial and independent. No financial, legal, or investment advice. No custody, no keys, no wallet
interaction. Nothing here is an offer to sell or a solicitation to buy any asset. Read the full
[`DISCLAIMER.md`](DISCLAIMER.md).

---

## License

Text © the contributors, licensed under **CC BY 4.0** — reuse with attribution.
Code snippets are additionally available under **MIT**. See [`LICENSE`](LICENSE).
