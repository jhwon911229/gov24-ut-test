/* demo-main.js — 정부24 앱 메인(가상) : AI 검색창 → AI국민비서 대화 */
(function () {
  'use strict';
  var toastEl = document.createElement('div'); toastEl.className = 'demo-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  var tT; function toast(m) { toastEl.innerHTML = m; toastEl.classList.add('on'); clearTimeout(tT); tT = setTimeout(function () { toastEl.classList.remove('on'); }, 2600); }
  var tb = document.querySelector('.demo-tabbar'); if (tb) document.body.appendChild(tb);
  var input = document.getElementById('mainSearch');
  var btn = document.querySelector('.mo-main-search-new .btn-total-search');
  function go() {
    var q = (input.value || '').trim();
    location.href = q ? 'chat.html?q=' + encodeURIComponent(q) : 'ai.html';
  }
  if (input) {
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); go(); } });
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); go(); });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-demo], .header-util a[href=""], .header-util button, .mo-main-notice-always a, .sch-mo-lifeguide-wrap a, .sch-mo-shorcut-wrap a');
    if (!a || a.getAttribute('href') === 'ai.html') return;
    e.preventDefault();
    toast('시연에서는 <strong>AI 검색창</strong>에 질문을 입력해 주세요.');
  });
})();
/* 허브에서 들어온 경우(?mode=minwon|benefit) 예시 질문 안내 */
(function () {
  var mode = new URLSearchParams(location.search).get('mode');
  var tb = document.querySelector('.demo-tabbar'); if (tb) document.body.appendChild(tb);
  var input = document.getElementById('mainSearch');
  if (!mode || !input) return;
  var ex = mode === 'benefit' ? '내가 받을 수 있는 혜택 알려줘' : '주민등록등본 발급해줘';
  input.setAttribute('placeholder', '예) ' + ex);
  var t = document.querySelector('.demo-toast');
  if (t) { t.innerHTML = 'AI 검색창에 <strong>“' + ex + '”</strong>를 입력해 보세요.'; t.classList.add('on'); setTimeout(function () { t.classList.remove('on'); }, 3200); }
})();
