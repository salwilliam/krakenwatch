#!/usr/bin/env node
// test-delete-cleanup-guidance.mjs
//
// Tests that step 4c of rotate-deploy-key.sh emits the correct cleanup
// guidance when a GitHub deploy-key deletion fails after retry, and that the
// caller receives a non-empty failures array (causing a non-zero exit).
//
// Imports deleteRotationKeys directly from the shared module
// (scripts/lib/delete-rotation-keys.mjs) so the test exercises the real
// implementation — not a copy.  No real GitHub credentials or network access
// are required.
//
// Run: node .github/scripts/tests/test-delete-cleanup-guidance.mjs

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Resolve the shared module relative to this test file.
// Layout: .github/scripts/tests/ → up 3 levels → repo root → scripts/lib/
const MODULE_PATH = path.resolve(
  __dirname,
  '../../../scripts/lib/delete-rotation-keys.mjs',
);

const { deleteRotationKeys } = await import(`file://${MODULE_PATH}`);

// ---------------------------------------------------------------------------
// Minimal test harness
// ---------------------------------------------------------------------------

let PASS = 0;
let FAIL = 0;

function pass(desc) {
  console.log(`    PASS: ${desc}`);
  PASS++;
}

function fail(desc) {
  console.log(`    FAIL: ${desc}`);
  FAIL++;
}

// Captures console.error lines emitted during fn() without suppressing them.
async function captureStderr(fn) {
  const lines = [];
  const original = console.error;
  console.error = (...args) => {
    const line = args.join(' ');
    lines.push(line);
    original(...args);
  };
  try {
    await fn();
  } finally {
    console.error = original;
  }
  return lines;
}

// Captures console.log lines emitted during fn().
async function captureStdout(fn) {
  const lines = [];
  const original = console.log;
  console.log = (...args) => {
    const line = args.join(' ');
    lines.push(line);
    original(...args);
  };
  try {
    await fn();
  } finally {
    console.log = original;
  }
  return lines;
}

function assertContains(lines, pattern, desc) {
  const joined = lines.join('\n');
  if (joined.includes(pattern)) {
    pass(desc);
  } else {
    fail(`${desc}  (pattern ${JSON.stringify(pattern)} not found in output)`);
  }
}

function assertNotContains(lines, pattern, desc) {
  const joined = lines.join('\n');
  if (!joined.includes(pattern)) {
    pass(desc);
  } else {
    fail(`${desc}  (unexpected pattern ${JSON.stringify(pattern)} found in output)`);
  }
}

// ---------------------------------------------------------------------------
// Test 1: both DELETE attempts return HTTP 422 → retry is logged, cleanup
//         guidance is emitted with the exact repo URL and key details, and the
//         returned failures array is non-empty (caller must exit non-zero).
// ---------------------------------------------------------------------------
console.log('');
console.log('Test 1: both DELETE attempts fail (HTTP 422) — cleanup guidance emitted, non-empty failures returned');

{
  const REPO = 'salwilliam/krakenwatch';
  const KEY  = { id: 99001, title: 'krakenwatch-deploy-20260101' };

  let deleteCallCount = 0;

  async function ghRequestAlwaysFails(method, _path) {
    if (method === 'DELETE') {
      deleteCallCount++;
      return { status: 422, body: 'Unprocessable Entity' };
    }
    return { status: 200, body: '[]' };
  }

  let failures;
  const errLines = await captureStderr(async () => {
    failures = await deleteRotationKeys({
      ghRequest: ghRequestAlwaysFails,
      repo: REPO,
      rotationKeys: [KEY],
    });
  });

  // The retry must be attempted exactly once after the first failure,
  // so DELETE is called twice total (first attempt + retry).
  if (deleteCallCount === 2) {
    pass('DELETE endpoint called exactly twice (first attempt + one retry)');
  } else {
    fail(`DELETE endpoint call count: expected 2, got ${deleteCallCount}`);
  }

  assertContains(
    errLines,
    `WARN: First delete attempt for key ${KEY.id} failed (HTTP 422) — retrying …`,
    'WARN message logged for first failure with retry notice',
  );

  assertContains(
    errLines,
    `ERROR: Failed to delete key ${KEY.id} ("${KEY.title}") after retry (HTTP 422).`,
    'ERROR message logged after retry also fails',
  );

  assertContains(
    errLines,
    `https://github.com/${REPO}/settings/keys`,
    'GitHub settings URL included in cleanup guidance',
  );

  assertContains(
    errLines,
    `Key details — ID: ${KEY.id}  title: "${KEY.title}"`,
    'Stale key ID and title included in cleanup guidance',
  );

  assertContains(
    errLines,
    `• [${KEY.id}] "${KEY.title}"`,
    'Stale key listed in the failure summary',
  );

  if (failures.length === 1 && failures[0].id === KEY.id) {
    pass('Returned failures array contains the failed key (caller should exit 1)');
  } else {
    fail(`Expected failures array with key id ${KEY.id}, got: ${JSON.stringify(failures)}`);
  }
}

// ---------------------------------------------------------------------------
// Test 2: both DELETE attempts throw a network error (null response path)
//         → same cleanup guidance, non-empty failures returned.
// ---------------------------------------------------------------------------
console.log('');
console.log('Test 2: both DELETE attempts throw a network error — cleanup guidance emitted, non-empty failures returned');

{
  const REPO = 'salwilliam/krakenwatch';
  const KEY  = { id: 99002, title: 'krakenwatch-deploy-20260102' };

  let deleteCallCount = 0;

  async function ghRequestThrows(method, _path) {
    if (method === 'DELETE') {
      deleteCallCount++;
      throw new Error('ECONNREFUSED');
    }
    return { status: 200, body: '[]' };
  }

  let failures;
  const errLines = await captureStderr(async () => {
    failures = await deleteRotationKeys({
      ghRequest: ghRequestThrows,
      repo: REPO,
      rotationKeys: [KEY],
    });
  });

  if (deleteCallCount === 2) {
    pass('DELETE endpoint called exactly twice (first attempt + one retry)');
  } else {
    fail(`DELETE endpoint call count: expected 2, got ${deleteCallCount}`);
  }

  assertContains(
    errLines,
    'network error',
    'Network error reason appears in output',
  );

  assertContains(
    errLines,
    `https://github.com/${REPO}/settings/keys`,
    'GitHub settings URL included in cleanup guidance after network error',
  );

  assertContains(
    errLines,
    `Key details — ID: ${KEY.id}  title: "${KEY.title}"`,
    'Stale key ID and title included after network error',
  );

  if (failures.length === 1 && failures[0].id === KEY.id) {
    pass('Returned failures array is non-empty (caller should exit 1)');
  } else {
    fail(`Expected failures array with key id ${KEY.id}, got: ${JSON.stringify(failures)}`);
  }
}

// ---------------------------------------------------------------------------
// Test 3: first attempt fails, retry succeeds → WARN logged but NO error
//         guidance emitted, failures array is empty (caller exits 0).
// ---------------------------------------------------------------------------
console.log('');
console.log('Test 3: first DELETE fails, retry succeeds — WARN logged, no ERROR guidance, empty failures');

{
  const REPO = 'salwilliam/krakenwatch';
  const KEY  = { id: 99003, title: 'krakenwatch-deploy-20260103' };

  let deleteCallCount = 0;

  async function ghRequestFailThenSucceed(method, _path) {
    if (method === 'DELETE') {
      deleteCallCount++;
      if (deleteCallCount === 1) return { status: 503, body: 'Service Unavailable' };
      return { status: 204, body: '' };
    }
    return { status: 200, body: '[]' };
  }

  let failures;
  const errLines  = await captureStderr(async () => {
    // captureStdout separately for the success message assertion
  });

  const outLines = await captureStdout(async () => {
    const innerErr = await captureStderr(async () => {
      failures = await deleteRotationKeys({
        ghRequest: ghRequestFailThenSucceed,
        repo: REPO,
        rotationKeys: [KEY],
      });
    });
    errLines.push(...innerErr);
  });

  assertContains(
    errLines,
    `WARN: First delete attempt for key ${KEY.id} failed`,
    'WARN logged when first attempt fails',
  );

  assertNotContains(
    errLines,
    'ERROR: Failed to delete key',
    'No ERROR guidance when retry succeeds',
  );

  assertNotContains(
    errLines,
    'settings/keys',
    'No GitHub settings URL when retry succeeds',
  );

  assertContains(
    outLines,
    `==> Removed old deploy key: [${KEY.id}] "${KEY.title}"`,
    'Success message logged after retry succeeds',
  );

  if (failures.length === 0) {
    pass('Failures array is empty when retry succeeds (caller exits 0)');
  } else {
    fail(`Expected empty failures array, got: ${JSON.stringify(failures)}`);
  }
}

// ---------------------------------------------------------------------------
// Test 4: multiple keys all fail → all reported in the summary, count is
//         correct, each key listed in the consolidated summary.
// ---------------------------------------------------------------------------
console.log('');
console.log('Test 4: multiple keys all fail — all reported in summary, correct count');

{
  const REPO = 'salwilliam/krakenwatch';
  const KEYS = [
    { id: 99010, title: 'krakenwatch-deploy-20260110' },
    { id: 99011, title: 'krakenwatch-deploy-20260111' },
  ];

  async function ghRequestAlwaysFails(method, _path) {
    if (method === 'DELETE') return { status: 422, body: 'Unprocessable Entity' };
    return { status: 200, body: '[]' };
  }

  let failures;
  const errLines = await captureStderr(async () => {
    failures = await deleteRotationKeys({
      ghRequest: ghRequestAlwaysFails,
      repo: REPO,
      rotationKeys: KEYS,
    });
  });

  assertContains(
    errLines,
    '2 stale deploy key(s) could not be deleted automatically.',
    'Summary reports correct count of failed deletions',
  );

  for (const key of KEYS) {
    assertContains(
      errLines,
      `• [${key.id}] "${key.title}"`,
      `Key ${key.id} listed in failure summary`,
    );
  }

  if (failures.length === KEYS.length) {
    pass('Failures array contains all failed keys');
  } else {
    fail(`Expected ${KEYS.length} failures, got ${failures.length}`);
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('');
console.log('─────────────────────────────────────────────');
console.log(`Passed: ${PASS} | Failed: ${FAIL}`);
console.log('─────────────────────────────────────────────');

if (FAIL > 0) {
  process.exit(1);
}
