# Roadmap — TPI Content Scorer

## Đã xong (v1.0)

- [x] Auth: đăng ký / đăng nhập / admin duyệt
- [x] Rate limiting: giới hạn bài/ngày/user, admin điều chỉnh
- [x] Preflight checks: 5 kiểm tra trước khi chấm
- [x] Rule scoring: 10 tiêu chí JS/regex (free)
- [x] LLM scoring: 8 tiêu chí Haiku + 6 tiêu chí Sonnet
- [x] Cost optimization: skip LLM nếu rule < threshold
- [x] Top 5 fixes: actionable, có vị trí cụ thể
- [x] History table: lịch sử theo user / admin thấy tất cả
- [x] Admin panel: duyệt user, đổi giới hạn, config
- [x] API key: lưu per-user, test trước khi dùng
- [x] Dark theme, responsive mobile

## Backlog đã được duyệt (v1.x)

### P1 — Cần làm trước
- [ ] Đổi mật khẩu admin trong UI (không cần sửa code)
- [ ] Export báo cáo ra Markdown/PDF
- [ ] Thêm trường "Ghi chú" khi nộp bài
- [ ] Hiển thị điểm chi tiết từng tiêu chí (accordion expand)

### P2 — Sau khi P1 ổn định
- [ ] So sánh 2 lần chấm cùng bài (diff view)
- [ ] Thống kê điểm trung bình theo tuần/tháng (chart)
- [ ] Rubric v2 (tpi-v2.json) khi có cập nhật framework
- [ ] Webhook n8n: gửi kết quả về Telegram sau khi chấm

### P3 — Nghiên cứu thêm
- [ ] Import bài từ Google Docs URL (cần OAuth hoặc service account)
- [ ] Multi-rubric: chọn rubric khi nộp (tpi-v1, tpi-v2...)
- [ ] Shared API key: admin set 1 key, user không cần nhập

## Không làm (đã quyết định)
- ❌ Backend/database — giữ static, không thêm server
- ❌ React/Vue — giữ vanilla JS, không cần build step
- ❌ Multi-language rubric — chỉ tiếng Việt
- ❌ Batch processing — real-time UX tốt hơn
