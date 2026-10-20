/* =========================================================
   demo-benefit.js — 혜택알리미(가상) 서비스 상세 · 맞춤안내 결과
   퍼블리싱(OTT_서비스상세 / OTT_맞춤안내조회결과) 마크업에 예시 데이터를 채움
   ========================================================= */
(function () {
  'use strict';
  var D = window.DEMO, qs = new URLSearchParams(location.search);
  var page = document.body.getAttribute('data-page');
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var toastEl = document.createElement('div'); toastEl.className = 'demo-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  var tT; function toast(m) { toastEl.innerHTML = m; toastEl.classList.add('on'); clearTimeout(tT); tT = setTimeout(function () { toastEl.classList.remove('on'); }, 2600); }

  function find(id) {
    for (var i = 0; i < D.benefitSets.length; i++) {
      var s = D.benefitSets[i];
      for (var j = 0; j < s.items.length; j++) if (s.items[j].id === id) return { set: s, it: s.items[j] };
    }
    return null;
  }
  function getSet(key) { for (var i = 0; i < D.benefitSets.length; i++) if (D.benefitSets[i].key === key) return D.benefitSets[i]; return D.benefitSets[0]; }

  /* ---------- 서비스 상세 ---------- */
  if (page === 'bn-detail') {
    var f = find(qs.get('id')) || { set: D.benefitSets[0], it: D.benefitSets[0].items[0] };
    var it = f.it;
    document.title = '[가상 서비스] ' + it.t + ' | 서비스 상세 | 혜택알리미';
    $('#bnTitle').textContent = it.t;
    var li = function (t) { return '<li>' + esc(t) + '</li>'; };
    $('#bnDetail').innerHTML =
      '<div class="info-area"><p class="sub">' + esc(it.what) + ' <strong>' + esc(it.when) + '</strong>으로 신청할 수 있습니다.</p></div>' +
      '<div class="sch-bc-grid"><div class="section-lg">' +
        '<div class="sch-bc-section"><h3 class="title xxlg">서비스 개요</h3><div class="sch-bc-detail-table">' +
          '<div class="item"><p class="label">서비스 대상</p><p class="value">' + esc(it.who) + '</p></div>' +
          '<div class="item"><p class="label">신청 기간</p><p class="value">' + esc(it.when) + '</p></div>' +
          '<div class="item"><p class="label">신청 방법</p><p class="value">' + esc(it.how) + '</p></div>' +
          '<div class="item"><p class="label">접수기관</p><div class="value"><p>' + esc(it.org) + '</p></div></div>' +
        '</div></div>' +
        '<div class="sch-bc-section"><h3 class="title xxlg">서비스 상세</h3>' +
          '<div class="section-4"><h4 class="title xlg">지원대상</h4><ul class="list-bull">' + li(it.who) + '</ul></div>' +
          '<div class="box-help-info"><p class="tit">신청 전 꼭 확인하세요.</p><p class="txt">이 화면은 사용성 평가용 가상 화면입니다. 실제 지원 대상·금액·기간은 소관 기관의 공고를 확인해 주세요.</p></div>' +
          '<div class="section-4"><h4 class="title xlg">지원내용</h4><ul class="list-bull">' + li(it.what) + '</ul></div>' +
        '</div>' +
        '<div class="sch-bc-section"><h3 class="title xxlg">신청방법</h3>' +
          '<div class="section-4"><h4 class="title xlg">신청기간</h4><ul class="list-bull">' + li(it.when) + '</ul></div>' +
          '<div class="section-4"><h4 class="title xlg">신청방법</h4><ul class="list-bull">' + li(it.how) + '</ul></div>' +
        '</div>' +
        '<div class="sch-bc-section"><h3 class="title xxlg">접수 및 문의</h3>' +
          '<div class="section-4"><h4 class="title xlg">접수기관</h4><ul class="list-bull">' + li(it.org) + '</ul></div>' +
          '<div class="section-4"><h4 class="title xlg">문의처</h4><ul class="list-bull">' + li('정부민원안내콜센터 국번없이 110') + '</ul></div>' +
        '</div>' +
        '<div class="sch-bc-section"><h3 class="title xxlg">부가정보</h3>' +
          '<div class="section-4"><h4 class="title xlg">소관기관</h4><ul class="list-bull">' + li(it.org) + '</ul></div>' +
          '<div class="section-4"><h4 class="title xlg">비고</h4><ul class="list-bull">' + li('시연용 예시 데이터') + '</ul></div>' +
        '</div>' +
      '</div></div>';
    $('#bnApply').addEventListener('click', function (e) { e.preventDefault(); toast('시연에서는 실제 신청 화면으로 이동하지 않아요.'); });
    return;
  }

  /* ---------- 맞춤안내 조회 결과 ---------- */
  if (page === 'bn-list') {
    var set = getSet(qs.get('set'));
    var items = set.items;
    var tabs = $$('.tab-list .btn-tab');
    if (tabs[0]) tabs[0].textContent = '신청 가능(' + set.total + ')';
    var msgs = $$('.list-top-util p.fs-lg');
    msgs.forEach(function (p, i) { if (i > 0) p.remove(); });
    if (msgs[0]) msgs[0].innerHTML = '<strong>' + esc(set.label) + ' 기준으로 신청할 수 있는 혜택이 <em class="text-primary">' + set.total + '</em>개 있어요.</strong>';
    var dt = $('.view-date-box'); if (dt) dt.innerHTML = '<span class="sub-tit">조회 기준일</span><span><strong>오늘</strong> (시연용 예시 데이터)</span>';
    $('#bnList').innerHTML = items.map(function (it) {
      return '<li><div class="card-wrap my-benefit-card"><div class="cont-area">' +
        '<div class="card-header"><span class="support-type"><i class="iconset ico-support-service"></i> ' + esc(it.org) + '</span></div>' +
        '<div class="card-body"><div class="info-area">' +
          '<a href="benefit.html?id=' + it.id + '" class="card-btn"><p class="tit"><span>' + esc(it.t) + '</span></p><p class="txt"><span>' + esc(it.what) + '</span></p></a>' +
          '<div class="info-list"><div class="info-item"><div class="sub-tit">신청기간</div><div class="date-wrap"><span class="text">' + esc(it.when) + '</span></div></div>' +
          '<div class="info-item"><div class="sub-tit">대상</div><div>' + esc(it.who) + '</div></div></div>' +
        '</div></div></div>' +
        '<div class="card-footer"><div class="btn-wrap"><a href="benefit.html?id=' + it.id + '" class="btn">상세보기</a></div></div>' +
      '</div></li>';
    }).join('');
    $$('.tab-list .btn-tab').forEach(function (b, i) { if (i) b.addEventListener('click', function () { toast('시연에서는 ‘신청 가능’ 탭만 볼 수 있어요.'); }); });
  }
})();
