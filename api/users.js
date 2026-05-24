// Vercel Function — User Management API
// Dùng Vercel Blob làm persistent storage (free, không cần setup riêng)
//
// Setup: Vercel Dashboard → Storage → Blob → Create → Connect to project
// → Tự động inject BLOB_READ_WRITE_TOKEN
//
// Actions:
//   register   POST { name, username, pass }
//   login      POST { username, pass }
//   list       POST { adminUser, adminPassHash }
//   create     POST { adminUser, adminPassHash, name, username, pass, limit }
//   approve    POST { adminUser, adminPassHash, username }
//   setlimit   POST { adminUser, adminPassHash, username, limit }
//   resetpass  POST { adminUser, adminPassHash, username, newPass }
//   delete     POST { adminUser, adminPassHash, username }

// Vercel Blob REST API — bypass SDK để tránh lỗi "access must be public" trên private store
const USERS_BLOB = 'tpi-users.json';

async function blobList() {
  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  const res = await fetch(`https://blob.vercel-storage.com?prefix=${USERS_BLOB}&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Blob list failed: ' + res.status);
  return res.json();
}

async function blobPut(content) {
  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  const res = await fetch(`https://blob.vercel-storage.com/${USERS_BLOB}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-api-version': '7',
    },
    body: content,
  });
  if (!res.ok) throw new Error('Blob put failed: ' + await res.text());
}

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function hashPass(p) {
  let h = 0;
  for (let i = 0; i < p.length; i++) h = (Math.imul(31, h) + p.charCodeAt(i)) | 0;
  return h.toString(36);
}

function ok(res, data)           { return res.status(200).json(data); }
function err(res, msg, code=400) { return res.status(code).json({ error: msg }); }

async function getUsers() {
  try {
    const { blobs } = await blobList();
    if (!blobs || !blobs.length) return {};
    const token = process.env.BLOB_READ_WRITE_TOKEN || '';
    const res = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch (e) {
    console.error('getUsers error:', e.message);
    return {};
  }
}
async function saveUsers(users) {
  await blobPut(JSON.stringify(users));
}

async function ensureAdmin() {
  const users = await getUsers();
  if (!users.admin) {
    users.admin = {
      name: 'Jimmy T7', pass: hashPass('admin2024'),
      role: 'admin', status: 'active', dailyLimit: 999, submissions: []
    };
    try { await saveUsers(users); } catch (e) { console.error('ensureAdmin save error:', e.message); }
  }
  return users;
}

function verifyAdmin(users, adminUser, adminPassHash) {
  const u = users[adminUser];
  return u && u.role === 'admin' && u.status === 'active' && u.pass === adminPassHash;
}

function safe(users) {
  return Object.entries(users).map(([username, u]) => ({
    username, name: u.name, role: u.role,
    status: u.status, dailyLimit: u.dailyLimit,
    subCount: (u.submissions || []).length,
  }));
}

module.exports = async (req, res) => {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return err(res, 'Method Not Allowed', 405);

  // Kiểm tra Blob token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return err(res, 'Storage chưa cấu hình. Vào Vercel → Storage → Connect Blob store vào project.', 503);
  }

  let body;
  try { body = req.body || {}; } catch { body = {}; }

  try {
  const { action } = body;

  // ── REGISTER ────────────────────────────────────────────────
  if (action === 'register') {
    const { name, username, pass } = body;
    if (!name || !username || !pass) return err(res, 'Điền đầy đủ Tên, Username, Mật khẩu.');
    if (pass.length < 6) return err(res, 'Mật khẩu tối thiểu 6 ký tự.');
    if (/\s/.test(username)) return err(res, 'Username không có khoảng trắng.');

    const users = await ensureAdmin();
    if (users[username]) return err(res, 'Username đã tồn tại.');

    users[username] = {
      name, pass: hashPass(pass), role: 'user',
      status: 'pending', dailyLimit: 5, submissions: []
    };
    await saveUsers(users);
    return ok(res, { success: true, message: 'Đã gửi đăng ký. Vui lòng chờ admin duyệt.' });
  }

  // ── LOGIN ────────────────────────────────────────────────────
  if (action === 'login') {
    const { username, pass } = body;
    if (!username || !pass) return err(res, 'Thiếu username hoặc mật khẩu.');

    const users = await ensureAdmin();
    const user = users[username];
    if (!user || user.pass !== hashPass(pass)) return err(res, 'Sai tên đăng nhập hoặc mật khẩu.', 401);
    if (user.status === 'pending') return err(res, 'Tài khoản đang chờ admin duyệt. Liên hệ Jimmy T7.', 403);
    if (user.status !== 'active')  return err(res, 'Tài khoản bị khóa.', 403);

    return ok(res, {
      success: true,
      user: { name: user.name, role: user.role, dailyLimit: user.dailyLimit },
      passHash: hashPass(pass),
    });
  }

  // ── LIST (admin) ─────────────────────────────────────────────
  if (action === 'list') {
    const { adminUser, adminPassHash } = body;
    const users = await ensureAdmin();
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err(res, 'Không có quyền admin.', 403);
    return ok(res, { users: safe(users) });
  }

  // ── CREATE (admin) ───────────────────────────────────────────
  if (action === 'create') {
    const { adminUser, adminPassHash, name, username, pass, limit } = body;
    const users = await ensureAdmin();
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err(res, 'Không có quyền admin.', 403);
    if (!name || !username || !pass) return err(res, 'Thiếu thông tin.');
    if (pass.length < 6) return err(res, 'Mật khẩu tối thiểu 6 ký tự.');
    if (users[username]) return err(res, 'Username đã tồn tại.');

    users[username] = {
      name, pass: hashPass(pass), role: 'user',
      status: 'active', dailyLimit: parseInt(limit) || 5, submissions: []
    };
    await saveUsers(users);

    const payload = Buffer.from(JSON.stringify({ u: username, n: name, p: hashPass(pass), l: parseInt(limit)||5 })).toString('base64');
    return ok(res, { success: true, invitePayload: payload });
  }

  // ── APPROVE (admin) ──────────────────────────────────────────
  if (action === 'approve') {
    const { adminUser, adminPassHash, username } = body;
    const users = await ensureAdmin();
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err(res, 'Không có quyền admin.', 403);
    if (!users[username]) return err(res, 'User không tồn tại.');
    users[username].status = 'active';
    await saveUsers(users);
    return ok(res, { success: true });
  }

  // ── SET LIMIT (admin) ────────────────────────────────────────
  if (action === 'setlimit') {
    const { adminUser, adminPassHash, username, limit } = body;
    const users = await ensureAdmin();
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err(res, 'Không có quyền admin.', 403);
    if (!users[username]) return err(res, 'User không tồn tại.');
    users[username].dailyLimit = parseInt(limit) || 5;
    await saveUsers(users);
    return ok(res, { success: true });
  }

  // ── RESET PASSWORD (admin) ────────────────────────────────────
  if (action === 'resetpass') {
    const { adminUser, adminPassHash, username, newPass } = body;
    const users = await ensureAdmin();
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err(res, 'Không có quyền admin.', 403);
    if (!users[username]) return err(res, 'User không tồn tại.');
    if (!newPass || newPass.length < 6) return err(res, 'Mật khẩu mới tối thiểu 6 ký tự.');
    users[username].pass = hashPass(newPass);
    await saveUsers(users);
    return ok(res, { success: true });
  }

  // ── DELETE (admin) ────────────────────────────────────────────
  if (action === 'delete') {
    const { adminUser, adminPassHash, username } = body;
    const users = await ensureAdmin();
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err(res, 'Không có quyền admin.', 403);
    if (username === 'admin') return err(res, 'Không thể xóa tài khoản admin.');
    if (!users[username]) return err(res, 'User không tồn tại.');
    delete users[username];
    await saveUsers(users);
    return ok(res, { success: true });
  }

  return err(res, 'Unknown action');

  } catch (e) {
    console.error('users API crash:', e.message);
    return err(res, 'Lỗi server: ' + e.message, 500);
  }
};
