# CONTEXT — cập nhật: 20/05/2026 (session 10)

> File này anh Jimmy T7 cập nhật cuối mỗi session Claude Code.
> Claude Code đọc file này ĐẦU TIÊN để biết đang ở đâu.

## Trạng thái hiện tại: v2.0.0 — ĐANG DEPLOY (Netlify + GitHub)

Repo: `github.com/ngothaitinh/tpi-scorer` → Netlify auto-deploy mỗi lần push.
Provider LLM: **chiasegpu.vn** (OpenAI-compatible) qua universal proxy.
Đã nâng cấp lên **Rubric v2 AEO/GEO Edition** — 100đ rebalanced, 4 tiêu chí mới.

## ĐỊNH NGHĨA HOÀN THÀNH v2.0 (xong hết → NHẮC JIMMY mở track V3)
- [ ] Netlify build pass (đã fix submodule worktree — chờ xác nhận)
- [ ] Set 3 env var Netlify: `LLM_ENDPOINT`, `LLM_API_KEY`, `DAILY_CALL_LIMIT`
- [ ] Test proxy `/.netlify/functions/claude` trả JSON đúng
- [ ] Test chấm 1 bài thật — xác nhận v2 scoring + checklist chạy OK
- [ ] Đổi mật khẩu admin khỏi `admin2024` (user tự làm qua UI)
- [ ] (tùy chọn) gắn tên miền riêng

> ⏳ **V3 WordPress Plugin** đã lập kế hoạch (`docs/V3-WORDPRESS-PLUGIN.md`)
> nhưng ĐANG CHỜ. Khi 6 mục trên xong hết → NHẮC JIMMY bắt đầu track V3.

## Đang làm dở
- [ ] **CHƯA XÁC NHẬN**: `safeParseJSON` 4-stage pipeline có fix được "Unexpected token ')'" không — cần test với bài thật
- [ ] **Test v2 scoring + Checklist UX** với bài thật sau deploy — xác nhận A1/A2/A3, tooltip, mode badges

## Vừa xong (session 10 — 20/05/2026)
- [x] **V3 WordPress Plugin** — lập kế hoạch `docs/V3-WORDPRESS-PLUGIN.md` (track riêng, CHƯA code)
- [x] Push repo lên GitHub `ngothaitinh/tpi-scorer` + kết nối Netlify auto-deploy
- [x] Fix submodule worktree bị commit nhầm (`git rm --cached` + ignore `.claude/worktrees/`)
- [x] **Universal proxy** — `claude.js` hỗ trợ cả Anthropic native + OpenAI-compatible (chiasegpu.vn)
- [x] **Deploy infrastructure** — Netlify static + Function proxy
  - `netlify/functions/claude.js`: proxy Claude API, đọc `ANTHROPIC_API_KEY` từ env, soft daily counter
  - `netlify.toml`: publish=public, functions=netlify/functions, security headers
  - `callAnthropic()` → gọi `/.netlify/functions/claude` (bỏ `anthropic-dangerous-direct-browser-access`)
  - `callLLM()` → skip api_key check cho anthropic provider
  - `callClaude()` dead-code → redirect về `callAnthropic()`
  - Admin UI → ẩn api_key row khi provider=anthropic, hiện note "Server key ✓"
  - `testApiConfig()` → test qua proxy khi provider=anthropic
  - `submitArticle()` + `autoCheckWithAI()` → bỏ api_key guard cho anthropic
- [x] **Hash import** `#import=<encoded>` — nhận bài từ bookmarklet Elementor
  - DOMContentLoaded đọc hash → `window._pendingImport` → xóa hash khỏi URL
  - `enterApp()` gọi `_injectHashImport()` → điền contenteditable + switch Paste tab + toast
- [x] **Bookmarklet Elementor** — `docs/BOOKMARKLET.md`
  - Extract H1/H2/H3/H4/p/li/blockquote → markdown → `SCORER/#import=...`
  - Version auto-truncate 15000 ký tự cho bài dài

## Vừa xong (session 9 — 20/05/2026)
- [x] **Checklist UX A+B+C** — commit `bba920b` (3986 dòng, +220 lines)
  - **A (Tooltip)**: `tip: {m, g, b}` cho tất cả 43 items — rê chuột hiện meaning + ✓ good + ✗ bad
  - **B (Mode badges)**: `checkMode: 'auto'|'ai'|'manual'` — badge 🤖/🤝/👁 inline trước label
    - 🤖 auto = 20 items (tự động từ rubric scores)
    - 🤝 AI = 11 items (AI button kiểm tra)
    - 👁 manual = 12 items (tự review thủ công)
  - **C (Smart AI button)**: chỉ gửi items `checkMode='ai'` lên LLM → tiết kiệm ~60% token
  - `_clItemHtml()` helper — DRY render dùng chung CL page + ACL result tab
  - Note legend giải thích 3 modes inline cho user: "🤖 auto=từ rubric · 🤝 AI=nút này · 👁 manual=tự review"
  - CSS: `.cl-mode-badge`, `.cl-tt`, `.cl-tt-good`, `.cl-tt-bad`

## Vừa xong (session 8 — 19/05/2026)
- [x] **Refactor #1**: Dispatcher pattern `RULE_SCORERS` + evidence pass-through
  - Mỗi scorer trả về `{score, evidence}` — `generateRuleFixes` dùng lại, không scan lại
  - `scoreRules` chạy vòng lặp qua `RULE_SCORERS` object
- [x] **Refactor #2**: 2-column result layout + tab system
  - CSS grid: 290px sticky left (scorecard + actions) + 1fr scrollable right
  - 3 tabs: 🛠 Fix Cards / 📋 Checklist / 📊 Chi tiết
  - `switchResultTab`, `renderDetailTab` với tier breakdown
- [x] **Refactor #3**: LLM parallel calls — `Promise.allSettled([simple, complex])`
  - Latency giảm ~50%: max(3s, 5s) thay vì 3s + 5s tuần tự
  - I3 chuyển sang rule-only (không gọi LLM nữa)
- [x] **Refactor #4**: Cost dashboard + monthly quota
  - `calcCost(sub)` — ước tính VND từ token count, blended Haiku+Sonnet
  - `monthly_limit` config + `tpi_monthly_{user}_{YYYY-MM}` localStorage
  - Admin thấy cost/quota trong dashboard
- [x] **Refactor #5**: Rubric v2 AEO/GEO Edition — commit `10aaac7`
  - Tạo `src/rubric.tpi-v2.json` (AEO/GEO, T1=28/T2=28/T3=24/T4=20 = 100đ)
  - Thêm `_scoreA1` (Answer-First Paragraph, 4đ rule): đoạn sau H1 phải 40-70 từ
  - Thêm `_scoreA2` (FAQ Schema-Ready, 2đ rule): H3 FAQ answers ≤100 từ
  - Thêm `_scoreA3` (Definition Sentence, 2đ rule): `{entity} là ...` trong 1500 ký tự đầu
  - Thêm G1 vào `scoreLLMComplex` prompt (GEO Citable Chunk, 2đ LLM)
  - Cập nhật `CRITERION_NAMES`/`CRITERION_MAX` — total = 100đ ✓
  - Điều chỉnh caps: P2(4), P3(3), S3(4), S4(4), S6(2), I3(3)
  - Cập nhật `tierBreakdown`, `renderDetailTab`, `allScores` aggregation
  - Cập nhật LLM prompts: S2(max5), P1(max5), R1(max4)

## Vừa xong (session 7 — 19/05/2026)
- [x] **Fix cards — vị trí cụ thể**: `generateRuleFixes(ruleScores, parsed)` thêm param `parsed`
- [x] **Tooltip thuật ngữ SEO/GEO**: `linkTerms(text)` + mở rộng `TERM_TOOLTIPS`
- [x] Browser-tested: 3 fix cards OK, 6 tooltip spans đúng, location cụ thể

## Vừa xong (session 6 — 19/05/2026)
- [x] **Mức 1**: Auto-check checklist từ rubric scores — `autoCheckFromRubric()` + `RUBRIC_CL_MAP` constant
- [x] **Mức 2**: AI button trong checklist result — `autoCheckWithAI()`
- [x] Badge `🤖 auto`, DEV MODE xóa, CSS mới

## Vừa xong (session 5 — 17/05/2026)
- [x] P0: Fix P2/P3 bugs, Scorecard block, Severity tags, fix cards chia nhóm
- [x] `safeParseJSON()` 4-stage fallback, `CRITERION_NAMES`/`CRITERION_MAX` consts
- [x] Per-article checklist + confetti 100%

## Vừa xong (session 4 — 16/05/2026)
- [x] Fix fetch Google Docs, fix paste, admin limit bar, API Key & Model section

## Vừa xong (session 3 — 15/05/2026)
- [x] Font Be Vietnam Pro, 2-mode input (Paste + URL)

## Quyết định đã chốt — KHÔNG thay đổi nếu chưa hỏi Jimmy T7
- **Single-file HTML** — không tách JS/CSS, không dùng React/Vue
- **localStorage only** — không có backend, không có DB
- **Admin key mặc định**: `admin` / `admin2024` (đổi sau khi deploy)
- **skip_llm_threshold = 30** — rule < 30đ thì skip LLM tier 3+4
- **llm_mode**: `balanced` (Haiku+Sonnet) / `economy` (Haiku all) / `accurate` (Sonnet all)
- **Font**: Be Vietnam Pro
- **Content input**: 2 tab — Paste (contenteditable) + URL Fetch
- **DEV MODE đã xóa** — `checkSession()` đọc localStorage bình thường
- **Severity**: dựa trên deficit tuyệt đối — Critical ≥5, Major 3–4.99, Minor <3
- **Auto-check Mức 1**: rubric mapping (free) — threshold riêng cho từng criterion
- **Auto-check Mức 2**: AI button (Haiku, ~$0.002) — user click thủ công, không tự động
- **Rubric v2 AEO/GEO**: 4 tiêu chí mới (A1/A2/A3/G1), 100đ rebalanced — ĐANG DÙNG
- **LLM calls**: song song (`Promise.allSettled`) — ~50% latency
- **I3**: rule-only từ v2 — không gọi LLM cho AI cliché detection
- **Result layout**: 2-column grid, 3 tabs (Fixes/Checklist/Chi tiết)

## Số liệu hiện tại
- `public/index.html`: **4048 dòng** (main file — edits trực tiếp)
- `src/rubric.tpi-v2.json`: 28 tiêu chí (24 v1 + 4 mới), 100 điểm, pass = 70
- `src/rubric.tpi-v1.json`: frozen — không sửa
- Commits session 8: `10aaac7` (v2 rubric + 4 new criteria)
- Ước tính chi phí: ~530đ/bài (balanced), ~$0.007 (economy), ~$0.05 (accurate)

## Lưu ý quan trọng
- File chính: `C:\Users\ASUS\Desktop\tpi-scorer\public\index.html` (4048 dòng)
- KHÔNG sửa file worktree
- Server localhost:3000 đang serve đúng main file
- `RULE_SCORERS` (~line 1843): dispatcher object — A1/A2/A3 đã thêm vào
- `_scoreA1/A2/A3` (~line 1739): 3 scorer AEO/GEO mới
- `CRITERION_MAX` (~line 1926): v2 weights — total = 100đ
- `RUBRIC_CL_MAP` (~line 1947): 15 mappings criterion → checklist items
- `renderDetailTab` (~line 2535): tier breakdown v2 (T1=28/T2=28/T3=24/T4=20)
- `generateRuleFixes(ruleScores, parsed, evidence)` — 3 params
- `clData` (~line 3611): 43 items với tip + checkMode (auto/ai/manual)
- `_clItemHtml(item, done, isAuto, prefix, onChangeFn)` (~line 3903): DRY helper render 1 item
- `autoCheckWithAI` (~line 3385): smart filter — chỉ gửi `checkMode='ai'` items

## Backlog ưu tiên (từ docs/ROADMAP.md)
### Làm tiếp theo (P1) — DEPLOY CHECKLIST
1. **[ USER ]** Push repo lên GitHub
2. **[ USER ]** Connect GitHub → Netlify, build settings: publish=`public`, functions=`netlify/functions`
3. **[ USER ]** Netlify → Site settings → Environment variables → thêm `ANTHROPIC_API_KEY`
4. **[ USER ]** Anthropic Console → đặt spend limit tháng (ví dụ $10)
5. **[ USER ]** Đổi mật khẩu admin trong app UI sau khi deploy
6. **Test sau deploy** — chấm bài thật, xác nhận proxy hoạt động (không còn lỗi CORS/key)
7. **Test bookmarklet** — mở Elementor Preview, bấm bookmark → scorer mở với bài đã điền
8. Export báo cáo ra Markdown (P1 backlog tiếp theo)

### Sau đó (P2)
- Webhook Telegram sau khi chấm xong
- Thống kê điểm trung bình theo tuần (chart)
