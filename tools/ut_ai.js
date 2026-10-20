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
