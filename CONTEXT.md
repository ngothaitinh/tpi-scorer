# CONTEXT — cập nhật: 29/05/2026 (session 18)

> File này anh Jimmy T7 cập nhật cuối mỗi session Claude Code.
> Claude Code đọc file này ĐẦU TIÊN để biết đang ở đâu.

## Trạng thái hiện tại: v3.0.0 — DEPLOYED to Vercel (GitHub: commit 469c734)

Repo: `github.com/ngothaitinh/tpi-scorer` → Vercel auto-deploy mỗi lần push.
Live: **https://tpi-scorer.vercel.app**
Provider LLM: **chiasegpu.vn** (OpenAI-compatible + Anthropic-compatible) qua `api/claude.js` proxy.
Đã nâng cấp lên **Rubric v3.0 E-E-A-T+HCU+GEO Edition** — 100đ, 6 tiêu chí mới (E1/E2/E3/G2/G3/HC1).

## ĐỊNH NGHĨA HOÀN THÀNH v3.0 (xong → thoải mái cho v3-wordpress-plugin)
- [x] Merge v3.0 feature branch → master + push Vercel (commit 77ba1ec)
- [x] Query Fan-out v2 — TPI Land Edition (commit 7ba4b32)
- [ ] **Test scoring v3.0** với bài thật — xác nhận E1/E2/E3/G2/G3/HC1 chấm đúng
- [ ] Test Query Fan-out v2: ≥10 branches, semantic chips, 2 nhóm query (SEO + NLP)
- [ ] Verify LLM proxy (`api/claude.js`) routing cả Anthropic + OpenAI endpoints
- [ ] Đổi mật khẩu admin khỏi `admin2024` trong app UI

## Đang làm dở
- [ ] **[ USER ] Admin setup Phase 1 Backup** — theo `docs/PHASE1-BACKUP-SETUP.md`:
  1. Tạo Google Sheet + Apps Script (6 bước)
  2. Set Vercel env `GSHEETS_WEBHOOK_URL`
  3. Test webhook từ Admin panel → kiểm tra Sheet
- [ ] **Phase 2 Analytics** — in-app Admin dashboard (chart.js), criterion fail tracking — TẠM NGƯNG, nhắc sau
- [ ] **Phase 3 Cloud sync** (optional) — Vercel KV dual-write — TẠM NGƯNG
- [ ] **Test QF v2** — nhập seed query thật, verify ≥10 branches + brief export
- [ ] **Test scoring v3.0** — chấm bài thật, xác nhận E1/E2/E3/G2/G3/HC1
- [ ] **Fix stale footer** `exportMarkdown()` — còn "Rubric v2.1" + URL Netlify cũ
- [ ] **(Tuỳ chọn)** Rubric v3 documentation page trong app

## Vừa xong (session 18 — 29/05/2026)
- [x] **user-guide.html — Gemini Gem section** (commit f575fda)
  - Section 1 updated: "2 công cụ" → "3 công cụ phối hợp" (thêm Gem row vào bảng)
  - Section 2 updated: bước 3-4 dẫn đến Gem, "📤 Brief cho Gem" + "📤 Sửa với Gem"
  - Section 5b mới (id="gem"): Viết bài với Gemini Gem
    - Link trực tiếp: gemini.google.com/u/2/gem/ce399149b789
    - 3-bước workflow (paste brief → paste 4 block data → Gem viết)
    - 4 document block templates cho exclusive TPI content:
      BẢNG GIÁ & THÔNG SỐ / SỐ LIỆU GIAO DỊCH / NAP cố định / PHÁP LÝ & ĐẶC ĐIỂM
    - Section 5b.3: hướng dẫn dùng "📤 Sửa với Gem"
- [x] **Phase 1 Backup & Webhook** (commit 469c734, 5980 dòng)
  - `api/log.js` (38 dòng) — Vercel proxy forward POST → `GSHEETS_WEBHOOK_URL`
  - `_logToSheet(type, payload)` — helper gọi /api/log (silent, không chặn UI)
  - Sau `saveSubmission()`: auto push submission lên Google Sheet (tiers + top5 summary)
  - `exportAllData()` — tải tpi-backup-YYYY-MM-DD.json (toàn bộ keys tpi_*)
  - `importAllData()` — restore merge từ file .json (confirm + reload)
  - Admin panel section mới: 💾 Backup & Restore (3 nút: Export/Import/Test Webhook)
  - `docs/PHASE1-BACKUP-SETUP.md` — 6-bước setup guide cho admin
- [x] **Đánh giá hệ thống** — review quy trình, SOP tối ưu, capacity estimate, khuyến nghị P0-P2

## Vừa xong (session 17 — 28/05/2026)
- [x] **Workflow QF → Gem → Scorer — Phase 1** (commit 1b89373)
  - `exportQFBriefForGem()` — tạo brief tối ưu cho Gemini Gem từ QF result
  - Button "📤 Brief cho Gem" (indigo) trong QF summary bar
  - File: `tpi-brief-gem-{entity}-{ts}.md` gồm: keyword table, top branch H2 gợi ý + SEO queries,
    semantic keywords, Hub & Spoke, Golden paragraphs, all fan-out queries,
    phần ⚠️ nhắc Gem hỏi thêm: data TPI độc quyền + quote + NAP
- [x] **Workflow QF → Gem → Scorer — Phase 2** (file Desktop)
  - `prompt-gem-v3.2.txt` — cập nhật Gemini Gem prompt
  - **Bỏ**: tự chấm rubric (bảng 4 tầng + checklist 21 mục) trong BƯỚC 3
  - **Thêm**: section [NHẬN BRIEF TỪ TPI SCORER] — đọc ⚠️, hỏi đúng 3 mục thiếu,
    dùng H2/keywords từ brief, không hỏi lại keyword đã có
  - **Cập nhật** tin nhắn mở đầu — gợi ý dùng "📤 Brief cho Gem" để tiết kiệm bước
  - **BƯỚC 3 mới**: chỉ check placeholder count → kết thúc bằng "paste lên Scorer"
- [x] **Workflow QF → Gem → Scorer — Phase 3** (commit 097415b)
  - `exportFixesForGem()` — tạo fix brief từ Scorer result cho Gemini Gem
  - Button "📤 Sửa với Gem" (indigo) trong result-actions panel (sau Export MD)
  - File: `tpi-fix-gem-{keyword}-{date}.md` gồm: score summary + tier breakdown + ⚠️ weak tiers,
    fix cards 🔴→🟡→🟢 (ID, điểm đạt, vị trí, vấn đề, cách sửa),
    top-8 losing criteria table, 6-step instructions cho Gem

## Vừa xong (session 16 — 28/05/2026)
- [x] **API key architecture** — user không nhập key, admin cấu hình 1 lần server-side (Vercel env vars)
  - Xóa tất cả api_key field khỏi user UI
  - `callProxy()` — single function gọi `/api/claude` proxy, server giữ key
  - `callLLM()` + `callAnthropic()` simplified → gọi `callProxy()`
  - Xóa guard api_key trong `submitArticle` + `autoCheckWithAI`
- [x] **QF model admin-once** (commit 352dc99) — admin nhập `qf_model` 1 lần, tất cả user dùng
  - Xóa `<details class="qf-api-config">` HTML block (per-user QF API config)
  - Xóa CSS `.qf-api-config` + `.qf-api-btn` + `.qf-api-row` (16 dòng)
  - Xóa JS: `_qfApiKey / loadQFApiConfig / saveQFApiConfig / testQFApiConfig / clearQFApiConfig / _updateQFApiStatus`
  - Thêm `qf_model` field vào admin panel (shared config)
  - `_callLLM_QF()` → đọc `apiCfg.qf_model` → `callProxy()`
  - `_renderQFModelBadge()` — hiện model badge cho user (read-only)
- [x] **Hash routing** — mỗi page có link riêng: `#submit`, `#history`, `#query`, `#aeo`, `#admin`
- [x] **rubric-guide.html** — tài liệu hướng dẫn chấm bài v3.0, font Poppins

## Vừa xong (session 15 — 27/05/2026)
- [x] **Query Fan-out v2 — TPI Land Edition** (commits 599f320 → 7ba4b32, 5060 dòng)
  - `TPI_BRAND` constant + `_tpiBrandContext()` — inject context thương hiệu vào mọi LLM call QF
  - (Per-user API config đã bị xóa ở session 16 — replaced bằng admin qf_model)
  - **Simplified Form** — 3 fields (seed, entity, context), bỏ radios journey/persona/type
  - **Prompt 3-layer**: brand context + NLP rules (≥10 từ/query) + 13-category BĐS framework
  - **2 nhóm query tách biệt**: `fan_out_queries` (SEO, 4-8 từ) + `user_questions` (NLP, ≥10 từ)
    - SEO hiện trên (🔍 cam/monospace), NLP hiện dưới (💬 xanh)
    - Backward compat: `b.fan_out_queries || b.queries || []`
  - **Intent tiếng Việt**: Thông tin / Thương mại / Điều hướng / Giao dịch
  - **Semantic Keywords section**: `core_entities` / `supporting_terms` / `action_modifiers` (chips)
  - **Copy all LSI button** — copy toàn bộ semantic keywords ra clipboard
  - **Advanced Settings**: intentSel, branchCount (10/15/20), kwCount (10/15/20)
  - **JSON Editor** — power-user sửa raw JSON rồi re-render không gọi AI
  - **QF History**: lưu 10 runs gần nhất per-user (`tpi_qf_hist_<user>`), show 5 chips
  - **Export Markdown** (📥 button) — `exportQFMarkdown()` tạo .md + trigger download
  - **Ctrl+Enter shortcut** — trigger runQueryFanout từ bất kỳ field nào
  - **Year enforcement** — inject `Năm hiện tại: ${currentYear}`, cấm dùng năm -1/-2
  - **Toast 'info' type** (xanh #3b82f6) — fix bug trước đó hiện màu xanh lá

## Vừa xong (session 14 — 27/05/2026)
- [x] **Debug LLM 405 error** — root cause: `api/claude.js` callOpenAICompat() double-append `/chat/completions`
- [x] **Support Anthropic models** via chiasegpu.vn `/messages` endpoint
  - Thêm `callAnthropicCompat()` parse Anthropic response format
  - Route model `ant/*` → `/messages`, others → `/chat/completions`
- [x] **Merge v3.0 feature branch** `claude/todo-implementation-ROAGz` → master
  - Rubric v3.0: 6 criteria mới (E1/E2/E3/G2/G3/HC1), loại S6/R6, rebalance 13 tiêu chí
  - Tiers v3.0: T1=27, T2=22, T3=24, T4=27 (= 100đ, pass=70)
  - Query Fan-out research page mới (UI base), Notes field enhancement
- [x] **Push master → Vercel** (commit 77ba1ec) — auto-deploy triggered

## Vừa xong (session 13 — 23/05/2026)
- [x] Tạo PR #1, resolve merge conflicts, fix Netlify deploy preview (external_node_modules)

## Vừa xong (session 12 — 21/05/2026)
- [x] Fix bug nghiêm trọng `_scoreSI2` đọc `parsed.plainText` undefined
- [x] `parseArticle`: ghi `h.pos` cho heading — fix `_scoreA1/A2`
- [x] LLM error tracking + banner cảnh báo + `_showToast()` dùng chung

## Vừa xong (session 11 — 20/05/2026)
- [x] Rubric v2.1 AEO/GEO+SI Edition — SI1 (4đ LLM) + SI2 (2đ Rule)

## Vừa xong (sessions 8-10)
- [x] Refactor 1-5: Dispatcher, 2-column layout, parallel LLM, cost dashboard, Rubric v2 AEO
- [x] GitHub push + Netlify auto-deploy + universal proxy + bookmarklet Elementor

## Quyết định đã chốt — KHÔNG thay đổi nếu chưa hỏi Jimmy T7
- **Single-file HTML** — không tách JS/CSS, không dùng React/Vue
- **localStorage only** cho user session
- **Vercel deployment** — `api/claude.js` proxy hỗ trợ cả Anthropic + OpenAI-compatible providers
- **Admin key mặc định**: `admin` / `admin2024` (đổi sau khi deploy)
- **skip_llm_threshold = 30** — rule < 30đ thì skip LLM tier 3+4
- **llm_mode**: `balanced` (Haiku+Sonnet) / `economy` (Haiku all) / `accurate` (Sonnet all)
- **Font**: Be Vietnam Pro
- **Content input**: 2 tab — Paste (contenteditable) + URL Fetch
- **Severity**: Critical ≥5, Major 3–4.99, Minor <3
- **Auto-check Mức 1**: rubric mapping (free) / Mức 2: AI button (Haiku, ~$0.002)
- **Rubric v3.0 E-E-A-T+HCU+GEO**: 28 tiêu chí, 100đ, pass=70 — ĐANG DÙNG
- **LLM calls**: song song `Promise.allSettled` — ~50% latency
- **I3**: rule-only — không gọi LLM cho AI cliché detection
- **Result layout**: 2-column grid, 3 tabs (Fixes/Checklist/Chi tiết)
- **QF v2**: Custom AI key riêng (tách biệt scoring), 2 nhóm query, 13-category BĐS framework
- **_callLLM_QF**: ant/* hoặc includes 'claude' → /messages, others → /chat/completions

## Số liệu hiện tại (v3.0 + QF v2 + Gem workflow + Phase 1 Backup)
- `public/index.html`: **5980 dòng** (main file — commit 469c734)
- `api/log.js`: 38 dòng (webhook proxy)
- `src/rubric.tpi-v3.json`: 28 tiêu chí (E1/E2/E3/G2/G3/HC1 mới), 100đ, pass=70
  - Loại bỏ: S6, R6 | Thêm: E1(4pt), E2(2pt), E3(2pt), G2(3pt), G3(2pt), HC1(3pt)
- Ước tính chi phí v3.0: ~540đ/bài (balanced), ~$0.008 (economy), ~$0.05 (accurate)

## Lưu ý quan trọng (v3.0 + QF v2 + Phase 1 Backup)
- **File chính**: `C:\Users\ASUS\Desktop\tpi-scorer\public\index.html` (5980 dòng)
- **KHÔNG sửa file worktree** — làm thẳng trên master
- **Rubric v3.0**: `src/rubric.tpi-v3.json` — loaded in-code, all criteria active
- **New scorers v3.0**: E1/E2/E3 (E-E-A-T), G2/G3 (GEO), HC1 (HCU) — trong `RULE_SCORERS`
- **Removed scorers**: S6, R6 — đã xóa khỏi `RULE_SCORERS`
- **LLM proxy**: `api/claude.js` — ant/* → /messages (Anthropic), others → /chat/completions
- **API key architecture**: server-side only (`ANTHROPIC_API_KEY` hoặc `LLM_ENDPOINT+LLM_API_KEY` trong Vercel env), user không nhập
- **callProxy()**: single function gọi `/api/claude` — tất cả LLM calls đi qua đây
- **QF model**: admin cấu hình `qf_model` 1 lần trong Admin panel (shared, tất cả user dùng)
- **QF v2 functions còn active**: `_tpiBrandContext`, `_callLLM_QF`, `_renderQFModelBadge`
- **QF history**: localStorage `tpi_qf_hist_<user>` — last 10 runs
- **QF JSON editor**: `openQFJsonEditor / closeQFJsonEditor / applyQFJsonEdit`
- **QF Markdown export**: `exportQFMarkdown()` — download .md file
- **QF Brief for Gem**: `exportQFBriefForGem()` — brief tối ưu Gem, file `tpi-brief-gem-*.md`
- **Scorer Fix for Gem**: `exportFixesForGem()` — fix brief từ result, file `tpi-fix-gem-*.md`
- **Gem prompt**: `C:\Users\ASUS\Desktop\prompt-gem-v3.2.txt` — v3.2 (bỏ self-QA, thêm brief handler)
- **Hash routing**: `#submit`, `#history`, `#query`, `#aeo`, `#admin` — mỗi page có link riêng
- **rubric-guide.html**: tài liệu hướng dẫn chấm bài, font Poppins
- **Backup webhook**: `api/log.js` → proxy tới `GSHEETS_WEBHOOK_URL` (Vercel env)
- **Backup UI**: Admin panel → 💾 Backup & Restore (Export/Import JSON + Test Webhook)
- **_logToSheet()**: silent push submission lên Google Sheet sau saveSubmission()
- **Setup guide**: `docs/PHASE1-BACKUP-SETUP.md` — 6 bước cho admin
- **user-guide.html**: 1306 dòng (Section 5b Gem workflow + 4 block data templates)
- **workflow-guide.html**: ~1050 dòng (user-facing 5-step guide)

## Backlog ưu tiên
### P0 — Admin setup (user action)
1. **[ USER ]** Set Vercel env vars: `LLM_ENDPOINT` + `LLM_API_KEY` + `GSHEETS_WEBHOOK_URL`
2. **[ USER ]** Setup Google Sheet + Apps Script theo `docs/PHASE1-BACKUP-SETUP.md`
3. **[ USER ]** Admin panel → Test Webhook → verify Sheet nhận row
4. **[ USER ]** Admin panel → API & Model → nhập `model` + `qf_model` → Test → Lưu
5. **[ USER ]** Test QF v2 với seed query thật → verify ≥10 branches
6. **[ USER ]** Chấm bài thật v3.0 → xác nhận E1/E2/E3/G2/G3/HC1
7. **[ USER ]** Đổi mật khẩu admin (`admin2024`) trong app UI
8. **[ USER ]** Test full workflow: QF → Brief cho Gem → viết → Scorer → Sửa với Gem

### P1 — Phase 2 Analytics + Stabilization (TẠM NGƯNG — nhắc sau)
- [ ] In-app Admin Analytics tab (chart.js CDN): avg score/tuần, top criterion fail, leaderboard
- [ ] Criterion fail tracking: parse allScores từ Sheet → tỷ lệ fail mỗi criterion
- [ ] Fix stale footer `exportMarkdown()` — "Rubric v2.1" → v3.0, Netlify → Vercel URL
- [ ] Rubric v3.0 in-app documentation page

### P2 — Next Track
- [ ] Webhook n8n/Telegram sau khi chấm xong
- [ ] Thống kê điểm trung bình theo tuần (chart)
- [ ] V3-WordPress-Plugin track (khi v3.0 stable)
