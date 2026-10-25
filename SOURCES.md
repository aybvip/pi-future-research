# SOURCES — the evidence base

**Status:** living document · **Last reviewed:** 2026-10-25 · **Evidence cut-off:** 2026-10-25

Every `FACT` in this repository traces to a row in this file. If a document cites something that is not
here, either the document is wrong or this file is incomplete — both are bugs, and both are reportable.

Three rules govern this registry:

1. **Date the retrieval, not just the publication.** A page can change after publication. Both dates are
   recorded where they differ.
2. **Pin what can be pinned.** Git repositories get a commit hash; PDFs get a SHA-256; living sites get a
   retrieval date and an explicit "unpinned" marker.
3. **Never upgrade a secondary source to a primary one.** If a news site reports something official, the row
   is marked *secondary* and the document must say so.

---

## §0 Pinning policy

| Source type | Pin used | Why |
|---|---|---|
| GitHub repository file | Commit hash of the last commit touching the file | Survives force-pushes and branch drift |
| PDF | SHA-256 of the exact bytes | A PDF can be silently re-uploaded at the same URL |
| Blog post | Publication date + retrieval date | Usually stable, but WordPress posts get edited |
| Living docs site | Retrieval date only, marked `unpinned` | No revision history is exposed |
| Social media / forum | **Not used as a source for `FACT`** | Unverifiable, deletable, ambiguous |

Example verification commands:

```bash
# Pin a repository file
git clone --filter=blob:none https://github.com/PiNetwork/PiRC
git -C PiRC log -1 --format='%h %cs' -- PiRC1/ReadMe.md

# Pin a PDF
curl -sL https://minepi.com/wp-content/uploads/2025/11/MiCA-Whitepaper-Pi-1.pdf -o mica.pdf
sha256sum mica.pdf
# Windows: certutil -hashfile mica.pdf SHA256
```

---

## §1 Primary sources — official Pi Network

### §1.1 Developer documentation and platform references

| # | Source | URL | Pin / date | Supports |
|---|---|---|---|---|
| S-01 | Pi developer documentation (consolidated) | <https://docs.minepi.com/> | `unpinned` · consolidated 2026-09-04 | SDK, platform API, auth, payments, app lifecycle |
| S-02 | Pi Wallet & SDK module | <https://docs.minepi.com/use-native-features/Wallet> | `unpinned` · retrieved 2026-10-25 | `window.Pi.Wallet`, pre-signed transactions, Pi Browser requirement |
| S-03 | Accept a payment (U2A) | <https://docs.minepi.com/accept-payment/Payments> | `unpinned` · retrieved 2026-10-25 | `createPayment` flow, complete-before-delivery rule |
| S-04 | Advanced payments (A2U) | <https://docs.minepi.com/accept-payment/PaymentsAdvanced> | `unpinned` · retrieved 2026-10-25 | Server-signed payments; "blockchain is the only source of truth" |
| S-05 | Tokens / native asset | <https://docs.minepi.com/use-native-features/Tokens> | `unpinned` · retrieved 2026-10-25 | Horizon endpoints, trustlines, native-asset distinction |
| S-06 | Platform API — `PaymentDTO` | <https://github.com/pi-apps/pi-platform-docs/blob/master/platform_API.md> | commit `cb704b9` · 2024-08-28 | Full payment object; base path `api.minepi.com/v2` |
| S-07 | Payments flow (three phases) | <https://github.com/pi-apps/pi-platform-docs/blob/master/payments.md> | `unpinned` · retrieved 2026-10-25 | Approve → transact → complete |
| S-08 | SDK integration guide (A2U) | <https://github.com/pi-apps/pi-sdk-integration-guide> | commit `9b263cd` · 2023-01-27 | Server-side signing with Stellar SDK |
| S-09 | `@pinetwork/pi-sdk-js` | <https://github.com/pi-apps/pi-sdk-js> | `@pinetwork/pi-sdk-js@2.0.0` · published 2026-03-19 | Client SDK surface |
| S-10 | Community developer guide | <https://pi-apps.github.io/community-developer-guide/> | `unpinned` · retrieved 2026-10-25 | Onboarding overview |
| S-11 | Developer landing page | <https://minepi.com/developers/> | `unpinned` · retrieved 2026-10-25 | "60+ million" Pioneers claim; PiOS; `demo.pi` |
| S-12 | Demo app source (PiOS) | <https://github.com/pi-apps/demo> | `unpinned` · retrieved 2026-10-25 | Reference app structure |
| S-13 | PiOS — Pi Open Source license + registry | <https://github.com/pi-apps/PiOS> · [list](https://github.com/pi-apps/PiOS/blob/main/list.md) | `unpinned` · retrieved 2026-10-25 | License terms for ecosystem apps/libraries |

> **Careful with S-13.** PiOS is a **license for community applications and libraries**. It is not evidence
> that the Pi node or consensus code is open source — see §5.

### §1.2 Official blog posts (dated)

| # | Source | URL | Published | Supports |
|---|---|---|---|---|
| S-20 | Open Network launch | <https://minepi.com/blog/open-network/> | post dated 2025-02-19 · launch 2025-02-20 | Firewall removed; CEX/onramp integrations; node Mainnet transition by invitation |
| S-21 | Open Network launch date | <https://minepi.com/blog/open-network-launch-date/> | 2025-02 | Enclosed-Network firewall definition |
| S-22 | Mainnet migrations roadmap & tokenomics | <https://minepi.com/blog/mainnet-migrations-roadmap-and-tokenomics/> | `unpinned` | Migration stages |
| S-23 | Ecosystem token design on Mainnet | <https://minepi.com/blog/open-network-anniversary/#ecosystem-token-design-mainnet> | 2026-02-20 | Ecosystem-token **design** published as a PiRC; not evidence that tokens are live |
| S-24 | **Pi Launchpad released on Testnet** | <https://minepi.com/blog/pi-launchpad/> | 2026-03-19 | Launchpad mechanism; proceeds → liquidity; Pi DEX on Testnet; Mainnet version pending |
| S-25 | Pi Day 2026 releases | <https://minepi.com/blog/pi-day-2026/> | 2026-03-14 | Launchpad introduction; 7th anniversary |
| S-26 | First smart contract: subscriptions | <https://minepi.com/blog/subscriptions-smart-contract> | 2026-04-17 | Soroban; Testnet-first; external audit |
| S-27 | Ecosystem Directory staking | <https://minepi.com/blog/ecosystem-directory-staking/> | 2026-06-18 | App rankings in PiApps tab; staking-based boost |
| S-28 | Pi2Day 2026 | <https://minepi.com/blog/pi2day2026/> | 2026-06-28 | SoloHost beta launch |
| S-29 | **Pi Node 0.6.2 & SoloHost updates** | <https://minepi.com/blog/pi-node-0-6-2/> | 2026-08-14 | UPnP, port checker, unlisted apps; 5-node distributed-compute test; "Pi coordinator"; node compensation by third-party clients |
| S-30 | App Studio creation pricing | <https://minepi.com/blog/app-studio-pricing/> | 2026-08-17 | 0.25 Pi create/edit until 2026-08-24; cost-reflective pricing; subsidised tier |
| S-31 | New SoloHost apps (OpenClaw, mcp-atlassian) | <https://minepi.com/blog/new-solohost-apps/> | 2026-08-27 | **420,000+ Node runners**; SoloHost in beta; permissionless publisher flow |
| S-32 | New developer capabilities + docs | <https://minepi.com/blog/dev-capabilities-documentation/> | 2026-09-04 | Local storage (whitelisted), Staking Data API (whitelisted), `Pi.shareFile`, docs consolidation |
| S-33 | SoloHost in Pi Desktop 0.6.3 | <https://minepi.com/blog/solohost-pi-desktop-0-6-3/> | 2026-09 | App discovery, reliability, developer tools |
| S-34 | SoloHost app: OpenMind case study | <https://minepi.com/blog/openmind-case-study/> | `unpinned` | Prior proof-of-concept for distributed AI compute |
| S-35 | Pi Node product page | <https://minepi.com/pi-node/> | `unpinned` · retrieved 2026-10-25 | Node role and requirements |
| S-36 | Pi BlockExplorer (official) | <https://blockexplorer.minepi.com/> | `unpinned` · retrieved 2026-10-25 | An official explorer already exists — see [`RES-008`](research/blockchain-explorer.md) |
| S-37 | KYB verified businesses | <https://minepi.com/kyb-list/> | `unpinned` · retrieved 2026-10-25 | Business verification list |
| S-38 | Pi Network Ventures | <https://minepi.com/ventures/> | `unpinned` · retrieved 2026-10-25 | Ecosystem investment programme |
| S-39 | Roadmap page | <https://minepi.com/roadmap/> | `unpinned` · retrieved 2026-10-25 | Official roadmap framing |

### §1.3 Specifications and whitepapers

| # | Source | URL | Pin / date | Supports |
|---|---|---|---|---|
| S-50 | Pi whitepaper | <https://minepi.com/white-paper/> | `unpinned` | Mining, roles, tokenomics |
| S-51 | MiCA whitepaper (PDF) | <https://minepi.com/wp-content/uploads/2025/11/MiCA-Whitepaper-Pi-1.pdf> | SHA-256 `9c0dd64e622433cdaed077216e917fe87a34e3733b08a0c6886eba844d8ae61e` · published 2025-11-27 | "native, fungible digital asset"; Malta home state; immutability statement |
| S-52 | **PiRC** — Pi Requests for Comment | <https://github.com/PiNetwork/PiRC> | `unpinned` | RFC process itself |
| S-53 | **PiRC1** — Ecosystem Token Design (Launchpad) | <https://github.com/PiNetwork/PiRC/blob/main/PiRC1/ReadMe.md> | commit `c50d516` · 2026-02-20 | Launchpad design, PiPower, liquidity routing |
| S-54 | **PiRC2** — Subscription Contract API | <https://github.com/PiNetwork/PiRC/blob/main/PiRC2/ReadMe.md> | commit `dc86dfd` · 2026-04-17 | Allowance-based recurring payments |
| S-55 | Reference contracts | <https://github.com/PiNetwork/SmartContracts> | commit `d5b3915` · 2026-04-17 | `soroban-sdk = "22.0.0"`; `TokenClient` usage; `Service`/`Subscription` structs |

> **RFC ≠ specification.** S-52 through S-55 are Requests for Comment and reference implementations. They
> are open to change. Any document here that cites them must say "RFC" and must not present their contents
> as settled Mainnet behaviour.

### §1.4 Network endpoints (public, read-only)

| # | Endpoint | Purpose | Note |
|---|---|---|---|
| S-60 | `https://api.mainnet.minepi.com` | Horizon-compatible API, Mainnet | Used for read-only chain reads |
| S-61 | `https://api.testnet.minepi.com` | Horizon-compatible API, Testnet | Network passphrase `Pi Testnet` |
| S-62 | `https://api.minepi.com/v2` | Pi Platform API | Requires app credentials; not a chain API |

`ANALYSIS` — These are documented public endpoints. Their **rate limits, availability targets, and
maintenance windows are not published**, so this repository does not state them as fact and does not
invent an SLA. See [`RES-002`](research/rpc-infrastructure.md) and [`PR-001`](proposals/proposal-001-rpc-monitoring.md).

---

## §2 Metrics reported by official sources

Quoted as reported. This repository has **not** independently audited any of them.

| Metric | Value | Source | Date | Independent verification |
|---|---|---|---|---|
| Pioneers | "60+ million" | S-11 | retrieved 2026-10-25 | Not verifiable from public data |
| Pi Node runners | "420,000+" | S-31 | 2026-08-27 | Not verifiable from public data |
| Distributed-compute test participants | 5 volunteer Nodes | S-29 | 2026-08-14 | Not verifiable from public data |
| App Studio creation price (pre-change) | 0.25 Pi create / 0.25 Pi edit | S-30 | 2026-08-17 | Price list is public |
| Protocol version on Mainnet | 28 | Measured, see §3 (`M-01`, re-observed in `M-04`) | 2026-10-18 · 2026-10-25 | **Yes** — `GET /` on Horizon |

> **Rule:** "official claim" and "verified fact" are different things. A number in this table is an official
> claim *about* the network, not a measurement *of* the network.

---

## §3 Measurements made by this repository or its sibling projects

| # | Measurement | Method | Date | Where |
|---|---|---|---|---|
| M-01 | Mainnet `protocol_version = 28` | Live read of Horizon root endpoint | 2026-10-18 | [`pi-fungibility`](https://github.com/aybvip/pi-fungibility) · `docs/PRIOR-ART.md` |
| M-02 | No per-unit origin field on native Pi payments | Enumerating keys of live payment records | 2026-10-18 | Same repository · `examples/provenance-check.mjs` |
| M-03 | RPC probe methodology (proposed, not yet run at scale) | See `PR-001` | planned | [`PR-001`](proposals/proposal-001-rpc-monitoring.md) |
| M-04 | Mainnet and Testnet root properties: passphrases `Pi Network` / `Pi Testnet`; `current_protocol_version = 28` on both; `history_elder_ledger = 2` on both | Live `GET /` on S-60 and S-61 | 2026-10-25 | This repository · review pass |
| M-05 | Build identifiers differ by network: Mainnet `horizon_version 28.0.1-a70eb47f76985d372de3e59f4d75c7f8542752f7`, `core_version stellar-core 28.0.1 (947aad8…)`; Testnet `horizon_version pi-horizon-28.0.1-d8f98fd`, `core_version v28.0.1` | Live `GET /` on S-60 and S-61 | 2026-10-25 | This repository · review pass |

`ANALYSIS` — M-01, M-02, M-04, and M-05 are reproducible by anyone with `curl`. They are the only measurements
in this repository that meet the "a stranger can re-run it" bar. Everything else is either quoted or reasoned.

> **What M-05 does and does not show.** It records the *strings the public endpoint reports*. Mainnet reports an
> unbranded Horizon build and a `stellar-core` version string; Testnet reports a `pi-horizon` branded build. That
> is consistent with, but not proof of, Mainnet running a build close to upstream Horizon. A build string can be
> overridden, and nothing here observes consensus rules. Do not read this row as "Pi Mainnet is unmodified
> Stellar" — only as "the public build identifiers differ between the two networks, in this direction".

---

## §4 Secondary sources (never sufficient alone)

| # | Source | What it is used for | Caution |
|---|---|---|---|
| S-70 | CoinMarketCap AI summary, Protocol 28 completion | Reported Mainnet upgrade date of 2026-10-23 | **Secondary.** Conflicts with M-01's date; recorded as unconfirmed |
| S-71 | Exchange/price aggregator pages | Not used for any claim in this repository | Out of scope by policy |
| S-72 | Third-party news and video explainers | Not used for any claim | Unverifiable and often derivative |

`ANALYSIS` — The Protocol 28 date is a good worked example of why labelling matters. M-01 shows
`protocol_version = 28` on **2026-10-18**, and M-04 re-observes the same value on **2026-10-25**. A secondary
summary reports "Mainnet completed the Protocol 28 upgrade" on **2026-10-23**. All three can be true if the
version became readable before the upgrade was formally announced as complete — but this repository cannot
resolve it, so it records the conflict instead of choosing the tidier story. What the two measurements do
establish is narrower and safe: *protocol 28 was observable on Mainnet on both dates, so any claim that it was
first reachable on 2026-10-23 is wrong.*

---

## §5 What this repository could not verify

Recorded so that no document quietly implies more certainty than exists.

| Question | Status | Why it matters |
|---|---|---|
| Is the Pi node/consensus implementation open source? | **Not established.** PiOS (S-13) covers ecosystem apps, not core node code | Determines whether node operation can be independently audited |
| What are the published rate limits of S-60 / S-61? | **Not published** (as of 2026-10-25) | Any client capacity plan is guesswork without them |
| Is there an official uptime/SLA statement? | **Not found** | [`RES-002`](research/rpc-infrastructure.md) treats availability as unmeasured |
| Has the subscription contract been audited? | **In progress** per S-26; no public report found | Affects whether contracts should be trusted with value |
| Is the Launchpad live on Mainnet? | **No** at evidence cut-off; Testnet only per S-24 | Any Mainnet launch guidance would be premature |
| How are node rewards computed for compute jobs? | **Not specified publicly**; S-29 says clients compensate nodes in Pi | Core to the economics in [`RES-007`](research/decentralized-compute.md) |
| Do whitelisted app capabilities have published criteria? | **Not found** (S-32 says whitelisting is required) | Fairness of access to platform features |

---

## §6 How to correct this file

1. Open an issue: `SOURCE: <S-nn> is wrong / stale / missing`.
2. Include the URL, the date you retrieved it, and — if it is a repository — the commit hash.
3. If the source changed and a document's conclusion no longer holds, say which document and which sentence.

A correction that fixes a `FACT` is treated as a **priority** change: the affected documents are re-reviewed
before anything else in the queue.

---

## References

| Source | Type | Date |
|---|---|---|
| All rows above | Mixed — see the `Type` column in each table | as recorded per row |
| [`pi-fungibility`](https://github.com/aybvip/pi-fungibility) — sibling measurement repository | Independent measurement | 2026-10-18 |
