# CONTEXT — cập nhật: 19/05/2026 (session 7)

> File này anh Jimmy T7 cập nhật cuối mỗi session Claude Code.
> Claude Code đọc file này ĐẦU TIÊN để biết đang ở đâu.

## Trạng thái hiện tại: v1.4.1-dev — CHƯA DEPLOY

App chạy được trên localhost:3000. Tất cả edits đang ở main file trực tiếp.

## Đang làm dở
- [ ] **Trước khi deploy**: đổi mật khẩu admin từ `admin2024` (qua UI Admin hoặc sửa initDB)
- [x] ~~Commit session 6+7~~ — đã commit `672e370` (v1.4.1)
- [ ] **CHƯA XÁC NHẬN**: `safeParseJSON` 4-stage pipeline có fix được "Unexpected token ')'" không — cần test với API key thật

## Vừa xong (session 7 — 19/05/2026)
- [x] **Fix cards — vị trí cụ thể**: `generateRuleFixes(ruleScores, parsed)` thêm param `parsed`
  - S6: tìm heading đầu tiên sau 70% bài → `Từ heading: "…" trở xuống` + % thực tế
  - P2: liệt kê từ do dự thực tế → `Ctrl+F: "khoảng" · "dự kiến"`
  - P3: liệt kê cụm chung chung thực tế
  - P5: tên heading sai viết hoa đầu tiên → `"pháp lý và tiến Độ thanh Toán"`
  - P8: heading gần nhất với câu dài đầu tiên
  - S3: text của H3 mồ côi đầu tiên
- [x] **Tooltip thuật ngữ SEO/GEO**: `linkTerms(text)` + mở rộng `TERM_TOOLTIPS`
  - Thêm entries: `Supplement`, `Main Content`, `Title Case`, `Entity`, `Heading`
  - Null-byte placeholder system: tránh nested replacement
  - `renderFixCard` dùng `linkTerms()` cho issue + suggestion text
- [x] Browser-tested: 3 fix cards OK, 6 tooltip spans đúng, location cụ thể

## Vừa xong (session 6 — 19/05/2026)
- [x] **Mức 1**: Auto-check checklist từ rubric scores — `autoCheckFromRubric()` + `RUBRIC_CL_MAP` constant
  - 15 mappings: S1→ms2, S2→ms1, S3→ms3+ms4, S4→ms11, S5→ms8+ms9, S6→ms15, P1→wc7+am5, P2→wc1+wc19, P4→wc21, P5→wc5, P7→wc13, P8→wc11, R1→am2, R6→ms6+wc15, I3→wc17
  - Khi `score/max >= threshold`: tự động tick checklist item, lưu vào `_auto` key riêng
  - Không ghi đè item đã manually checked
- [x] **Mức 2**: AI button trong checklist result — `autoCheckWithAI()`
  - Gọi Haiku với nội dung bài + danh sách unchecked items
  - Parse JSON array `[{id, pass}]`, tick items đạt
  - Cost: ~$0.002/lần, dùng khi cần xác nhận thêm
- [x] Badge `🤖 auto` hiển thị cạnh item được tự động tick
- [x] `_lastArticleText` global — lưu nội dung bài khi submit để AI button dùng
- [x] `getACLAutoKey`, `loadACLAuto`, `saveACLAuto` — separate storage cho auto-checked state
- [x] `resetACL` cũng xóa autoSet khi reset
- [x] CSS: `.acl-auto-tag`, `.cl-item.auto-checked`, `.acl-ai-row`, `.acl-ai-btn`, `.acl-ai-note`
- [x] DEV MODE đã xóa — `checkSession()` giờ đọc session từ localStorage bình thường

## Vừa xong (session 5 — 17/05/2026)
- [x] P0: Fix P2 hesitantWords — thêm `dự kiến`, `khoảng`, `ước tính`
- [x] P0: Fix P3 matchAll — đổi từ `indexOf` sang `matchAll` với regex escape
- [x] P1: Scorecard block ở đầu result — 4 tầng điểm + preflight status
- [x] P2: Severity tags (🔴 Critical / 🟡 Major / 🟢 Minor) cho fix card
- [x] P3: Chia fix cards: Critical Issues / Polish
- [x] P4: Hiển thị tên đầy đủ tiêu chí trong fix card
- [x] `CRITERION_NAMES` + `CRITERION_MAX` consts
- [x] `safeParseJSON()` helper — 4-stage fallback pipeline
- [x] Tạo test fixture: `tests/fixtures/the_metropolis.md`
- [x] **Per-article checklist** với tracking per-user × keyword × entity
- [x] Celebration effect (confetti) khi đạt 100% checklist
- [x] `acl_{user}|{kw}|{entity}` localStorage key

## Vừa xong (session 4 — 16/05/2026)
- [x] Fix fetch Google Docs: detect URL → convert sang `/pub` → fetch qua `corsproxy.io`
- [x] Fix paste không có định dạng: thay `execCommand('insertHTML')` bằng Range/Selection API
- [x] Admin limit bar: hiện số bài đã chấm (số to)
- [x] Thêm section "API Key & Model" trong trang Admin
- [x] `scoreLLMSimple` + `scoreLLMComplex` đọc `llm_mode` từ config để chọn model
- [x] Fix error message fetch URL

## Vừa xong (session 3 — 15/05/2026)
- [x] Đổi font sang Be Vietnam Pro
- [x] DEV MODE: bypass login, auto-login admin
- [x] Thêm 2-mode input: Paste (contenteditable) + URL Fetch

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

## Số liệu hiện tại
- `public/index.html`: **3360 dòng** (main file — edits trực tiếp)
- `src/rubric.tpi-v1.json`: 24 tiêu chí, 100 điểm, pass = 70
- Ước tính chi phí: ~530đ/bài (balanced), ~$0.007 (economy), ~$0.05 (accurate)

## Lưu ý quan trọng
- File chính: `C:\Users\ASUS\Desktop\tpi-scorer\public\index.html` (3360 dòng)
- KHÔNG sửa file worktree
- Server localhost:3000 đang serve đúng main file
- `RUBRIC_CL_MAP` (~line 1703): 15 mappings criterion → checklist items
- `autoCheckFromRubric` (~line 2783): Mức 1 logic
- `autoCheckWithAI` (~line 2806): Mức 2 AI button handler
- `_lastArticleText` global (~line 2875): lưu nội dung bài cho AI button
- `linkTerms(text)` (~line 1820): tooltip thuật ngữ SEO/GEO
- `generateRuleFixes(ruleScores, parsed)` — thêm param `parsed` để lấy location cụ thể

## Backlog ưu tiên (từ docs/ROADMAP.md)
### Làm tiếp theo (P1)
1. Đổi mật khẩu admin trong UI (trước khi deploy)
2. Export báo cáo ra Markdown
3. Hiển thị điểm chi tiết từng tiêu chí (accordion)
4. **Test AI button** với API key thật — Mức 2 + safeParseJSON

### Sau đó (P2)
- Webhook Telegram sau khi chấm xong
- Thống kê điểm trung bình theo tuần (chart)
