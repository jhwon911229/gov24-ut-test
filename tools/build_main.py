"""정부24 앱 메인(로그인 전) 시연 화면 생성.
기준: 피그마 '01. 메인(앱/웹)' > APP_UI-PT-AAA01M_로그인전(24227:102020 / 24227:102755)
마크업: 퍼블리싱 UI-PT-AAA01M-AD_3차_default.html
사용: python3 tools/build_main.py <퍼블리싱 contents 폴더>
"""
import re, sys, os
SRC = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/up/html/html/contents/'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'main.html')
s = open(os.path.join(SRC, 'UI-PT-AAA01M-AD_3#Ucc28_default.html'), encoding='utf-8').read()

def find_block(s, start_pat, tag='div', frm=0):
    """start_pat 로 시작하는 태그 블록의 (시작, 끝) 위치"""
    i = s.find(start_pat, frm)
    if i < 0: raise Exception('nf: ' + start_pat)
    depth = 0
    for m in re.finditer(r'<(/?)%s\b' % tag, s[i:]):
        depth += 1 if m.group(1) == '' else -1
        if depth == 0:
            return i, s.find('>', i + m.end()) + 1
    raise Exception('unbalanced')
def remove(s, pat, tag='div'):
    i, j = find_block(s, pat, tag); return s[:i] + s[j:]
def replace_block(s, pat, new, tag='div'):
    i, j = find_block(s, pat, tag); return s[:i] + new + s[j:]

NOTICE = '<p class="txt demo-notice"><span class="demo-badge">가상 서비스</span>시연용 가상 화면 · 실제 민원 접수 안 됨</p>'
s = s.replace('../../static/', 'static/')
s = re.sub(r'<script(?![^>]*\bsrc=)[^>]*>.*?</script>', '', s, flags=re.S)
s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
s = re.sub(r'<title>.*?</title>', '<title>[가상 서비스] 정부24</title>', s, flags=re.S)
s = s.replace('</head>', '<meta name="robots" content="noindex,nofollow">\n<link rel="stylesheet" href="demo/demo.css">\n</head>', 1)
s = s.replace('<p class="txt">이 누리집은 대한민국 공식 전자정부 누리집입니다.</p>', NOTICE)
s = s.replace('<body>', '<body data-page="main">', 1)

# 자동 팝업 모달 제거
while 'class="iw-modal-auto' in s:
    i = s.find('<div class="iw-modal-auto'); s = remove(s, s[i:i+40])

# 헤더: 로그인 전 → 로고 노출, 사용자 정보 제거
s = s.replace('<header id="iw_header" class="main sch-main has-user">', '<header id="iw_header" class="main sch-main">')
s = remove(s, '<a href="" class="user-info">', 'a')
s = s.replace('<div class="header-top">', '<div class="header-top">\n<h1 class="logo"><a href="main.html"><span class="sr-only">정부24</span></a></h1>', 1)
s = s.replace('<button type="button" class="btn-txt ico-before ico-sammy-ai">정부24 AI</button>',
              '<a href="ai.html" class="btn-txt ico-before ico-sammy-ai">AI국민비서</a>')
s = s.replace('<a href="" class="btn-txt ico-before ico-sammy-ai">정부24 AI</a>',
              '<a href="ai.html" class="btn-txt ico-before ico-sammy-ai">AI국민비서</a>')

# 한줄 공지(검은 띠) 제거, 상시 공지 문구
s = remove(s, '<div class="mo-main-notice-wrap">')
s = s.replace('<i class="iconset ico-bell"></i> 새로운 공지사항 확인하기', '<i class="iconset ico-bell"></i> 공지사항 확인하기')

# AI 검색창: 자동완성 제거, 누르면 AI국민비서 대화로
s = remove(s, '<div class="auto-complete-area">')
s = s.replace('<input type="search" placeholder="정부24에 물어보세요" title="검색어 입력" id="mainSearch" class="input" autocomplete="off">',
              '<input type="search" placeholder="AI 정부24에 물어보세요" title="AI 정부24에 물어보기" id="mainSearch" class="input" autocomplete="off" enterkeyhint="send">')

# AI국민비서 바로가기 버튼(피그마 현행본에 없음) 제거
s = remove(s, '<div class="mp-main-section">')

# 자주 찾는 서비스(비로그인) 6개 — 피그마 현행본 순서
FAV = [('토지(임야)대장', 'ico-main-pdf'), ('주민등록등본(초본)', 'ico-main-pdf'), ('자동차등록원부', 'ico-main-pc'),
       ('건축물대장', 'ico-main-pdf'), ('가족관계증명서', 'ico-main-new-window'), ('여권 재발급', 'ico-main-edit')]
fav = '<ul class="list">' + ''.join(
    f'<li><a href="#" title="{t}" class="btn-mo-main-link" data-demo="fav"><span class="txt ellipsis">{t}</span><i class="iconset {ic}"></i></a></li>'
    for t, ic in FAV) + '</ul>'
j, k = find_block(s, '<ul class="list">', 'ul', s.find('<div class="sch-mo-favorite-wrap">'))
s = s[:j] + fav + s[k:]
# 자주찾는 서비스 펼쳐보기 모달 제거
while 'id="layerModal_gatherMo"' in s:
    i = s.rfind('<div', 0, s.find('id="layerModal_gatherMo"')); s = remove(s, s[i:i+30])

# 로그인 후 영역·이벤트 배너·바로가기 스와이퍼 제거
for pat in ['<div class="sch-mo-favorite-wrap has-user">', '<div class="mo-main-event-banner">', '<div class="sch-mo-new-shortcut-wrap">']:
    while pat in s: s = remove(s, pat)
while '<div class="sch-mo-fld-cont sch-mo-benefit-wrap has-user">' in s:
    s = remove(s, '<div class="sch-mo-fld-cont sch-mo-benefit-wrap has-user">')
# 비어 있는 mo-main-section 제거
s = re.sub(r'<div class="mo-main-section">\s*</div>', '', s)

# 혜택알리미 카드 문구(피그마)
s = re.sub(r'(class="[^"]*?)\s*\blike\b', r'\1', s)
s = s.replace('<p class="tit">산모·신생아 지원</p>', '<p class="tit">급한 생활비, 대출 지원</p>')
s = s.replace('<a href="" class="btn-txt" title="혜택알리미">', '<a href="benefit-list.html" class="btn-txt" title="혜택알리미">')
s = s.replace('<a href="" class="bn-card', '<a href="benefit-list.html" class="bn-card')
# 생활가이드 '데이터 없음' 중복 섹션 제거
m = re.search(r'<div class="mo-main-section">\s*<div class="sch-mo-fld-cont sch-mo-lifeguide-wrap">(?:(?!mo-main-section).)*?main-no-data', s, re.S)
if m: s = s[:m.start()] + remove(s[m.start():], '<div class="mo-main-section">')
# 생활가이드 '더보기'(피그마 현행본에 없음) 제거
while '<div class="btn-more-area">' in s: s = remove(s, '<div class="btn-more-area">')

# 하단 탭바(앱 네이티브 영역 재현)
TAB = '''
<nav class="demo-tabbar" aria-label="하단 메뉴">
  <a href="#" data-demo="tab"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="10" r="2.5"/><path d="M8 16.5c.8-1.6 2.3-2.5 4-2.5s3.2.9 4 2.5"/></svg><span>내 지갑</span></a>
  <a href="#" data-demo="tab"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v6"/><path d="M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5"/><circle cx="16" cy="16" r="3"/><path d="m18.2 18.2 2.3 2.3"/></svg><span>주제별 보기</span></a>
  <a href="#" data-demo="tab"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="9" height="12" rx="2"/><rect x="12" y="6" width="9" height="12" rx="2"/><path d="M7.5 10v4M16.5 10v4"/></svg><span>문서진위확인</span></a>
  <a href="benefit-list.html"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="9" width="16" height="12" rx="2"/><path d="M3 9h18M12 9v12"/><path d="M12 9c-1.5-3-5-3.5-5-1.2C7 9 12 9 12 9s5 0 5-1.2C17 5.5 13.5 6 12 9z"/></svg><span>혜택알림</span></a>
</nav>'''
s = s.replace('</footer>', '</footer>\n<div class="demo-foot-note">이 화면은 「정부24 AI국민비서」 사용성 평가를 위해 만든 <strong>가상 서비스(시연용)</strong>입니다. 실제 인증·발급·신청은 이루어지지 않습니다.</div>' + TAB, 1)
s = s.replace('</body>', '<script src="demo/demo-main.js"></script>\n</body>', 1)
s = re.sub(r'\n\s*\n+', '\n', s)
open(OUT, 'w', encoding='utf-8').write(s)
print('main.html', len(s))
