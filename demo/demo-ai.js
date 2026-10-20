/* =========================================================
   demo-ai.js — 정부24 AI국민비서 사용성 평가 시연(가상 서비스)
   퍼블리싱 마크업(UI-AI-LGA01M / _dialogue) 구조 그대로 대화를 생성
   · 민원 발급: 확인 → 로그인(가상 간편인증) → 주소 확인/선택 → 온라인발급(본인출력) → 완료
   · 혜택 조회: 조건 요청 → 조건 포함 재질문 → 조회 진행 → 혜택 카드 / 결과 없음
   ========================================================= */
(function () {
  'use strict';
  var D = window.DEMO;
  var VOICE_URL = 'https://voice.myvoicedemos.com/';
  var page = document.body.getAttribute('data-page');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var uid = 0; function nid(p) { return (p || 'd') + '_' + (++uid); }
  function el(html) { var t = document.createElement('div'); t.innerHTML = html.trim(); return t.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- 토스트 ---------- */
  var toastEl = el('<div class="demo-toast" role="status" aria-live="polite"></div>'); document.body.appendChild(toastEl);
  var tT; function toast(html, ms) { toastEl.innerHTML = html; toastEl.classList.add('on'); clearTimeout(tT); tT = setTimeout(function () { toastEl.classList.remove('on'); }, ms || 2600); }

  /* ---------- 퍼블리싱 모달 ---------- */
  function modal(title, bodyHtml, footHtml) {
    var host = $('.iw-ai-wrap') || document.body;
    var id = nid('modal');
    var m = el('<div class="iw-ai-modal demo-modal" id="' + id + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '_t">' +
      '<div class="modal-wrap"><div class="modal-dialog" tabindex="0">' +
      '<div class="modal-header"><h2 class="modal-title" id="' + id + '_t">' + title + '</h2></div>' +
      '<div class="modal-body" tabindex="0">' + bodyHtml + '</div>' +
      (footHtml ? '<div class="modal-footer"><div class="btn-wrap">' + footHtml + '</div></div>' : '') +
      '<button type="button" class="btn-close-modal close-modal"><span class="sr-only">닫기</span></button>' +
      '</div></div></div>');
    host.appendChild(m);
    var prev = document.activeElement;
    requestAnimationFrame(function () { m.classList.add('on'); document.body.classList.add('overflow'); $('.modal-dialog', m).focus(); });
    function close() { m.classList.remove('on'); m.remove(); if (!$('.iw-ai-modal.on')) document.body.classList.remove('overflow'); if (prev && prev.focus) prev.focus(); }
    $$('.close-modal', m).forEach(function (b) { b.addEventListener('click', close); });
    m.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    m.addEventListener('click', function (e) { if (e.target === m || e.target.classList.contains('modal-wrap')) close(); });
    return { el: m, close: close, body: $('.modal-body', m) };
  }

  function openVoice() {
    var md = modal('말로 물어보기',
      '<p class="demo-sub">음성 대화는 <strong>‘음성 서비스’ 시연</strong>에서 체험할 수 있어요.<br>이 화면에서는 글로 입력하거나 예시 질문을 눌러 주세요.</p>',
      '<button type="button" class="btn tertiary close-modal">닫기</button><a class="btn" href="' + VOICE_URL + '" target="_blank" rel="noopener">음성 서비스 열기</a>');
  }

  /* ---------- 공통 버튼 ---------- */
  function goChat(q) { location.href = 'chat.html?q=' + encodeURIComponent(q); }
  document.addEventListener('click', function (e) {
    var mic = e.target.closest('.btn-mic');
    if (mic) { e.preventDefault(); e.stopPropagation(); openVoice(); return; }
    var nq = e.target.closest('.btn-new-question');
    if (nq) { e.preventDefault(); location.href = 'ai.html'; return; }
  }, true);

  /* =========================================================
     전용홈
     ========================================================= */
  if (page === 'home') {
    var ta = $('.iw-ai-main .iw-ai-input');
    var send = function () { var v = (ta.value || '').trim(); if (v) goChat(v); else ta.focus(); };
    $('.iw-ai-main .btn-search').addEventListener('click', send);
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } });
    $$('.iw-ai-news-area .news-wrap .tit').forEach(function (b) {
      b.addEventListener('click', function () { goChat(b.textContent.replace(/[“”"]/g, '').trim()); });
    });
    var Q = { '주민등록등본(초본)': '주민등록등본 발급해줘', '납세증명': '납세증명서 발급해줘', '소득금액 증명': '소득금액증명 발급해줘', '건강보험 자격득실 확인': '건강보험 자격득실 확인서 발급해줘', '사업자등록 증명': '사업자등록증명 발급해줘' };
    $$('.compact-service-list li').forEach(function (li) {
      var name = $('.txt', li).textContent.trim();
      var ai = $('.btn-ai', li), lk = $('.btn-link', li);
      if (ai) ai.addEventListener('click', function () { goChat(Q[name] || (name + ' 발급해줘')); });
      if (lk) lk.addEventListener('click', function (e) { e.preventDefault(); toast('시연에서는 <strong>AI</strong> 버튼으로 대화 발급을 체험할 수 있어요.'); });
    });
    var mode = new URLSearchParams(location.search).get('mode');
    if (mode) ta.setAttribute('placeholder', mode === 'benefit' ? '예) 내가 받을 수 있는 혜택 알려줘' : '예) 주민등록등본 발급해줘');
    return;
  }

  /* =========================================================
     대화
     ========================================================= */
  var log = $('#log');
  var st = { await: null, doc: null, loggedIn: false, sido: D.user.sido, sigungu: D.user.sigungu };
  var input = $('.input-ai-area.bottom .iw-ai-input');

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function scrollEnd(node) {
    requestAnimationFrame(function () {
      var target = node || log.lastElementChild; if (!target) return;
      var r = target.getBoundingClientRect();
      var bar = $('.input-ai-area.bottom');
      var limit = bar ? Math.min(window.innerHeight, bar.getBoundingClientRect().top) - 16 : window.innerHeight - 140;
      var d = r.bottom - limit; if (d <= 0) return;
      var maxd = r.top - 90; if (maxd > 0) d = Math.min(d, maxd);
      window.scrollBy({ top: d, behavior: 'smooth' });
    });
  }
  function userMsg(t) { var n = el('<div class="iw-ai-my-q"><div class="cont"></div></div>'); n.firstChild.textContent = t; log.appendChild(n); scrollEnd(n); }
  var TITLE = '<div class="iw-ai-title-wrap"><div class="left"><p class="tit"><span>정부<span class="sr-only">24</span></span> <span class="point">AI국민비서</span></p></div></div>';
  var firstInTurn = true;
  async function ai(build, delay) {
    var sec = el('<div class="iw-ai-answer ai-conversation-section">' + (firstInTurn ? TITLE : '') + '<div class="demo-typing" aria-label="답변 작성 중"><i></i><i></i><i></i></div></div>');
    firstInTurn = false;
    log.appendChild(sec); scrollEnd(sec);
    await wait(delay == null ? 700 : delay);
    $('.demo-typing', sec).remove();
    build(sec); scrollEnd(sec);
    return sec;
  }
  function P(html, cls) { return el('<p class="' + (cls || 'ai-followup-copy') + '">' + html + '</p>'); }
  function util(sec) {
    var u = el('<div class="iw-ai-util-area"><div class="iw-ai-feedback">' +
      '<button type="button" class="btn-feedback"><i class="iconset ico-good"><span class="sr-only">좋아요</span></i></button>' +
      '<button type="button" class="btn-feedback"><i class="iconset ico-bad"><span class="sr-only">싫어요</span></i></button></div>' +
      '<div class="iw-ai-reading"><button type="button" class="btn-reading"><i class="iconset ico-reading" aria-hidden="true"></i> <span class="reading-label">답변전체읽기</span></button></div></div>');
    u.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('btn-reading')) { toast('시연 화면에서는 음성 낭독을 제공하지 않아요.'); return; }
      var on = !b.classList.contains('on');
      $$('.btn-feedback', u).forEach(function (x) { x.classList.remove('on'); });
      if (on) { b.classList.add('on'); toast('의견을 보내 주셔서 감사합니다.'); }
    });
    sec.appendChild(u);
  }
  /* 선택 칩 (퍼블리싱 form-chip chip-square) */
  function chips(sec, items) {
    var name = nid('chip');
    var w = el('<div class="chip-area ai-conversation-actions"></div>');
    items.forEach(function (it, i) {
      var id = name + '_' + i;
      var c = el('<div class="form-chip chip-square"><input type="radio" name="' + name + '" id="' + id + '"><label for="' + id + '">' + esc(it.label) + '</label></div>');
      $('input', c).addEventListener('change', function () {
        $$('input', w).forEach(function (x) { x.disabled = true; });
        st.await = null; userMsg(it.say || it.label); it.fn();
      });
      w.appendChild(c);
    });
    sec.appendChild(w); return w;
  }
  function lockChips() { $$('#log .chip-area input:not(:disabled)').forEach(function (x) { x.disabled = true; }); }
  function quick(sec, list) {
    var w = el('<div class="chip-area demo-quick"></div>'), name = nid('q');
    list.forEach(function (q, i) {
      var id = name + '_' + i;
      var c = el('<div class="form-chip chip-square"><input type="radio" name="' + name + '" id="' + id + '"><label for="' + id + '">' + esc(q) + '</label></div>');
      $('input', c).addEventListener('change', function () { $$('input', w).forEach(function (x) { x.disabled = true; }); handle(q); });
      w.appendChild(c);
    });
    sec.appendChild(w);
  }

  /* ---------- 라우팅 ---------- */
  var RE_BENEFIT = /혜택|지원금|지원 |지원$|지원해|지원 알려|수당|받을 수|바우처|보조금|난방/;
  var RE_YES = /^(응|네|예|어|그래|좋아|맞아|맞아요|발급해|발급해줘|해줘|진행|ㅇㅇ|웅)/;
  var RE_NO = /아니|그만|취소|안 ?할|싫/;
  function findDoc(t) { for (var i = 0; i < D.docs.length; i++) if (D.docs[i].re.test(t)) return D.docs[i]; return null; }
  function findSet(t) { for (var i = 0; i < D.benefitSets.length; i++) if (D.benefitSets[i].re.test(t)) return D.benefitSets[i]; return null; }

  function handle(text) {
    text = (text || '').trim(); if (!text) return;
    userMsg(text); firstInTurn = true;
    var t = text.replace(/\s+/g, ' '), a = st.await;
    if (a === 'confirm') { if (RE_NO.test(t)) { lockChips(); return stopIssue(); } if (RE_YES.test(t) || /발급/.test(t)) { lockChips(); return issueStart(); } }
    if (a === 'login' && /로그인|인증|응|네/.test(t)) return openAuth();
    if (a === 'addr') { if (RE_NO.test(t) || /다시/.test(t)) { lockChips(); return addrPick(); } if (RE_YES.test(t)) { lockChips(); return issueRun(); } }
    if (a === 'benefitCond') { lockChips(); st.await = null; var s0 = findSet(t); return s0 ? benefitSearch(s0) : benefitNone(); }
    var doc = findDoc(t);
    if (doc && /발급|떼|뗄|출력|필요|신청|등본|초본|증명/.test(t) && !RE_BENEFIT.test(t)) return issueAsk(doc);
    var set = findSet(t);
    if (set && (RE_BENEFIT.test(t) || set.key !== 'gyeonggi')) return benefitSearch(set);
    if (RE_BENEFIT.test(t)) return benefitAsk();
    return ai(function (s) {
      s.appendChild(P('시연 화면에서는 <strong>민원서류 발급</strong>과 <strong>혜택 조회</strong>를 체험할 수 있어요. 아래 질문을 눌러 보세요.'));
      quick(s, ['주민등록등본 발급해줘', '내가 받을 수 있는 혜택 알려줘']); util(s);
    });
  }

  /* ---------- 민원 발급 ---------- */
  function issueAsk(doc) {
    st.doc = doc; st.await = 'confirm';
    return ai(function (s) {
      s.appendChild(el('<p>' + doc.short + (/[서명]$/.test(doc.short) ? '를' : '을') + ' 발급할까요?</p>'));
      chips(s, [{ label: '발급하기', fn: issueStart }, { label: '그만두기', fn: stopIssue }]);
    });
  }
  function stopIssue() {
    st.await = null; firstInTurn = true;
    return ai(function (s) { s.appendChild(P('발급을 진행하지 않을게요. 다른 도움이 필요하면 말씀해 주세요.')); quick(s, ['내가 받을 수 있는 혜택 알려줘']); util(s); });
  }
  function issueStart() {
    if (st.loggedIn) return addrAsk();
    st.await = 'login';
    return ai(function (s) {
      var pm = el('<div class="ai-process-messages"><ul class="ai-process-list">' +
        '<li class="login-step"><span class="text-shimmer">로그인을 진행해 주세요.</span> <a href="#" class="btn-txt sm ico-arr-right">로그인하기</a></li></ul></div>');
      $('a', pm).addEventListener('click', function (e) { e.preventDefault(); openAuth(); });
      s.appendChild(pm);
    });
  }
  function openAuth() {
    if ($('.demo-auth.on')) return;
    var certs = ['간편인증 A', '간편인증 B', '간편인증 C', '간편인증 D', '간편인증 E', '간편인증 F'];
    var md = modal('간편인증 로그인<span class="demo-tag">가상</span>',
      '<p class="demo-sub">시연용 가상 인증입니다. 개인정보를 입력하지 않고, 버튼만 누르면 다음 단계로 넘어갑니다.</p>' +
      '<div class="demo-certs" role="group" aria-label="인증 수단 선택">' + certs.map(function (c, i) { return '<button type="button" class="demo-cert" aria-pressed="' + (i === 0) + '"><i>' + 'ABCDEF'[i] + '</i>' + c + '</button>'; }).join('') + '</div>' +
      '<dl class="demo-ro"><div><dt>이름</dt><dd>' + D.user.name + '</dd></div><div><dt>생년월일</dt><dd>' + D.user.birth + '</dd></div><div><dt>휴대폰</dt><dd>' + D.user.phone + '</dd></div></dl>',
      '<button type="button" class="btn tertiary close-modal">취소</button><button type="button" class="btn" data-go>인증 요청</button>');
    md.el.classList.add('demo-auth');
    $('.demo-certs', md.el).addEventListener('click', function (e) {
      var b = e.target.closest('.demo-cert'); if (!b) return;
      $$('.demo-cert', md.el).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true');
    });
    $('[data-go]', md.el).addEventListener('click', function () {
      md.body.innerHTML = '<div class="demo-wait"><div class="spin"></div><p>인증 앱에서 확인 중이에요</p><small>시연에서는 잠시 후 자동으로 완료됩니다.</small></div>';
      var f = $('.modal-footer', md.el); if (f) f.remove();
      setTimeout(function () {
        md.body.innerHTML = '<div class="demo-wait"><p>인증이 완료되었어요</p><small>대화 화면으로 돌아갑니다.</small></div>';
        setTimeout(function () { md.close(); afterLogin(); }, 700);
      }, 1500);
    });
  }
  function afterLogin() {
    st.loggedIn = true;
    var li = $('#log .login-step');
    if (li) { li.className = 'done'; li.innerHTML = '로그인이 완료되었습니다.'; }
    addrAsk();
  }
  function addrAsk() {
    if (!st.doc.addr) return issueRun();
    st.await = 'addr';
    var host = $('#log .login-step, #log .ai-process-list li.done') ? log.lastElementChild : null;
    return ai(function (s) {
      s.appendChild(el('<div class="box-alert warning no-tit"><p class="txt icon">화면을 이동하면 발급이 종료됩니다</p></div>'));
      s.appendChild(P(D.user.name + '님, 안녕하세요. 주민등록상 주소가 <strong>“' + D.user.sido + ' ' + D.user.sigungu + '”</strong>가 맞나요? 아니라면 다시 골라 주세요.'));
      chips(s, [{ label: '맞아요', fn: issueRun }, { label: '아니요, 다시 고를게요', fn: addrPick }]);
    }, 500);
  }
  function accordion(title, legend, name, items) {
    var id = nid('acc');
    var sec = el('<section class="ai-package-panel" aria-labelledby="' + id + '_h">' +
      '<h3 class="employment-package-heading" id="' + id + '_h"><button type="button" class="employment-package-toggle" aria-expanded="true" aria-controls="' + id + '_d">' +
      '<span class="employment-package-title">' + title + '</span><i class="issue-toggle-icon is-open" aria-hidden="true"></i></button></h3>' +
      '<div class="employment-package-detail" id="' + id + '_d"><fieldset class="employment-package-options"><legend class="sr-only">' + legend + '</legend>' +
      '<div class="employment-package-items"><div class="chk-area"></div></div></fieldset></div></section>');
    fillRadios(sec, name, items);
    var tg = $('.employment-package-toggle', sec);
    tg.addEventListener('click', function () { setOpen(sec, tg.getAttribute('aria-expanded') !== 'true'); });
    return sec;
  }
  function fillRadios(sec, name, items) {
    var area = $('.chk-area', sec); area.innerHTML = '';
    items.forEach(function (v, i) {
      var id = name + '_' + i;
      area.appendChild(el('<div class="form-check"><input type="radio" name="' + name + '" id="' + id + '" value="' + esc(v) + '"><label for="' + id + '">' + esc(v) + '</label></div>'));
    });
  }
  function setOpen(sec, open) {
    var tg = $('.employment-package-toggle', sec);
    tg.setAttribute('aria-expanded', open ? 'true' : 'false');
    $('.issue-toggle-icon', sec).classList.toggle('is-open', open);
    $('.employment-package-detail', sec).hidden = !open;
  }
  function addrPick() {
    st.await = 'addrPick'; firstInTurn = false;
    return ai(function (s) {
      s.appendChild(el('<p>주민등록상 주소에 해당하는 <strong>“시도”</strong>와 <strong>“시군구”</strong>를 선택해 주세요.</p>'));
      var n1 = nid('sido'), n2 = nid('sgg');
      var a1 = accordion('시도를 골라주세요', '시도 목록', n1, Object.keys(D.sido));
      var a2 = accordion('시군구를 골라주세요', '시군구 목록', n2, []);
      $('.chk-area', a2).innerHTML = '<p class="form-hint">시도를 먼저 골라 주세요.</p>';
      var acts = el('<div class="ai-conversation-actions"><button type="button" class="btn" disabled>선택 완료</button></div>');
      var go = $('button', acts), sido = null, sgg = null;
      a1.addEventListener('change', function (e) {
        sido = e.target.value; sgg = null; go.disabled = true;
        $('.employment-package-title', a1).textContent = '시도 : ' + sido;
        $('.employment-package-title', a2).textContent = '시군구를 골라주세요';
        fillRadios(a2, n2, D.sido[sido]); setOpen(a1, false); setOpen(a2, true); scrollEnd(acts);
      });
      a2.addEventListener('change', function (e) { sgg = e.target.value; $('.employment-package-title', a2).textContent = '시군구 : ' + sgg; go.disabled = false; scrollEnd(acts); });
      go.addEventListener('click', function () {
        if (!sido || !sgg) return;
        go.disabled = true; setOpen(a1, false); setOpen(a2, false);
        $$('input', s).forEach(function (i) { i.disabled = true; });
        st.sido = sido; st.sigungu = sgg; st.await = null;
        userMsg(sido + ' ' + sgg); issueRun();
      });
      s.appendChild(a1); s.appendChild(a2); s.appendChild(acts);
    });
  }
  async function issueRun() {
    st.await = null; firstInTurn = false;
    var doc = st.doc, addr = doc.addr ? '“' + st.sido + ' ' + st.sigungu + '”(으)로 ' : '';
    var s = await ai(function (s) {
      s.appendChild(P(addr + '온라인발급(본인출력)을 진행합니다. 발급이 완료되면 인쇄할 수 있습니다.'));
      s.appendChild(el('<div class="ai-process-messages"><ul class="ai-process-list"><li class="run"><span class="text-shimmer">' + doc.name + ' 발급 중입니다.</span></li></ul></div>'));
    }, 500);
    await wait(1600);
    var li = $('.ai-process-list .run', s); li.className = 'done'; li.textContent = doc.name + ' 발급이 완료되었습니다.';
    s.appendChild(P('발급이 완료되었습니다. 자세한 신청 내역은 서비스 신청 내역을 확인해 주세요.', 'ai-complete-message'));
    var acts = el('<div class="ai-conversation-actions"><button type="button" class="btn secondary">' + doc.name + ' 인쇄하기</button></div>');
    $('button', acts).addEventListener('click', function () { window.open('print.html?doc=' + encodeURIComponent(doc.name) + '&sido=' + encodeURIComponent(st.sido) + '&sgg=' + encodeURIComponent(st.sigungu), '_blank'); });
    s.appendChild(acts);
    var ch = el('<div class="answer-choice"><a href="#" class="btn-choice"><span>서비스 신청내역</span><i class="iconset ico-arr-more" aria-hidden="true"></i></a></div>');
    $('a', ch).addEventListener('click', function (e) { e.preventDefault(); toast('시연에서는 신청내역 화면으로 이동하지 않아요.'); });
    s.appendChild(ch);
    util(s);
    s.appendChild(el('<p class="form-hint">이어서 이런 것도 물어볼 수 있어요.</p>'));
    quick(s, ['내가 받을 수 있는 혜택 알려줘']);
    scrollEnd(s);
  }

  /* ---------- 혜택 조회 ---------- */
  function benefitAsk() {
    st.await = 'benefitCond';
    return ai(function (s) {
      s.appendChild(el('<p><strong>정확한 정보를 위해 조금 더 알려주세요.</strong><br>예를 들어 궁금한 지역, 연령대, 상황 등을 같이 적어 주세요.<br>“경기도 혜택”, “60대 이상 혜택”, “아이가 태어났을 때” 등</p>'));
      util(s);
      quick(s, ['경기도에서 내가 받을 수 있는 혜택이 뭐야?', '60대 이상 혜택 알려줘', '아이가 태어났을 때 받을 수 있는 혜택']);
    });
  }
  async function progress() {
    var s = await ai(function (s) {
      s.appendChild(el('<div class="ai-progress-wrap"><div class="ai-progress-label"><span class="secondary-txt">혜택을 조회 중이에요.</span></div>' +
        '<div class="ai-progress-bar --type-bg-gray" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span style="width:0%"></span></div></div>'));
    }, 500);
    var bar = $('.ai-progress-bar span', s);
    requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.width = '100%'; $('.ai-progress-bar', s).setAttribute('aria-valuenow', '100'); }); });
    await wait(2300);
    $('.ai-progress-label .secondary-txt', s).textContent = '조회가 끝났어요.';
    return s;
  }
  function cardHtml(it) {
    return '<a href="#" class="btn-card-box" data-id="' + it.id + '" title="상세 보기"><b class="tit">' + esc(it.t) + '<i class="iconset ico-ai-arrow" aria-hidden="true"></i></b>' +
      '<p class="txt"><span>대상 :</span><span>' + esc(it.who) + '</span></p><p class="txt">기간 : ' + esc(it.when) + '</p></a>';
  }
  async function benefitSearch(set) {
    st.await = null;
    var s = await progress();
    s.appendChild(P('맞춤 혜택을 찾았어요.', 'ai-complete-message'));
    var panel = el('<div class="ai-card-link-panel">' + set.items.map(cardHtml).join('') +
      '<button type="button" class="btn-more">' + set.total + '개 혜택 더보기<i class="iconset ico-ai-arrow" aria-hidden="true"></i></button></div>');
    panel.addEventListener('click', function (e) {
      var c = e.target.closest('.btn-card-box');
      if (c) { e.preventDefault(); window.open('benefit.html?id=' + c.dataset.id, '_blank'); return; }
      if (e.target.closest('.btn-more')) window.open('benefit-list.html?set=' + set.key, '_blank');
    });
    s.appendChild(panel); util(s); scrollEnd(s);
  }
  async function benefitNone() {
    var s = await progress();
    s.appendChild(P('아쉽게도 맞춤 혜택이 없어요.', 'ai-complete-message'));
    s.appendChild(el('<p>정확한 혜택 조회를 위해서 혜택알리미 서비스를 이용해 보세요.<br>1만여 종의 혜택을 볼 수 있어요.</p>'));
    var ch = el('<div class="answer-choice"><a href="#" class="btn-choice"><span>내 맞춤 조건 설정하기</span><i class="iconset ico-arr-more" aria-hidden="true"></i></a></div>');
    $('a', ch).addEventListener('click', function (e) { e.preventDefault(); window.open('benefit-list.html?set=gyeonggi', '_blank'); });
    s.appendChild(ch); util(s);
    s.appendChild(el('<p class="form-hint">이렇게 다시 물어볼 수도 있어요.</p>'));
    quick(s, ['경기도에서 받을 수 있는 혜택 알려줘', '60대 이상 혜택 알려줘']);
    scrollEnd(s);
  }
  function openBenefit(it, set) {
    var md = modal('혜택알리미',
      '<div class="demo-bn"><div class="demo-bn-tags"><span>' + set.label + '</span><span>' + esc(it.when) + '</span><span class="ex">시연용 예시 데이터</span></div>' +
      '<h3>' + esc(it.t) + '</h3><p class="org">' + esc(it.org) + '</p>' +
      '<section><h4>지원 대상</h4><p>' + esc(it.who) + '</p></section>' +
      '<section><h4>지원 내용</h4><p>' + esc(it.what) + '</p></section>' +
      '<section><h4>신청 방법</h4><p>' + esc(it.how) + '</p></section>' +
      '<section><h4>안내</h4><p>사용성 평가용 가상 화면입니다. 실제 지원 대상·금액·기간은 소관 기관의 공고를 확인해 주세요.</p></section></div>',
      '<button type="button" class="btn tertiary close-modal">대화로 돌아가기</button><button type="button" class="btn" data-apply>신청하러 가기</button>');
    $('[data-apply]', md.el).addEventListener('click', function () { toast('시연에서는 실제 신청 화면으로 이동하지 않아요.'); });
  }
  function openBenefitList(set) {
    var md = modal('혜택알리미',
      '<div class="demo-bn"><div class="demo-bn-tags"><span>' + set.label + '</span><span class="ex">시연용 예시 데이터</span></div>' +
      '<h3>맞춤 혜택 ' + set.total + '개</h3><p class="org">이 중 일부만 예시로 보여 드려요.</p>' +
      '<div class="iw-ai-wrap"><div class="ai-card-link-panel">' + set.items.map(cardHtml).join('') + '</div></div></div>',
      '<button type="button" class="btn close-modal">대화로 돌아가기</button>');
    $('.ai-card-link-panel', md.el).addEventListener('click', function (e) {
      var c = e.target.closest('.btn-card-box'); if (!c) return; e.preventDefault();
      openBenefit(set.items.filter(function (x) { return x.id === c.dataset.id; })[0], set);
    });
  }

  /* ---------- 입력 ---------- */
  function sendInput() { var v = (input.value || '').trim(); if (!v) { input.focus(); return; } input.value = ''; handle(v); }
  $('.input-ai-area.bottom .btn-search').addEventListener('click', sendInput);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendInput(); } });

  var q = new URLSearchParams(location.search).get('q');
  if (q) handle(q); else location.replace('ai.html');
})();
