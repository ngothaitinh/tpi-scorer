# CONTEXT — cập nhật: 29/05/2026 (session 18)

> File này anh Jimmy T7 cập nhật cuối mỗi session Claude Code.
> Claude Code đọc file này ĐẦU TIÊN để biết đang ở đâu.

## Trạng thái hiện tại: v3.0.0 — DEPLOYED to Vercel (GitHub: commit dd9d8d3)

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
- [ ] **VERIFICATION PROTOCOL** (P0 — blocking mọi feature mới) — xem backlog P0 dưới
- [ ] **Quick Polish Pack** (P1 — code) — fix exportMarkdown footer, in-app rubric docs,
  TPI_BLOCK_TEMPLATES constants, Brief Preview, auto-update CONTEXT.md
- [ ] **Phase 2 Analytics** (P2 — cần Phase 1 setup xong + ≥10 bài data)
- [ ] **Cluster Tracker** (P3 — build trên Pillar/Spoke vừa làm)

## Vừa xong (session 18 — 29/05/2026 — phần 2)
- [x] **Pillar + per-branch Spoke briefs** (commit dd9d8d3, 6223 dòng)
  - Pillar Brief (top button "📤 Brief Pillar (Top 5)"): Section 3 đổi từ
    "1 nhánh trọng tâm" → "Top 5 branches = 5 H2 outline" (mỗi branch H3 từ user_q + SEO queries)
  - Spoke Brief (`exportQFBranchBrief(idx)` — mới): mỗi branch có nút indigo riêng
    dưới priority badge → outline = user_questions của branch đó
  - Auto-gen URL pillar slug để Gem link UP
  - Internal Link Strategy section: 1 link UP pillar + 1-2 chéo spoke
  - Lọc golden paragraphs match queries của branch
  - 2 mục tiêu khác nhau: Pillar 2.500-4.000 từ vs Spoke 1.500-2.500 từ
- [x] **Brief content upgrade — anti-halu + AEO directives** (commit 0dded19, 6057 dòng)
  - Brief mới 10 sections (cũ 7): Section 2 (context 4 trục từ qf-context),
    Section 8 (11 AEO/GEO directives + criterion ID), Section 9 (chống halu —
    source tag mandatory + self-check), Section 10 (4 block data code templates)
  - Lưu `window._qfLastContext` để brief đọc lại
- [x] **prompt-gem-v3.3.txt** (file Desktop, 343 dòng từ 239 v3.2)
  - Nguyên tắc số 1: chống halu cứng hơn — source tag bắt buộc, self-check 3 phase
  - Cấm thêm: "khoảng/ước tính/tầm/xấp xỉ" cho số chính
  - Cấm trích "theo nghiên cứu/chuyên gia" không tên + năm
  - Section mới [NHẬN FIX BRIEF] — xử lý fix workflow Scorer → Gem
  - Mandatory Elements rõ hơn: Byline E2+E3 (4đ rẻ), Definition sentence pattern,
    ≥3 Citable Chunks, FAQ schema-ready câu hỏi đầy đủ
  - Section mới [NGÔN NGỮ — SÚC TÍCH]: 7 nguyên tắc (1 câu = 1 ý, ≤25 từ,
    bỏ filler "đáng chú ý/cần lưu ý", bố cục ngược tháp, cắt từ thừa)
- [x] **workflow-guide.html review + 8 fixes** (commits e11237b, 84920d7)
  - QF example: Thanh Phú Centre Point thay cho condotel Vũng Tàu mơ hồ
  - Context field hướng dẫn 4 trục: Persona / Journey Stage / Micro-Intent / Related Entities
  - Score table 70-84: "Đạt — ưu tiên sửa Tầng yếu nhất, nếu deadline → publish được"
  - Bước 2.5 mới: 4 block tài liệu TPI với color-coded cards + link sang user-guide.html#gem
  - FAQ Tầng 4 sửa đúng: liệt kê E1/E2/I1/I2/G2 thay vì gợi ý chung
  - Bước 5: thêm giới hạn 2 vòng sửa (vòng 3 → viết lại từ Bước 1)
  - Thêm callout "Không có brief?" — 5 mục Gem cần
  - Timeline mẫu 20-25 phút từ keyword đến publish
  - Tip công cụ nâng cao QF: branch count, kw count, intent filter, JSON Editor, Copy all LSI

## Vừa xong (session 18 — 29/05/2026 — phần 1)
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

## Số liệu hiện tại (v3.0 + Pillar/Spoke briefs + anti-halu + Phase 1 Backup)
- `public/index.html`: **6223 dòng** (main file — commit dd9d8d3)
- `public/workflow-guide.html`: 902 dòng (Pillar/Spoke workflow + 4 block + timeline)
- `api/log.js`: 38 dòng (webhook proxy)
- `prompt-gem-v3.3.txt`: 343 dòng (Desktop) — anti-halu mạnh + concise rules
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
- **QF Pillar Brief**: `exportQFBriefForGem()` — Top 5 branches = 5 H2, file `tpi-brief-gem-*.md`
- **QF Spoke Brief**: `exportQFBranchBrief(idx)` — per-branch, file `tpi-spoke-*.md`
- **Scorer Fix for Gem**: `exportFixesForGem()` — fix brief từ result, file `tpi-fix-gem-*.md`
- **Brief content**: 10 sections (context 4 trục + 11 AEO directives + chống halu + 4 block data templates)
- **Per-branch button**: nằm dưới priority badge mỗi branch card (indigo)
- **Gem prompt**: `C:\Users\ASUS\Desktop\prompt-gem-v3.3.txt` — v3.3 (anti-halu mạnh, source tag, concise rules)
- **Hash routing**: `#submit`, `#history`, `#query`, `#aeo`, `#admin` — mỗi page có link riêng
- **rubric-guide.html**: tài liệu hướng dẫn chấm bài, font Poppins
- **Backup webhook**: `api/log.js` → proxy tới `GSHEETS_WEBHOOK_URL` (Vercel env)
- **Backup UI**: Admin panel → 💾 Backup & Restore (Export/Import JSON + Test Webhook)
- **_logToSheet()**: silent push submission lên Google Sheet sau saveSubmission()
- **Setup guide**: `docs/PHASE1-BACKUP-SETUP.md` — 6 bước cho admin
- **user-guide.html**: 1306 dòng (Section 5b Gem workflow + 4 block data templates)
- **workflow-guide.html**: ~1050 dòng (user-facing 5-step guide)

## Backlog ưu tiên
### P0 — VERIFICATION PROTOCOL (chưa làm — quan trọng nhất)
**Toàn bộ feature 3 session qua chưa test với bài thật. Trước khi build thêm, phải:**
1. **[ USER ]** Paste `prompt-gem-v3.3.txt` lên Gem dashboard
2. **[ USER ]** Set Vercel env: `LLM_ENDPOINT` + `LLM_API_KEY` + `GSHEETS_WEBHOOK_URL`
3. **[ USER ]** Setup Google Sheet + Apps Script theo `docs/PHASE1-BACKUP-SETUP.md`
4. **[ USER ]** Đổi mật khẩu admin khỏi `admin2024`
5. **[ USER ]** Chạy 1 bài thật end-to-end: QF Thanh Phú Centre Point →
   Pillar Brief → Gem viết → Scorer chấm → verify E1/E2/E3/G2/G3/HC1 hiển thị đúng
6. **[ USER ]** Test Spoke Brief: chọn 1 branch → nút "📤 Brief cho Gem" dưới badge
   → Gem viết spoke 1.500 từ → chấm
7. **[ USER ]** Test Phase 1 webhook: Admin → Test Webhook → kiểm tra Google Sheet
8. **[ USER ]** Test fix workflow: chấm bài thiếu data → Sửa với Gem → chấm lại

### P1 — Quick Polish Pack (1 buổi code, sau khi P0 done)
- [ ] Fix stale footer `exportMarkdown()` — "Rubric v2.1" → v3.0, Netlify → Vercel URL
- [ ] Rubric v3.0 in-app documentation page
- [ ] Constants `TPI_BLOCK_TEMPLATES` — gom 4 block 1 chỗ (đỡ sửa 4 file)
- [ ] Brief Preview tool — admin xem brief mẫu không cần chạy QF
- [ ] Auto-update CONTEXT.md từ git log (bớt sửa tay)

### P2 — Phase 2 Analytics (1 tuần, cần Phase 1 setup + ≥10 bài data)
- [ ] In-app Admin Analytics tab (chart.js CDN): avg score/tuần, top criterion fail, leaderboard
- [ ] Criterion fail tracking: parse allScores từ Sheet → tỷ lệ fail mỗi criterion
- [ ] Trend chart 4 tuần

### P3 — Cluster Tracker (1 tuần, build trên Pillar/Spoke)
- [ ] Cluster Map visual: 1 pillar + 5 spokes, tick xanh khi publish
- [ ] Cluster status table cho admin
- [ ] Next Spoke Suggestion (auto-rank)
- [ ] Spoke→Pillar link checker

### P4 — Next Track
- [ ] Webhook n8n/Telegram sau khi chấm xong
- [ ] Thống kê điểm trung bình theo tuần (chart)
- [ ] V3-WordPress-Plugin track (khi v3.0 stable)
