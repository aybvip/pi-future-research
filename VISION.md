# VISION

**Status:** living document · **Last reviewed:** 2026-10-25 · **Evidence cut-off:** 2026-10-25

> This is a statement of *intent for a research repository*, not a claim about Pi Network's plans.
> Where it describes a possible future, that future is `ANALYSIS` or `PROPOSAL`. Nothing here is
> endorsed by the Pi Core Team.

---

## 1. The one-sentence vision

> A Pi ecosystem where any developer can discover what exists, verify what is true, ship something safe,
> and be corrected by evidence — without needing permission, insider knowledge, or a price chart.

Everything below is a consequence of that sentence.

---

## 2. Why "infrastructure" is the interesting question

Pi's public conversation is dominated by two subjects: mining and price. Both are settled enough to stop
being the centre of attention:

- **Mining** is defined by the whitepaper and the migration process; the open questions are operational,
  not conceptual.
- **Price** is not a research topic. It is a market outcome. This repository has no view on it and does not
  accept contributions about it ([`DISCLAIMER.md`](DISCLAIMER.md)).

What remains under-examined is the layer in between: the **infrastructure and standards** that determine
whether 60 million identity-verified people can do anything useful with the network. That layer is where a
research repository can add value that a news site or a price bot cannot.

`ANALYSIS` — The binding constraints on Pi's next phase are unlikely to be consensus throughput. They are
more likely to be:

1. **Verifiability** — can an outsider check what the platform says is true?
2. **Developer ergonomics** — how long from "idea" to "safe, reviewed app"?
3. **Trust surface** — how many ways can a user lose money, and how visible are they?
4. **Standards** — when two Pi apps integrate, is there a shared vocabulary, or is every integration bespoke?

Each of the twelve research documents in this repository is an attempt to attack one of those four.

---

## 3. What maturity would look like

A mature ecosystem is boring in specific, checkable ways. This is a scorecard, not a wish list — each row is
something an outsider could verify without asking anyone's permission.

| Dimension | Immature state (typical, 2026) | Mature state (the target) | How you would verify it |
|---|---|---|---|
| **Documentation** | Scattered across blog posts, GitHub repos, community guides | One canonical source, versioned, with a changelog | Compare a doc URL to a pinned commit |
| **API contracts** | Prose descriptions of JSON fields | Machine-readable schema (`OpenAPI`) with typed clients | Fetch the schema, run the generator |
| **Availability** | Anecdotal "it was down earlier" | Independent, published, timestamped measurements | Check a public dashboard's raw data |
| **Incidents** | Discovered by users on social media | A dated incident log with impact and resolution | Read the log, count the gaps |
| **Security** | Each app reinvents payment verification | A shared checklist with reference code | Audit an app against the checklist |
| **Contracts** | One audited reference contract | A registry of verified contracts and their audits | Look up an address, see the audit |
| **Directory** | Rankings that cannot be inspected | Published inclusion criteria and evidence per listing | Re-derive a listing's status from its evidence |
| **Standards** | Proposals live in chat threads | RFCs with comment periods and a decision record | Read the disposition of each RFC |
| **Data** | A block explorer UI | An open, rate-limited, documented data API + bulk export | Export 1,000 ledgers, verify the hashes |

`ANALYSIS` — None of these requires the Core Team to change direction. Most of them can be built by a small
number of contributors who agree on a format. That is the entire premise of this repository: **the cheapest
improvements to an ecosystem are usually documentation, measurement, and standards — not new chains.**

---

## 4. Five principles

### 4.1 Verifiability over authority

A statement should be checkable by someone who does not trust the author. This is why every document here
pins sources, dates claims, and — where possible — describes a command a reader can run.

> If a claim cannot be checked and cannot be falsified, it belongs in an opinion piece, not here.

### 4.2 The ledger is the source of truth; the platform is the interface

`FACT` — Pi's own documentation states the blockchain is the source of truth for exchanging Pi, while the
platform backend exists to improve UX and prevent developer mistakes
([`SOURCES.md`](SOURCES.md) §17).

`ANALYSIS` — The practical consequence is a division of responsibility that many apps get wrong: the
platform API can *assist* a payment, but only the ledger *settles* one. Any design that treats an API
response as settlement is fragile by construction. See [`RES-006`](research/security-and-trust.md).

### 4.3 Small, adoptable standards beat grand ones

A standard that nobody implements is a blog post with extra steps. Every proposal here is written so that a
single developer could implement it for one app in a week and still be compliant.

### 4.4 Say what you do not know

The most useful sentence in research is often "we could not determine this". The open-question register
([`RES-012`](research/open-questions.md)) exists so that ignorance is recorded rather than papered over.

### 4.5 No custodial surface, ever

This repository will not host a wallet, ask for a passphrase, or hold funds. Documents may *describe*
custody risks; they will not create custody.

---

## 5. What this repository deliberately will not do

| Not doing | Reason |
|---|---|
| Price analysis, targets, "when moon" | Not research; invites the wrong audience; see [`DISCLAIMER.md`](DISCLAIMER.md) |
| Speaking for the Core Team | We cannot; attributing intent to them would be fabrication |
| Claiming official status for any proposal | Proposals here are `PROPOSAL`-labelled, permanently |
| Ranking apps by quality for reward | Ranking creates incentive to game the ranking; see [`PR-003`](proposals/proposal-003-ecosystem-directory.md) |
| Publishing unverified rumours as "news" | A rumour with a date is still a rumour |
| Hosting user funds or keys | No custody, by principle |

---

## 6. What success looks like in three years

`PROPOSAL` — Success is not "this repository is famous". It is that the following sentences become true and
stay true, and that nobody needs this repository to know them:

1. A new Pi developer can go from zero to a correctly verified payment in under a day, using public docs.
2. Anyone can check whether the Pi RPC endpoints are healthy *without* asking a Discord channel.
3. A user can tell, before signing, whether an app is verified, what it will charge, and who holds the funds.
4. Every ecosystem token launch publishes the same machine-readable disclosure, so two launches can be
   compared without reading two marketing sites.
5. A smart contract on Pi can be looked up, matched to its source, and matched to an audit.
6. The community roadmap has a public decision log, including the proposals that were **rejected** and why.

Notice that all six are *falsifiable*. Each can be false. That is the point.

---

## 7. How to disagree with this document

Open an issue titled `VISION: <the sentence you dispute>`. Quote the sentence, state the evidence, and say
what you would replace it with. Vision statements are the easiest thing in any repository to write and the
hardest to keep honest — so they get reviewed on the same 90-day cycle as everything else.

---

## References

| Source | Type | Date |
|---|---|---|
| Pi docs — blockchain as source of truth | Official | retrieved 2026-10-25 |
| [`SOURCES.md`](SOURCES.md) — pinned source registry | This repo | 2026-10-25 |
| [`ROADMAP.md`](ROADMAP.md) — publication plan | This repo | 2026-10-25 |
