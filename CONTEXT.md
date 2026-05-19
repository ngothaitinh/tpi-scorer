# CONTEXT — cập nhật: 19/05/2026 (session 8)

> File này anh Jimmy T7 cập nhật cuối mỗi session Claude Code.
> Claude Code đọc file này ĐẦU TIÊN để biết đang ở đâu.

## Trạng thái hiện tại: v2.0.0-dev — CHƯA DEPLOY

App chạy được trên localhost:3000. Tất cả edits đang ở main file trực tiếp.
Đã nâng cấp lên **Rubric v2 AEO/GEO Edition** — 100đ rebalanced, 4 tiêu chí mới.

## Đang làm dở
- [ ] **Trước khi deploy**: đổi mật khẩu admin từ `admin2024` (qua UI Admin hoặc sửa initDB)
- [ ] **CHƯA XÁC NHẬN**: `safeParseJSON` 4-stage pipeline có fix được "Unexpected token ')'" không — cần test với API key thật
- [ ] **Test v2 scoring** với bài thật — kiểm tra A1/A2/A3 hoạt động đúng trên browser

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
- `public/index.html`: **3766 dòng** (main file — edits trực tiếp)
- `src/rubric.tpi-v2.json`: 28 tiêu chí (24 v1 + 4 mới), 100 điểm, pass = 70
- `src/rubric.tpi-v1.json`: frozen — không sửa
- Commits session 8: `10aaac7` (v2 rubric + 4 new criteria)
- Ước tính chi phí: ~530đ/bài (balanced), ~$0.007 (economy), ~$0.05 (accurate)

## Lưu ý quan trọng
- File chính: `C:\Users\ASUS\Desktop\tpi-scorer\public\index.html` (3766 dòng)
- KHÔNG sửa file worktree
- Server localhost:3000 đang serve đúng main file
- `RULE_SCORERS` (~line 1843): dispatcher object — A1/A2/A3 đã thêm vào
- `_scoreA1/A2/A3` (~line 1739): 3 scorer AEO/GEO mới
- `CRITERION_MAX` (~line 1926): v2 weights — total = 100đ
- `RUBRIC_CL_MAP` (~line 1875): 15 mappings criterion → checklist items
- `renderDetailTab` (~line 2535): tier breakdown v2 (T1=28/T2=28/T3=24/T4=20)
- `generateRuleFixes(ruleScores, parsed, evidence)` — 3 params

## Backlog ưu tiên (từ docs/ROADMAP.md)
### Làm tiếp theo (P1)
1. **Test v2 scoring** với bài The Metropolis — xác nhận A1/A2/A3 hoạt động đúng
2. Đổi mật khẩu admin trong UI (trước khi deploy)
3. Export báo cáo ra Markdown
4. **Test AI button** với API key thật — Mức 2 + safeParseJSON

### Sau đó (P2)
- Webhook Telegram sau khi chấm xong
- Thống kê điểm trung bình theo tuần (chart)
