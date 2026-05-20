# CONTEXT — cập nhật: 17/05/2026 (session 5)

> File này anh Jimmy T7 cập nhật cuối mỗi session Claude Code.
> Claude Code đọc file này ĐẦU TIÊN để biết đang ở đâu.

## Trạng thái hiện tại: v1.3-dev — CHƯA DEPLOY

App chạy được trên localhost:3000. Tất cả edits đang ở main file trực tiếp.

## Đang làm dở
- [ ] **Trước khi deploy**: xóa DEV MODE bypass trong `checkSession()` (hiện đang auto-login admin)
- [ ] **Trước khi deploy**: đổi mật khẩu admin từ `admin2024`
- [ ] Commit code session 3+4+5
- [ ] **CHƯA XÁC NHẬN**: `safeParseJSON` 4-stage pipeline có fix được "Unexpected token ')'" không — cần test browser lại

## Vừa xong (session 5 — 17/05/2026)
- [x] P0: Fix P2 hesitantWords — thêm `dự kiến`, `khoảng`, `ước tính` vào danh sách
- [x] P0: Fix P3 matchAll — đổi từ `indexOf` (chỉ bắt 1 lần) sang `matchAll` với regex escape đúng
- [x] P1: Thêm Scorecard block ở đầu result — hiển thị 4 tầng điểm + preflight status
- [x] P2: Thêm Severity tags (🔴 Critical / 🟡 Major / 🟢 Minor) cho từng fix card
- [x] P3: Chia fix cards thành 2 nhóm: Critical Issues / Polish
- [x] P4: Hiển thị tên đầy đủ tiêu chí cạnh criterion ID trong fix card
- [x] Thêm `CRITERION_NAMES` + `CRITERION_MAX` consts (~line 1357)
- [x] Thêm `safeParseJSON()` helper — 4-stage fallback pipeline cho LLM JSON lỗi
- [x] Fix `scoreLLMSimple` + `scoreLLMComplex`: dùng `safeParseJSON` thay `JSON.parse`
- [x] Update `renderResult` signature: thêm param `allScores` (4th)
- [x] Update `submitArticle`: truyền `allScores` vào `renderResult`
- [x] Thêm CSS: `.scorecard-block`, `.fix-sev-tag`, `.sev-critical/major/minor`, `.fixes-group-title`
- [x] Tạo test fixture: `tests/fixtures/the_metropolis.md`

## Vừa xong (session 4 — 16/05/2026)
- [x] Fix fetch Google Docs: detect URL → convert sang `/pub` → fetch qua `corsproxy.io`
- [x] Fix paste không có định dạng: thay `execCommand('insertHTML')` bằng Range/Selection API
- [x] Admin limit bar: hiện số bài đã chấm (số to) thay vì 999 chấm tròn
- [x] Thêm section "API Key & Model" trong trang Admin:
  - Nhập/lưu API key với nút 👁 show/hide
  - Dropdown chọn model: Cân bằng / Tiết kiệm / Chính xác
- [x] `scoreLLMSimple` + `scoreLLMComplex` đọc `llm_mode` từ config để chọn model
- [x] Fix error message fetch URL: chặn Google Docs/mạng xã hội với hướng dẫn rõ

## Vừa xong (session 3 — 15/05/2026)
- [x] Đổi font sang **Be Vietnam Pro** — tối ưu tiếng Việt
- [x] DEV MODE: bypass login, auto-login admin
- [x] Thêm 2-mode input: Paste (contenteditable) + URL Fetch
- [x] `sanitizePaste()` — fix bold khi dán từ Google Docs
- [x] Fix `parseArticle()` word count dùng `textContent`

## Vừa xong (session 2 — 14/05/2026)
- [x] Fix bug tiếng Việt IME
- [x] `git init` repo

## Vừa xong (session 1 — 14/05/2026)
- [x] Build full app: auth + rate limit + scoring + admin panel

## Quyết định đã chốt — KHÔNG thay đổi nếu chưa hỏi Jimmy T7
- **Single-file HTML** — không tách JS/CSS, không dùng React/Vue
- **localStorage only** — không có backend, không có DB
- **Admin key mặc định**: `admin` / `admin2024` (đổi sau khi deploy)
- **skip_llm_threshold = 30** — rule < 30đ thì skip LLM tier 3+4
- **llm_mode**: `balanced` (Haiku+Sonnet) / `economy` (Haiku all) / `accurate` (Sonnet all) — lưu trong config
- **Font**: Be Vietnam Pro — không dùng Lora/Syne nữa
- **Content input**: 2 tab — Paste (contenteditable) + URL Fetch
- **Google Docs fetch**: qua corsproxy.io, doc phải Publish to web trước
- **DEV MODE hiện bật** — nhớ TẮT trước khi deploy
- **Severity**: dựa trên deficit tuyệt đối — Critical ≥5, Major 3–4.99, Minor <3 (không phụ thuộc loại tiêu chí)

## Số liệu hiện tại
- `public/index.html`: **2058 dòng** (main file — edits trực tiếp, không qua worktree)
- `src/rubric.tpi-v1.json`: 24 tiêu chí, 100 điểm, pass = 70
- Ước tính chi phí: ~530đ/bài (balanced), ~$0.007 (economy), ~$0.05 (accurate)

## Lưu ý quan trọng
- Các edit trong session 3/4/5 đã vào thẳng `C:\Users\ASUS\Desktop\tpi-scorer\public\index.html` (main)
- Worktree file (`priceless-tu-20b2b5/public/index.html`) — KHÔNG dùng file worktree
- Server localhost:3000 đang serve đúng main file
- `safeParseJSON` (~line 1370): 4-stage fallback — JSON.parse → sanitize newlines → fix JS syntax → Function eval

## Backlog ưu tiên (từ docs/ROADMAP.md)
### Làm tiếp theo (P1)
1. **Test browser** bài The Metropolis — xác nhận `safeParseJSON` fix "Unexpected token ')'"
2. **Xóa DEV MODE** trước khi deploy
3. Đổi mật khẩu admin trong UI
4. Export báo cáo ra Markdown
5. Hiển thị điểm chi tiết từng tiêu chí (accordion)

### Sau đó (P2)
- Webhook Telegram sau khi chấm xong
- Thống kê điểm trung bình theo tuần (chart)

## Biết trước khi sửa code
- Sửa file: `C:\Users\ASUS\Desktop\tpi-scorer\public\index.html` (main, 2058 dòng)
- KHÔNG sửa file worktree
- Rubric trong `src/rubric.tpi-v1.json` — không sửa trực tiếp
- DEV MODE hiện bật — nhớ TẮT trước deploy
- `CRITERION_NAMES` + `CRITERION_MAX` consts nằm cạnh nhau ~line 1357 (inline const, không đọc từ JSON)
