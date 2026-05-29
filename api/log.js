// Vercel Function — Google Sheets Webhook Proxy
// POST /api/log  { type, payload }
//   type: "submission" | "ping"
//   payload: object — gửi nguyên sang Apps Script
//
// Env vars:
//   GSHEETS_WEBHOOK_URL = https://script.google.com/macros/s/.../exec
//
// Mục đích: ẩn URL webhook, tránh ai cũng spam thẳng vào Google Sheet.
// Không chặn quá trình chấm bài — fail thì silent log.

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  setCORS(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Method not allowed' }); return; }

  const url = process.env.GSHEETS_WEBHOOK_URL;
  if (!url) { res.status(200).json({ ok: false, skipped: true, reason: 'no_webhook_configured' }); return; }

  try {
    const body = req.body || {};
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    res.status(200).json({ ok: r.ok, status: r.status, response: text.slice(0, 500) });
  } catch (e) {
    res.status(200).json({ ok: false, error: e.message });
  }
};
