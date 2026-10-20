"""AI국민비서(전용홈+대화) 사용성 평가용 화면 생성.
기준: gov24-ai-demo 저장소 html/contents/UI-AI-AAA01M_3차_AI국민비서_통합.html (중간보고 시연 플로우)
사용성 평가용으로 바꾼 점
  · 주민등록표 등본·초본은 로그인 뒤 '주소 확인 → (아니요) 시도·시군구 선택' 단계를 거쳐 발급 (기존 UT 플로우 유지)
  · 발급 완료 뒤 대화창의 문서 미리보기(증명서 썸네일) 제거 — 인쇄는 발급 진행 현황의 [인쇄하기]로
  · 혜택: 조건(지역·연령 등)을 덧붙여 다시 물으면 그 조건 기준 카드로, 카드·더보기는 가상 혜택알리미(benefit*.html)로
  · 실제 정부24 링크·음성 레이어·시연 리모컨 제거, 가상 서비스 표기, 모바일 대화 화면 입력창 하단 고정
사용: python3 tools/build_ai.py <gov24-ai-demo 저장소 경로>
"""
import sys, os, re, shutil
REF = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/jhwon911229/gov24-ai-demo'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
s = open(os.path.join(REF, 'html/contents/UI-AI-AAA01M_3차_AI국민비서_통합.html'), encoding='utf-8').read()

def rep(old, new, count=1, src=None):
    global s
    t = s if src is None else src
    if old not in t: raise SystemExit('패치 위치를 찾지 못함: ' + old[:80])
    t = t.replace(old, new, count if count else -1)
    if src is None: s = t
    return t
def cut_block(start_pat, tag='div'):
    global s
    i = s.find(start_pat)
    if i < 0: raise SystemExit('블록 없음: ' + start_pat)
    depth = 0
    for m in re.finditer(r'<(/?)%s\b' % tag, s[i:]):
        depth += 1 if m.group(1) == '' else -1
        if depth == 0:
            j = s.find('>', i + m.end()) + 1; s = s[:i] + s[j:]; return
    raise SystemExit('불균형: ' + start_pat)

# ---------- 경로·표기 ----------
s = s.replace('../../static/', 'static/')
s = s.replace('./UI-PT-AAA01M_3차_시연.html', 'index.html').replace('./UI-PT-AAA01M-AD_3차_시연.html', 'index.html')
s = re.sub(r'<title>.*?</title>', '<title>[가상 서비스] 정부24 AI국민비서</title>', s, count=1, flags=re.S)
rep('</head>', '<meta name="robots" content="noindex,nofollow">\n<script src="demo/data.js"></script>\n<style id="ut-patch">' + open(os.path.join(OUT, 'tools/ut_ai.css'), encoding='utf-8').read() + '</style>\n</head>')
rep('시연용 프로토타입 · 실제 정부24 서비스가 아닙니다', '가상 서비스 · 사용성 평가용 시연 화면')
s = re.sub(r'href="https://(www\.gov\.kr/portal/main|efamily\.scourt\.go\.kr)"', 'href="#demo-go"', s)

# 시연 리모컨·하단 '누르고 말하기' 버튼 제거
cut_block('<div class="demo-remote" id="demoRemote">')
rep('<button type="button" class="aih-talk" id="aihTalk" data-voice-open>누르고 말하기</button>', '')

# ---------- 스크립트 ----------
rep("var GOV = 'https://www.gov.kr/portal/main', MYAPPLY = GOV, LIFE = GOV, BNF = 'https://www.gov.kr/portal/rcvfvrSvc/main';",
    "var GOV = '#demo-go', MYAPPLY = GOV, LIFE = GOV, BNF = 'benefit-list.html?set=aih', BNF_SETTING = 'benefit-list.html?set=aih';")
# 음성: 이 화면에서는 '② 음성 서비스' 안내만
rep("$$('[data-voice-open]').forEach(function (b) { b.addEventListener('click', openVoice); });",
    "$$('[data-voice-open]').forEach(function (b) { b.addEventListener('click', voiceNotice); });")
rep("if (homeMic) homeMic.addEventListener('click', openVoice);", "if (homeMic) homeMic.addEventListener('click', voiceNotice);")
rep("if (vm) { VOICE_Q", "if (false) { VOICE_Q")

# 발급: 등본·초본은 로그인 후 주소 확인 단계
rep("singleIssue: function (b) { var d = b.getAttribute('data-doc'); addQ('발급하기'); needAuth('발급을 위해 본인확인이 필요해요.', function () { packProgress([d]); }, true); },",
    "singleIssue: function (b) { var d = b.getAttribute('data-doc'); addQ('발급하기'); needAuth('발급을 위해 본인확인이 필요해요.', function () { if (needsAddr(d)) addrAsk(d); else packProgress([d]); }, true); },\n"
    "\t\taddrYes: function (b) { addQ('맞아요'); packProgress(b.getAttribute('data-doc').split('|')); },\n"
    "\t\taddrPick: function (b) { addQ('아니요, 다시 고를게요'); addrPick(b.getAttribute('data-doc')); },\n"
    "\t\taddrDone: function (b) { addQ(ADDR.sido + ' ' + ADDR.sgg); packProgress(b.getAttribute('data-doc').split('|')); },")
# 일괄발급: 등본이 포함되면 주소 확인
rep("needAuth('발급을 위해 본인확인이 필요해요.', function () { packProgress(docs); }, true);",
    "needAuth('발급을 위해 본인확인이 필요해요.', function () { if (docs.some(needsAddr)) addrAsk(docs.join('|')); else packProgress(docs); }, true);")
rep("put(sec, '<p class=\"ai-followup-copy\">' + docs.map(esc).join(', ') + ' 발급에 필요한 정보를 확인하여 진행할게요.</p>' +",
    "put(sec, '<p class=\"ai-followup-copy\">' + docs.map(esc).join(', ') + ' 발급에 필요한 정보를 확인하여 진행할게요.' + (docs.some(needsAddr) ? ' 주민등록표 등본은 <strong>“' + esc(ADDR.sido + ' ' + ADDR.sgg) + '”</strong> 주소로 발급해요.' : '') + '</p>' +")
# 발급 완료: 문서 미리보기(썸네일) 제거
rep("'<p class=\"ai-complete-message\">모든 발급이 완료되었습니다. 각 문서는 서비스 신청 내역에서 확인할 수 있습니다.</p>' + papersHtml(docs) + links([['서비스 신청내역', MYAPPLY]]));",
    "'<p class=\"ai-complete-message\">모든 발급이 완료되었습니다. 위 발급 진행 현황의 [인쇄하기]를 누르면 문서를 보고 인쇄할 수 있어요.</p>' + links([['서비스 신청내역', MYAPPLY]]));")
# 혜택: 질문에 담긴 조건 기준
rep("if (/혜택|지원금|난방비|바우처|받을수있는/.test(t)) return benefit();", "if (/혜택|지원금|난방비|바우처|받을수있는/.test(t)) return benefit(q);")
rep("function benefit() {\n\t\tneedAuth('맞춤 혜택은 ' + NAME + '님의 정보를 바탕으로 찾아드려요.', function () { benefitResult(); });",
    "function benefit(q) {\n\t\tneedAuth('맞춤 혜택은 ' + NAME + '님의 정보를 바탕으로 찾아드려요.', function () { benefitResult(q); });")
rep("function benefitResult() {", "function benefitResult(q) {\n\t\tvar set = bnSet(q);")
rep("put(sec, '<p class=\"ai-complete-message\">맞춤 혜택을 찾았어요.</p>' +\n\t\t\t\t\t\t'<div class=\"ai-card-link-panel\">' + BNF_LIST.slice(0, 5).map(function (b) { return '<a href=\"' + BNF + '\" class=\"btn-card-box\" target=\"_blank\" title=\"' + esc(b[0]) + ' 혜택알리미 상세(새 창)\"><b class=\"tit\">' + esc(b[0]) + '<i class=\"iconset ico-ai-arrow\" aria-hidden=\"true\"></i></b><p class=\"txt\"><span>대상 :</span><span>' + esc(b[1]) + '</span></p><p class=\"txt\">기간 : ' + esc(b[2]) + '</p></a>'; }).join('') +\n\t\t\t\t\t\t'<a href=\"' + BNF + '\" class=\"btn-more\" target=\"_blank\" title=\"혜택알리미 맞춤혜택조회(새 창)\">혜택알리미에서 더 많은 혜택 보기<i class=\"iconset ico-ai-arrow\" aria-hidden=\"true\"></i></a></div>' +",
    "put(sec, '<p class=\"ai-complete-message\">' + (set.key === 'aih' ? '' : esc(set.label) + ' 기준으로 ') + '맞춤 혜택을 찾았어요.</p>' +\n\t\t\t\t\t\t'<div class=\"ai-card-link-panel\">' + set.items.slice(0, 5).map(function (b) { return '<a href=\"benefit.html?id=' + b.id + '\" class=\"btn-card-box\" title=\"' + esc(b.t) + ' 혜택알리미 상세\"><b class=\"tit\">' + esc(b.t) + '<i class=\"iconset ico-ai-arrow\" aria-hidden=\"true\"></i></b><p class=\"txt\"><span>대상 :</span><span>' + esc(b.who) + '</span></p><p class=\"txt\">기간 : ' + esc(b.when) + '</p></a>'; }).join('') +\n\t\t\t\t\t\t'<a href=\"benefit-list.html?set=' + set.key + '\" class=\"btn-more\" title=\"혜택알리미 맞춤혜택조회\">혜택알리미에서 더 많은 혜택 보기<i class=\"iconset ico-ai-arrow\" aria-hidden=\"true\"></i></a></div>' +")
rep("end(sec, ['경기도에서 내가 받을 수 있는 혜택이 뭐야?', '회사에 제출할 서류 준비해줘', '운전면허 갱신기간 알려줘']);",
    "end(sec, ['경기도에서 내가 받을 수 있는 혜택이 뭐야?', '60대가 받을 수 있는 혜택 알려줘', '주민등록등본 발급해줘']);")

# 사용성 평가 추가 함수(주소 확인·선택, 혜택 조건, 안내 토스트)
rep("\t/* ---------- 버튼 동작 ---------- */", open(os.path.join(OUT, 'tools/ut_ai.js'), encoding='utf-8').read() + "\n\t/* ---------- 버튼 동작 ---------- */")
open(os.path.join(OUT, 'ai.html'), 'w', encoding='utf-8').write(s)

# ---------- 문서출력 ----------
d = open(os.path.join(REF, 'html/contents/UI-AI-DOC_문서출력.html'), encoding='utf-8').read()
d = d.replace('../../static/', 'static/').replace('<title>[시연용] 정부24 - 발급 문서출력</title>', '<title>[가상 서비스] 정부24 - 발급 문서출력</title>')
d = d.replace('</head>', '<meta name="robots" content="noindex,nofollow">\n</head>', 1)
open(os.path.join(OUT, 'doc.html'), 'w', encoding='utf-8').write(d)
shutil.copy(os.path.join(REF, 'static/css/@pub/aih-doc.css'), os.path.join(OUT, 'static/css/@pub/aih-doc.css'))
j = open(os.path.join(REF, 'static/js/aih-doc.js'), encoding='utf-8').read()
j = j.replace("var NAME = '홍길동', HANJA = '洪吉童', ADDR = '경기도 파주시 시연로 123, 101동 1001호 (시연아파트)', ISSUER = '경기도 파주시장';",
"""var NAME = '홍길동', HANJA = '洪吉童', ADDR, ISSUER;
	// [사용성 평가] 대화에서 고른 주소(시도·시군구)를 문서에 반영 : ?sido=&sgg= 또는 AihDoc.setAddr()
	function head0(sd, sg) { ADDR = sd + ' ' + sg + ' 시연로 123, 101동 1001호 (시연아파트)'; ISSUER = sd === sg || /세종/.test(sd) ? sd + '장' : sd + ' ' + sg + (/구$/.test(sg) ? '청장' : /군$/.test(sg) ? '수' : '장'); }
	var qp = new URLSearchParams(w.location.search); head0(qp.get('sido') || '경기도', qp.get('sgg') || '파주시');""")
j = j.replace("w.AihDoc = { paperHtml: paperHtml, docTitle: docTitle, printUrl: function (doc) { return 'UI-AI-DOC_문서출력.html?doc=' + encodeURIComponent(doc); } };",
"""var CUR = { sido: '경기도', sgg: '파주시' };
	w.AihDoc = { paperHtml: paperHtml, docTitle: docTitle, setAddr: function (sd, sg) { CUR = { sido: sd, sgg: sg }; head0(sd, sg); },
		printUrl: function (doc) { return 'doc.html?doc=' + encodeURIComponent(doc) + '&sido=' + encodeURIComponent(CUR.sido) + '&sgg=' + encodeURIComponent(CUR.sgg); } };""")
assert 'head0' in j and 'doc.html?doc' in j
open(os.path.join(OUT, 'static/js/aih-doc.js'), 'w', encoding='utf-8').write(j)
print('ai.html, doc.html 생성')
