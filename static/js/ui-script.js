// modal. 클릭이벤트 없이 함수 호출인 경우
function openModal(ele) {
	var layer = document.getElementById(ele),
		layerWrap = layer.querySelector('.modal-dialog'),
		btnClose = layerWrap.querySelectorAll('.close-modal'),
		layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])'),
		layerTabFirst = layerTab[0],
		layerTabLast = layerTab[layerTab.length - 1];

		var iwModalAll = document.querySelectorAll('.iw-modal')

	// 모달 열기 핸들러
	function openModalHandler() {
		/* dimed 는 개발에서 제어
		if (!document.querySelector('.iw-modal-dimed')) {
			document.body.insertAdjacentHTML('beforeend', '<div class="iw-modal-dimed"></div>');
		} else {
			iwModalAll.forEach(function(iwModal){
				//iwModal.classList.add('over');
				//layer.classList.remove('over');
			});
		}
		*/
		
		document.body.classList.add('overflow');

		layer.classList.add('on');
		
		// Tab 순서에는 포함하지 않고, 모달이 열릴 때만 스크립트로 포커스한다.
		layerWrap.setAttribute('tabindex', '-1');
		layerWrap.focus();
		
		if (layerTab.length > 0) {
			document.addEventListener('keydown', function (e) {
				if (document.activeElement === layerWrap && e.shiftKey && e.key === 'Tab') {
					e.preventDefault();
					layerTabLast.focus();
				}
				
				if (document.activeElement === layerTabFirst && e.shiftKey && e.key === 'Tab') {
					e.preventDefault();
					layerTabLast.focus();
				}
				
				if (document.activeElement === layerTabLast && !e.shiftKey && e.key === 'Tab') {
					e.preventDefault();
					layerTabFirst.focus();
				}
			});
		}
	}

	// 모달 닫기 핸들러
	function closeModal() {
		layer.classList.remove('on');
		
		if (!document.querySelector('.iw-modal.on')) {
			//var dimed = document.querySelector('.iw-modal-dimed');
			//if (dimed) dimed.remove();
			
			document.body.classList.remove('overflow');

			//헤더 통합검색 창에서 boby overflow 삭제방지
			if (document.querySelector('.total-search-layer.on')) {
				document.body.classList.add('overflow');
			}
		}
	}

	btnClose.forEach(function(btn) {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			
			if (!this.classList.contains('disabled')) {
				closeModal();
			}
		});
	});

	openModalHandler();
}


// modal. 버튼 클릭 이벤트로 띄울 때. 함수호출X
var lastOpenedButtons = {}; 

function openModalBtn(btn) {
	var btnOpen = btn;
	var closestOpenModal = btnOpen.closest('.open-modal');
	var layerId;
	var layer;

	if (btnOpen instanceof HTMLButtonElement || btnOpen instanceof HTMLAnchorElement || closestOpenModal) {
		if (closestOpenModal) {
			layerId = closestOpenModal.getAttribute('aria-controls');
			layer = document.getElementById(layerId);
		}
	}

	if(layer){
		var layerWrap = layer.querySelector('.modal-dialog'),
			btnClose = layerWrap.querySelectorAll('.close-modal'),
			layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])'),
			layerTabFirst = layerTab[0],
			layerTabLast = layerTab[layerTab.length - 1];

		// 모달 열기 핸들러
		function openModalHandler() {
			/*
			if (!document.querySelector('.iw-modal-dimed')) {
				document.body.insertAdjacentHTML('beforeend', '<div class="iw-modal-dimed"></div>');
			} else {
				if (btnOpen.closest('.iw-modal')) {
					btnOpen.closest('.iw-modal').classList.add('over');
				}
			}
			*/

			if (btnOpen.closest('.iw-modal')) {
				btnOpen.closest('.iw-modal').classList.add('over');
			}

			document.body.classList.add('overflow');

			layer.classList.add('on');
			// Tab 순서에는 포함하지 않고, 모달이 열릴 때만 스크립트로 포커스한다.
			layerWrap.setAttribute('tabindex', '-1');
			layerWrap.focus();

			// 마지막으로 열린 버튼을 모달에 맞게 저장
			lastOpenedButtons[layerId] = btnOpen;

			// Tab 키 순환 처리
			if (layerTab.length > 0) {
				document.addEventListener('keydown', function (e) {
					if (document.activeElement === layerWrap && e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						layerTabLast.focus();
					}

					if (document.activeElement === layerTabFirst && e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						layerTabLast.focus();
					}

					if (document.activeElement === layerTabLast && !e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						layerTabFirst.focus();
					}
				});
			}
		}

		// 모달 닫기 핸들러
		function closeModalHandler() {
			layer.classList.remove('on');

			// 모달 닫힌 후 dimmed 상태 처리
			if (!document.querySelector('.iw-modal.on')) {
				//var dimed = document.querySelector('.iw-modal-dimed');
				//if (dimed) dimed.remove();

				document.body.classList.remove('overflow');
				
				// 헤더 통합검색 창에서 boby overflow 삭제방지
				if (document.querySelector('.total-search-layer.on')) {
					document.body.classList.add('overflow');
				}			
			}

			var opendModal = btnOpen.closest('.iw-modal');

			if (opendModal && opendModal.classList.contains('over')) {
				opendModal.classList.remove('over');
			}

			// 열었던 버튼으로 포커스 반환
			if (lastOpenedButtons[layerId]) {
				lastOpenedButtons[layerId].closest('.open-modal').focus();
			}
		}

		// btnClose 이벤트 리스너 중복 등록 방지
		btnClose.forEach(function (btn) {
			if (!btn.dataset.listenerAdded) {
				btn.dataset.listenerAdded = true; // 리스너 등록 여부 기록

				btn.addEventListener('click', function (e) {
					e.preventDefault();
					if (!this.classList.contains('disabled')) {
						closeModalHandler();
					}
				});
			}
		});

		openModalHandler();
	}
	else {
		//console.log('해당 레이어가 없습니다.')
	}
}

// document 이벤트 리스너 : modal 열기
document.addEventListener('click', function (e) {
	if (e.target.closest('.open-modal')) {
		e.preventDefault();

		if (!e.target.classList.contains('disabled')) {
			openModalBtn(e.target);
		}
	}
});

// input 기능 포커스 제어
document.addEventListener('focusin', function(e) {
	if (e.target.classList.contains('input')) {
		var inputUtil = e.target.closest('.input-fn');
		if (inputUtil) {
			inputUtil.classList.add('focus');
		}
	}
});

document.addEventListener('focusout', function(e) {
	if (e.target.classList.contains('input')) {
		var inputUtil = e.target.closest('.input-fn');
		if (inputUtil) {
			inputUtil.classList.remove('focus');
		}
	}
});

document.addEventListener('click', function(e) {
	// 비밀번호 보이기, 안보이기
	if (e.target.classList.contains('btn-pwd-view')) {
		e.preventDefault();

		var emElement = e.target.querySelector('em');
		var inputUtil = e.target.closest('.input-fn');
		
		if (inputUtil) {
			var adInput = inputUtil.querySelector('.input');
			
			if (e.target.classList.contains('ico-pwd-view-on')) {
				e.target.classList.remove('ico-pwd-view-on');
				e.target.classList.add('ico-pwd-view-off');
				
				if (emElement) emElement.textContent = '보이게 하기';
				if (adInput) adInput.type = 'password';
			}
			else if (e.target.classList.contains('ico-pwd-view-off')) {
				e.target.classList.remove('ico-pwd-view-off');
				e.target.classList.add('ico-pwd-view-on');
				
				if (emElement) emElement.textContent = '보이지 않게 하기';
				if (adInput) adInput.type = 'text';
			}
		}
	}
});

// page util : sns 공유하기
function openPageUtil(btn) {
	var btnOpen = btn,
		layerId,
		layer;
	
	layerId = btnOpen.getAttribute('aria-controls');
	layer = document.getElementById(layerId);
	
	var layerWrap = layer.querySelector('.wrap'),
		btnClose = layer.querySelector('.btn-close-page-util'),
		layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])'),
		layerTabFirst = layerTab[0],
		layerTabLast = layerTab[layerTab.length - 1];

	// 모달 열기 핸들러
	function openModalHandler() {
		document.body.classList.add('overflow');

		layer.classList.add('on');
		
		layerWrap.focus();

		if (layerTab.length > 0) {
			document.addEventListener('keydown', function (e) {
				if (document.activeElement === layerWrap && e.shiftKey && e.key === 'Tab') {
					e.preventDefault();
					layerTabLast.focus();
				}
				
				if (document.activeElement === layerTabFirst && e.shiftKey && e.key === 'Tab') {
					e.preventDefault();
					layerTabLast.focus();
				}
				
				if (document.activeElement === layerTabLast && !e.shiftKey && e.key === 'Tab') {
					e.preventDefault();
					layerTabFirst.focus();
				}
			});
		}
	}

	// 모달 닫기 핸들러
	function closeModal() {
		if (btnOpen) {
			btnOpen.focus();
		}
		
		layer.classList.remove('on');
		
		document.body.classList.remove('overflow');
		
		//헤더 통합검색 창에서 boby overflow 삭제방지
		if (document.querySelector('.total-search-layer.on')) {
			document.body.classList.add('overflow');
		}
	}

	btnClose.addEventListener('click', function (e) {
		e.preventDefault();
		
		if (!this.classList.contains('disabled')) {
			closeModal();
		}
	});

	openModalHandler();
}

document.addEventListener('click', function(e) {
	if (e.target.closest('.btn-open-util-area')) {
		e.preventDefault();
		
		if (!e.target.classList.contains('disabled')) {
			openPageUtil(e.target);
		}
	}
});

function checkPageUtil() {
	var chkWidth = window.innerWidth;
	var isFilterOpen = document.querySelector('#layer_page_util.on');

	if(isFilterOpen){
		if (chkWidth >= 1024) {
			document.body.classList.remove('overflow');
			isFilterOpen.classList.remove('on');
			
		} else {
			if (isFilterOpen) {
				document.body.classList.add('overflow');
			}
		}
	}
	
}
window.addEventListener('resize', checkPageUtil);
checkPageUtil();

/* 
// tooltip 열기
function openTooltip(btn) {
	var layerId = btn.getAttribute('aria-controls');
	var layer = document.getElementById(layerId);
	
	if (!layer) return;
	
	var layerWrap = layer.querySelector('.tooltip-wrap');
	var btnClose = layerWrap.querySelector('.btn-close-common');
	var layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])');
	var layerTabFirst = layerTab[0];
	var layerTabLast = layerTab[layerTab.length - 1];



	// 버튼의 좌표값 구하기
	var btnRect = btn.getBoundingClientRect();
    var buttonCoordinates = {
        top: btnRect.top + window.scrollY,
        left: btnRect.left + window.scrollX,
        right: btnRect.right + window.scrollX,
        bottom: btnRect.bottom + window.scrollY,
        width: btnRect.width,
        height: btnRect.height
    };
    console.log('Button Coordinates (Full Screen):', buttonCoordinates);
    
	
	// 현재 열려 있는 모든 툴팁 닫기
	tooltipClose();
	
	// 버튼과 툴팁 활성화
	btn.classList.add('on');
	layer.closest('.tooltip').classList.add('on');
	
	layerWrap.focus();
	
	if (layerTab.length > 0) {
		document.addEventListener('keydown', function trapFocus(e) {
		if (document.activeElement === layerWrap && e.shiftKey && e.key === 'Tab') {
			e.preventDefault();
			layerTabLast.focus();
		}
	
		if (document.activeElement === layerTabFirst && e.shiftKey && e.key === 'Tab') {
			e.preventDefault();
			layerTabLast.focus();
		}
	
		if (document.activeElement === layerTabLast && !e.shiftKey && e.key === 'Tab') {
			e.preventDefault();
			layerTabFirst.focus();
		}
		});
	}
	
	// 닫기 버튼 핸들러
	btnClose.addEventListener('click', function (e) {
		e.preventDefault();
		closeTooltip(btn, layer);
	});
}
	
// tooltip 닫기
function closeTooltip(btn, layer) {
	if (btn) btn.focus(); // 닫기 시 버튼으로 포커스 이동

	if (layer) {
		layer.closest('.tooltip').classList.remove('on');
	}
}
	
// 모든 tooltip 닫기
function tooltipClose() {
	var tooltipLayer = document.querySelectorAll('.tooltip-layer');
	var btnTooltip = document.querySelectorAll('.btn-tooltip-open');
	
	tooltipLayer.forEach((layer) => {
		layer.closest('.tooltip').classList.remove('on');
	});
	
	btnTooltip.forEach((btn) => btn.classList.remove('on'));
}
	
// tooltip 열고 닫기 이벤트
document.addEventListener('click', function (event) {
	var btn = event.target.closest('.btn-tooltip-open');
	var tooltip = event.target.closest('.tooltip.on');
	
	// tooltip 열기
	if (btn) {
		if (!btn.classList.contains('disabled')) {
		if (btn.classList.contains('on')) {
			tooltipClose();
		} else {
			openTooltip(btn);
		}
		}
		return;
	}
	
	// 여백 클릭 시 모든 tooltip 닫기
	if (!tooltip) {
		tooltipClose();
	}
});
*/

/*
// 같이 찾는 (서비스)
var withLayer = document.querySelectorAll('.layer-with');

function openWith(btn) {
	var layerId = btn.getAttribute('aria-controls');
	var layer = document.getElementById(layerId);

	if (!layer) return;

	var layerWrap = layer.querySelector('.with-wrap');
	var btnClose = layerWrap.querySelector('.btn-close-common');
	var layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])');
	var layerTabFirst = layerTab[0];
	var layerTabLast = layerTab[layerTab.length - 1];

	// 토글: 버튼이 활성화 상태라면 닫기
	if (btn.classList.contains('on')) {
		closeWith(btn, layer);
		return;
	}

	// 모든 열린 레이어 닫기
	withLayerClose();

	// 레이어 열기
	btn.classList.add('on');
	layer.closest('.with').classList.add('on');
	layer.classList.add('on');
	layerWrap.focus();

	// 키보드 포커스 트랩
	if (layerTab.length > 0) {
		document.addEventListener('keydown', function trapFocus(e) {
			if (e.key !== 'Tab') return;

			if (document.activeElement === layerWrap && e.shiftKey) {
				e.preventDefault();
				layerTabLast.focus();
			}

			if (document.activeElement === layerTabFirst && e.shiftKey) {
				e.preventDefault();
				layerTabLast.focus();
			}

			if (document.activeElement === layerTabLast && !e.shiftKey) {
				e.preventDefault();
				layerTabFirst.focus();
			}
		});
	}

	// 닫기 버튼 클릭 시 레이어 닫기
	btnClose.addEventListener('click', function (e) {
		e.preventDefault();
		closeWith(btn, layer);
	});
}

function closeWith(btn, layer) {
	if (btn) btn.focus();
	if (layer) {
		layer.classList.remove('on');
		layer.closest('.with').classList.remove('on');
		btn.classList.remove('on');
	}
}

function withLayerClose() {
	withLayer.forEach((layer) => {
		layer.classList.remove('on');
		layer.closest('.with').classList.remove('on');
	});

	document.querySelectorAll('.ico-with').forEach((btn) => btn.classList.remove('on'));
}

// 같이 찾는 서비스 열기/닫기
document.addEventListener('click', function (event) {
	var btn = event.target.closest('.ico-with');
	var activeLayer = event.target.closest('.with.on');

	if (btn) {
		if (!btn.classList.contains('disabled')) {
			openWith(btn);
		}
		return;
	}

	if (!activeLayer) {
		withLayerClose();
	}
});

// 플랫폼 QR 코드보기
var platformLayer = document.querySelectorAll('.platform-qr .layer-qr');

function openPlatformQr(btn) {
	var layerId = btn.getAttribute('aria-controls');
	var layer = document.getElementById(layerId);

	if (!layer) return;

	var layerWrap = layer.querySelector('.qr-wrap');
	var btnClose = layerWrap.querySelector('.btn-close-common');
	var layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])');
	var layerTabFirst = layerTab[0];
	var layerTabLast = layerTab[layerTab.length - 1];

	// 토글: 버튼이 활성화 상태라면 닫기
	if (btn.classList.contains('on')) {
		closePlatformQr(btn, layer);
		return;
	}

	// 모든 열린 레이어 닫기
	platformLayerClose();

	// 레이어 열기
	btn.classList.add('on');
	layer.closest('.platform-qr').classList.add('on');
	layer.classList.add('on');
	layer.setAttribute('aria-hidden', 'false');
	layerWrap.focus();

	// 키보드 포커스 트랩
	if (layerTab.length > 0) {
		document.addEventListener('keydown', function trapFocus(e) {
			if (e.key !== 'Tab') return;

			if (document.activeElement === layerWrap && e.shiftKey) {
				e.preventDefault();
				layerTabLast.focus();
			}

			if (document.activeElement === layerTabFirst && e.shiftKey) {
				e.preventDefault();
				layerTabLast.focus();
			}

			if (document.activeElement === layerTabLast && !e.shiftKey) {
				e.preventDefault();
				layerTabFirst.focus();
			}
		});
	}

	// 닫기 버튼 클릭 시 레이어 닫기
	btnClose.addEventListener('click', function (e) {
		e.preventDefault();
		closePlatformQr(btn, layer);
	});
}

function closePlatformQr(btn, layer) {
	if (btn) btn.focus();
	if (layer) {
		layer.classList.remove('on');
		layer.setAttribute('aria-hidden', 'true');
		layer.closest('.platform-qr').classList.remove('on');
		btn.classList.remove('on');
	}
}

function platformLayerClose() {
	platformLayer.forEach((layer) => {
		layer.classList.remove('on');
		layer.setAttribute('aria-hidden', 'true');
		layer.closest('.platform-qr').classList.remove('on');
	});

	document.querySelectorAll('.ico-platform-qr').forEach((btn) => btn.classList.remove('on'));
}

// QR코드보기 열기/닫기
document.addEventListener('click', function (event) {
	var btn = event.target.closest('.ico-platform-qr');
	var activeLayer = event.target.closest('.platform-qr.on');

	if (btn) {
		if (!btn.classList.contains('disabled')) {
			openPlatformQr(btn);
		}
		return;
	}

	if (!activeLayer) {
		platformLayerClose();
	}
});
*/

// datepicker
var btnCalendar = document.querySelectorAll('.input-fn .btn-calendar');

btnCalendar.forEach(function (btn) {
	btn.addEventListener('click', function (event) {
		// 클릭 이벤트가 document로 전파되는 것을 일시적으로 막음
		event.stopPropagation();

		var currentInputFn = btn.closest('.input-fn');
		var currentLayer = currentInputFn.querySelector('.datepicker-layer');

		if (currentLayer) {
			if (currentLayer.classList.contains('on')) {
				currentLayer.classList.remove('on');
			} else {
				// 모든 .datepicker-layer에서 on 클래스 제거
				var allDatepickers = document.querySelectorAll('.datepicker-layer');
				allDatepickers.forEach((layer) => layer.classList.remove('on'));

				// 클릭된 버튼과 연결된 .datepicker-layer에만 on 클래스 추가
				currentLayer.classList.add('on');
			}
		}
	});
});

// document 클릭 이벤트 핸들러
document.addEventListener('click', function (event) {
	// 클릭된 요소와 연관된 input-fn만 유지하고 다른 레이어 닫기
	var activeInputFn = document.querySelector('.datepicker-layer.on')?.closest('.input-fn');

	if (
		!event.target.closest('.datepicker-layer') &&
		//!event.target.closest('.input-fn') &&
		activeInputFn
	) {
		closeDatepicker(activeInputFn); // 특정 input-fn과 관련된 레이어만 닫음
	}
});

// keyup 이벤트 핸들러
document.addEventListener('keyup', function (event) {
	// Enter 키나 Space 키를 눌렀을 때는 closeDatepicker를 실행하지 않음
	if (event.key === 'Enter' || event.key === ' ') {
		return;
	}

	// .datepicker-wrap 외부에서 keyup 이벤트 발생 시 닫기
	var activeInputFn = document.querySelector('.datepicker-layer.on')?.closest('.input-fn');
	if (
		!event.target.closest('.datepicker-wrap') &&
		//!event.target.closest('.input-fn') &&
		activeInputFn
	) {
		closeDatepicker(activeInputFn); // 특정 input-fn과 관련된 레이어만 닫음
	}
});

function closeDatepicker(activeInputFn) {
	var openLayer = activeInputFn.querySelector('.datepicker-layer.on');
	if (openLayer) {
		openLayer.classList.remove('on');
	}
}

// datepicker 안에 있는 년, 월 선택
var ymChoice = document.querySelectorAll('.datepicker-wrap .control .choice');
var ymToggle = document.querySelectorAll('.datepicker-wrap .control .choice .toggle');

ymToggle.forEach(function(btn){
	btn.addEventListener('click', function(){
		btn.closest('.choice').classList.toggle('on');
	});
});

document.addEventListener('keyup', function(e) {
	if (!e.target.closest('.datepicker-wrap .control .date .choice.on')) {
		yearMonthClose();
	}
});

function yearMonthClose() {
	ymChoice.forEach(function(area) {1
		area.classList.remove('on');
	});
}

var ymSelect = document.querySelectorAll('.datepicker-wrap .control .choice .list .select');

ymSelect.forEach(function(btn){
	btn.addEventListener('click', function(){
		btn.closest('.choice').classList.remove('on');
		
		var ymNumber = btn.querySelector('em').childNodes[0].nodeValue.trim();
		btn.closest('.choice').querySelector('.toggle').focus();
		btn.closest('.choice').querySelector('.toggle em').textContent = ymNumber;
	});
});

// 달력안 날짜 선택
var daySelect = document.querySelectorAll('.datepicker-wrap .tbl-calendar .day');

daySelect.forEach(function(day) {
	// 클릭 이벤트 추가
	day.addEventListener('click', function() {
		var allTd =	day.closest('.tbl-calendar').querySelectorAll('td');
		
		allTd.forEach(function(all){
			all.classList.remove('set');
			all.querySelector('.day').removeAttribute('title')
			day.setAttribute('title', '선택됨');
		});
		
		var parentTd = day.closest('td');
		if (parentTd) {
			parentTd.classList.add('set');
		} 
	});
});


/* layer tab */
function layerTab() {
	var layerTabArea = document.querySelectorAll('.tab-area.layer');
	
	layerTabArea.forEach(function(e) {
		var layerTabEle = e.querySelectorAll('.tab-list > ul > li');
		var tabPanel = e.querySelectorAll('.tab-conts');
		
		/* 탭 접근성 텍스트 세팅 */
		var tabAccText = document.createTextNode('선택됨');
		var tabAccTag = document.createElement('span');
		tabAccTag.setAttribute('class', 'sr-only');
		tabAccTag.appendChild(tabAccText);

		function tab() {
			layerTabEle.forEach(function(ele) {
				var control = ele.getAttribute('aria-controls');
				var selectedTabPanel = document.getElementById(control);

				if (ele.classList.contains('active')) {
					//선택됨 텍스트 추가
					ele.querySelector('button').append(tabAccTag);
				}

				ele.addEventListener('click', function() {
					layerTabInitial(); //레이어탭 초기화

					ele.classList.add('active');
					ele.querySelector('button').append(tabAccTag); //선택됨 텍스트 추가
					ele.setAttribute('aria-selected', 'true');
					selectedTabPanel.classList.add('active');
				});
			});

		}

		//레이어탭 초기화
		function layerTabInitial() {
			layerTabEle.forEach(function(ele) {
				var srOnly = ele.querySelector('.sr-only');
				if (srOnly) {
					ele.querySelector('button').removeChild(srOnly);
				}
		
				ele.classList.remove('active');
				ele.setAttribute('aria-selected', 'false');
			});
		
			tabPanel.forEach(function(ele) {
				ele.classList.remove('active');
			});
		}
		
		tab();
	});
}

var adLayerTabArea = document.querySelector('.tab-area.layer .tab-list');
if(adLayerTabArea) {
	layerTab();
}

// tab sort 클릭 핸들러 함수
function tabSortClick(event) {
	var clickedTab = event.currentTarget;
	var area = clickedTab.closest('.tab-area.sort');
	var layerTabEle = area.querySelectorAll('.tab-list > ul > li');

	// 기존 탭 상태 초기화
	layerTabEle.forEach(function (ele) {
		ele.classList.remove('active');
		var srOnly = ele.querySelector('.sr-only');
		if (srOnly) {
			srOnly.remove();
		}
	});

	// 현재 클릭된 탭에 active 및 접근성 텍스트 추가
	clickedTab.classList.add('active');
	var btn = clickedTab.querySelector('button');

	var span = document.createElement('span');
	span.className = 'sr-only';
	span.textContent = '선택됨';
	btn.appendChild(span);
}

function layerSort() {
	var layerTabArea = document.querySelectorAll('.tab-area.sort');

	layerTabArea.forEach(function (area) {
		var layerTabEle = area.querySelectorAll('.tab-list > ul > li');

		layerTabEle.forEach(function (ele) {
			var btn = ele.querySelector('button');

			// 초기 상태 active 탭에 "선택됨" 텍스트 추가
			if (ele.classList.contains('active') && !btn.querySelector('.sr-only')) {
				var span = document.createElement('span');
				span.className = 'sr-only';
				span.textContent = '선택됨';
				btn.appendChild(span);
			}

			// 중복 방지: 기존 이벤트 제거 후 다시 등록
			ele.removeEventListener('click', tabSortClick);
			ele.addEventListener('click', tabSortClick);
		});
	});
}

// 초기에 실행
var adLayerTabSort = document.querySelector('.tab-area.sort .tab-list');
if (adLayerTabSort) {
	layerSort();
}


// 중첩탭 외부
function multiTab() {
	var multiTabBtn = document.querySelectorAll('.tab-list-multi .btn-tab');
	multiTabBtn.forEach(function(btn){
		btn.addEventListener('click', function(){
			var tabBtn = btn.closest('li');
			var tabBtnGroup = tabBtn.closest('.tab-list-multi');
			var tabId = tabBtn.getAttribute('aria-controls');

			// 탭 버튼 초기화
			tabBtnGroup.querySelectorAll("li").forEach(function (siblings) {
				siblings.classList.remove('active');
				siblings.querySelector('.btn-tab').removeAttribute('title');
				siblings.setAttribute('aria-selected', 'false');
			});
			// 탭 컨텐츠 초기화
			var contSiblings = document.getElementById(tabId).parentElement.children ;
			Array.from(contSiblings).forEach((tabCont) => {
				tabCont.classList.remove('active');
			});

			// 선택 버튼 활성화
			tabBtn.classList.add('active');
			tabBtn.setAttribute('aria-selected', 'true');
			btn.title = '선택됨';

			// 선택 탭 활성화
			document.getElementById(tabId).classList.add('active');	
		});
	});
}

var adMultiTab = document.querySelector('.tab-area .tab-list-multi');
if(adMultiTab) {
	multiTab();
}

// 스크롤탭

function scrollTab(){
	document.querySelectorAll('.scroll-tab-wrap > .tab-list').forEach(function(scrollTab){
		var scrollTabX = scrollTab.querySelector('ul'),
			scrollTabWidth = scrollTab.offsetWidth,
			scrollTabXWidth = scrollTabX.scrollWidth;

		if ( scrollTabWidth < scrollTabXWidth ){
			scrollTab.querySelector('.scroll-btn-box.next').style.display = "block";
		} else {
			scrollTab.querySelector('.scroll-btn-box.next').style.display = "none";
		}
	
		scrollTabX.addEventListener('scroll', function () {
	
			// prev 버튼 비활성화
			if (this.scrollLeft <= 10) {
				scrollTab.querySelector('.scroll-btn-box.prev').style.display = "none";
			} else {
				scrollTab.querySelector('.scroll-btn-box.prev').style.display = "block";
			}
	
			// next 버튼 비활성화
			if (this.scrollLeft + scrollTabWidth >= scrollTabXWidth - 10) {
				scrollTab.querySelector('.scroll-btn-box.next').style.display = "none";
			} else {
				scrollTab.querySelector('.scroll-btn-box.next').style.display = "block";
			}
		});
	
		// tab 좌우 버튼
		var scrollBtn = scrollTab.querySelectorAll('.scroll-btn-box .btn-scroll-x');
		scrollBtn.forEach(function(btn) {
			btn.addEventListener('click', function(){
				var thisBtn = this.closest('.scroll-btn-box'),
					scrollOffsetX = scrollTabX.scrollLeft;
	
				if (thisBtn.classList.contains('prev')) {
					// 이전버튼
					scrollTabX.scrollLeft = scrollOffsetX - scrollTabWidth + 70
					
				} else if (thisBtn.classList.contains('next')) {
					scrollTabX.scrollLeft = scrollOffsetX + scrollTabWidth - 70
					//다음버튼
				}
			});
		});
	});
}

var adScrollTab = document.querySelector('.scroll-tab-wrap');
if(adScrollTab) {
	//vue 관련 이슈로 기능 삭제
	//scrollTab();
	//window.addEventListener("load",scrollTab);
	//window.addEventListener('resize', scrollTab);
}




// tab-spread
var tabSpread = document.querySelector('.tab-spread');
if (tabSpread) {
	var spreadToggle = tabSpread.querySelector('.btn-toggle');
	var spreadToggleText = tabSpread.querySelector('.btn-toggle .sr-only');
	var boxSpread = tabSpread.querySelector('.box-spread');

	function mobileTabHandle(e) {
		if (!boxSpread.classList.contains('on')) return; // boxSpread가 닫혀있으면 이벤트 실행 안 함

		var layerSpreadTab = boxSpread.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])'),
			layerSpreadTabFirst = layerSpreadTab[0],
			layerSpreadTabLast = layerSpreadTab[layerSpreadTab.length - 1];

		if (document.activeElement === boxSpread && e.shiftKey && e.key === 'Tab') {
			e.preventDefault();
			layerSpreadTabLast.focus();
		}

		if (document.activeElement === layerSpreadTabFirst && e.shiftKey && e.key === 'Tab') {
			e.preventDefault();
			layerSpreadTabLast.focus();
		}

		if (document.activeElement === layerSpreadTabLast && !e.shiftKey && e.key === 'Tab') {
			e.preventDefault();
			layerSpreadTabFirst.focus();
		}
	}

	// 모바일 접근성
	function responsiveTabSpread() {
		var chkWidth = window.innerWidth;
		var layerSpread = boxSpread.querySelector('.wrap'),
			layerCont = layerSpread.querySelector('.select-area');

		if (chkWidth >= 768) {
			document.removeEventListener('keydown', mobileTabHandle);
			document.body.classList.remove('overflow');

			// 접근성 속성 삭제
			boxSpread.removeAttribute('role');
			boxSpread.removeAttribute('aria-modal');
			layerSpread.removeAttribute('tabindex');
			layerCont.removeAttribute('tabindex');

		} else {
			// 모바일일 때 모달 속성 설정
			boxSpread.setAttribute('role', 'dialog');
			boxSpread.setAttribute('aria-modal', 'true');
			layerSpread.setAttribute('tabindex', '0');
			layerCont.setAttribute('tabindex', '0');

			var isFilterOpen = document.querySelector('.box-spread.on');

			if (isFilterOpen) { // 열린 상태
				document.body.classList.add('overflow');

				// 접근성 설정
				var layerSpreadTab = boxSpread.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])');
				if (layerSpreadTab.length > 0) {
					layerSpreadTab[0].focus();
				}

				document.addEventListener('keydown', mobileTabHandle);
			} else { // 닫힌 상태
				document.body.classList.remove('overflow');
				document.removeEventListener('keydown', mobileTabHandle);
			}
		}
	}

	window.addEventListener('resize', responsiveTabSpread);
	responsiveTabSpread();

	// 토글버튼 상태설정
	if (spreadToggle.classList.contains('active')) {
		spreadToggleText.innerText = '닫기';
	} else {
		spreadToggleText.innerText = '열기';
	}

	document.addEventListener('click', function (e) {
		if (e.target.closest('.tab-spread')) {
			// 토글 버튼 클릭시
			if (e.target.classList.contains('btn-toggle')) {
				if (!e.target.classList.contains('active')) {
					e.target.classList.add('active');
					e.target.querySelector('.sr-only').innerText = '닫기';
					boxSpread.classList.add('on');
				} else {
					e.target.classList.remove('active');
					e.target.querySelector('.sr-only').innerText = '열기';
					boxSpread.classList.remove('on');
				}
			}

			// 모바일 (닫기)
			if (e.target.classList.contains('close-spread')) {
				spreadToggle.classList.remove('active');
				spreadToggle.querySelector('.sr-only').innerText = '열기';
				boxSpread.classList.remove('on');
				spreadToggle.focus();
			}

			responsiveTabSpread();
		}
	});
}


// // 목록 정렬기준 : 관련도순, 최신순, 인기순 등등
// var sortStandard = document.querySelectorAll('.sort-standard');
// var sortToggle = document.querySelectorAll('.sort-standard .btn-toggle');
// var sortChoice = document.querySelectorAll('.sort-standard li .btn-txt');

// sortToggle.forEach(function(btn){
// 	btn.addEventListener('click', function(){
// 		btn.closest('.sort-standard').classList.toggle('on');
// 	});
// });

// sortChoice.forEach(function(btn) {
// 	btn.addEventListener('click', function() {
// 		btn.classList.add('on');
// 		btn.setAttribute('title', '선택됨');

// 		var _txt = btn.textContent;

// 		btn.closest('.sort-standard').classList.remove('on');
// 		btn.closest('.sort-standard').querySelector('.btn-toggle').textContent = _txt;

// 		Array.from(btn.closest('li').parentNode.children).forEach(function(sibling) {
// 			if (sibling !== btn.closest('li')) {
// 				var siblingBtn = sibling.querySelector('.btn-txt');
// 				if (siblingBtn) {
// 					siblingBtn.classList.remove('on');
// 					siblingBtn.removeAttribute('title');
// 				}
// 			}
// 		});
// 	});
// });

// // 목록 정렬기준 : 닫기
// function sortStandardClose(){
// 	sortStandard.forEach(function(layer){
// 		layer.classList.remove('on');
// 	});
// }

// document.addEventListener('click', function (event) {
// 	var activeSortStandard = event.target.closest('.sort-standard.on');

// 	if (!activeSortStandard) {
// 		sortStandardClose();
// 	}
// });

// document.addEventListener('keyup', function (event) {
// 	var activeSortStandard = event.target.closest('.sort-standard.on');

// 	if (!activeSortStandard) {
// 		sortStandardClose();
// 	}
// });

// 통합검색 관련 js 는 html 에 선언. 검색팀 요청


// 찜하기
var icoLike = document.querySelectorAll('.ico-like');

icoLike.forEach(function(like){
	like.addEventListener('click', function(){
		like.classList.toggle('done');
		
		if (like.classList.contains('done')) {
			like.querySelector('.txt').textContent = '찜해제';
		} else {
			like.querySelector('.txt').textContent = '찜하기';
		}
	});
});

// 목록 보기 형태 선택. 카드형(col), 목록형(row)
var viewTypeBtn = document.querySelectorAll('.view-type .type');

viewTypeBtn.forEach(function(btn) {
	btn.addEventListener('click', function(event) {
		var clickedBtn = event.currentTarget;

		viewTypeBtn.forEach(function(b) {
			b.classList.remove('on');

			var isRow = b.classList.contains('row');
			var label = isRow ? '목록형 보기' : '카드형 보기';

			b.setAttribute('title', label);
			
			var srOnly = b.querySelector('.sr-only');
			if (srOnly) {
				srOnly.textContent = label;
			}
		});

		clickedBtn.classList.add('on');

		var isClickedRow = clickedBtn.classList.contains('row');
		var clickedLabel = isClickedRow ? '목록형 보기로 선택됨' : '카드형 보기로 선택됨';

		clickedBtn.setAttribute('title', clickedLabel);

		var clickedSrOnly = clickedBtn.querySelector('.sr-only');
		if (clickedSrOnly) {
			clickedSrOnly.textContent = clickedLabel;
		}

		var listCardWrap = clickedBtn.closest('.list-card-wrap');
		if (listCardWrap) {
			var listCard = listCardWrap.querySelector('.list-card');
			if (listCard) {
				if (isClickedRow) {
					listCard.classList.add('row');
				} else {
					listCard.classList.remove('row');
				}
			}
		}

		// 혜택알리미 2차 > 결과목록 (운영 소스 수정(통합포털))
		var bnResultArea = clickedBtn.closest('.bn-result-area');
		if (bnResultArea) {
			var bnListCard = bnResultArea.querySelector('.bn-list-card');
			if (bnListCard) {
				if (isClickedRow) {
					bnListCard.classList.add('row');
				} else {
					bnListCard.classList.remove('row');
				}
			}
		}
	});
});


// 통합검색 page
// 통합검색 left toggle
// var searchFilterToggle = document.querySelectorAll('.filter-area .filter-block .btn-toggle');

// searchFilterToggle.forEach(function(btn) {
// 	btn.addEventListener('click', function() {
// 		btn.closest('.filter-block').classList.toggle('off');
// 	});
// });

// 통합검색 - 연관검색어
// var relatedWordToggle = document.querySelector('.total-search-page .top-search .related-word .btn-arr-toggle');

// if(relatedWordToggle){
// 	relatedWordToggle.addEventListener('click', function () {
// 		var _list = this.closest('.list');
// 		var _txt = this.querySelector('em');
	
// 		_list.classList.toggle('on');
	
// 		_txt.textContent = _list.classList.contains('on') ? '닫기' : '더보기';
// 	});
	
// }

// 통합검색 상단 filter swiper
var searchfilterSwiper = document.querySelector('.search-filter-swiper');

if(searchfilterSwiper){
	searchfilterSwiper = new Swiper(".search-filter-swiper", {
		slidesPerView: "auto",
		spaceBetween:8,
		observer: true,
		observerParents: true,
		slidesOffsetBefore:0,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		on: {
			init: function () {
				this.setTranslate(0)
			}
		}
	});
}

// 개발팀 요청 > ui-script-layout.js를 ts로 변환하며 생긴 오류로 책갈피 스크립트 삭제. searchdtl.vue 혜택알리미 책갈피 script로 대치
// 민원서식 안내 (서비스안내) - 책갈피
// var iwWrap = document.getElementById('iw_wrap');
// var iwHeader = document.getElementById('iw_header');
// var contWrap = document.querySelector('.conts-wrap');
// var contWrapTop;
// var quickPanel;
// if(contWrap){
// 	contWrapTop = contWrap.offsetTop;
// 	quickPanel = document.querySelector('.quick-panel-wrap');
// }

// if (quickPanel) {
// 	// 책갈피 클릭 스크롤 이동
// 	var quickLink = document.querySelectorAll('.quick-panel-wrap .list-quick li a');
// 	var iwHeaderHeight = 0; // 헤더 높이
// 	var quickLinkHighlightBound; // 함수 바인딩 저장용 변수


// 	quickLink.forEach(function (btn) {
// 		btn.addEventListener('click', function (event) {
// 			var quickLinkId = event.target.hash;
// 			var section = document.querySelector(quickLinkId);

// 			if (section) { // 해당 섹션 존재여부 확인
// 				var sectionTop = section.getBoundingClientRect().top; // 해당 섹션의 위치
// 				event.preventDefault();

// 				if (iwWrap) {
// 					if (Math.sign(sectionTop) == -1 && sectionTop < window.scrollY) {
// 						/* 
// 						타겟 섹션이 위에 있을때 sectionTop이 음수값이기 때문에

// 						1. 음수값을 가진 sectionTop 인 경우에만
// 						2. 위로 스크롤하는 경우에만 적용
						
// 						*/
// 						//console.log(iwHeaderHeight)
// 						window.scrollTo({ top: window.scrollY + sectionTop - iwHeaderHeight, behavior: 'smooth' });
// 					} else {
// 						/* 
// 						타겟 섹션이 아래에 있을때 
// 						1. sectionTop이 양수값이고 현재 스크롤위치보다 작은 경우
// 						2. 아래로 스크롤하는 경우 적용
						
// 						*/
						
// 						// PC / 모바일 헤더 높이값으로 체크
// 						if (!document.querySelector('#iw_header .header-in') || iwHeader.offsetHeight == 0) {
// 							window.scrollTo({ top: window.scrollY + sectionTop - iwHeaderHeight, behavior: 'smooth' });
// 						} else {
// 							window.scrollTo({ top: window.scrollY + sectionTop, behavior: 'smooth' });
// 						}
// 					}
// 				}
// 			}
// 		});
// 	});

// 	// 스크롤 이동 책갈피 활성화 기능
// 	function quickLinkHighlight() {
// 		if (!quickPanel || !document.body.contains(quickPanel)) {
// 			// quickPanel이 DOM에서 제거된 경우 이벤트 해제
// 			document.removeEventListener('scroll', quickLinkHighlightBound);
// 			return;
// 		}

// 		var scrollTop = Math.ceil(window.scrollY); // 현재 스크롤 위치
// 		var viewHeight = Math.ceil(window.innerHeight); // 뷰포트 높이
// 		var scrollHeight = Math.ceil(document.body.scrollHeight); // 문서 전체 높이


// 		// 헤더 유무 체크
// 		if (!document.querySelector('#iw_header .header-in')) {
// 			// 헤더가 없을 경우에만
// 			iwHeaderHeight = document.querySelector('.tit-page-wrap').offsetHeight;
// 		} else {
// 			// 헤더 있는 경우 높이값으로 pc, 모바일 체크
// 			if (iwHeader.offsetHeight == 0) {
// 				iwHeaderHeight = document.querySelector('.tit-page-wrap').offsetHeight;
// 			} else {
// 				iwHeaderHeight = iwHeader.offsetHeight;
// 			}
// 		}

// 		quickLink.forEach(function (link) {
// 			var linkId = link.hash;
// 			var section = document.querySelector(linkId);
// 			if (!section) return; // 섹션이 없으면 건너뜀

// 			var sectionTop = section.offsetTop; // 섹션의 시작 위치
// 			var firstLink = document.querySelector('.list-quick ul li:first-child a');
// 			var firstSectionTop = document.querySelector(firstLink.attributes.href.value).offsetTop;

// 			// quick link class active 삭제
// 			var deleteActive = function (link) {
// 				Array.from(link.closest('ul').children).forEach(function (sibling) {
// 					if (sibling !== link.closest('li')) sibling.classList.remove('active');
// 				});
// 			};

// 			// 스크롤이 섹션 시작 영역보다 위에 있는 경우 첫번째 링크에 active 추가
// 			if (scrollTop <= firstSectionTop) {
// 				deleteActive(firstLink);
// 				firstLink.closest('li').classList.add('active');
// 			}

// 			// 스크롤 위치에 해당하는 섹션 링크 제어
// 			if (scrollTop - iwHeaderHeight >= sectionTop) {
// 				deleteActive(link);
// 				link.closest('li').classList.add('active');
// 			}

// 			// 마지막 섹션 링크 제어
// 			var lastSection = document.querySelector('.list-quick ul li:last-child a');
// 			if (scrollTop + viewHeight >= scrollHeight) {
// 				deleteActive(lastSection);
// 				lastSection.closest('li').classList.add('active');
// 			}
// 		});
// 	}

// 	// 바인딩된 함수 참조를 저장
// 	quickLinkHighlightBound = quickLinkHighlight.bind(this);

// 	// 이벤트 리스너 추가
// 	document.addEventListener('scroll', quickLinkHighlightBound);

// 	// 초기 실행
// 	quickLinkHighlight();
// }


// modal-auto
var modalAuto = document.querySelectorAll('.iw-modal-auto');
if(modalAuto.length > 0) {
	function autoModalHandle() {
		modalAuto.forEach(function(layer) {
			var layerWrap = layer.querySelector('.modal-dialog'),
				btnClose = layerWrap.querySelectorAll('.close-modal'),
				layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])'),
				layerTabFirst = layerTab[0],
				layerTabLast = layerTab[layerTab.length - 1];
	
			// 모달 안 포커스
			layerWrap.setAttribute('tabindex', '-1');
			layerWrap.focus();
			
			if (layerTab.length > 0) {
				document.addEventListener('keydown', function (e) {
					if (document.activeElement === layerWrap && e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						layerTabLast.focus();
					}
					
					if (document.activeElement === layerTabFirst && e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						layerTabLast.focus();
					}
					
					if (document.activeElement === layerTabLast && !e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						layerTabFirst.focus();
					}
				});
			}
			
	
			// 모달 닫기 핸들러
			function closeModalAuto() {
				layer.classList.remove('on');
			}
	
			btnClose.forEach(function(btn) {
				btn.addEventListener('click', function (e) {
					e.preventDefault();
					
					if (!this.classList.contains('disabled')) {
						closeModalAuto();
					}
				});
			});
		});
	}

	autoModalHandle();
}

//accordion-toggle
var accordionToggle = document.querySelectorAll('.accordion-item .btn-toggle');

accordionToggle.forEach(function(btn) {
	btn.addEventListener('click', function() {
		var accoItem = btn.closest('.accordion-item'),
			isExpanded = this.getAttribute('aria-expanded') === 'true';

		this.setAttribute('aria-expanded', !isExpanded); 
		accoItem.classList.toggle('off', isExpanded); 
	});
});


// 만족도평가
var assessArea = document.querySelector('.assess-area');
if (assessArea) {
	var btnAssess = assessArea.querySelectorAll('.assess-area .btn-assess');
	btnAssess.forEach(function(btn) {
		btn.addEventListener('click', function() {
			// 버튼 활성화 기능
			this.classList.add('on');
			this.setAttribute('title', '선택됨');

			Array.from(btn.parentNode.children).forEach(function(sibling) {
				if (sibling !== btn) {
					sibling.classList.remove('on');
					sibling.removeAttribute('title');
				}
			});
			

			// (모달) 만족도 평가 내용 활성화
			if (this.closest('.box-assess')) {
				if (this.classList.contains('good')) {
					this.closest('.wrap-assess-question').querySelector('li.question-good').style = 'display:block;';
					this.closest('.wrap-assess-question').querySelector('li.question-bad').style = 'display:none;';
				}
	
				if (this.classList.contains('bad')) {
					this.closest('.wrap-assess-question').querySelector('li.question-good').style = 'display:none;';
					this.closest('.wrap-assess-question').querySelector('li.question-bad').style = 'display:block;';
				}
			}

			// 혜택알리미 2차 만족도 평가 내용 활성화 (운영 소스 수정(통합포털))
			if (this.closest('.box-toggle')) {
				this.closest('.box-toggle').querySelector('.opinion-area').classList.add('active');

				if (this.classList.contains('good')) {
					this.closest('.box-toggle').querySelector('.opinion-area li.question-good').style = 'display:block;';
					this.closest('.box-toggle').querySelector('.opinion-area li.question-bad').style = 'display:none;';
				}
	
				if (this.classList.contains('bad')) {
					this.closest('.box-toggle').querySelector('li.question-good').style = 'display:none;';
					this.closest('.box-toggle').querySelector('li.question-bad').style = 'display:block;';
				}
			}
		});
	});
}


// 디스클로저
function getEventPath(event) {
	var path = [];
	var currentElem = event.target;

	while (currentElem) {
		path.push(currentElem);
		currentElem = currentElem.parentNode;
	}

	if (!path.includes(window)) path.push(window);
	if (!path.includes(document)) path.push(document);

	return path;
}

function handleDisclosureToggle(e) {
	var btn = null;
	var path = e.composedPath ? e.composedPath() : getEventPath(e);

	for (var i = 0; i < path.length; i++) {
		var el = path[i];
		if (el && el.classList && el.classList.contains('btn-toggle')) {
			btn = el;
			break;
		}
	}

	if (!btn) return;

	var disclosure = btn.closest('.iw-disclosure');
	if (!disclosure) return;

	var isExpanded = btn.getAttribute('aria-expanded') === 'true';

	disclosure.classList.toggle('on');
	btn.setAttribute('aria-expanded', String(!isExpanded));

	var srText = btn.querySelector('.sr-only em');
	if (srText) {
		srText.textContent = isExpanded ? '열기' : '닫기';
	}
}

document.addEventListener('click', handleDisclosureToggle, true);


// 개인정보처리방침, 이용약관 책갈피 효과
var termAnchorList = document.querySelector('.term-anchor-list');

if(termAnchorList) {
	var termBtnAnchor = termAnchorList.querySelectorAll('.btn-anchor');

	termBtnAnchor.forEach(function(btn){
		btn.addEventListener('click', function(e){
			e.preventDefault();

			var anchorContId = this.getAttribute('href').replace('#', ''),
				anchorCont = document.getElementById(anchorContId),
				anchorContOffset = anchorCont.offsetTop,
				windowSize = window.innerWidth,
				topPadding = windowSize >= 1024 ? 24 : 88;
			
			anchorContPosition = anchorContOffset - topPadding;

			window.scrollTo({ top: anchorContPosition });
		});
	});
}



// 혜택알리미 > 가족 등록 및 관리 > 가족 정보입력
var bnfFamilydataToggle = document.querySelectorAll('.bnf-family-data .data.btn-toggle');

bnfFamilydataToggle.forEach(function(btn) {
	btn.addEventListener('click', function() {
		var item = btn.closest('.item'),
			isExpanded = this.getAttribute('aria-expanded') === 'true';

		var srText = btn.querySelector('.sr-only em');
		if (srText) {
			srText.textContent = isExpanded ? '열기' : '닫기';
		}

		this.setAttribute('aria-expanded', !isExpanded); 
		item.classList.toggle('on', !isExpanded); 
	});
});

//다크모드 테스트코드. 실제는 안씁니다 :: DOM로드 후 다크모드 주기
// document.addEventListener('DOMContentLoaded', function() {
// 	document.documentElement.setAttribute('data-theme', 'dark-mode');
// });


// AI 디스클로져
const AI_briefing = {
    disclosures: null,

    init() {
        this.disclosures = document.querySelectorAll('.briefing-disclosure')
        if (!this.disclosures.length) return
        this.setupDisclosure()
    },

    setupDisclosure() {
        this.disclosures.forEach((disclosure) => {
            const btn = disclosure.querySelector('.btn-conts-expand')
            const bodyConts = disclosure.querySelector('.body-conts')

            if (!btn || !bodyConts) return

            const btnLabel = btn.querySelector('span')

            bodyConts.style.overflow = 'hidden'
            bodyConts.style.transition = 'height 0.4s ease'
            bodyConts.style.height = '173px'

            btn.setAttribute('aria-expanded', 'false')
            if (btnLabel) btnLabel.textContent = '더보기'

            // 초기 active 상태 처리
            if (disclosure.classList.contains('active')) {
                this.setExpanded(disclosure, btn, btnLabel, bodyConts)
            }

            btn.addEventListener('click', () => {
                const isExpanded = disclosure.classList.contains('active')

                if (isExpanded) {
                    this.collapse(disclosure, btn, btnLabel, bodyConts)
                } else {
                    this.expand(disclosure, btn, btnLabel, bodyConts)
                }
            })
        })
    },

    expand(disclosure, btn, btnLabel, bodyConts) {
        bodyConts.style.height = `${bodyConts.scrollHeight}px`
        disclosure.classList.add('active')
        btn.setAttribute('aria-expanded', 'true')
        if (btnLabel) btnLabel.textContent = '접기'

        bodyConts.addEventListener(
            'transitionend',
            () => {
                bodyConts.style.height = 'auto'
                bodyConts.style.overflow = 'visible'
                bodyConts.classList.add('is-expanded')
            },
            { once: true },
        )
    },

    collapse(disclosure, btn, btnLabel, bodyConts) {
        bodyConts.style.height = `${bodyConts.scrollHeight}px`
        bodyConts.style.overflow = 'hidden'

        requestAnimationFrame(() => {
            bodyConts.style.height = '173px'
            disclosure.classList.remove('active')
            bodyConts.classList.remove('is-expanded')
            btn.setAttribute('aria-expanded', 'false')
            if (btnLabel) btnLabel.textContent = '더보기'
        })
    },

    setExpanded(disclosure, btn, btnLabel, bodyConts) {
        bodyConts.style.height = 'auto'
        bodyConts.style.overflow = 'visible'
        bodyConts.classList.add('is-expanded')
        disclosure.classList.add('active')
        btn.setAttribute('aria-expanded', 'true')
        if (btnLabel) btnLabel.textContent = '접기'
    },
}

const AI_loading = {
    instance: null,
    canvas: null,

    init() {
        this.canvas = document.querySelector('#lottie-loading')
        if (!this.canvas) return
        this.canvas.setAttribute('width', '40')
        this.canvas.setAttribute('height', '40')
    },

    show() {
        if (!this.canvas) return
        if (this.instance) {
            this.instance.destroy()
            this.instance = null
        }

        this.canvas.style.display = 'block'

        this.instance = new DotLottie({
            autoplay: true,
            loop: true,
            canvas: this.canvas,
            src: '/static/js/loading.json',
        })
    },

    hide() {
        if (!this.canvas) return
        this.canvas.style.display = 'none'
        if (this.instance) {
            this.instance.destroy()
            this.instance = null
        }
    },
}

document.addEventListener('DOMContentLoaded', () => {
    AI_loading.init()
    AI_briefing.init()
})
