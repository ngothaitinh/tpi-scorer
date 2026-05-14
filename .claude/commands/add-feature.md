# /add-feature

## Bước 1 — Đọc trước khi làm
- [ ] Đọc CONTEXT.md → task có trong backlog không?
- [ ] Đọc ROADMAP.md → ưu tiên P1 hay P2?
- [ ] Nếu tính năng KHÔNG có trong ROADMAP → dừng, hỏi Jimmy T7

## Bước 2 — Phân tích
- Tính năng này cần sửa hàm nào? (dùng Function Index ở đầu script)
- Có ảnh hưởng localStorage schema không? → cập nhật ARCHITECTURE.md
- Cần thêm HTML, CSS, hay JS? Vị trí cụ thể trong file?

## Bước 3 — Code
- Chỉ sửa `public/index.html`
- Thêm vào đúng section (HTML → JS, CSS → style block)
- Không refactor hàm hiện có khi không được yêu cầu
- Không thêm external library

## Bước 4 — Verify
```bash
node -e "require('fs').readFileSync('public/index.html','utf8')" && echo "OK"
wc -l public/index.html
```

## Bước 5 — Cập nhật docs
- ROADMAP.md: move item từ Backlog → Đã xong
- CONTEXT.md: thêm vào "Vừa xong"
- Function Index trong script: thêm tên hàm mới nếu có
