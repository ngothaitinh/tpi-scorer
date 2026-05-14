# Rubric tpi-v1 — 24 Tiêu chí Chấm Bài

Nguồn thật: `src/rubric.tpi-v1.json`
Tổng: 100 điểm | Pass: 70 | Author: Jimmy T7 | Org: TPI Land

## Tầng 1 — Cấu trúc & Ngữ cảnh (30đ) — rule + LLM

| ID | Tên | Điểm | Chấm bằng |
|----|-----|------|-----------|
| S1 | Macro Context Alignment H1↔H2 | 7 | LLM |
| S2 | 9-10 Heading đầu chất lượng | 6 | LLM |
| S3 | Heading Hierarchy hợp lý | 5 | Rule |
| S4 | Contextual Coverage tại Main Content | 5 | Rule |
| S5 | Contextual Flow logic | 4 | LLM |
| S6 | Tỷ lệ Supplement Content ≤25% | 3 | Rule |

## Tầng 2 — Chất lượng đoạn (25đ) — mostly rule

| ID | Tên | Điểm | Chấm bằng |
|----|-----|------|-----------|
| P1 | Early Query Answer / No Delay | 6 | LLM |
| P2 | Be Certain — cấm từ do dự | 5 | Rule (regex) |
| P3 | Cụ thể vs Chung chung | 4 | Rule (regex) |
| P4 | Số liệu cụ thể (≥1/300 từ) | 4 | Rule |
| P5 | Heading viết hoa đúng chuẩn | 2 | Rule |
| P6 | Internal link đúng vị trí | 2 | Rule |
| P7 | Không hệ thống số đếm 1.1.2 | 1 | Rule |
| P8 | Câu đầy đủ chủ vị, không câu cụt | 1 | Rule |

## Tầng 3 — RPP & Entity (25đ) — LLM

| ID | Tên | Điểm | Chấm bằng |
|----|-----|------|-----------|
| R1 | RPP — Relevance (liên quan business model) | 5 | LLM |
| R2 | RPP — Prominence (thiết yếu định nghĩa Entity) | 5 | LLM |
| R3 | RPP — Popularity (khớp Search Intent) | 4 | LLM |
| R4 | EAV Coverage (Entity-Attribute-Value) | 6 | LLM |
| R5 | Central Entity Alignment (cuối bài) | 3 | LLM |
| R6 | Heading đầu-cuối kết nối ngược (nâng cao) | 2 | LLM |

## Tầng 4 — Information Gain (20đ) — LLM

| ID | Tên | Điểm | Chấm bằng |
|----|-----|------|-----------|
| I1 | Dữ liệu/Case study độc quyền TPI | 7 | LLM |
| I2 | Góc nhìn mới / quan điểm riêng | 5 | LLM |
| I3 | Tránh văn phong AI generic | 5 | LLM |
| I4 | Trích dẫn nguồn uy tín | 3 | LLM |

## 5 Preflight Checks (fail → 0đ, không gọi LLM)

1. `has_h1` — Bài phải có ít nhất 1 H1
2. `has_h2` — Bài phải có ít nhất 3 H2
3. `min_word_count` — word_count ≥ 800
4. `max_word_count` — word_count ≤ 10000
5. `main_entity_in_h1` — H1 phải chứa keyword hoặc main entity

## Quy tắc nâng cấp rubric

- **Không sửa** `rubric.tpi-v1.json` sau khi production
- Muốn thay đổi → tạo `src/rubric.tpi-v2.json`
- Mỗi submission lưu `rubric_version` để so sánh lịch sử
