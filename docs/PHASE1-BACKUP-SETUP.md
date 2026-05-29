# Phase 1 — Backup & Webhook Setup

## Mục tiêu
- Mỗi bài chấm tự push sang Google Sheets (analytics + backup)
- Admin có nút Export/Import toàn bộ data trong browser

## Bước 1 — Tạo Google Sheet

1. Vào https://sheets.google.com → tạo Sheet mới
2. Đặt tên: `TPI Scorer — Submissions Log`
3. Tạo 2 sheet (tab):
   - `Submissions` — header row A1:N1:
     ```
     timestamp | user | keyword | entity | intent | wordCount | total | passed | llmUsed | tier1 | tier2 | tier3 | tier4 | top5_summary
     ```
   - `Pings` — header A1:C1:
     ```
     timestamp | by | note
     ```

## Bước 2 — Tạo Apps Script

1. Trong Sheet → menu **Extensions** → **Apps Script**
2. Xóa code mặc định, paste:

```javascript
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var type = body.type || 'unknown';
    var p = body.payload || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (type === 'submission') {
      var sh = ss.getSheetByName('Submissions');
      var tiers = p.tiers || [];
      var tierScore = function(i) { return tiers[i] ? tiers[i].score + '/' + tiers[i].max : ''; };
      var top5 = (p.top5 || []).map(function(t) {
        return '[' + (t.sev || '?').toUpperCase() + '] ' + (t.id || '') + ': ' + (t.issue || '');
      }).join(' || ');
      sh.appendRow([
        p.timestamp || new Date().toISOString(),
        p.user || '',
        p.keyword || '',
        p.entity || '',
        p.intent || '',
        p.wordCount || 0,
        p.total || 0,
        p.passed ? 'YES' : 'NO',
        p.llmUsed ? 'YES' : 'NO',
        tierScore(0), tierScore(1), tierScore(2), tierScore(3),
        top5,
      ]);
    } else if (type === 'ping') {
      var sh = ss.getSheetByName('Pings');
      sh.appendRow([p.at || new Date().toISOString(), p.by || '', p.note || 'ping']);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, type: type }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('TPI Scorer webhook — POST only').setMimeType(ContentService.MimeType.TEXT);
}
```

3. **Save** (Ctrl+S) → đặt tên project: `TPI Scorer Webhook`

## Bước 3 — Deploy as Web App

1. Click **Deploy** (góc phải) → **New deployment**
2. Click bánh răng → chọn **Web app**
3. Cấu hình:
   - **Description**: `TPI Scorer v1`
   - **Execute as**: `Me` (your account)
   - **Who has access**: `Anyone` ⚠ (cần "Anyone" để Vercel function gọi được)
4. **Deploy** → cấp permission
5. Copy URL dạng `https://script.google.com/macros/s/AKfy.../exec`

## Bước 4 — Set Vercel env var

1. Vercel Dashboard → project `tpi-scorer` → Settings → Environment Variables
2. Add:
   - Name: `GSHEETS_WEBHOOK_URL`
   - Value: paste URL ở Bước 3
   - Environment: `Production` + `Preview` + `Development`
3. **Save** → Redeploy project (Deployments → ... → Redeploy)

## Bước 5 — Test

1. Mở app live → đăng nhập admin
2. Vào **Quản trị** page → kéo xuống section **💾 Backup & Restore**
3. Click **🔔 Test Webhook** → toast báo "✓ Đã ping webhook"
4. Mở Google Sheet tab `Pings` → thấy 1 row mới có timestamp + username admin → ✅ OK
5. Chấm thử 1 bài bất kỳ → vào tab `Submissions` → thấy 1 row mới với điểm số → ✅ OK

## Bước 6 — Pivot Tables (analytics)

Trong Sheet, tạo tab `Dashboard`:

1. **Pivot 1 — Bài/user tuần này**
   - Rows: `user`
   - Values: `COUNTA(timestamp)`
   - Filter: `timestamp >= TODAY()-7`

2. **Pivot 2 — Avg score per user**
   - Rows: `user`
   - Values: `AVG(total)`

3. **Pivot 3 — Pass rate**
   - Rows: `user`
   - Values: `COUNTIF(passed="YES")/COUNTA(passed)`

4. **Chart — Score trend 4 tuần**
   - Data: cột `timestamp` + `total`
   - Type: Line chart

## Backup manual (Export/Import)

- **Export**: Admin → 💾 Backup section → **📥 Export All Data** → tải file `tpi-backup-YYYY-MM-DD.json`
  - Khuyến nghị: lưu vào Google Drive folder `TPI Scorer Backups`, làm 1 lần/tuần
- **Import**: **📤 Import Data** → chọn file `.json` → confirm → trang reload với data đã restore

## Troubleshooting

- **Webhook trả `ok:false, status:401`**: Apps Script chưa set "Anyone" access → redeploy
- **Apps Script báo lỗi permission**: chạy thủ công `doPost` 1 lần trong editor để authorize
- **Vercel function timeout 10s**: Apps Script chậm — cân nhắc Apps Script `cache_service` nếu vẫn chậm
- **Sheet không nhận row mới**: kiểm tra env `GSHEETS_WEBHOOK_URL` đã set + redeploy Vercel

---

**Status sau Phase 1:**
- ✅ Backup tự động: mọi bài → Google Sheet
- ✅ Backup manual: Export JSON file
- ✅ Restore: Import JSON file
- ✅ Analytics cơ bản: pivot trong Google Sheet
- ⏳ Phase 2 (sau): in-app Analytics tab với chart
