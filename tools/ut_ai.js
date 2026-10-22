	/* ======================================================================
	   [사용성 평가] 추가 — 주민등록표 등본·초본 주소 확인·선택 / 혜택 조건 / 안내
	   ====================================================================== */
	var ADDR = { sido: (window.DEMO && DEMO.user.sido) || '경기도', sgg: (window.DEMO && DEMO.user.sigungu) || '파주시' };
	function needsAddr(d) { return /주민등록표/.test(d || ''); }
	function addrAsk(doc) {   // doc : 서류명, 일괄발급이면 '서류1|서류2|…'
		answer(false, function (sec) {
			put(sec, (doc.indexOf('|') > -1 ? '<p>선택하신 서류 중 <strong>주민등록표 등본</strong>은 주소 확인이 필요해요.</p>' : '') + '<p>' + NAME + '님, 주민등록상 주소가 <strong>“' + esc(ADDR.sido + ' ' + ADDR.sgg) + '”</strong>가 맞나요? 아니라면 다시 골라 주세요.</p>' +
				chips('addr', [['맞아요', 'data-act="addrYes" data-doc="' + esc(doc) + '"'], ['아니요, 다시 고를게요', 'data-act="addrPick" data-doc="' + esc(doc) + '"']], 'ai-conversation-actions ai-delivery-options'));
		}, { delay: 500 });
	}
	function accHtml(id, title, legend) {
		return '<section class="ai-package-panel ut-addr" aria-labelledby="' + id + '_h"><h3 class="employment-package-heading" id="' + id + '_h"><button type="button" class="employment-package-toggle" aria-expanded="true" aria-controls="' + id + '_d"><span class="employment-package-title">' + title + '</span><i class="issue-toggle-icon is-open" aria-hidden="true"></i></button></h3>' +
			'<div class="employment-package-detail" id="' + id + '_d"><fieldset class="employment-package-options"><legend class="sr-only">' + legend + '</legend><div class="employment-package-items"></div></fieldset></div></section>';
	}
	function accOpen(acc, open) { var tg = $('.employment-package-toggle', acc); tg.setAttribute('aria-expanded', String(open)); $('.issue-toggle-icon', acc).classList.toggle('is-open', open); $('.employment-package-detail', acc).hidden = !open; }
	function accFill(acc, name, list) {
		$('.employment-package-items', acc).innerHTML = list.length ? list.map(function (v, i) { return '<div class="form-check"><input type="radio" name="' + name + '" id="' + name + '_' + i + '" value="' + esc(v) + '"><label for="' + name + '_' + i + '">' + esc(v) + '</label></div>'; }).join('') : '<p class="form-hint">시도를 먼저 골라 주세요.</p>';
	}
	function addrPick(doc) {
		answer(false, function (sec) {
			var id = 'ua' + (++uid), SD = (window.DEMO && DEMO.sido) || {};
			put(sec, '<p>주민등록상 주소에 해당하는 <strong>“시도”</strong>와 <strong>“시군구”</strong>를 선택해 주세요.</p>' + accHtml(id + 's', '시도를 골라주세요', '시도 목록') + accHtml(id + 'g', '시군구를 골라주세요', '시군구 목록') +
				'<div class="ai-conversation-actions aih-confirm"><button type="button" class="btn primary" data-act="addrDone" data-doc="' + esc(doc) + '" disabled>선택 완료</button></div>');
			var a1 = $('#' + id + 's_h', sec).parentNode, a2 = $('#' + id + 'g_h', sec).parentNode, go = $('[data-act=addrDone]', sec), sd = null, sg = null;
			accFill(a1, id + 'sd', Object.keys(SD)); accFill(a2, id + 'sg', []);
			[a1, a2].forEach(function (a) { var tg = $('.employment-package-toggle', a); tg.addEventListener('click', function () { accOpen(a, tg.getAttribute('aria-expanded') !== 'true'); }); });
			a1.addEventListener('change', function (e) { e.stopPropagation(); sd = e.target.value; sg = null; go.disabled = true; $('.employment-package-title', a1).textContent = '시도 : ' + sd; $('.employment-package-title', a2).textContent = '시군구를 골라주세요'; accFill(a2, id + 'sg', SD[sd] || []); accOpen(a1, false); accOpen(a2, true); scrollBottom(); });
			a2.addEventListener('change', function (e) { e.stopPropagation(); sg = e.target.value; $('.employment-package-title', a2).textContent = '시군구 : ' + sg; go.disabled = false; ADDR = { sido: sd, sgg: sg }; scrollBottom(); });
			go.addEventListener('click', function () { if (!sd || !sg) return; accOpen(a1, false); accOpen(a2, false); $$('input', sec).forEach(function (i) { i.disabled = true; }); ADDR = { sido: sd, sgg: sg }; if (window.AihDoc && AihDoc.setAddr) AihDoc.setAddr(sd, sg); }, true);
		}, { delay: 500 });
	}
	// 혜택 : 질문에 담긴 조건(지역·연령·상황)에 맞는 예시 세트, 없으면 기본 세트
	function bnSet(q) {
		var sets = (window.DEMO && DEMO.benefitSets) || [], t = (q || '').replace(/\s/g, ''), def = null;
		for (var i = 0; i < sets.length; i++) { if (sets[i].key === 'aih') def = sets[i]; else if (sets[i].re.test(t)) return sets[i]; }
		return def || sets[0];
	}
	// 안내 토스트
	var toastEl = document.createElement('div'); toastEl.className = 'ut-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
	var toastT; function toast(m) { toastEl.innerHTML = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2600); }
	function voiceNotice(e) { if (e) e.preventDefault(); toast('말로 묻기는 <strong>‘② 음성 서비스’</strong>에서 체험해 주세요.<br>이 화면에서는 글자로 입력해 주세요.'); }
	document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href="#demo-go"]'); if (!a) return; e.preventDefault(); e.stopImmediatePropagation(); toast('시연에서는 실제 정부24 화면으로 이동하지 않아요.'); }, true);
	(function () { var m = new URLSearchParams(location.search).get('mode'); if (m && homeInput) homeInput.setAttribute('placeholder', m === 'benefit' ? '예) 내가 받을 수 있는 혜택 알려줘' : '예) 주민등록등본 발급해줘'); })();
	// 폴더블 접힘 등 좁은 화면 : 입력창 안내 문구를 짧게
	(function () {
		function fit() {
			var narrow = window.innerWidth <= 340, m = new URLSearchParams(location.search).get('mode');
			if (bInput) bInput.setAttribute('placeholder', narrow ? '물어보세요' : '정부24에 물어보세요');
			if (homeInput) homeInput.setAttribute('placeholder', m ? (m === 'benefit' ? (narrow ? '혜택 알려줘' : '예) 내가 받을 수 있는 혜택 알려줘') : (narrow ? '등본 발급해줘' : '예) 주민등록등본 발급해줘')) : (narrow ? 'AI에게 물어보세요' : 'AI에게 물어보세요'));
		}
		fit(); window.addEventListener('resize', fit);
	})();

	/* ----------------------------------------------------------------------
	   [사용성 평가] 로그인 : Figma 08. 회원계정 로그인 프로세스
	   로그인 방식 선택(MO_UI-PT-II01M_로그인방식선택_개인) → 간편인증(UI-PT-IAA03M) → 앱 인증 후 [인증 완료]
	   · 시연은 간편 인증만 진행 · 본인인증 정보는 가상 정보(홍길동)로 미리 채움(입력 불가)
	   ---------------------------------------------------------------------- */
	var UT_CERTS = [['카카오뱅크', 'kakaobank'], ['국민인증서', 'kb'], ['뱅크샐러드', 'banksalad'], ['카카오톡', 'kakaotalk'],
		['삼성패스', 'samsungpass'], ['NH인증서', 'nh'], ['페이코', 'payco'], ['우리인증서', 'woori'],
		['네이버', 'naver'], ['하나인증서', 'hana'], ['드림인증', 'dream'], ['통신사PASS', 'pass']];
	function utLogo(f) { return '<img class="lg" src="static/images/login/cert-' + f + '.png" alt="">'; }
	var UT_LT = [
		['통합로그인', '한 번에 인증하고<br>모든 서비스 이용하기', [['mobile', '모바일 신분증'], ['simple', '간편 인증'], ['joint', '공동 인증서'], ['finance', '금융 인증서']]],
		['생체인증', '빠르게 인증하고 서비스 이용하기', [['bio', '생체인증'], ['pin', '간편비밀번호'], ['pattern', '패턴']]],
		['간편로그인', '간단히 로그인하고<br>필요 시 추가 인증하기', [['id', '아이디 로그인'], ['guest', '비회원 로그인<br>(개인)']]]];
	function loginModal() {
		if (LM) return LM;
		var tiles = UT_CERTS.map(function (c, i) { return '<button type="button" class="ut-cert" data-lm="cert" data-i="' + i + '" aria-pressed="false">' + utLogo(c[1]) + '<span class="nm">' + c[0] + '</span></button>'; }).join('');
		LM = el('<div class="ut-login" id="utLogin" role="dialog" aria-modal="true" aria-label="로그인" data-step="type">' +
			// ① 로그인 방식 선택
			'<section class="ut-step ut-type"><header class="ut-lhead"><button type="button" class="ut-back" data-lm="close" aria-label="이전"></button><h2>로그인</h2></header>' +
			'<div class="ut-lbody"><h3 class="ut-ltit">로그인 방식을<br>선택해 주세요.</h3><div class="ut-ltab" role="tablist"><button type="button" role="tab" aria-selected="true" class="on">개인</button><button type="button" role="tab" aria-selected="false" data-lm="soon">법인</button></div>' +
			UT_LT.map(function (g) { return '<div class="ut-lgrp"><h4>' + g[1] + '</h4><div class="ut-lcards">' + g[2].map(function (t) { return '<button type="button" class="ut-lcard" data-lm="' + (t[0] === 'simple' ? 'simple' : 'soon') + '"><img src="static/images/login/ico-' + t[0] + '.png" alt=""><span>' + t[1] + '</span></button>'; }).join('') + '</div></div>'; }).join('') +
			'<div class="ut-ljoin"><p>아직 정부24 회원이 아니신가요?</p><button type="button" data-lm="soon">회원가입</button></div></div></section>' +
			// ② 간편인증
			'<section class="ut-step ut-simple"><header class="ut-shead"><button type="button" class="ut-back w" data-lm="back" aria-label="이전"></button><h2>간편인증</h2><span class="ut-g24">정부24</span></header>' +
			'<div class="ut-sbody"><h4 class="ut-stit"><span class="ic c"></span>민간 인증서</h4><div class="ut-certs">' + tiles + '</div>' +
			'<h4 class="ut-stit"><span class="ic i"></span>모바일 신분증</h4><div class="ut-certs"><button type="button" class="ut-cert" data-lm="soon">' + utLogo('mid') + '<span class="nm">모바일신분증</span></button></div>' +
			'<h4 class="ut-stit2">본인인증 정보 입력</h4><dl class="ut-form"><dt><label for="utNm">이름</label></dt><dd><input type="text" id="utNm" class="uf" placeholder="홍길동" autocomplete="off" maxlength="20"></dd>' +
			'<dt><label for="utBd">생년월일</label></dt><dd><input type="text" id="utBd" class="uf" placeholder="19900101" inputmode="numeric" autocomplete="off" maxlength="8"></dd>' +
			'<dt><label for="utPh">휴대폰 번호</label></dt><dd class="ph"><select aria-label="휴대폰 앞자리"><option>010</option><option>011</option><option>016</option><option>017</option><option>018</option><option>019</option></select><input type="text" id="utPh" class="uf" placeholder="12341234" inputmode="numeric" autocomplete="off" maxlength="8" aria-label="휴대폰 번호 뒷자리"></dd></dl>' +
			'<p class="ut-fake">입력한 정보는 저장되거나 전송되지 않아요. 가상 정보를 입력해도 돼요.</p>' +
			'<div class="ut-agree-h"><h4 class="ut-stit2">서비스 이용에 대한 동의</h4><label class="ut-all"><input type="checkbox" data-lm="all"> 전체동의</label></div>' +
			'<ul class="ut-agree">' + ['개인정보 이용 동의', '제3자정보제공동의', '고유식별정보처리동의'].map(function (t) { return '<li><label><input type="checkbox" class="ag"> ' + t + '</label><button type="button" data-lm="soon">보기</button></li>'; }).join('') + '</ul></div>' +
			'<div class="ut-sbtn"><button type="button" data-lm="close">닫기</button><button type="button" class="go off" data-lm="req">인증 요청</button></div></section>' +
			// ③ 앱 인증 대기
			'<section class="ut-step ut-wait"><header class="ut-shead"><h2>간편인증</h2><span class="ut-g24">정부24</span></header>' +
			'<div class="ut-wbody"><img class="lg" src="" alt=""><p class="t"><strong class="nm"></strong> 앱에서<br>인증을 진행해 주세요.</p><p class="s">휴대폰으로 받은 인증 요청을 확인하고,<br>앱에서 인증을 마친 뒤 아래 <b>인증 완료</b>를 눌러 주세요.</p><p class="ut-fake">시연용 · 실제 인증 요청은 보내지 않아요.</p></div>' +
			'<div class="ut-sbtn"><button type="button" data-lm="back2">취소</button><button type="button" class="go" data-lm="done">인증 완료</button></div></section></div>');
		document.body.appendChild(LM);
		var sel = -1;
		function formOk() { var n = $('#utNm', LM).value.trim(), d = $('#utBd', LM).value, h = $('#utPh', LM).value; return n.length >= 2 && /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(d) && /^\d{7,8}$/.test(h); }
		function agOk() { return $$('.ag', LM).every(function (c) { return c.checked; }); }
		function canGo() { $('[data-lm=req]', LM).classList.toggle('off', !(sel > -1 && formOk() && agOk())); }
		function why() { return sel < 0 ? '인증서를 선택해 주세요.' : $('#utNm', LM).value.trim().length < 2 ? '이름을 입력해 주세요.' : !/^(19|20)\d{6}$/.test($('#utBd', LM).value) ? '생년월일 8자리를 입력해 주세요. (예: 19900101)' : !/^\d{7,8}$/.test($('#utPh', LM).value) ? '휴대폰 번호를 입력해 주세요.' : !agOk() ? '서비스 이용에 모두 동의해 주세요.' : ''; }
		LM.addEventListener('input', function (e) { if (e.target.id === 'utBd' || e.target.id === 'utPh') e.target.value = e.target.value.replace(/\D/g, ''); canGo(); });
		LM.addEventListener('change', function (e) {
			if (e.target.matches('[data-lm=all]')) $$('.ag', LM).forEach(function (c) { c.checked = e.target.checked; });
			else if (e.target.classList.contains('ag')) $('[data-lm=all]', LM).checked = $$('.ag', LM).every(function (c) { return c.checked; });
			canGo();
		});
		LM.addEventListener('click', function (e) {
			var t = e.target.closest('[data-lm]'); if (!t || t.tagName === 'INPUT') return;
			var k = t.getAttribute('data-lm');
			if (k === 'close') closeLogin(false);
			else if (k === 'soon') toast('사용성 평가에서는 <strong>간편 인증</strong>으로 로그인해 주세요.');
			else if (k === 'simple') { LM.setAttribute('data-step', 'simple'); LM.scrollTop = 0; }
			else if (k === 'back') { LM.setAttribute('data-step', 'type'); LM.scrollTop = 0; }
			else if (k === 'back2') { LM.setAttribute('data-step', 'simple'); }
			else if (k === 'cert') { sel = +t.getAttribute('data-i'); $$('.ut-cert[data-lm=cert]', LM).forEach(function (b, i) { b.classList.toggle('on', i === sel); b.setAttribute('aria-pressed', String(i === sel)); }); canGo(); }
			else if (k === 'req') { if (t.classList.contains('off')) { toast(why() || '생년월일을 다시 확인해 주세요.'); return; } var c = UT_CERTS[sel]; $('.ut-wait .lg', LM).src = 'static/images/login/cert-' + c[1] + '.png'; $('.ut-wait .nm', LM).textContent = c[0]; LM.setAttribute('data-step', 'wait'); LM.scrollTop = 0; }
			else if (k === 'done') { closeLogin(UT_CERTS[sel][0]); }
		});
		return LM;
	}
	function openLogin() {
		var m = loginModal(); m.setAttribute('data-step', 'type');
		$$('.ut-cert', m).forEach(function (b) { b.classList.remove('on'); }); $$('input[type=checkbox]', m).forEach(function (c) { c.checked = false; }); $$('.uf', m).forEach(function (i) { i.value = ''; }); $('.ut-form select', m).selectedIndex = 0; $('[data-lm=req]', m).classList.add('off');
		m.classList.add('on'); m.scrollTop = 0; document.body.classList.add('overflow');
	}
	// 헤더 로그인 버튼도 같은 로그인 프로세스로(로그아웃은 세션만 해제)
	document.addEventListener('click', function (e) {
		var t = e.target.closest && e.target.closest('#iw_header .ico-login, #iw_header .ico-logout');
		if (!t) return; e.preventDefault(); e.stopImmediatePropagation();
		if (t.classList.contains('ico-logout')) { if (window.DemoSession) DemoSession.set(false); } else openLogin();
	}, true);
