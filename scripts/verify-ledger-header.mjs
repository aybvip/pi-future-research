#!/usr/bin/env node
/**
 * verify-ledger-header.mjs — cross-check committed ledger records against the live API and
 * decode the close time from the ledger header XDR.
 *
 * Why this exists:
 *   The cadence study reads `closed_at` from Horizon. This script checks that (a) the live API
 *   still returns the same hash and closed_at for sampled ledgers, and (b) the close time inside
 *   the ledger header XDR is the same Unix second as `closed_at` — i.e. `closed_at` is not an
 *   API-side display rounding of a different value.
 *
 * Usage:
 *   node scripts/verify-ledger-header.mjs [--dir DIR] [--sequences 1,2,3] [--out FILE]
 *
 * Default samples: oldest, middle, newest ledger in the dataset.
 *
 * XDR note: LedgerHeader begins with uint32 ledgerVersion, then Hash previousLedgerHash (32 bytes),
 * then StellarValue scpValue, whose first fields are Hash txSetHash (32 bytes) and uint64 closeTime.
 * The close time therefore starts at byte offset 4 + 32 + 32 = 68 in the base64-decoded header.
 *
 * Node.js 18+ (built-in fetch). No dependencies.
 */

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Error(`unexpected argument: ${arg}`);
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`missing value for ${arg}`);
    out[key] = value;
    i += 1;
  }
  return out;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function resolveDataDir(explicitDir) {
  if (explicitDir) return path.resolve(explicitDir);
  const dataRoot = path.resolve('data');
  let entries;
  try {
    entries = await readdir(dataRoot, { withFileTypes: true });
  } catch {
    throw new Error('no --dir given and ./data does not exist; run scripts/fetch-ledgers.mjs first');
  }
  const candidates = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('ledger-cadence-'))
    .map((entry) => entry.name)
    .sort();
  assert(candidates.length > 0, 'no data/ledger-cadence-* directories found');
  return path.join(dataRoot, candidates[candidates.length - 1]);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dir = await resolveDataDir(args.dir);
  const manifest = JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8'));
  const datasetBytes = await readFile(path.join(dir, 'ledgers.jsonl'));
  const datasetSha256 = createHash('sha256').update(datasetBytes).digest('hex');
  assert(
    datasetSha256 === manifest.dataset_sha256,
    `dataset SHA-256 mismatch: file ${datasetSha256}, manifest ${manifest.dataset_sha256}`,
  );
  const lines = datasetBytes
    .toString('utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  assert(lines.length === manifest.collected_count, `dataset has ${lines.length} lines, manifest says ${manifest.collected_count}`);
  const bySequence = new Map(lines.map((line) => {
    const record = JSON.parse(line);
    return [record.sequence, record];
  }));
  assert(bySequence.size === lines.length, 'duplicate sequence in committed dataset');

  const baseUrl = manifest.endpoint.replace(/\/ledgers$/, '');
  const oldest = manifest.oldest_sequence;
  const newest = manifest.newest_sequence;
  const middle = oldest + Math.floor((newest - oldest) / 2);
  const sequences = args.sequences
    ? args.sequences.split(',').map((value) => Number(value.trim()))
    : [oldest, middle, newest];
  assert(sequences.length > 0 && sequences.every(Number.isInteger), 'invalid --sequences');

  const results = [];
  for (const sequence of sequences) {
    const committed = bySequence.get(sequence);
    assert(committed, `sequence ${sequence} is not in the committed dataset`);

    const response = await fetch(`${baseUrl}/ledgers/${sequence}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'pi-future-research/1.0 (ledger-header verification; read-only)',
      },
      signal: AbortSignal.timeout(30_000),
    });
    assert(response.ok, `HTTP ${response.status} for ledger ${sequence}`);
    const live = await response.json();

    assert(live.sequence === committed.sequence, `sequence mismatch for ${sequence}`);
    assert(live.hash === committed.hash, `hash mismatch for ${sequence}`);
    assert(live.prev_hash === committed.prev_hash, `prev_hash mismatch for ${sequence}`);
    assert(live.closed_at === committed.closed_at, `closed_at mismatch for ${sequence}`);

    const header = Buffer.from(live.header_xdr, 'base64');
    assert(header.length >= 76, `header XDR too short for ledger ${sequence}`);

    const xdrCloseTime = header.readBigUInt64BE(68);
    const closedAtMs = Date.parse(live.closed_at);
    assert(Number.isFinite(closedAtMs) && closedAtMs % 1000 === 0, `closed_at is not whole-second for ${sequence}`);
    const closedAtUnix = BigInt(closedAtMs / 1000);

    results.push({
      sequence,
      closed_at: live.closed_at,
      closed_at_unix: Number(closedAtUnix),
      header_xdr_close_time_unix: Number(xdrCloseTime),
      header_xdr_close_time_iso: new Date(Number(xdrCloseTime) * 1000).toISOString(),
      hash: live.hash,
      dataset_hash_matches: live.hash === committed.hash,
      dataset_prev_hash_matches: live.prev_hash === committed.prev_hash,
      dataset_closed_at_matches: live.closed_at === committed.closed_at,
      header_close_time_matches_closed_at: xdrCloseTime === closedAtUnix,
      header_xdr_bytes: header.length,
    });
  }

  const allChecksPassed = results.every(
    (result) =>
      result.dataset_hash_matches &&
      result.dataset_prev_hash_matches &&
      result.dataset_closed_at_matches &&
      result.header_close_time_matches_closed_at,
  );

  const output = {
    schema: 'pi-ledger-header-check/1',
    generated_by: 'scripts/verify-ledger-header.mjs',
    generated_at: new Date().toISOString(),
    source_dataset_sha256: datasetSha256,
    endpoint: baseUrl,
    sampled_sequences: sequences,
    all_checks_passed: allChecksPassed,
    results,
    note:
      'This checks sampled ledgers, not the whole dataset. It shows that, for those samples, the committed record matches the live API and closed_at equals the close time encoded in the ledger header itself. It does not establish a protocol guarantee or an SLA.',
  };

  const serialised = `${JSON.stringify(output, null, 2)}\n`;
  if (args.out) {
    await writeFile(path.resolve(args.out), serialised, 'utf8');
  }
  process.stdout.write(serialised);

  if (!allChecksPassed) process.exitCode = 2;
}

main().catch((error) => {
  process.stderr.write(`verification failed: ${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
