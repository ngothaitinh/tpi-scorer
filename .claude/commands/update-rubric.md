# /update-rubric

## Nguyên tắc bất biến
KHÔNG sửa `src/rubric.tpi-v1.json` nếu đã có submission dùng v1.
Luôn tạo file mới.

## Bước 1 — Tạo v2
```bash
cp src/rubric.tpi-v1.json src/rubric.tpi-v2.json
```
Đổi metadata: `"rubric_id": "tpi-v2"`, `"version": "2.0.0"`

## Bước 2 — Sửa tiêu chí
Giữ tổng = 100. Validate:
```bash
python3 -c "
import json
r = json.load(open('src/rubric.tpi-v2.json'))
t = sum(c['weight'] for tier in r['tiers'] for c in tier['criteria'])
print(f'Total: {t}/100 -', 'OK' if t==100 else 'ERROR - fix weights')
"
```

## Bước 3 — Cập nhật app
Trong `public/index.html`:
- Thêm `RUBRIC_V2 = {...}` cạnh `RUBRIC` hiện tại
- Thêm dropdown chọn rubric vào form nộp bài
- Submission lưu thêm field `rubric_version`

## Bước 4 — Cập nhật docs
- `docs/RUBRIC.md`: thêm bảng tiêu chí v2
- `CONTEXT.md`: ghi nhận rubric v2 đã active
