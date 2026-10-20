/* 발급 문서 견본(시연용) 생성 : 대화창 썸네일과 문서출력 페이지에서 공용 */
(function (w) {
	function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
	function today() { var d = new Date(); return [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)]; }
	var T = today(), DATE_KO = T[0] + '년 ' + T[1] + '월 ' + T[2] + '일', DATE_SL = T[0] + '/' + T[1] + '/' + T[2];
	var NAME = '홍길동', HANJA = '洪吉童', ADDR, ISSUER;
	// [사용성 평가] 대화에서 고른 주소(시도·시군구)를 문서에 반영 : ?sido=&sgg= 또는 AihDoc.setAddr()
	function head0(sd, sg) { ADDR = sd + ' ' + sg + ' 시연로 123, 101동 1001호 (시연아파트)'; ISSUER = sd === sg || /세종/.test(sd) ? sd + '장' : sd + ' ' + sg + (/구$/.test(sg) ? '청장' : /군$/.test(sg) ? '수' : '장'); }
	var qp = new URLSearchParams(w.location.search); head0(qp.get('sido') || '경기도', qp.get('sgg') || '파주시');
	function wm() { var s = ''; for (var i = 0; i < 14; i++) s += '<span style="left:' + ((i % 4) * 160 - 60) + 'px;top:' + (Math.floor(i / 4) * 230 + 40 + (i % 2) * 60) + 'px">견본 · 시연용</span>'; return '<div class="wm" aria-hidden="true">' + s + '</div>'; }
	function head(no, certTxt) {
		return '<p class="p-tag">[견본] 시연용 가상 문서</p><div class="p-top"><div class="l"><div class="p-stamp-round" aria-hidden="true"><small>시 연 용</small><b>견 본</b><small>' + DATE_SL + '</small></div>' +
			'<p class="p-no">문서확인번호 : 0000-0000-0000-0000 (시연용)</p><h1>' + no + '</h1></div>' +
			'<div class="p-cert">' + certTxt + '<br>담당자 : 시연담당&nbsp;&nbsp;전화 : 000-0000-0000<br>신청인 : ' + NAME + '&nbsp;&nbsp;용도 및 목적 : 시연용</div></div>' +
			'<p class="p-date">' + DATE_KO + '</p>';
	}
	function sign(issuer) { return '<div class="p-sign"><span class="nm">' + esc(issuer) + '</span><span class="p-stamp-sq" aria-hidden="true">견본<br>시연</span></div>'; }
	function foot() { return '<div class="p-foot"><p>※ 1. 이 문서는 「정부24 AI국민비서」 사용성 평가를 위한 견본이며, 이름·주민등록번호·주소는 모두 가상의 정보입니다.</p><p>&nbsp;&nbsp;&nbsp;&nbsp;2. 문서확인번호와 직인은 시연용 표시로, 실제 발급 문서가 아니며 어떠한 법적 효력도 없습니다.</p></div>'; }
	function emptyRows(n, cols) { var s = ''; for (var i = 0; i < n; i++) s += '<tr class="empty"><td class="bl"></td>' + (cols > 1 ? '<td colspan="' + (cols - 1) + '"></td>' : '') + '</tr>'; return s; }

	function jumin() {
		return '<div class="aih-paper" lang="ko">' + wm() + head('주 민 등 록 표<small>( 등 본 )</small>', '이 등본은 세대별 주민등록표의 원본 내용과 틀림없음을 증명합니다.') +
			'<p class="p-mayor">' + ISSUER + '</p>' +
			'<table><colgroup><col style="width:22%"><col style="width:44%"><col style="width:16%"><col style="width:18%"></colgroup><tbody>' +
			'<tr><th>세대주 성명(한자)</th><td>' + NAME + '&nbsp;&nbsp;(' + HANJA + ')</td><th>세대구성<br>사유 및 일자</th><td>전입<br>2024-03-02</td></tr>' +
			'<tr><th colspan="2">주&nbsp;&nbsp;&nbsp;&nbsp;소</th><th colspan="2">발생일 / 신고일<br>변동사유</th></tr>' +
			'<tr><td class="c" style="width:12%">현주소 :</td><td colspan="1">' + ADDR + '</td><td class="c" colspan="2">2024-03-02 / 2024-03-02<br>전입</td></tr>' +
			'<tr class="sp"><td colspan="4">== 공&nbsp;&nbsp;란 ==</td></tr></tbody></table>' +
			'<table style="margin-top:-1px"><colgroup><col style="width:8%"><col style="width:12%"><col style="width:40%"><col style="width:26%"><col style="width:14%"></colgroup>' +
			'<thead><tr><th>번호</th><th>세대주<br>관계</th><th>성명(한자)<br>주민등록번호</th><th>발생일 / 신고일<br>등록상태</th><th>변동사유</th></tr></thead><tbody>' +
			'<tr><td class="c">1</td><td class="c">본인</td><td>' + NAME + ' (' + HANJA + ')<br>600101-1*******</td><td class="c">2024-03-02 / 2024-03-02<br>거주자</td><td class="c">전입</td></tr>' +
			'<tr><td class="c">2</td><td class="c">배우자</td><td>성춘향 (成春香)<br>620505-2*******</td><td class="c">2024-03-02 / 2024-03-02<br>거주자</td><td class="c">전입</td></tr>' +
			'<tr><td class="c">3</td><td class="c">자녀</td><td>홍길순 (洪吉順)<br>900303-2*******</td><td class="c">2024-03-02 / 2024-03-02<br>거주자</td><td class="c">전입</td></tr>' +
			'<tr class="sp"><td class="bl"></td><td colspan="4">== 이하 여백 ==</td></tr>' + emptyRows(6, 5) + '</tbody></table>' +
			sign(ISSUER) + foot() + '</div>';
	}
	function generic(title, certTxt, rows, issuer) {
		return '<div class="aih-paper generic" lang="ko">' + wm() + head(title, certTxt) + '<p class="p-mayor">' + esc(issuer) + '</p>' +
			'<table class="p-list"><colgroup><col style="width:28%"><col></colgroup><tbody>' + rows.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') +
			'<tr class="sp"><td class="bl"></td><td>== 이하 여백 ==</td></tr>' + emptyRows(5, 2) + '</tbody></table>' + sign(issuer) + foot() + '</div>';
	}
	var DOCS = {
		'주민등록표 등본': { title: '주민등록등본(국문)', html: jumin },
		'건강보험 자격득실 확인서': { title: '건강보험 자격득실 확인서', html: function () { return generic('건강보험 자격득실<small>확 인 서</small>', '위 사람의 건강보험 자격 취득·상실 내역이 아래와 같음을 확인합니다.', [['성명', NAME], ['주민등록번호', '600101-1*******'], ['자격 구분', '직장가입자'], ['사업장(기관) 명칭', '㈜시연컴퍼니'], ['자격취득일', '2021-02-01'], ['자격상실일', '해당 없음 (현재 가입 중)'], ['조회 기간', '2021-02-01 ~ ' + T.join('-')]], '국민건강보험공단 이사장'); } },
		'국가기술자격 취득사항 확인서': { title: '국가기술자격 취득사항 확인서', html: function () { return generic('국가기술자격<small>취득사항 확인서</small>', '위 사람의 국가기술자격 취득사항이 아래와 같음을 확인합니다.', [['성명', NAME], ['생년월일', '1960-01-01'], ['자격 종목', '정보처리기사'], ['자격 등급', '기사'], ['자격번호', '21201234567A'], ['취득일', '2021-11-26'], ['시행기관', '한국산업인력공단']], '한국산업인력공단 이사장'); } }
	};
	function paperHtml(doc) { var d = DOCS[doc]; if (d) return d.html(); return generic(esc(doc), '위 사항이 사실과 틀림없음을 확인합니다.', [['성명', NAME], ['주민등록번호', '600101-1*******'], ['발급 민원', doc], ['용도', '제출용']], ISSUER); }
	function docTitle(doc) { var d = DOCS[doc]; return (d ? d.title : doc) + ' 발급 문서출력'; }
	var CUR = { sido: '경기도', sgg: '파주시' };
	w.AihDoc = { paperHtml: paperHtml, docTitle: docTitle, setAddr: function (sd, sg) { CUR = { sido: sd, sgg: sg }; head0(sd, sg); },
		printUrl: function (doc) { return 'doc.html?doc=' + encodeURIComponent(doc) + '&sido=' + encodeURIComponent(CUR.sido) + '&sgg=' + encodeURIComponent(CUR.sgg); } };
})(window);
