// Vercel Function — Article Fetch Proxy
// POST /api/fetch  { url: "https://..." }
// → Fetch URL server-side (tránh CORS), trả về HTML

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { url } = req.body || {};
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'URL không hợp lệ' });
  }

  // Chặn internal/private URLs
  if (/localhost|127\.|192\.168\.|10\.\d+\.\d+\.\d+/.test(url)) {
    return res.status(403).json({ error: 'URL bị chặn' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    const html = await response.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(response.status).send(html);
  } catch (e) {
    return res.status(502).json({ error: 'Không tải được: ' + e.message });
  }
};
