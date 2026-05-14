# /fix-bug

## Nhận bug report theo format
```
Triệu chứng: [user thấy gì]
Bước tái hiện: [làm gì để bug xuất hiện]
Hàm nghi ngờ: [nếu biết]
```

## Bước 1 — Locate
- Dùng Function Index (đầu script) để tìm hàm liên quan
- Đọc hàm đó và các hàm nó gọi
- Xác định root cause trước khi sửa

## Bước 2 — Fix
- Sửa ít nhất có thể — chỉ đúng chỗ bug
- Không "improve" code xung quanh
- Không đổi tên hàm / biến hiện có

## Bước 3 — Verify
```bash
node -e "require('fs').readFileSync('public/index.html','utf8')" && echo "OK"
```

## Bước 4 — Report
Báo cáo ngắn:
- Root cause: [vì sao bug xảy ra]
- Fix: [đã sửa gì, ở đâu]
- Dòng: [số dòng đã thay đổi]

## Bước 5 — Cập nhật CONTEXT.md
Thêm fix vào "Vừa xong"
