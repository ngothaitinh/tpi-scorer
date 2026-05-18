# CONTEXT — cập nhật: 14/05/2026 (session 3)

> File này anh Jimmy T7 cập nhật cuối mỗi session Claude Code.
> Claude Code đọc file này ĐẦU TIÊN để biết đang ở đâu.

## Trạng thái hiện tại: v1.1 — PRODUCTION READY

App đã hoàn chỉnh, chạy được, chưa deploy.

## Đang làm dở
- [ ] Commit đầu tiên chờ anh cấu hình git identity:
  ```
  git config --global user.email "ngothaitinh852@gmail.com"
  git config --global user.name "Jimmy T7"
  git commit -m "v1.1 — multi-provider LLM + Google Docs fetch"
  ```

## Vừa xong (session 4 — 15/05/2026)
- [x] Fix Google Docs fetch: chuyển sang Google Docs API v1 (`docs.googleapis.com/v1/documents/{id}?key=...`)
  - Tránh CORS + Drive Export block
  - Admin cần enable "Google Docs API" (không phải Drive API) tại GCP
  - localStorage key: `tpi_docs_api_key`

## Vừa xong (session 3 — 14/05/2026)
- [x] Fix giao diện admin limit bar (không còn render 999 chấm)
- [x] Shared API key: chỉ admin cấu hình, user không thấy
- [x] Multi-provider LLM: Anthropic / Google Gemini / OpenAI / Custom (OpenAI-compatible)
- [x] Font tiếng Việt: đổi sang `Be Vietnam Pro` (full diacritic support)
- [x] Tạo demo account: `demo1` / `tinh1`
- [x] Custom provider support cho `https://llm.chiasegpu.vn/v1`
- [x] Google Docs fetch: admin nhập Drive API key, user paste URL → nội dung tự điền vào textarea

## Vừa xong (session 2 — 14/05/2026)
- [x] Fix bug tiếng Việt IME: thêm `e.isComposing || e.keyCode === 229` vào global keydown handler
- [x] `git init` repo thành công — commit chờ anh set user identity

## Vừa xong (session 1 — 14/05/2026)
- [x] Build full app: auth + rate limit + scoring + admin panel
- [x] Tạo project structure cho Claude Code
- [x] Thêm Function Index vào index.html
- [x] Tạo CONTEXT.md, cập nhật CLAUDE.md

## Quyết định đã chốt — KHÔNG thay đổi nếu chưa hỏi Jimmy T7
- **Single-file HTML** — không tách JS/CSS, không dùng React/Vue
- **localStorage only** — không có backend, không có DB
- **Admin key mặc định**: `admin` / `admin2024` (đổi sau khi deploy)
- **skip_llm_threshold = 30** — rule < 30đ thì skip LLM tier 3+4
- **Shared API key** — admin set 1 key, user không cần nhập (đổi so với v1.0)
- **Multi-provider**: Anthropic (default), Google, OpenAI, Custom — admin chọn
- **Google Docs fetch** dùng Drive API v3 export (cần doc share "Anyone with link")

## Số liệu hiện tại
- `public/index.html`: 1637 dòng, ~70KB
- `src/rubric.tpi-v1.json`: 24 tiêu chí, 100 điểm, pass = 70
- Ước tính chi phí: ~530đ/bài trung bình (Anthropic), thấp hơn nếu dùng Gemini/Custom

## localStorage keys mới (session 3)
- `tpi_provider_admin` — provider đang dùng ('anthropic'|'google'|'openai'|'custom')
- `tpi_apikey_admin` — shared LLM API key (thay `tpi_apikey_{user}`)
- `tpi_custom_url` — base URL custom provider
- `tpi_custom_model` — model name custom provider
- `tpi_google_drive_key` — Drive API key để fetch Google Docs

## Backlog ưu tiên (từ docs/ROADMAP.md)
### Làm tiếp theo (P1)
1. Đổi mật khẩu admin trong UI
2. Export báo cáo ra Markdown
3. Hiển thị điểm chi tiết từng tiêu chí (accordion)
4. Thêm trường "Ghi chú" khi nộp bài

### Sau đó (P2)
- Webhook Telegram sau khi chấm xong
- Thống kê điểm trung bình theo tuần (chart)

## Biết trước khi sửa code
- Toàn bộ app trong `public/index.html` — chỉ sửa file này
- Rubric trong `src/rubric.tpi-v1.json` — không sửa trực tiếp, tạo v2 nếu cần
- Dùng Function Index (đầu `<script>`) để tìm hàm nhanh
- Test sau khi sửa: `node -e "require('fs').readFileSync('public/index.html','utf8')" && echo OK`
- Google Docs fetch yêu cầu doc được share "Anyone with the link can view"
