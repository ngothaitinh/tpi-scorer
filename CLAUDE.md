# TPI Content Scorer

Công cụ chấm bài viết SEO/GEO cho TPI Land (BĐS Vũng Tàu).
Author: Jimmy T7 | Single-page app | No build step.

## Đọc ngay — tình trạng hiện tại
@CONTEXT.md

## Stack
- Vanilla HTML/CSS/JS — không framework, không bundler
- Claude API: Haiku 4.5 (tiêu chí simple) + Sonnet 4.6 (tiêu chí complex)
- localStorage cho auth, config, lịch sử (prefix: `tpi_`)
- Deploy: static file lên Netlify / GitHub Pages

## File quan trọng
| File | Vai trò |
|------|---------|
| `public/index.html` | Toàn bộ app (~1440 dòng) |
| `src/rubric.tpi-v1.json` | 24 tiêu chí chấm (nguồn thật) |
| `CONTEXT.md` | Tình trạng task, quyết định đã chốt |

## Quy tắc bất biến (không được vi phạm)
1. Giữ single-file HTML — không tách JS/CSS ra file riêng
2. Không thêm framework (React, Vue, Alpine...)
3. Không sửa `rubric.tpi-v1.json` — tạo v2 nếu cần nâng cấp
4. Không thêm tính năng ngoài `docs/ROADMAP.md` khi chưa được duyệt
5. Mọi thay đổi phải surgical — chỉ sửa đúng chỗ yêu cầu

## Đọc thêm khi liên quan
- Sửa scoring / rubric → @docs/RUBRIC.md
- Hiểu data flow / schema → @docs/ARCHITECTURE.md
- Thêm tính năng → @docs/ROADMAP.md

## Verify sau khi sửa
```bash
node -e "require('fs').readFileSync('public/index.html','utf8')" && echo "OK"
wc -l public/index.html
```

## Slash commands
- `/add-feature` — thêm tính năng từ ROADMAP
- `/fix-bug` — sửa bug surgical
- `/update-rubric` — nâng cấp bộ tiêu chí lên v2
