# 정부24 AI국민비서 1차 사용성 평가 시연 화면 (가상 서비스)

- 2026.10.23.(금) 1차 사용성 평가용 **가상 서비스** 시연 화면입니다. 실제 민원이 접수되지 않으며, 모든 개인정보는 가상 데이터입니다.
- 배포: https://jhwon911229.github.io/gov24-ut-test/ (GitHub Pages, main 브랜치 루트)

## 구성
| 파일 | 내용 |
|---|---|
| `index.html` | 시연 시작 화면(허브) — ①기존 정부24 ②음성 ③대화형 민원 ④대화형 혜택 |
| `ai.html` | AI국민비서 전용홈 + 대화(민원 발급·혜택 조회) — gov24-ai-demo 플로우 기준 |
| `doc.html` | 발급 문서출력(가상 주민등록표 등본 등) |
| `chat.html`, `print.html` | 예전 주소 호환용(각각 ai.html, doc.html로 이동) |
| `benefit-list.html`, `benefit.html` | 혜택알리미(가상) 목록 · 상세 |
| `demo/` | 예시 데이터(`data.js`), 혜택알리미 스크립트(`demo-benefit.js`), 보조 CSS(`demo.css`) |
| `static/` | 퍼블리싱 CSS·이미지 |

## 다시 만들기
퍼블리싱 원본(html.zip의 `html/contents`)이 있으면 아래로 페이지를 다시 생성합니다. `demo/`의 스크립트·CSS는 직접 수정합니다.
```
python3 tools/build_ai.py    <gov24-ai-demo 저장소 경로>      # ai.html, doc.html (+ tools/ut_ai.js, ut_ai.css 패치)
python3 tools/build_pages.py <퍼블리싱 html/contents 경로>   # benefit.html, benefit-list.html
```

## 사용성 평가용 플로우 (gov24-ai-demo 대비 차이)
- 주민등록표 등본·초본: 발급하기 → 간편인증 1회 → **주소 확인(맞아요 / 아니요 → 시도·시군구 선택)** → 발급 진행 현황 → [인쇄하기]
- 발급 완료 뒤 대화창의 문서 미리보기(증명서 썸네일)는 넣지 않음
- 혜택: 지역·연령 등 조건을 덧붙이면 그 조건 기준 카드, 카드·더보기는 가상 혜택알리미로 연결
- 말로 묻기는 ‘② 음성 서비스’에서 체험(이 화면의 마이크는 안내만)
