#!/usr/bin/env node
/**
 * ledger-cadence.mjs — validate a fetched ledger dataset and compute close-interval statistics.
 *
 * Usage:
 *   node scripts/ledger-cadence.mjs [--dir data/ledger-cadence-YYYY-MM-DD]
 *
 * Input:
 *   <DIR>/ledgers.jsonl   one ledger per line, newest first (as written by fetch-ledgers.mjs)
 *   <DIR>/manifest.json   collection metadata, including the SHA-256 of ledgers.jsonl
 *
 * Output:
 *   <DIR>/stats.json      every computed number, including validation results
 *   <DIR>/intervals.csv   adjacent-ledger intervals, one row per pair
 *
 * Definitions (also recorded in stats.json):
 *   interval            closed_at[i] - closed_at[i-1] for ledgers with adjacent sequence numbers,
 *                       in ascending sequence order. This is a ledger-close interval, not a
 *                       transaction confirmation time.
 *   percentile          nearest-rank: sorted[ceil(p * n) - 1], 1 <= rank <= n.
 *   median              average of the two middle values when n is even.
 *   standard deviation  population standard deviation (divide by n).
 *
 * Node.js 18+ (built-in fetch not needed here). No dependencies.
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

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function round(value, digits = 6) {
  if (value === null || value === undefined) return value;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function percentileNearestRank(sorted, p) {
  assert(sorted.length > 0, 'percentile of empty array');
  const rank = Math.ceil(p * sorted.length);
  const index = Math.min(sorted.length, Math.max(1, rank)) - 1;
  return sorted[index];
}

function median(sorted) {
  assert(sorted.length > 0, 'median of empty array');
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function populationStddev(values, average) {
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function medianAbsoluteDeviation(sorted, centre) {
  const deviations = sorted.map((value) => Math.abs(value - centre)).sort((a, b) => a - b);
  return median(deviations);
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
  assert(candidates.length > 0, 'no data/ledger-cadence-* directories found; run scripts/fetch-ledgers.mjs first');
  return path.join(dataRoot, candidates[candidates.length - 1]);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dir = await resolveDataDir(args.dir);
  const datasetPath = path.join(dir, 'ledgers.jsonl');
  const manifestPath = path.join(dir, 'manifest.json');

  const datasetBytes = await readFile(datasetPath);
  const manifestBytes = await readFile(manifestPath);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  const text = datasetBytes.toString('utf8');

  const actualSha256 = sha256(datasetBytes);
  assert(
    actualSha256 === manifest.dataset_sha256,
    `dataset SHA-256 mismatch: file ${actualSha256}, manifest ${manifest.dataset_sha256}`,
  );

  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  assert(lines.length === manifest.collected_count, `dataset has ${lines.length} lines, manifest says ${manifest.collected_count}`);

  const raw = lines.map((line, index) => {
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      throw new Error(`line ${index + 1} is not valid JSON`);
    }
    for (const field of ['sequence', 'closed_at', 'protocol_version', 'hash', 'prev_hash']) {
      assert(record[field] !== undefined && record[field] !== null, `line ${index + 1}: missing ${field}`);
    }
    assert(Number.isInteger(record.sequence), `line ${index + 1}: sequence is not an integer`);
    return record;
  });

  const seenSequences = new Set();
  for (const record of raw) {
    assert(!seenSequences.has(record.sequence), `duplicate sequence ${record.sequence}`);
    seenSequences.add(record.sequence);
  }

  const ledgers = [...raw].sort((a, b) => a.sequence - b.sequence);
  const n = ledgers.length;
  assert(n >= 2, 'need at least two ledgers to compute an interval');

  const first = ledgers[0];
  const last = ledgers[n - 1];
  assert(
    manifest.newest_sequence === last.sequence && manifest.oldest_sequence === first.sequence,
    `manifest sequence bounds (${manifest.newest_sequence}..${manifest.oldest_sequence}) do not match dataset (${last.sequence}..${first.sequence})`,
  );

  const expectedSpan = last.sequence - first.sequence + 1;
  const missingSequences = [];
  for (let sequence = first.sequence; sequence <= last.sequence; sequence += 1) {
    if (!seenSequences.has(sequence)) missingSequences.push(sequence);
  }
  const sequenceContiguous = missingSequences.length === 0 && expectedSpan === n;

  const timestampProblems = [];
  const parsedTimes = new Map();
  for (const ledger of ledgers) {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(ledger.closed_at)) {
      timestampProblems.push({ sequence: ledger.sequence, closed_at: ledger.closed_at, problem: 'not second-precision UTC ISO 8601' });
      continue;
    }
    const ms = Date.parse(ledger.closed_at);
    if (!Number.isFinite(ms)) {
      timestampProblems.push({ sequence: ledger.sequence, closed_at: ledger.closed_at, problem: 'unparseable' });
      continue;
    }
    parsedTimes.set(ledger.sequence, ms);
  }

  const intervals = [];
  const hashLinkBreaks = [];
  const nonPositiveIntervals = [];
  const duplicateClosedAt = [];
  const skippedNonAdjacentPairs = [];
  const previousClosedAt = new Map();

  for (let i = 0; i < n; i += 1) {
    const current = ledgers[i];
    if (i > 0) {
      const previous = ledgers[i - 1];
      if (current.prev_hash !== previous.hash) {
        hashLinkBreaks.push({
          from_sequence: previous.sequence,
          to_sequence: current.sequence,
          previous_hash: previous.hash,
          current_prev_hash: current.prev_hash,
        });
      }

      const fromMs = parsedTimes.get(previous.sequence);
      const toMs = parsedTimes.get(current.sequence);
      if (fromMs !== undefined && toMs !== undefined) {
        const intervalSeconds = (toMs - fromMs) / 1000;
        if (current.sequence - previous.sequence !== 1) {
          skippedNonAdjacentPairs.push({
            from_sequence: previous.sequence,
            to_sequence: current.sequence,
            interval_seconds: intervalSeconds,
          });
        } else {
          intervals.push({
            from_sequence: previous.sequence,
            to_sequence: current.sequence,
            from_closed_at: previous.closed_at,
            to_closed_at: current.closed_at,
            interval_seconds: intervalSeconds,
            from_successful_transaction_count: previous.successful_transaction_count,
            from_failed_transaction_count: previous.failed_transaction_count,
            to_successful_transaction_count: current.successful_transaction_count,
            to_failed_transaction_count: current.failed_transaction_count,
          });
          if (intervalSeconds <= 0) {
            nonPositiveIntervals.push({
              from_sequence: previous.sequence,
              to_sequence: current.sequence,
              interval_seconds: intervalSeconds,
            });
          }
        }
      }
    }

    if (previousClosedAt.has(current.closed_at)) {
      duplicateClosedAt.push({
        closed_at: current.closed_at,
        sequences: [previousClosedAt.get(current.closed_at), current.sequence],
      });
    } else {
      previousClosedAt.set(current.closed_at, current.sequence);
    }
  }

  assert(intervals.length > 0, 'no adjacent-ledger intervals computed');
  const values = intervals.map((interval) => interval.interval_seconds);
  const sorted = [...values].sort((a, b) => a - b);
  const average = mean(values);
  const medianValue = median(sorted);
  const p25 = percentileNearestRank(sorted, 0.25);
  const p75 = percentileNearestRank(sorted, 0.75);
  const p90 = percentileNearestRank(sorted, 0.9);
  const p95 = percentileNearestRank(sorted, 0.95);
  const p99 = percentileNearestRank(sorted, 0.99);
  const stddev = populationStddev(values, average);
  const mad = medianAbsoluteDeviation(sorted, medianValue);
  const distinctIntervalValues = [...new Set(sorted)];

  const histogram = {};
  for (const value of sorted) {
    const key = String(value);
    histogram[key] = (histogram[key] ?? 0) + 1;
  }
  const histogramOrdered = Object.fromEntries(
    Object.entries(histogram).sort(([a], [b]) => Number(a) - Number(b)),
  );
  const modeCount = Math.max(...Object.values(histogram));
  const modes = Object.entries(histogram)
    .filter(([, count]) => count === modeCount)
    .map(([value]) => Number(value))
    .sort((a, b) => a - b);

  const sortedByIntervalDesc = [...intervals].sort((a, b) => b.interval_seconds - a.interval_seconds);
  const maxGap = sortedByIntervalDesc[0];
  const minGap = [...intervals].sort((a, b) => a.interval_seconds - b.interval_seconds)[0];

  const slowCloseThreshold = 3 * medianValue;
  const slowCloses = sortedByIntervalDesc.filter((interval) => interval.interval_seconds >= slowCloseThreshold);
  const gapsOver30s = sortedByIntervalDesc.filter((interval) => interval.interval_seconds >= 30);

  const protocolVersions = {};
  for (const ledger of ledgers) {
    const key = String(ledger.protocol_version);
    protocolVersions[key] = (protocolVersions[key] ?? 0) + 1;
  }

  const successfulTotal = ledgers.reduce((sum, ledger) => sum + (ledger.successful_transaction_count ?? 0), 0);
  const failedTotal = ledgers.reduce((sum, ledger) => sum + (ledger.failed_transaction_count ?? 0), 0);
  const operationTotal = ledgers.reduce((sum, ledger) => sum + (ledger.operation_count ?? 0), 0);
  const emptyLedgers = ledgers.filter(
    (ledger) => (ledger.successful_transaction_count ?? 0) + (ledger.failed_transaction_count ?? 0) === 0,
  ).length;

  const firstMs = parsedTimes.get(first.sequence);
  const lastMs = parsedTimes.get(last.sequence);
  const chainSpanSeconds = (lastMs - firstMs) / 1000;
  const coveredSpanSeconds = values.reduce((sum, value) => sum + value, 0);
  const sumOfIntervalsMatchesSpan = chainSpanSeconds === coveredSpanSeconds;

  const offFiveSecondBoundary = ledgers.filter((ledger) => {
    const ms = parsedTimes.get(ledger.sequence);
    return ms !== undefined && ms % 5000 !== 0;
  });

  const validation = {
    dataset_sha256_verified: true,
    dataset_sha256: actualSha256,
    manifest_sha256: sha256(manifestBytes),
    line_count_matches_manifest: lines.length === manifest.collected_count,
    sequence_contiguous: sequenceContiguous,
    expected_ledger_count_in_range: expectedSpan,
    actual_ledger_count: n,
    missing_sequence_count: missingSequences.length,
    missing_sequences: missingSequences.slice(0, 50),
    hash_chain_intact: hashLinkBreaks.length === 0,
    hash_link_break_count: hashLinkBreaks.length,
    hash_link_breaks: hashLinkBreaks.slice(0, 20),
    timestamps_valid: timestampProblems.length === 0,
    timestamp_problem_count: timestampProblems.length,
    timestamp_problems: timestampProblems.slice(0, 20),
    closed_at_strictly_increasing: nonPositiveIntervals.length === 0 && duplicateClosedAt.length === 0,
    non_positive_interval_count: nonPositiveIntervals.length,
    non_positive_intervals: nonPositiveIntervals.slice(0, 20),
    duplicate_closed_at_count: duplicateClosedAt.length,
    duplicate_closed_at: duplicateClosedAt.slice(0, 20),
    adjacent_pair_count: intervals.length,
    non_adjacent_pair_count: skippedNonAdjacentPairs.length,
    non_adjacent_pairs: skippedNonAdjacentPairs.slice(0, 20),
    all_closed_at_on_5s_boundary: offFiveSecondBoundary.length === 0,
    off_5s_boundary_count: offFiveSecondBoundary.length,
    off_5s_boundary: offFiveSecondBoundary.slice(0, 20).map((ledger) => ({
      sequence: ledger.sequence,
      closed_at: ledger.closed_at,
    })),
    sum_of_intervals_equals_chain_span: sumOfIntervalsMatchesSpan,
  };

  const warnings = [];
  if (!sequenceContiguous) warnings.push(`${missingSequences.length} sequence number(s) missing inside the range`);
  if (!validation.hash_chain_intact) warnings.push(`${hashLinkBreaks.length} prev_hash/hash mismatch(es)`);
  if (!validation.timestamps_valid) warnings.push(`${timestampProblems.length} timestamp problem(s)`);
  if (!validation.closed_at_strictly_increasing) warnings.push('closed_at is not strictly increasing');
  if (!sumOfIntervalsMatchesSpan) warnings.push('sum of adjacent intervals does not equal the full chain span');

  const stats = {
    schema: 'pi-ledger-cadence-stats/1',
    generated_by: 'scripts/ledger-cadence.mjs',
    generated_at: new Date().toISOString(),
    source: {
      directory: path.relative(process.cwd(), dir).replaceAll('\\', '/'),
      dataset_file: 'ledgers.jsonl',
      manifest_file: 'manifest.json',
      dataset_sha256: actualSha256,
      manifest_sha256: validation.manifest_sha256,
      dataset_bytes: datasetBytes.length,
    },
    network: manifest.network,
    collection: {
      started_at: manifest.collection_started_at,
      finished_at: manifest.collection_finished_at,
      server_date_first_page: manifest.server_date_first_page,
      server_date_last_page: manifest.server_date_last_page,
      pages: manifest.pages,
      requested_count: manifest.requested_count,
      collected_count: manifest.collected_count,
      newest_sequence: manifest.newest_sequence,
      oldest_sequence: manifest.oldest_sequence,
      newest_closed_at: manifest.newest_closed_at,
      oldest_closed_at: manifest.oldest_closed_at,
      local_clock_lag_estimate_seconds: manifest.local_clock_lag_estimate_seconds,
      clock_note: manifest.clock_note,
    },
    coverage: {
      ledger_count: n,
      interval_count: values.length,
      first_sequence: first.sequence,
      first_closed_at: first.closed_at,
      last_sequence: last.sequence,
      last_closed_at: last.closed_at,
      chain_span_seconds: chainSpanSeconds,
      chain_span_hours: round(chainSpanSeconds / 3600, 3),
      sum_of_intervals_seconds: coveredSpanSeconds,
      sum_of_intervals_matches_chain_span: sumOfIntervalsMatchesSpan,
      observation_note:
        'Closed ledgers only, from one vantage point, over one contiguous sequence window. This is not a continuous monitor.',
    },
    cadence: {
      min_seconds: minGap.interval_seconds,
      max_seconds: maxGap.interval_seconds,
      mean_seconds: round(average, 6),
      median_seconds: round(medianValue, 6),
      p25_seconds: p25,
      p75_seconds: p75,
      p90_seconds: p90,
      p95_seconds: p95,
      p99_seconds: p99,
      stddev_seconds: round(stddev, 6),
      iqr_seconds: p75 - p25,
      mad_seconds: round(mad, 6),
      mode_seconds: modes,
      mode_count: modeCount,
      distinct_interval_seconds: distinctIntervalValues,
      single_valued: distinctIntervalValues.length === 1,
      histogram_seconds: histogramOrdered,
      max_gap: {
        from_sequence: maxGap.from_sequence,
        to_sequence: maxGap.to_sequence,
        from_closed_at: maxGap.from_closed_at,
        to_closed_at: maxGap.to_closed_at,
        interval_seconds: maxGap.interval_seconds,
      },
      min_gap: {
        from_sequence: minGap.from_sequence,
        to_sequence: minGap.to_sequence,
        from_closed_at: minGap.from_closed_at,
        to_closed_at: minGap.to_closed_at,
        interval_seconds: minGap.interval_seconds,
      },
      top_gaps: sortedByIntervalDesc.slice(0, 10).map((interval) => ({
        from_sequence: interval.from_sequence,
        to_sequence: interval.to_sequence,
        from_closed_at: interval.from_closed_at,
        to_closed_at: interval.to_closed_at,
        interval_seconds: interval.interval_seconds,
      })),
    },
    transactions: {
      successful_transaction_count_total: successfulTotal,
      failed_transaction_count_total: failedTotal,
      operation_count_total: operationTotal,
      empty_ledger_count: emptyLedgers,
      empty_ledger_share: round(emptyLedgers / n, 6),
      mean_transactions_per_ledger: round((successfulTotal + failedTotal) / n, 6),
      mean_operations_per_ledger: round(operationTotal / n, 6),
      note: 'Descriptive context only; this dataset is too short to establish a cadence/load relationship.',
    },
    anomalies: {
      rule_slow_close: 'interval_seconds >= 3 * median_seconds',
      slow_close_threshold_seconds: round(slowCloseThreshold, 6),
      slow_close_count: slowCloses.length,
      slow_closes: slowCloses.slice(0, 20).map((interval) => ({
        from_sequence: interval.from_sequence,
        to_sequence: interval.to_sequence,
        from_closed_at: interval.from_closed_at,
        to_closed_at: interval.to_closed_at,
        interval_seconds: interval.interval_seconds,
      })),
      gaps_ge_30s_count: gapsOver30s.length,
      gaps_ge_30s: gapsOver30s.map((interval) => ({
        from_sequence: interval.from_sequence,
        to_sequence: interval.to_sequence,
        interval_seconds: interval.interval_seconds,
      })),
      non_positive_interval_count: nonPositiveIntervals.length,
      duplicate_closed_at_count: duplicateClosedAt.length,
      sequence_gap_count: missingSequences.length,
      hash_link_break_count: hashLinkBreaks.length,
      timestamp_problem_count: timestampProblems.length,
      protocol_versions: protocolVersions,
      protocol_version_changes: Object.keys(protocolVersions).length > 1,
    },
    definitions: {
      interval:
        'Difference between consecutive closed_at values for ledgers with adjacent sequence numbers, in ascending order.',
      time_precision: 'closed_at is second-granularity UTC ISO 8601; intervals are integer seconds.',
      percentile: 'Nearest-rank: sorted[ceil(p * n) - 1], clamped to [1, n].',
      median: 'Average of the two middle values when n is even.',
      stddev: 'Population standard deviation (divide by n).',
      slow_close_anomaly: 'An interval at least three times the median. Exploratory rule, not an SLA threshold.',
    },
    validation,
    warnings,
  };

  const csvHeader = 'from_sequence,to_sequence,from_closed_at,to_closed_at,interval_seconds\n';
  const csvBody = intervals
    .map((interval) =>
      [
        interval.from_sequence,
        interval.to_sequence,
        interval.from_closed_at,
        interval.to_closed_at,
        interval.interval_seconds,
      ].join(','),
    )
    .join('\n');

  await writeFile(path.join(dir, 'stats.json'), `${JSON.stringify(stats, null, 2)}\n`, 'utf8');
  await writeFile(path.join(dir, 'intervals.csv'), `${csvHeader}${csvBody}\n`, 'utf8');

  const statsBytes = await readFile(path.join(dir, 'stats.json'));
  const csvBytes = await readFile(path.join(dir, 'intervals.csv'));

  process.stderr.write(
    `analysed ${n} ledgers (${first.sequence} → ${last.sequence}) from ${path.relative(process.cwd(), dir)}\n` +
      `  intervals: n=${values.length} min=${minGap.interval_seconds}s median=${medianValue}s mean=${round(average, 3)}s p95=${p95}s max=${maxGap.interval_seconds}s\n` +
      `  max gap: ${maxGap.from_sequence} → ${maxGap.to_sequence} at ${maxGap.to_closed_at}\n` +
      `  validation: sequence_contiguous=${sequenceContiguous} hash_chain_intact=${validation.hash_chain_intact} timestamps_valid=${validation.timestamps_valid} strictly_increasing=${validation.closed_at_strictly_increasing}\n` +
      `  anomalies: slow_closes=${slowCloses.length} gaps_ge_30s=${gapsOver30s.length} missing_sequences=${missingSequences.length} hash_breaks=${hashLinkBreaks.length}\n` +
      `  wrote stats.json (${statsBytes.length} bytes) and intervals.csv (${csvBytes.length} bytes)\n`,
  );

  if (warnings.length > 0) {
    process.stderr.write(`  WARNING: ${warnings.join('; ')}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`analysis failed: ${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
