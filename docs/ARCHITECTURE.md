# Architecture — TPI Content Scorer

## Tổng quan

Single-page app chạy hoàn toàn trên browser. Không có backend. Gọi Claude API trực tiếp từ client.

## Data Flow: Chấm bài

```
User paste bài
    ↓
parseArticle()          ← extract words, headings H1/H2/H3
    ↓
runPreflight()          ← 5 checks cứng (fail → dừng, 0đ)
    ↓
scoreRules()            ← 10 tiêu chí JS/regex (FREE, ~instant)
    ↓
ruleTotal >= threshold? ← cfg: skip_llm_threshold (default 30)
    ├── NO  → generateRuleFixes()   ← skip LLM, tiết kiệm token
    └── YES ↓
scoreLLMSimple()        ← 1 call Haiku: 8 tiêu chí đơn giản
    ↓
scoreLLMComplex()       ← 1 call Sonnet: 6 tiêu chí + top5 fixes
    ↓
renderResult()          ← điểm 4 tầng + top 5 fixes
    ↓
saveSubmission()        ← localStorage tpi_submissions
```

## Auth Flow

```
Register → status: 'pending'
Admin login → approveUser() → status: 'active'
User login → checkStatus → enterApp()
```

Không có JWT, không có server session. Session = localStorage `tpi_session`.

## localStorage Schema

```
tpi_users           Object  { username: UserObject }
tpi_session         String  username đang đăng nhập
tpi_config          Object  { daily_limit, pass_score, skip_llm_threshold }
tpi_submissions     Array   [ SubmissionObject ] (tối đa 200)
tpi_daily_{user}_{date}  Number  số bài đã nộp hôm nay
tpi_apikey_{user}   String  Claude API key (encrypted in browser)
```

## UserObject schema

```json
{
  "name": "Nguyen Van A",
  "pass": "hashed_string",
  "role": "user|admin",
  "status": "active|pending",
  "dailyLimit": 5,
  "submissions": []
}
```

## SubmissionObject schema

```json
{
  "id": "timestamp_string",
  "date": "ISO datetime",
  "keyword": "string",
  "entity": "string",
  "intent": "Know|Do|Hybrid|Go",
  "wordCount": 2000,
  "total": 74.5,
  "passed": true,
  "tierBreakdown": [ { "name", "max", "score" } ],
  "top5": [ { "priority", "criterion_id", "location", "issue", "fix" } ],
  "llmUsed": true,
  "submitter": "username"
}
```

## LLM Call Strategy (cost-optimized)

| Call | Model | Tiêu chí | Ước tính token | Chi phí |
|------|-------|----------|----------------|---------|
| 1 | Haiku 4.5 | S1,S2,S5,P1,R1,R3,R5,R6 (8 simple) | ~4500 in / 600 out | ~$0.007 |
| 2 | Sonnet 4.6 | R2,R4,I1,I2,I3,I4 + top5 fixes | ~4500 in / 800 out | ~$0.025 |

Chi phí trung bình sau filter: ~530đ/bài (~$0.02 USD).

## Admin mặc định

- Username: `admin`
- Password: `admin2024` ← **đổi ngay sau deploy**
- Role: admin, dailyLimit: 999, status: active
