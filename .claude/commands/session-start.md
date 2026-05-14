# /session-start

Chạy lệnh này khi bắt đầu mỗi session Claude Code.

## Claude Code làm ngay — không hỏi

1. Đọc `CONTEXT.md` → tóm tắt trong 5 dòng:
   - Trạng thái app
   - Task đang làm dở (nếu có)
   - Quyết định quan trọng gần nhất
   - Backlog P1 tiếp theo
   - File nào đang "hot" (hay được sửa)

2. Đọc `public/index.html` dòng 645-680 (Function Index)

3. Báo cáo ngắn cho anh Jimmy T7:
   ```
   ✓ Đã đọc context
   App: [trạng thái]
   Dở dang: [nếu có] / Không có
   P1 tiếp theo: [tính năng]
   Sẵn sàng nhận task.
   ```

Không hỏi thêm. Chờ task.
