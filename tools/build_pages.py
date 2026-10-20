import re, os, shutil
import sys
# 사용: python3 tools/build_pages.py <퍼블리싱 contents 폴더>
SRC=(sys.argv[1] if len(sys.argv)>1 else '/home/claude/up/html/html/contents').rstrip('/')+'/'
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+'/'
os.makedirs(OUT, exist_ok=True)

def balanced_remove(s, start_pat):
    i = s.find(start_pat)
    if i < 0: return s
    depth = 0; k = i
    for m in re.finditer(r'<(/?)div\b', s[i:]):
        depth += 1 if m.group(1) == '' else -1
        if depth == 0:
            end = i + m.end(); end = s.find('>', end) + 1
            return s[:i] + s[end:]
    return s

def inner_replace(s, start_pat, new_inner):
    i = s.find(start_pat); j = s.find('>', i) + 1
    depth = 1
    for m in re.finditer(r'<(/?)div\b', s[j:]):
        depth += 1 if m.group(1) == '' else -1
        if depth == 0:
            e = j + m.start()
            return s[:j] + new_inner + s[e:]
    raise Exception('nf')

NOTICE = '<p class="txt demo-notice"><span class="demo-badge">가상 서비스</span>시연용 가상 화면 · 실제 민원 접수 안 됨</p>'

def common(s, title):
    s = s.replace('../../static/', 'static/')
    s = re.sub(r'<script(?![^>]*\bsrc=)[^>]*>.*?</script>', '', s, flags=re.S)
    s = s.replace('<p class="txt">이 누리집은 대한민국 공식 전자정부 누리집입니다.</p>', NOTICE)
    s = re.sub(r'<title>.*?</title>', '<title>[가상 서비스] ' + title + '</title>', s, flags=re.S)
    s = s.replace('</head>', '<meta name="robots" content="noindex,nofollow">\n<link rel="stylesheet" href="demo/demo.css">\n</head>', 1)
    # 기존 모달(약관·피드백 등) 제거
    while 'class="iw-ai-modal' in s:
        i = s.find('<div class="iw-ai-modal')
        if i < 0: break
        s = balanced_remove(s, s[i:i+60])
    # 푸터 안내 추가
    s = s.replace('<footer id="iw_footer">', '<div class="demo-foot-note">이 화면은 「정부24 AI국민비서」 사용성 평가를 위해 만든 <strong>가상 서비스(시연용)</strong>입니다. 이름·주소·혜택 정보는 모두 예시이며, 실제 인증·발급·신청은 이루어지지 않습니다.</div>\n<footer id="iw_footer">', 1)
    s = s.replace('<h1 class="logo"><a href="">', '<h1 class="logo"><a href="main.html">', 1)
    s = s.replace('</body>', '<script src="demo/data.js"></script>\n<script src="demo/demo-ai.js"></script>\n</body>', 1)
    return s

# ---- 전용홈
h = open(SRC + 'UI-AI-LGA01M.html', encoding='utf-8').read()
h = balanced_remove(h, '<div class="listening-area" id="voiceListeningLayer"')
h = common(h, '정부24 AI국민비서')
h = h.replace('<body class="', '<body data-page="home" class="', 1)
open(OUT + 'ai.html', 'w', encoding='utf-8').write(h)

# ---- 대화
d = open(SRC + 'UI-AI-LGA01M_dialogue.html', encoding='utf-8').read()
m = re.search(r'<div class="iw-ai-prompt-area ai-issuance-view">\s*<div class="input-ai-area bottom">', d)
inp_start = m.start()
# 입력 영역 블록 추출
tmp = d[inp_start:]
depth = 0
for mm in re.finditer(r'<(/?)div\b', tmp):
    depth += 1 if mm.group(1) == '' else -1
    if depth == 0:
        inp = tmp[:tmp.find('>', mm.end()) + 1]; break
inp = balanced_remove(inp, '<div class="listening-area"')
inp = inp.replace('<textarea title="정부24에 물어보세요" placeholder="정부24에 물어보세요" class="iw-ai-input"></textarea>',
                  '<textarea title="AI에게 물어보기" placeholder="AI에게 물어보세요" class="iw-ai-input" rows="1"></textarea>')
inp_inner = re.search(r'<div class="input-ai-area bottom">.*', inp, re.S).group(0)
inp_inner = inp_inner[:inp_inner.rfind('</div>')]
chat = '''
        <div class="iw-ai-prompt-area ai-issuance-view demo-chat" aria-labelledby="aiChatTitle">
          <div class="inner-prompt iw-ai-answer">
            <h2 class="sr-only" id="aiChatTitle">정부24 AI국민비서 대화</h2>
            <div class="iw-ai-answer-area ai-issuance-conversation" id="log" aria-live="polite"></div>
          </div>
          ''' + inp_inner + '''
        </div>
      '''
d = inner_replace(open(SRC + 'UI-AI-LGA01M.html', encoding='utf-8').read(), '<div class="iw-ai-wrap">', chat)
d = common(d, '정부24 AI국민비서 - 대화')
d = d.replace('<body class="', '<body data-page="chat" class="', 1)
open(OUT + 'chat.html', 'w', encoding='utf-8').write(d)
print('ok')

# ================= 혜택알리미 (서비스 상세 / 맞춤안내 결과) =================
SRC3 = SRC.rstrip('/').rsplit('/',1)[0] + '/contents_3rd/'
STRIP = '<div class="demo-strip-bn"><span class="demo-badge">가상 서비스</span>시연용 가상 화면 · 예시 데이터</div>'
def bn_common(s, title, page):
    s = s.replace('../../static/', 'static/')
    s = re.sub(r'<script(?![^>]*\bsrc=)[^>]*>.*?</script>', '', s, flags=re.S)
    s = re.sub(r'<title>.*?</title>', '<title>[가상 서비스] ' + title + '</title>', s, flags=re.S)
    s = s.replace('</head>', '<meta name="robots" content="noindex,nofollow">\n<link rel="stylesheet" href="demo/demo.css">\n</head>', 1)
    s = re.sub(r'<body[^>]*>', '<body data-page="' + page + '">\n' + STRIP, s, count=1)
    s = s.replace('</body>', '<script src="demo/data.js"></script>\n<script src="demo/demo-benefit.js"></script>\n</body>', 1)
    return s

b = open(SRC3 + 'OTT_#Uc11c#Ube44#Uc2a4#Uc0c1#Uc138.html', encoding='utf-8').read()
b = b.replace('<h3 class="tit-fake">국민내일배움카드</h3>', '<h3 class="tit-fake" id="bnTitle"></h3>')
b = inner_replace(b, '<div class="bn-view-service sch-baeum-card">', '<div class="section-2" id="bnDetail"></div>')
b = b.replace('<a href="" class="btn">신청하기</a>', '<a href="#" class="btn" id="bnApply">신청하기</a>')
b = bn_common(b, '서비스 상세 | 혜택알리미', 'bn-detail')
open(OUT + 'benefit.html', 'w', encoding='utf-8').write(b)

l = open(SRC3 + 'OTT_#Ub9de#Ucda4#Uc548#Ub0b4#Uc870#Ud68c#Uacb0#Uacfc.html', encoding='utf-8').read()
i = l.find('<div class="bn-list-card col3">'); j = l.find('<ul class="list">', i); k = l.find('</ul>', j)
# 중첩 ul 없는 구조 확인 후 교체
seg = l[j:]
depth = 0
for m in re.finditer(r'<(/?)ul\b', seg):
    depth += 1 if m.group(1) == '' else -1
    if depth == 0:
        end = j + seg.find('>', m.start()) + 1; break
l = l[:j] + '<ul class="list" id="bnList"></ul>' + l[end:]
l = l.replace('<em class="name">김지영</em>', '<em class="name">홍길동</em>')
l = bn_common(l, '맞춤안내 조회 결과 | 혜택알리미', 'bn-list')
open(OUT + 'benefit-list.html', 'w', encoding='utf-8').write(l)
print('bn ok')
