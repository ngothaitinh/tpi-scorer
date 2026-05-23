# V3 — WordPress Plugin Edition (KẾ HOẠCH — CHƯA TRIỂN KHAI)

> **Trạng thái:** ĐANG CHỜ. Không bắt đầu code cho đến khi bản hiện tại
> (v2.0 Netlify) deploy xong + test xong + đổi mật khẩu admin.
>
> Tài liệu này lập ở session 10 (20/05/2026) theo yêu cầu Jimmy T7.

## Mục tiêu

Đóng gói TPI Content Scorer thành **plugin WordPress dùng nội bộ công ty**,
thay cho bản web tĩnh trên Netlify. Lý do: bài viết được soạn chủ yếu trên
WordPress + Elementor.

## Vì sao chuyển

| Vấn đề bản Netlify | V3 plugin giải quyết |
|--------------------|----------------------|
| Phải dùng bookmarklet để lấy bài | Nút "Chấm điểm TPI" ngay trong trang soạn bài |
| Login 2 lần (WordPress + scorer) | Dùng luôn tài khoản WordPress |
| Cần thêm dịch vụ Netlify | Chạy trên hosting WordPress sẵn có |
| Rate-limit localStorage dễ lách | Đếm chuẩn qua WP database |

## Kiến trúc dự kiến

```
tpi-scorer-plugin/
├── tpi-scorer.php            ← plugin header, hooks, activation
├── includes/
│   ├── class-proxy.php       ← REST endpoint giấu API key (WP options)
│   ├── class-admin-page.php  ← trang admin + UI chấm bài
│   ├── class-rate-limit.php  ← đếm lượt/ngày/user qua user meta
│   └── class-content.php     ← trích nội dung từ bài Elementor
├── assets/
│   ├── app.js                ← logic chấm bài (port từ index.html)
│   └── app.css
└── readme.txt
```

## Bản đồ chuyển đổi (migration map)

| Bản Netlify (v2.0) | Bản WP Plugin (v3.0) |
|--------------------|----------------------|
| Netlify Function `claude.js` | WP REST route `/wp-json/tpi/v1/score` (PHP) |
| API key trong Netlify env var | WP options table (`tpi_llm_endpoint`, `tpi_llm_key`) |
| Auth localStorage | Tài khoản WordPress (`current_user_can`) |
| `tpi_submissions` localStorage | Custom DB table `wp_tpi_submissions` |
| Bookmarklet Elementor | Meta box / nút trong post editor |
| `tpi_apikey_{user}` per-user | Bỏ — shared key trong options |
| Rubric JSON | Giữ nguyên — đóng gói trong plugin |
| Logic scoring (rule + LLM) | Giữ nguyên — port sang `app.js` |

## Rào cản đã xác định

### 🔴 Rào cản 1 — Vi phạm quy tắc bất biến
`CLAUDE.md` quy định "single-file HTML, không thêm tính năng ngoài ROADMAP".
Plugin là cấu trúc PHP nhiều file → **Phase 0 phải cập nhật `CLAUDE.md` +
`ROADMAP.md`** để hợp pháp hóa hướng đi này trước khi code.

### 🟡 Rào cản 2 — Đọc nội dung bài Elementor
Elementor lưu bài dạng JSON trong post meta `_elementor_data`, KHÔNG phải
HTML sạch. `post_content` thường rỗng hoặc chỉ có fallback.

**Giải pháp:** dùng API render chính thức của Elementor server-side:
```php
\Elementor\Plugin::$instance->frontend->get_builder_content_for_display( $post_id );
```
→ trả về HTML đã render → parse H1/H2/H3/p như bookmarklet đang làm.
Hoạt động cả với bài nháp (chưa publish).

### 🟡 Rào cản 3 — Migrate storage
users/config/lịch sử đang ở localStorage → chuyển sang WP database.
Cần activation hook tạo bảng + (tùy chọn) script import dữ liệu cũ.

### 🟡 Rào cản 4 — Hai codebase
Không nên giữ song song cả Netlify + plugin. Khi v3 ổn định → bản Netlify
chuyển thành "frozen / legacy".

## Lộ trình triển khai (khi được duyệt)

| Phase | Nội dung | Gate |
|-------|----------|------|
| 0 | Cập nhật `CLAUDE.md` + `ROADMAP.md` hợp pháp hóa plugin track | Jimmy duyệt |
| 1 | Skeleton plugin + trang admin render UI chấm bài hiện có | — |
| 2 | PHP proxy — port `claude.js` sang WP REST endpoint | — |
| 3 | Auth + rate-limit qua WordPress | — |
| 4 | Trích nội dung Elementor (`class-content.php`) — phần khó nhất | — |
| 5 | Migrate storage sang WP DB | — |
| 6 | Đóng gói `.zip` + test trên site staging | Jimmy test |

## Câu hỏi cần Jimmy quyết trước Phase 1

1. **Storage lịch sử**: bảng DB riêng hay dùng post meta?
2. **Phân quyền**: role nào được chấm bài? (`editor`, `author`, hay tất cả?)
3. **UI**: giữ 1 file `app.js` gộp, hay tách module?
4. **Bản Netlify**: giữ làm backup hay bỏ hẳn khi v3 xong?

## Ước lượng

Khoảng **40% app viết lại** (auth, storage, proxy đổi nền tảng).
Logic scoring + rubric + checklist UX giữ gần như nguyên vẹn.
