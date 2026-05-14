# /session-end

Chạy lệnh này trước khi kết thúc session.

## Claude Code tự động làm — không hỏi

1. Cập nhật `CONTEXT.md`:
   - "Vừa xong": thêm task đã hoàn thành trong session này
   - "Đang làm dở": task còn dở (nếu có), ghi rõ đang ở bước nào
   - "Quyết định gần đây": nếu session có quyết định thiết kế mới
   - Cập nhật số dòng `public/index.html` nếu thay đổi

2. Nếu có sửa code:
   - Chạy verify: `node -e "require('fs').readFileSync('public/index.html','utf8')" && echo OK`
   - Báo số dòng đã thay đổi

3. Tóm tắt session trong 3 dòng cho anh Jimmy T7:
   ```
   Đã làm: [liệt kê]
   Còn lại: [nếu có] / Sạch
   Lần sau tiếp: [gợi ý P1 tiếp theo]
   ```
