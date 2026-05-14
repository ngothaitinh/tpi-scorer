# TPI Content Scorer

Công cụ chấm bài viết SEO/GEO chuẩn TPI Land. Chấm tự động 24 tiêu chí, trả về điểm 0-100 và top 5 gợi ý sửa.

## Dùng ngay

Mở `public/index.html` bằng trình duyệt. Không cần cài đặt gì.

**Admin mặc định:** `admin` / `admin2024` — đổi ngay sau khi dùng lần đầu.

## Deploy lên Netlify (30 giây)

1. Vào https://app.netlify.com/drop
2. Kéo thư mục `public/` vào
3. Có URL công khai ngay

## Cấu trúc project

```
tpi-scorer/
├── CLAUDE.md              ← Claude Code đọc đầu tiên
├── README.md              ← File này
├── public/
│   └── index.html         ← Toàn bộ app (single-file, ~54KB)
├── src/
│   └── rubric.tpi-v1.json ← Bộ 24 tiêu chí chấm bài
├── docs/
│   ├── ARCHITECTURE.md    ← Data flow, schema, cost analysis
│   ├── RUBRIC.md          ← Giải thích 24 tiêu chí
│   └── ROADMAP.md         ← Backlog tính năng
└── .claude/
    └── commands/
        ├── add-feature.md ← /add-feature
        ├── fix-bug.md     ← /fix-bug
        └── update-rubric.md ← /update-rubric
```

## Dùng với Claude Code

```bash
# Mở project trong Claude Code
cd tpi-scorer
claude

# Các lệnh hay dùng
/add-feature    # Thêm tính năng từ ROADMAP
/fix-bug        # Sửa bug
/update-rubric  # Nâng cấp bộ tiêu chí lên v2
```

## Chi phí API ước tính

| Lượng | Chi phí/tháng |
|-------|--------------|
| 100 bài | ~48.000đ (~$1.8) |
| 500 bài | ~238.000đ (~$9.2) |
| 1000 bài | ~476.000đ (~$18.3) |

*Đã tối ưu 7 tầng: rule-first, preflight filter, skip LLM threshold, gộp call, Haiku+Sonnet mix.*

## Tài khoản & Quyền

- **Admin** (Jimmy T7): duyệt user, đổi giới hạn, xem tất cả lịch sử
- **User**: đăng ký → chờ admin duyệt → nộp bài (mặc định 5 bài/ngày)
- Admin có thể tăng giới hạn từng user riêng lẻ

## API Key

Mỗi user nhập Claude API key của riêng mình (hoặc anh cấp 1 key chung cho team). Key lưu trong localStorage trình duyệt.
