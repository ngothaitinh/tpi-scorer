// Vercel Function — Universal LLM Proxy
// POST /api/claude  { model, prompt, maxTokens }
// Response luôn trả về format Anthropic: { content:[{text}], usage:{...} }
//
// Env vars:
//   ANTHROPIC_API_KEY = sk-ant-...           (Anthropic native)
//   LLM_ENDPOINT + LLM_API_KEY              (OpenAI-compatible, e.g. chiasegpu.vn)
//   DAILY_CALL_LIMIT = 500                  (soft limit)

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const DAILY_LIMIT = parseInt(process.env.DAILY_CALL_LIMIT || '500');
let _callCount = 0;
let _callDay   = '';
function todayKey() { return new Date().toISOString().slice(0, 10); }

async function callAnthropic(model, prompt, maxTokens, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function callOpenAICompat(model, prompt, maxTokens, endpoint, apiKey) {
  const base = endpoint.replace(/\/$/, '');
  const url = base.includes('/chat/completions') ? base : base + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }),
  });

  const raw = await res.text();
  if (!res.ok) {
    let msg = 'LLM error HTTP ' + res.status;
    try { msg = JSON.parse(raw)?.error?.message || msg; } catch (_) {}
    return { status: res.status, body: JSON.stringify({ error: { message: msg } }) };
  }

  let data;
  try { data = JSON.parse(raw); } catch (_) {
    return { status: 502, body: JSON.stringify({ error: { message: 'Invalid JSON from upstream' } }) };
  }

  const anthropicFmt = {
    id: data.id || 'proxy',
    type: 'message',
    role: 'assistant',
    content: [{ type: 'text', text: data.choices?.[0]?.message?.content || '' }],
    model: data.model || model,
    usage: {
      input_tokens:  data.usage?.prompt_tokens     || 0,
      output_tokens: data.usage?.completion_tokens || 0,
    },
  };
  return { status: 200, body: JSON.stringify(anthropicFmt) };
}

module.exports = async (req, res) => {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const llmEndpoint  = process.env.LLM_ENDPOINT;
  const llmKey       = process.env.LLM_API_KEY;

  if (!anthropicKey && !(llmEndpoint && llmKey)) {
    return res.status(500).json({ error: { message: 'Chưa cấu hình API key. Cần set ANTHROPIC_API_KEY hoặc LLM_ENDPOINT + LLM_API_KEY.' } });
  }

  const today = todayKey();
  if (_callDay !== today) { _callDay = today; _callCount = 0; }
  _callCount++;
  if (_callCount > DAILY_LIMIT) {
    return res.status(429).json({ error: { message: `Đã đạt giới hạn ${DAILY_LIMIT} lượt gọi/ngày.` } });
  }

  const body = req.body || {};
  const { model, prompt, maxTokens = 1000 } = body;
  if (!model || !prompt) {
    return res.status(400).json({ error: { message: 'Thiếu model hoặc prompt' } });
  }

  try {
    let result;
    if (anthropicKey) {
      result = await callAnthropic(model, prompt, maxTokens, anthropicKey);
    } else {
      result = await callOpenAICompat(model, prompt, maxTokens, llmEndpoint, llmKey);
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(result.status).send(result.body);
  } catch (err) {
    return res.status(502).json({ error: { message: 'Proxy error: ' + err.message } });
  }
};
