// delete-rotation-keys.mjs
//
// Shared step-4c logic for rotate-deploy-key.sh.
//
// Exported so the shell script (via dynamic import from its inline Node.js
// heredoc) and the automated test suite both execute the same code path.
//
// Usage:
//   const { deleteRotationKeys } = await import('file:///path/to/lib/delete-rotation-keys.mjs');
//   const failures = await deleteRotationKeys({ ghRequest, repo, rotationKeys });
//   if (failures.length > 0) process.exit(1);

/**
 * Attempts to DELETE each key in `rotationKeys` via `ghRequest`.
 * Each key gets one automatic retry on failure.  If the retry also fails,
 * a targeted error message is emitted with the exact GitHub settings URL and
 * the stale key's ID and title so the operator can remove it manually without
 * guessing which one it is.  Failures are collected so that all stale keys
 * are attempted before returning, leaving the operator with a complete list
 * of what still needs to be cleaned up.
 *
 * @param {object}   opts
 * @param {Function} opts.ghRequest     - async (method, path) => { status, body }
 * @param {string}   opts.repo          - GitHub repository slug, e.g. "owner/repo"
 * @param {Array}    opts.rotationKeys  - array of { id, title } deploy-key objects
 * @returns {Promise<Array>}  Keys that could not be deleted after retry.
 *                            Callers should exit non-zero when the array is non-empty.
 */
export async function deleteRotationKeys({ ghRequest, repo, rotationKeys }) {
  const deleteFailures = [];

  for (const key of rotationKeys) {
    // Helper: attempt a single DELETE and return the HTTP response, or null on
    // a transport-level error (connection refused, timeout, DNS failure, etc.)
    // so that network errors are handled the same way as bad HTTP responses.
    async function tryDelete() {
      try {
        return await ghRequest('DELETE', `/repos/${repo}/keys/${key.id}`);
      } catch (err) {
        console.error(`WARN: DELETE request for key ${key.id} threw a network error: ${err.message}`);
        return null;
      }
    }

    // First attempt.
    let delRes = await tryDelete();

    if (!delRes || delRes.status !== 204) {
      // One automatic retry before giving up.
      const reason = delRes ? `HTTP ${delRes.status}` : 'network error';
      console.error(`WARN: First delete attempt for key ${key.id} failed (${reason}) — retrying …`);
      delRes = await tryDelete();
    }

    if (delRes && delRes.status === 204) {
      console.log(`==> Removed old deploy key: [${key.id}] "${key.title}"`);
    } else {
      // Retry also failed — record this so we can report all failures together.
      const reason = delRes ? `HTTP ${delRes.status}` : 'network error';
      console.error(`ERROR: Failed to delete key ${key.id} ("${key.title}") after retry (${reason}).`);
      console.error(`       This stale key is still registered and must be removed manually.`);
      console.error(`       Remove it at: https://github.com/${repo}/settings/keys`);
      console.error(`       Key details — ID: ${key.id}  title: "${key.title}"`);
      deleteFailures.push(key);
    }
  }

  if (deleteFailures.length > 0) {
    console.error('');
    console.error(`ERROR: ${deleteFailures.length} stale deploy key(s) could not be deleted automatically.`);
    console.error('       Both the new key AND the stale key(s) are currently registered on GitHub.');
    console.error('       Remove each stale key manually to restore a clean rotation state:');
    console.error(`         https://github.com/${repo}/settings/keys`);
    console.error('       Stale key IDs to remove:');
    for (const k of deleteFailures) {
      console.error(`         • [${k.id}] "${k.title}"`);
    }
    console.error('');
    console.error('       After removing them, re-run this script to verify the state is correct.');
  }

  return deleteFailures;
}
