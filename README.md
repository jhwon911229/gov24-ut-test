# 정부24 AI국민비서 1차 사용성 평가 시연 화면 (가상 서비스)

- 2026.10.23.(금) 1차 사용성 평가용 **가상 서비스** 시연 화면입니다. 실제 민원이 접수되지 않으며, 모든 개인정보는 가상 데이터입니다.
- 배포: https://jhwon911229.github.io/gov24-ut-test/ (GitHub Pages, main 브랜치 루트)

## 구성
| 파일 | 내용 |
|---|---|
| `index.html` | 시연 시작 화면(허브) — ①기존 정부24 ②음성 ③대화형 민원 ④대화형 혜택 |
| `ai.html` | AI국민비서 전용홈 |
| `chat.html` | 대화형 민원 발급 · 혜택 조회 |
| `print.html` | 발급 문서(가상 주민등록등본) |
| `benefit-list.html`, `benefit.html` | 혜택알리미(가상) 목록 · 상세 |
| `demo/` | 시연 스크립트(`demo-ai.js`, `demo-benefit.js`, `data.js`)와 보조 CSS(`demo.css`) |
| `static/` | 퍼블리싱 CSS·이미지 |

## 다시 만들기
퍼블리싱 원본(html.zip의 `html/contents`)이 있으면 아래로 페이지를 다시 생성합니다. `demo/`의 스크립트·CSS는 직접 수정합니다.
```
python3 tools/build_pages.py <퍼블리싱 html/contents 경로>   # ai.html, chat.html, benefit*.html
```
