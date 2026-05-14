# Changelog — TPI Content Scorer

## [1.0.0] — 2026-05-13

### Initial release

**Core features:**
- Auth system: đăng ký / đăng nhập / admin duyệt tài khoản
- Rate limiting: giới hạn bài/ngày per user, admin điều chỉnh được
- Rubric tpi-v1: 24 tiêu chí, 100 điểm, 4 tầng
- Preflight checks: 5 kiểm tra trước khi chấm
- Rule-based scoring: 10 tiêu chí bằng JS (free)
- LLM scoring: 2 call (Haiku + Sonnet) thay vì 14 call riêng
- Cost optimization: 7 tầng tiết kiệm token
- Skip LLM threshold: bài yếu không tốn API
- Top 5 fixes: gợi ý sửa cụ thể actionable
- History: lịch sử chấm bài per user
- Admin panel: duyệt user, set limit, config hệ thống
- Single-file HTML: deploy Netlify Drop trong 30 giây

**Rubric tpi-v1.0.0:**
- T1 Cấu trúc: S1-S6 (30đ)
- T2 Chất lượng: P1-P8 (25đ)
- T3 RPP & Entity: R1-R6 (25đ)
- T4 Information Gain: I1-I4 (20đ)

---

## [Planned] — tpi-v1.1.0

- [ ] Đổi mật khẩu admin
- [ ] Export lịch sử CSV
- [ ] Xem điểm chi tiết từng tiêu chí trong history
- [ ] Dark/light mode toggle

## [Planned] — tpi-v2.0.0

- [ ] Rubric v2 (thêm tiêu chí GEO mới)
- [ ] Multi-rubric support
- [ ] n8n webhook integration
