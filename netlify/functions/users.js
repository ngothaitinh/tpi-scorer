// Netlify Function — User Management API
// Dùng Netlify Blobs làm persistent storage (có sẵn, không cần setup)
//
// Actions:
//   register   POST { name, username, pass }
//   login      POST { username, pass }
//   list       POST { adminUser, adminPassHash }          ← admin only
//   create     POST { adminUser, adminPassHash, name, username, pass, limit }
//   approve    POST { adminUser, adminPassHash, username }
//   setlimit   POST { adminUser, adminPassHash, username, limit }
//   resetpass  POST { adminUser, adminPassHash, username, newPass }
//   delete     POST { adminUser, adminPassHash, username }

const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Cùng thuật toán hash với client (frontend) để khớp
function hashPass(p) {
  let h = 0;
  for (let i = 0; i < p.length; i++) h = (Math.imul(31, h) + p.charCodeAt(i)) | 0;
  return h.toString(36);
}

function ok(data)           { return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }; }
function err(msg, code=400) { return { statusCode: code, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: msg }) }; }

async function getUsers(store) {
  try { return (await store.get('users', { type: 'json' })) || {}; }
  catch { return {}; }
}
async function saveUsers(store, users) { await store.setJSON('users', users); }

// Seed admin nếu chưa có user nào
async function ensureAdmin(store) {
  const users = await getUsers(store);
  if (!users.admin) {
    users.admin = {
      name: 'Jimmy T7', pass: hashPass('admin2024'),
      role: 'admin', status: 'active', dailyLimit: 999, submissions: []
    };
    await saveUsers(store, users);
  }
  return users;
}

// Xác thực admin
function verifyAdmin(users, adminUser, adminPassHash) {
  const u = users[adminUser];
  return u && u.role === 'admin' && u.status === 'active' && u.pass === adminPassHash;
}

// Lọc pass trước khi trả về client
function safe(users) {
  return Object.entries(users).map(([username, u]) => ({
    username, name: u.name, role: u.role,
    status: u.status, dailyLimit: u.dailyLimit,
    subCount: (u.submissions || []).length,
  }));
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST')    return err('Method Not Allowed', 405);

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return err('Invalid JSON'); }

  const store = getStore('tpi-users');
  const { action } = body;

  // ── REGISTER ────────────────────────────────────────────────
  if (action === 'register') {
    const { name, username, pass } = body;
    if (!name || !username || !pass) return err('Điền đầy đủ Tên, Username, Mật khẩu.');
    if (pass.length < 6) return err('Mật khẩu tối thiểu 6 ký tự.');
    if (/\s/.test(username)) return err('Username không có khoảng trắng.');

    const users = await ensureAdmin(store);
    if (users[username]) return err('Username đã tồn tại.');

    users[username] = {
      name, pass: hashPass(pass), role: 'user',
      status: 'pending', dailyLimit: 5, submissions: []
    };
    await saveUsers(store, users);
    return ok({ success: true, message: 'Đã gửi đăng ký. Vui lòng chờ admin duyệt.' });
  }

  // ── LOGIN ────────────────────────────────────────────────────
  if (action === 'login') {
    const { username, pass } = body;
    if (!username || !pass) return err('Thiếu username hoặc mật khẩu.');

    const users = await ensureAdmin(store);
    const user = users[username];
    if (!user || user.pass !== hashPass(pass)) return err('Sai tên đăng nhập hoặc mật khẩu.', 401);
    if (user.status === 'pending') return err('Tài khoản đang chờ admin duyệt. Liên hệ Jimmy T7.', 403);
    if (user.status !== 'active')  return err('Tài khoản bị khóa.', 403);

    return ok({
      success: true,
      user: { name: user.name, role: user.role, dailyLimit: user.dailyLimit },
      passHash: hashPass(pass), // trả về để client dùng cho admin calls
    });
  }

  // ── LIST (admin) ─────────────────────────────────────────────
  if (action === 'list') {
    const { adminUser, adminPassHash } = body;
    const users = await ensureAdmin(store);
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err('Không có quyền admin.', 403);
    return ok({ users: safe(users) });
  }

  // ── CREATE (admin) ───────────────────────────────────────────
  if (action === 'create') {
    const { adminUser, adminPassHash, name, username, pass, limit } = body;
    const users = await ensureAdmin(store);
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err('Không có quyền admin.', 403);
    if (!name || !username || !pass) return err('Thiếu thông tin.');
    if (pass.length < 6) return err('Mật khẩu tối thiểu 6 ký tự.');
    if (users[username]) return err('Username đã tồn tại.');

    users[username] = {
      name, pass: hashPass(pass), role: 'user',
      status: 'active', dailyLimit: parseInt(limit) || 5, submissions: []
    };
    await saveUsers(store, users);

    // Sinh invite payload
    const payload = Buffer.from(JSON.stringify({ u: username, n: name, p: hashPass(pass), l: parseInt(limit)||5 })).toString('base64');
    return ok({ success: true, invitePayload: payload });
  }

  // ── APPROVE (admin) ──────────────────────────────────────────
  if (action === 'approve') {
    const { adminUser, adminPassHash, username } = body;
    const users = await ensureAdmin(store);
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err('Không có quyền admin.', 403);
    if (!users[username]) return err('User không tồn tại.');

    users[username].status = 'active';
    await saveUsers(store, users);
    return ok({ success: true });
  }

  // ── SET LIMIT (admin) ────────────────────────────────────────
  if (action === 'setlimit') {
    const { adminUser, adminPassHash, username, limit } = body;
    const users = await ensureAdmin(store);
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err('Không có quyền admin.', 403);
    if (!users[username]) return err('User không tồn tại.');

    users[username].dailyLimit = parseInt(limit) || 5;
    await saveUsers(store, users);
    return ok({ success: true });
  }

  // ── RESET PASSWORD (admin) ────────────────────────────────────
  if (action === 'resetpass') {
    const { adminUser, adminPassHash, username, newPass } = body;
    const users = await ensureAdmin(store);
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err('Không có quyền admin.', 403);
    if (!users[username]) return err('User không tồn tại.');
    if (!newPass || newPass.length < 6) return err('Mật khẩu mới tối thiểu 6 ký tự.');

    users[username].pass = hashPass(newPass);
    await saveUsers(store, users);
    return ok({ success: true });
  }

  // ── DELETE (admin) ────────────────────────────────────────────
  if (action === 'delete') {
    const { adminUser, adminPassHash, username } = body;
    const users = await ensureAdmin(store);
    if (!verifyAdmin(users, adminUser, adminPassHash)) return err('Không có quyền admin.', 403);
    if (username === 'admin') return err('Không thể xóa tài khoản admin.');
    if (!users[username]) return err('User không tồn tại.');

    delete users[username];
    await saveUsers(store, users);
    return ok({ success: true });
  }

  return err('Unknown action');
};
