import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

const require = createRequire(import.meta.url);
const runId = `pre-fix-${Date.now()}`;
const endpoint = 'http://127.0.0.1:7935/ingest/3bf7fcbe-5dab-4a32-9f57-158ccef4a875';

function sendDebugLog(hypothesisId, location, message, data) {
  // #region agent log
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '53c55a'
    },
    body: JSON.stringify({
      sessionId: '53c55a',
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
}

sendDebugLog('H1', 'scripts/dev-debug.mjs:30', 'dev-start', {
  node: process.version,
  platform: process.platform,
  arch: process.arch
});

let bindingFound = false;
try {
  require.resolve('@rolldown/binding-linux-x64-gnu');
  bindingFound = true;
} catch (error) {
  sendDebugLog('H1', 'scripts/dev-debug.mjs:41', 'binding-package-missing', {
    name: error?.name,
    code: error?.code
  });
}

try {
  require.resolve('rolldown');
  sendDebugLog('H2', 'scripts/dev-debug.mjs:49', 'rolldown-package-present', {});
} catch (error) {
  sendDebugLog('H2', 'scripts/dev-debug.mjs:51', 'rolldown-package-missing', {
    name: error?.name,
    code: error?.code
  });
}

sendDebugLog('H3', 'scripts/dev-debug.mjs:58', 'before-vite-spawn', {
  bindingFound
});

const child = spawn('vite', { stdio: 'inherit', shell: true });

child.on('error', (error) => {
  sendDebugLog('H4', 'scripts/dev-debug.mjs:64', 'vite-spawn-error', {
    name: error?.name,
    message: error?.message
  });
});

child.on('exit', (code, signal) => {
  sendDebugLog('H5', 'scripts/dev-debug.mjs:72', 'vite-exit', {
    code,
    signal
  });
  process.exit(code ?? 1);
});
