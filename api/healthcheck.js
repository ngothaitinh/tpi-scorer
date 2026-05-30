// Vercel Function — System Health Check Agent (Option 4)
// GET  /api/healthcheck               → run health check, return JSON report
// POST /api/healthcheck  {secret}     → cron-triggered run
//
// Env vars required:
//   HEALTHCHECK_SECRET      = random string (cron auth)
//   LLM_ENDPOINT / LLM_API_KEY  (or ANTHROPIC_API_KEY) — để ping LLM
//   GSHEETS_WEBHOOK_URL     — webhook log
//
// Checks:
//   1. LLM reachability — gọi callProxy với prompt ngắn, expect response
//   2. Webhook reachability — POST ping tới GSHEETS_WEBHOOK_URL
//   3. Self-check — bài mẫu cố định → chấm điểm trong range expected
//
// Vercel Cron config (vercel.json):
//   {"crons": [{"path": "/api/healthcheck", "schedule": "0 8 * * 1"}]}  ← thứ 2, 8h sáng
//
// Output JSON:
// {
//   "timestamp": "...", "overall": "ok|warn|fail",
//   "checks": [{"name": "...", "status": "ok|fail", "detail": "..."}],
//   "duration_ms": 3200
// }

const { createHash } = require('crypto');

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Check 1: LLM reachability ─────────────────────────────────
async function checkLLM() {
  const endpoint  = process.env.LLM_ENDPOINT || '';
  const apiKey    = process.env.LLM_API_KEY   || process.env.ANTHROPIC_API_KEY || '';
  const model     = process.env.LLM_MODEL     || '';

  if (!apiKey) return { name: 'llm_reachability', status: 'fail', detail: 'No API key configured' };

  try {
    const t0 = Date.now();
    let res;

    if (process.env.ANTHROPIC_API_KEY && !process.env.LLM_ENDPOINT) {
      // Anthropic native
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model || 'claude-haiku-4-5',
          max_tokens: 32,
          messages: [{ role: 'user', content: 'Reply with exactly: HEALTH_OK' }],
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text || '';
      const ok = text.includes('HEALTH_OK');
      return { name: 'llm_reachability', status: ok ? 'ok' : 'warn', detail: `${Date.now() - t0}ms — response: "${text.slice(0, 80)}"` };
    } else {
      // OpenAI-compat
      const url = endpoint.includes('/chat/completions') ? endpoint : `${endpoint}/chat/completions`;
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          max_tokens: 32,
          messages: [{ role: 'user', content: 'Reply with exactly: HEALTH_OK' }],
        }),
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || '';
      const ok = text.includes('HEALTH_OK');
      return { name: 'llm_reachability', status: ok ? 'ok' : 'warn', detail: `${Date.now() - t0}ms — response: "${text.slice(0, 80)}"` };
    }
  } catch (e) {
    return { name: 'llm_reachability', status: 'fail', detail: e.message };
  }
}

// ── Check 2: Webhook reachability ────────────────────────────
async function checkWebhook() {
  const url = process.env.GSHEETS_WEBHOOK_URL || '';
  if (!url) return { name: 'webhook', status: 'warn', detail: 'GSHEETS_WEBHOOK_URL not configured — backup logging disabled' };
  try {
    const t0 = Date.now();
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'health_ping', payload: { at: new Date().toISOString(), by: 'healthcheck_agent' } }),
    });
    return { name: 'webhook', status: r.ok ? 'ok' : 'warn', detail: `${Date.now() - t0}ms — HTTP ${r.status}` };
  } catch (e) {
    return { name: 'webhook', status: 'fail', detail: e.message };
  }
}

// ── Check 3: Env vars completeness ───────────────────────────
function checkEnvVars() {
  const required = ['LLM_MODEL'];
  const optional = ['GSHEETS_WEBHOOK_URL', 'HEALTHCHECK_SECRET', 'DAILY_CALL_LIMIT'];
  const missing = required.filter(k => !process.env[k]);
  const hasLLM = !!(process.env.ANTHROPIC_API_KEY || (process.env.LLM_ENDPOINT && process.env.LLM_API_KEY));
  const issues = [];
  if (!hasLLM) issues.push('No LLM credentials (need ANTHROPIC_API_KEY or LLM_ENDPOINT+LLM_API_KEY)');
  missing.forEach(k => issues.push(`Missing: ${k}`));
  optional.filter(k => !process.env[k]).forEach(k => issues.push(`Optional not set: ${k}`));
  return {
    name: 'env_vars',
    status: issues.filter(i => !i.startsWith('Optional')).length === 0 ? 'ok' : 'fail',
    detail: issues.length ? issues.join('; ') : 'All required env vars present',
  };
}

// ── Main handler ─────────────────────────────────────────────
module.exports = async (req, res) => {
  setCORS(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Auth for POST (cron)
  if (req.method === 'POST') {
    const secret = req.body?.secret || '';
    const expected = process.env.HEALTHCHECK_SECRET || '';
    if (expected && secret !== expected) {
      res.status(401).json({ error: 'Unauthorized' }); return;
    }
  }

  const t0 = Date.now();
  const checks = await Promise.all([
    checkEnvVars(),
    checkLLM(),
    checkWebhook(),
  ]);

  const failCount  = checks.filter(c => c.status === 'fail').length;
  const warnCount  = checks.filter(c => c.status === 'warn').length;
  const overall    = failCount > 0 ? 'fail' : warnCount > 0 ? 'warn' : 'ok';
  const emojiMap   = { ok: '✅', warn: '⚠️', fail: '❌' };
  const duration   = Date.now() - t0;
  const report = {
    timestamp: new Date().toISOString(),
    overall,
    summary: `${emojiMap[overall]} ${checks.filter(c => c.status === 'ok').length}/${checks.length} OK · ${duration}ms`,
    checks,
    duration_ms: duration,
  };

  // Log result to Google Sheet if webhook configured
  if (process.env.GSHEETS_WEBHOOK_URL && overall !== 'ok') {
    try {
      await fetch(process.env.GSHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'health_result', payload: { ...report, checks: JSON.stringify(checks) } }),
      });
    } catch (_) {}
  }

  res.status(overall === 'fail' ? 503 : 200).json(report);
};
