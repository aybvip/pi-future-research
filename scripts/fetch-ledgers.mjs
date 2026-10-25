#!/usr/bin/env node
/**
 * fetch-ledgers.mjs — collect the most recent N closed ledgers from a Pi Horizon endpoint.
 *
 * Read-only: this script only issues GET requests to /ledgers.
 *
 * Usage:
 *   node scripts/fetch-ledgers.mjs [--network mainnet|testnet] [--count 1000] [--out DIR]
 *
 * Output:
 *   <DIR>/ledgers.jsonl   one JSON object per line, newest first, selected fields only
 *   <DIR>/manifest.json   collection window, endpoint, count, first/last sequence, SHA-256
 *
 * The dataset is written before the manifest, and the manifest hashes the exact bytes of
 * ledgers.jsonl. `ledger-cadence.mjs` refuses to analyse a dataset whose hash does not match.
 *
 * Node.js 18+ (built-in fetch). No dependencies.
 */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const USER_AGENT = 'pi-future-research/1.0 (ledger-cadence study; read-only)';
const PAGE_LIMIT = 200; // Horizon's maximum for /ledgers
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 4;
const PAGE_DELAY_MS = 300;

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

function utcDate(date) {
  return date.toISOString().slice(0, 10);
}

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pickLedger(record, index) {
  const required = [
    'sequence',
    'closed_at',
    'protocol_version',
    'successful_transaction_count',
    'failed_transaction_count',
    'operation_count',
    'tx_set_operation_count',
    'hash',
    'prev_hash',
  ];
  for (const field of required) {
    assert(record[field] !== undefined && record[field] !== null, `record ${index}: missing field ${field}`);
  }
  assert(Number.isInteger(record.sequence), `record ${index}: sequence is not an integer`);
  assert(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(record.closed_at),
    `record ${index}: closed_at is not second-precision UTC ISO 8601 (${record.closed_at})`,
  );
  assert(/^[0-9a-f]{64}$/.test(record.hash), `record ${index}: malformed hash`);
  assert(/^[0-9a-f]{64}$/.test(record.prev_hash), `record ${index}: malformed prev_hash`);

  return {
    sequence: record.sequence,
    closed_at: record.closed_at,
    protocol_version: record.protocol_version,
    successful_transaction_count: record.successful_transaction_count,
    failed_transaction_count: record.failed_transaction_count,
    operation_count: record.operation_count,
    tx_set_operation_count: record.tx_set_operation_count,
    hash: record.hash,
    prev_hash: record.prev_hash,
  };
}

async function getJson(url) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const started = Date.now();
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const text = await response.text();
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`HTTP ${response.status} from ${url}`);
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}: ${text.slice(0, 200)}`);
      }
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`non-JSON response from ${url}: ${text.slice(0, 200)}`);
      }
      return {
        json,
        status: response.status,
        serverDate: response.headers.get('date'),
        durationMs: Date.now() - started,
      };
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        const backoff = 500 * 2 ** (attempt - 1);
        process.stderr.write(`request failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${error.message}; retrying in ${backoff} ms\n`);
        await sleep(backoff);
      }
    }
  }
  throw lastError;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const network = args.network ?? 'mainnet';
  assert(network === 'mainnet' || network === 'testnet', `unknown network: ${network}`);

  const count = Number(args.count ?? 1000);
  assert(Number.isInteger(count) && count > 0 && count <= 20_000, `invalid count: ${args.count}`);

  const baseUrl = network === 'mainnet' ? 'https://api.mainnet.minepi.com' : 'https://api.testnet.minepi.com';
  const startedAt = new Date();
  const outDir = path.resolve(args.out ?? path.join('data', `ledger-cadence-${utcDate(startedAt)}`));

  process.stderr.write(`fetching ${count} ledgers from ${baseUrl}/ledgers (newest first)\n`);

  const records = [];
  const seen = new Set();
  let url = `${baseUrl}/ledgers?order=desc&limit=${PAGE_LIMIT}`;
  let pages = 0;
  let firstServerDate = null;
  let lastServerDate = null;
  let firstPageDurationMs = null;

  while (records.length < count) {
    const page = await getJson(url);
    pages += 1;
    firstServerDate ??= page.serverDate;
    lastServerDate = page.serverDate;
    firstPageDurationMs ??= page.durationMs;

    assert(Array.isArray(page.json?._embedded?.records), `page ${pages}: missing _embedded.records`);
    assert(page.json._embedded.records.length > 0, `page ${pages}: empty records array`);

    for (const record of page.json._embedded.records) {
      if (records.length >= count) break;
      assert(!seen.has(record.sequence), `duplicate sequence ${record.sequence} across pages; aborting`);
      seen.add(record.sequence);
      records.push(pickLedger(record, records.length));
    }

    process.stderr.write(`  page ${pages}: ${page.json._embedded.records.length} records, ${records.length}/${count} collected, ${page.durationMs} ms\n`);

    if (records.length < count) {
      const next = page.json?._links?.next?.href;
      assert(typeof next === 'string' && next.length > 0, `page ${pages}: no _links.next.href and fewer than ${count} records`);
      assert(next.startsWith(baseUrl), `page ${pages}: next link points outside ${baseUrl}: ${next}`);
      url = next;
      await sleep(PAGE_DELAY_MS);
    }
  }

  const finishedAt = new Date();
  assert(records.length === count, `collected ${records.length}, expected ${count}`);

  const newest = records[0];
  const oldest = records[records.length - 1];
  const spanSeconds = (Date.parse(newest.closed_at) - Date.parse(oldest.closed_at)) / 1000;
  assert(spanSeconds > 0, 'newest ledger is not newer than oldest ledger');

  // Do not derive collection age from the client clock or from a single HTTP Date header.
  // During collection the client clock ran ~30 s behind the chain's closed_at values, and the
  // endpoint's Date headers varied by tens of seconds between pages. Neither affects intervals,
  // which are differences between ledger closed_at values, but both must be stated honestly.
  const localLagSeconds = Math.round((Date.parse(newest.closed_at) - finishedAt.getTime()) / 1000);

  const jsonl = `${records.map((record) => JSON.stringify(record)).join('\n')}\n`;
  const datasetSha256 = sha256(jsonl);

  const manifest = {
    schema: 'pi-ledger-cadence/1',
    network,
    endpoint: `${baseUrl}/ledgers`,
    query: { order: 'desc', limit: PAGE_LIMIT },
    generated_by: 'scripts/fetch-ledgers.mjs',
    collection_started_at: startedAt.toISOString(),
    collection_finished_at: finishedAt.toISOString(),
    server_date_first_page: firstServerDate,
    server_date_last_page: lastServerDate,
    first_page_duration_ms: firstPageDurationMs,
    requested_count: count,
    collected_count: records.length,
    pages,
    newest_sequence: newest.sequence,
    oldest_sequence: oldest.sequence,
    newest_closed_at: newest.closed_at,
    oldest_closed_at: oldest.closed_at,
    chain_span_seconds: spanSeconds,
    local_clock_lag_estimate_seconds: localLagSeconds,
    clock_note:
      'The client clock ran about this many seconds behind the newest ledger closed_at during collection; the endpoint HTTP Date headers also varied by tens of seconds between pages. Collection timestamps above are client-clock values and are not used for interval computation. The chain timeline is anchored to closed_at.',
    collection_anchor: {
      oldest_ledger_closed_at: oldest.closed_at,
      newest_ledger_closed_at: newest.closed_at,
      chain_span_seconds: spanSeconds,
    },
    dataset_file: 'ledgers.jsonl',
    dataset_sha256: datasetSha256,
    dataset_bytes: Buffer.byteLength(jsonl, 'utf8'),
    fields: Object.keys(newest),
    notes: [
      'Records are stored newest first, exactly as returned by Horizon with order=desc.',
      'Only closed ledgers are observable through this endpoint; no mempool or pending transaction data is included.',
      'closed_at is second-granularity UTC ISO 8601, so close intervals are integer seconds.',
      'This is a single collection window from a single vantage point; it is not a continuous monitor and not an SLA measurement.',
    ],
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'ledgers.jsonl'), jsonl, 'utf8');
  await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  process.stderr.write(
    `wrote ${records.length} ledgers to ${path.join(outDir, 'ledgers.jsonl')}\n` +
      `  sequences ${newest.sequence} → ${oldest.sequence}\n` +
      `  closed_at ${newest.closed_at} → ${oldest.closed_at} (${spanSeconds} s)\n` +
      `  sha256 ${datasetSha256}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`fetch failed: ${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
