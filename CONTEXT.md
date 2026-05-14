# CONTEXT — cập nhật: 14/05/2026 (session 2)

> File này anh Jimmy T7 cập nhật cuối mỗi session Claude Code.
> Claude Code đọc file này ĐẦU TIÊN để biết đang ở đâu.

## Trạng thái hiện tại: v1.0 — PRODUCTION READY

App đã hoàn chỉnh, chạy được, chưa deploy.

## Đang làm dở
- [ ] Commit đầu tiên chờ anh cấu hình git identity:
  ```
  git config --global user.email "ngothaitinh852@gmail.com"
  git config --global user.name "Jimmy T7"
  git commit -m "v1.0 — TPI Scorer production ready"
  ```

## Vừa xong (session 2 — 14/05/2026)
- [x] Fix bug tiếng Việt IME: thêm `e.isComposing || e.keyCode === 229` vào global keydown handler (dòng 1438)
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
- **Haiku cho tiêu chí simple, Sonnet cho tiêu chí complex** — không đổi model
- **Không làm shared API key** — mỗi user tự nhập key của mình

## Số liệu hiện tại
- `public/index.html`: 1305 dòng, ~55KB
- `src/rubric.tpi-v1.json`: 24 tiêu chí, 100 điểm, pass = 70
- Ước tính chi phí: ~530đ/bài trung bình

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
