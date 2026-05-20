// Netlify Function — Universal LLM Proxy
// Hỗ trợ 2 chế độ (chọn bằng env var):
//
//   Chế độ 1 — Anthropic native:
//     ANTHROPIC_API_KEY = sk-ant-...
//
//   Chế độ 2 — OpenAI-compatible (chiasegpu.vn, OpenRouter, v.v.):
//     LLM_ENDPOINT = https://chiasegpu.vn/v1          ← base URL, không có /chat/completions
//     LLM_API_KEY  = <key từ chiasegpu.vn>
//
// Optional (cả 2 chế độ):
//   DAILY_CALL_LIMIT = 500   ← soft limit lượt gọi/ngày (default 500)
//
// POST /.netlify/functions/claude  { model, prompt, maxTokens }
// Response luôn trả về format Anthropic: { content:[{text}], usage:{input_tokens, output_tokens} }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Soft daily counter (in-memory, reset khi Function cold-start)
const DAILY_LIMIT = parseInt(process.env.DAILY_CALL_LIMIT || '500');
let _callCount = 0;
let _callDay   = '';
function todayKey() { return new Date().toISOString().slice(0, 10); }

// ─────────────────────────────────────────
// Chế độ 1: Anthropic native API
// ─────────────────────────────────────────
async function callAnthropic(model, prompt, maxTokens, apiKey) {
  const res  = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }),
  });
  // Trả thẳng response của Anthropic (client đã biết parse format này)
  const text = await res.text();
  return { status: res.status, body: text };
}

// ─────────────────────────────────────────
// Chế độ 2: OpenAI-compatible (chiasegpu.vn)
// Normalize response về format Anthropic để client không cần đổi code
// ─────────────────────────────────────────
async function callOpenAICompat(model, prompt, maxTokens, endpoint, apiKey) {
  const url = endpoint.replace(/\/$/, '') + '/chat/completions';
  const res  = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    // Trả lỗi theo format Anthropic để client xử lý đúng
    let msg = 'LLM error HTTP ' + res.status;
    try { msg = JSON.parse(raw)?.error?.message || msg; } catch (_) {}
    return {
      status: res.status,
      body: JSON.stringify({ error: { message: msg } }),
    };
  }

  // Parse OpenAI response → convert sang Anthropic format
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

// ─────────────────────────────────────────
// Handler chính
// ─────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Kiểm tra env vars — phải có ít nhất 1 trong 2 chế độ
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const llmEndpoint  = process.env.LLM_ENDPOINT;
  const llmKey       = process.env.LLM_API_KEY;

  if (!anthropicKey && !(llmEndpoint && llmKey)) {
    return {
      statusCode: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: 'Chưa cấu hình API key trên Netlify. Cần set ANTHROPIC_API_KEY hoặc LLM_ENDPOINT + LLM_API_KEY.' } }),
    };
  }

  // Soft daily limit
  const today = todayKey();
  if (_callDay !== today) { _callDay = today; _callCount = 0; }
  _callCount++;
  if (_callCount > DAILY_LIMIT) {
    return {
      statusCode: 429,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: `Đã đạt giới hạn ${DAILY_LIMIT} lượt gọi/ngày.` } }),
    };
  }

  // Parse body
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (_) { return { statusCode: 400, body: JSON.stringify({ error: { message: 'Invalid JSON' } }) }; }

  const { model, prompt, maxTokens = 1000 } = body;
  if (!model || !prompt) {
    return { statusCode: 400, body: JSON.stringify({ error: { message: 'Thiếu model hoặc prompt' } }) };
  }

  try {
    // Ưu tiên Anthropic native nếu có cả 2
    let result;
    if (anthropicKey) {
      result = await callAnthropic(model, prompt, maxTokens, anthropicKey);
    } else {
      result = await callOpenAICompat(model, prompt, maxTokens, llmEndpoint, llmKey);
    }

    return {
      statusCode: result.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: result.body,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: 'Proxy error: ' + err.message } }),
    };
  }
};
