// Netlify Function — Claude API Proxy
// Đọc ANTHROPIC_API_KEY từ Netlify env (không lộ ra client)
// POST /.netlify/functions/claude  { model, prompt, maxTokens }

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

// Giới hạn lượt gọi/ngày (safety net — Anthropic Console spend limit là hard stop)
const DAILY_LIMIT = parseInt(process.env.DAILY_CALL_LIMIT || '500');

// In-memory counter (reset khi Function cold-start; đây chỉ là soft limit)
// Hard limit = Anthropic Console spend limit — set thủ công trên console.anthropic.com
let _callCount = 0;
let _callDay   = '';

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-05-20"
}

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: 'ANTHROPIC_API_KEY chưa được cấu hình trong Netlify env vars.' } }),
    };
  }

  // Soft daily counter (in-memory, resets on cold start)
  const today = todayKey();
  if (_callDay !== today) { _callDay = today; _callCount = 0; }
  _callCount++;
  if (_callCount > DAILY_LIMIT) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: { message: `Đã đạt giới hạn ${DAILY_LIMIT} lượt/ngày. Liên hệ admin để tăng quota.` } }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, body: JSON.stringify({ error: { message: 'Invalid JSON body' } }) };
  }

  const { model, prompt, maxTokens = 1000 } = body;
  if (!model || !prompt) {
    return { statusCode: 400, body: JSON.stringify({ error: { message: 'Thiếu model hoặc prompt' } }) };
  }

  try {
    const upstream = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const text = await upstream.text();

    return {
      statusCode: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: { message: 'Proxy error: ' + err.message } }),
    };
  }
};
