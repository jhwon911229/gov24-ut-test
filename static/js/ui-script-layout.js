
// 스킵 네비게이션
document.querySelectorAll('.skip-nav a').forEach(function(skipEle) {
	skipEle.addEventListener('focus', function() {
		skipEle.closest('.skip-nav').classList.add('on');
	});
	skipEle.addEventListener('blur', function() {
		skipEle.closest('.skip-nav').classList.remove('on');
	});
});

/* header
==========================================================================*/
var iwWrap = document.getElementById('iw_wrap');
var iwHeader = document.getElementById('iw_header');
var iwHeaderIn = document.querySelector('#iw_header .header-in');
var adContainer = document.getElementById('iw_container');
var adConOffsetTop;

function updateHeaderHeight() {
	var chkWidth = window.innerWidth;

	if(iwHeader){
		if (chkWidth <= 1024) {
			iwHeader.style.height = ''; // 스타일 제거
		} else {
			if (iwHeaderIn) {
				iwHeader.style.height = iwHeaderIn.offsetHeight + 'px';
			}
		}
	}
}

// 헤더 class header-view 삭제, gnb 닫기
function deleteHeaderFunction() {
	var chkWidth = window.innerWidth;

	if(iwWrap){
		if (chkWidth <= 1024) {
			iwWrap.classList.remove('header-view');
			gnbClose();
		} 
	}
}

// 초기 높이 설정
updateHeaderHeight();

// 윈도우 리사이즈 이벤트에 updateHeaderHeight 추가
window.addEventListener('resize', updateHeaderHeight);
// 윈도우 리사이즈 이벤트에 deleteHeaderFunction 추가
window.addEventListener('resize', deleteHeaderFunction);

if (adContainer) {
	adConOffsetTop = adContainer.getBoundingClientRect().top + window.scrollY;
}

if(iwWrap){
	function headerFixed() {
		var lastScrollY = 0;

		// 스크롤 이벤트 핸들러
		function headerScroll() {
			var scrollY = window.scrollY;
			var scrollDown = scrollY > lastScrollY;
			var scrollUp = scrollY < lastScrollY;
			var chkWidth = window.innerWidth;
			
			if (scrollY > adConOffsetTop - 50 && scrollDown && chkWidth > 1024) {
				iwWrap.classList.add('scroll-down');
				iwWrap.classList.remove('scroll-up'); // 스크롤 다운
				
			} else if (scrollY > adConOffsetTop - 50 && scrollUp && chkWidth > 1024) {
				iwWrap.classList.add('scroll-up');
				iwWrap.classList.remove('scroll-down'); // 스크롤 업
			} else {
				iwWrap.classList.remove('scroll-down', 'scroll-up'); // 상단
			}
			lastScrollY = scrollY;
		}

		// 페이지 로드 시 초기 스크롤 상태 확인
		headerScroll();

		// 스크롤 이벤트 리스너 등록
		window.addEventListener('scroll', headerScroll);
	}

	setTimeout(function() {
		headerFixed();
	}, 100);
}

// header 키보드 제어
var iwHeaderTab = document.querySelectorAll('#iw_header button, #iw_header [href], #iw_header select, #iw_header input, #iw_header textarea, #iw_header [tabindex]:not([tabindex="-1"])');

iwHeaderTab.forEach(function(tab) {
	tab.addEventListener('focus', function() {
		iwWrap.classList.add('header-view'); // header 안에 포커스가 들어간 경우 보이기
	});
});


// header util. 지원, 화면 크기
var iwHeaderUtil = document.querySelectorAll('#iw_header .header-util .toggle');

iwHeaderUtil.forEach(function (toggle) {
	toggle.addEventListener('click', function () {
		var closestDiv = toggle.closest('.div');
		
		if (closestDiv) {
			Array.from(closestDiv.parentNode.children).forEach(function (sibling) {
				if (sibling !== closestDiv) {
					sibling.classList.remove('on');

					// 스크린리더 텍스트 제어
					var txtElement = sibling.querySelector('.sr-only em');
					if (txtElement) {
						txtElement.textContent = '펼치기';
					}
				}
			});

			closestDiv.classList.toggle('on');

			// 스크린리더 텍스트 제어
			var txtElement = this.querySelector('.sr-only em');
			if (txtElement) {
				txtElement.textContent = closestDiv.classList.contains('on') ? '닫기' : '펼치기';
			}

			// 토글시 header-view 클래스 제어
			if (!closestDiv.classList.contains('on')) {
				iwWrap.classList.remove('header-view');
			} else {
				iwWrap.classList.add('header-view');
			}
		}
	});
});

function iwHeaderUtilClose() {
	iwHeaderUtil.forEach(function (toggle) {
		var closestDiv = toggle.closest('.div');
		if (closestDiv) {
			closestDiv.classList.remove('on');
			// 스크린리더 텍스트 제어
			var txtElement = toggle.querySelector('.sr-only em');
			if (txtElement) {
				txtElement.textContent = '펼치기';
			}
		}
	});
}

// header my gov 레이어
var iwHeaderMyGov = document.querySelectorAll('#iw_header .header-mygov');
var iwHeaderMyGovOpen = document.querySelectorAll('#iw_header .open-header-mygov');

if(iwHeaderMyGovOpen){
	iwHeaderMyGovOpen.forEach(function(btn){
		btn.addEventListener('click', function (e) {
			e.target.closest('.header-mygov').classList.toggle('on');
	
			// 토글시 header-view 클래스 제어
			if (!e.target.closest('.header-mygov').classList.contains('on')) {
				iwWrap.classList.remove('header-view');
			} else {
				iwWrap.classList.add('header-view');
			}
		});
	});
}

function iwHeaderMyGovClose() {
	if(iwHeaderMyGov){
		iwHeaderMyGov.forEach(function(layer){
			layer.classList.remove('on');
		});
	}
}


// 여백 클릭시 header 관련 이벤트
document.addEventListener('click', function(event) {
	if( iwWrap ) {
		/* 여백 클릭시 header-view 제어 */
		if (document.querySelector('#iw_header #iw_gnb li.on')) { // gnb 열려있는 경우
			if (!event.target.closest(".header-bottom")) { // gnb 영역 외 클릭시
				// gnb 닫기
				gnbClose();

				if (!event.target.closest('.header-util .div') && !event.target.closest('.header-mygov')) { // 공백 클릭시 header-view 삭제
					iwWrap.classList.remove('header-view');
				}
			}

		} else { // gnb 닫혀있는 경우
			if (!event.target.closest('#iw_gnb li') && !event.target.closest('.header-util .div') && !event.target.closest('.header-mygov')) { // 공백 클릭시 header-view 삭제
				iwWrap.classList.remove('header-view');
			}
		}

		// header util
		if (!event.target.closest("#iw_header .header-util .div")) {
			iwHeaderUtilClose();
		}
		
		// header my gov
		if (!event.target.closest("#iw_header .header-mygov")) {
			iwHeaderMyGovClose();
		}


		// footer related
		if (!event.target.closest(".related-layer")) {
			iwFooterRelatedClose();
		}
	}
});


document.addEventListener('keyup', function(event) {
	if (!event.target.closest("#iw_header .header-util .div")) {
		iwHeaderUtilClose();
	}
	
	if (!event.target.closest("#iw_header .header-mygov")) {
		iwHeaderMyGovClose();
	}

	// 헤더 밖으로 포커스 이동시 header-view 삭제
	if (!event.target.closest("#iw_header")) {
		if(iwWrap){
			iwWrap.classList.remove('header-view');
		}
	}

});


// 화면 크기 조절 버튼 클릭 이벤트
document.addEventListener('click', function (event) {
	if (document.querySelectorAll('.screen-size').length > 0) {

		var _root =  document.querySelector(':root');

		var zoomLevels = {
			'btn-size sm': 0.9,
			'btn-size md': 1,
			'btn-size lg': 1.1,
			'btn-size xlg': 1.2,
			'btn-size xxlg': 1.3,
		};
	
		// 클릭한 요소가 화면 크기조절 버튼인지 확인
		var btn = event.target.closest('.screen-size .btn-size');
		if (!btn) return;
	
		// Zoom 조절
		var classKey = Array.from(btn.classList).join(' ');
		if (classKey in zoomLevels) {
			_root.style.zoom = zoomLevels[classKey];
		} else if (btn.classList.contains('reset')) {
			_root.style.removeProperty('zoom');
		}
	
		// 해당 버튼이 포함된 모든 `.screen-size` 영역을 찾아서 `active` 적용
		document.querySelectorAll('.screen-size').forEach(function(screenSize) {
			var ul = screenSize.querySelector('ul');
			if (!ul) return;
	
			// 모든 `li`에서 `active` 제거, 버튼에 title 삭제
			ul.querySelectorAll('li').forEach(function(li) {
				li.classList.remove('active');
				li.querySelector('.btn-size').removeAttribute('title');
			});
	
			// reset 버튼이 아닌 경우 해당 버튼 활성화
			if (!btn.classList.contains('reset')) {
				var matchingBtns = screenSize.querySelectorAll(`.${classKey.replace(' ', '.')}`);
				matchingBtns.forEach(function(matchingBtn) {
					var li = matchingBtn.closest('li');
					matchingBtn.setAttribute('title', '선택된 상태');
					if (li) li.classList.add('active');
				});
			} else { // reset 버튼 클릭 시, 해당 `.screen-size` 내 `.btn-size.md` 버튼 활성화
				var defaultBtns = screenSize.querySelectorAll('.btn-size.md');
				defaultBtns.forEach(function(defaultBtn) {
					var defaultLi = defaultBtn.closest('li');
					defaultBtn.setAttribute('title', '선택된 상태')
					if (defaultLi) defaultLi.classList.add('active');
				});
			}
		});

		// AI 패널 스타일 조정: 선택된 화면크기 저장 및 즉시 적용, 이후 열리는 패널에도 적용
		var selectedSize = '';
		if (btn.classList.contains('lg')) selectedSize = 'lg';
		else if (btn.classList.contains('xlg')) selectedSize = 'xlg';
		else if (btn.classList.contains('xxlg')) selectedSize = 'xxlg';
		else if (btn.classList.contains('md')) selectedSize = 'md';
		else if (btn.classList.contains('sm')) selectedSize = 'sm';
		else if (btn.classList.contains('reset')) selectedSize = '';

		document.documentElement.setAttribute('data-screen-size', selectedSize);

		function applyAiStylesToPanel(panel) {
			var size = document.documentElement.getAttribute('data-screen-size');
			if (size === 'lg' || size === 'xlg' || size === 'xxlg') {
				panel.style.zoom = '0.9';
				panel.style.bottom = '0';
			} else {
				panel.style.removeProperty('zoom');
				panel.style.removeProperty('bottom');
			}
		}

		var aiPanels = document.querySelectorAll('.sc-ai-panel-wrap.on');
		if (aiPanels.length > 0) {
			aiPanels.forEach(function(panel) {
				applyAiStylesToPanel(panel);
			});
		}

		if (!window.__aiPanelObserverAdded) {
			window.__aiPanelObserverAdded = true;
			var aiObserver = new MutationObserver(function(mutations) {
				mutations.forEach(function(m) {
					var target = m.target;
					if (target && target.classList && target.classList.contains('sc-ai-panel-wrap')) {
						if (target.classList.contains('on')) {
							applyAiStylesToPanel(target);
						} else {
							target.style.removeProperty('zoom');
							target.style.removeProperty('bottom');
						}
					}

					if (m.addedNodes && m.addedNodes.length) {
						Array.prototype.forEach.call(m.addedNodes, function(node) {
							if (node.nodeType === 1) {
								var el = node;
								if (el.classList && el.classList.contains('sc-ai-panel-wrap')) {
									if (el.classList.contains('on')) applyAiStylesToPanel(el);
								} else if (el.querySelectorAll) {
									var desc = el.querySelectorAll('.sc-ai-panel-wrap.on');
									if (desc && desc.length) {
										Array.prototype.forEach.call(desc, function(d) { applyAiStylesToPanel(d); });
									}
								}
							}
						});
					}
				});
			});

			aiObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'], childList: true });
		}


		//ts 변환
		// const selectedSize: string = (function() {
		// 	if (!btn) return '';
		// 	if (btn.classList.contains('lg')) return 'lg';
		// 	if (btn.classList.contains('xlg')) return 'xlg';
		// 	if (btn.classList.contains('xxlg')) return 'xxlg';
		// 	if (btn.classList.contains('md')) return 'md';
		// 	if (btn.classList.contains('sm')) return 'sm';
		// 	if (btn.classList.contains('reset')) return '';
		// 	return '';
		// })();

		// document.documentElement.setAttribute('data-screen-size', selectedSize);

		// function applyAiStylesToPanel(panel: HTMLElement): void {
		// 	const size = document.documentElement.getAttribute('data-screen-size');
		// 	if (size === 'lg' || size === 'xlg' || size === 'xxlg') {
		// 		panel.style.zoom = '0.9';
		// 		panel.style.bottom = '0';
		// 	} else {
		// 		panel.style.removeProperty('zoom');
		// 		panel.style.removeProperty('bottom');
		// 	}
		// }

		// const aiPanels: NodeListOf<HTMLElement> = document.querySelectorAll('.sc-ai-panel-wrap.on') as NodeListOf<HTMLElement>;
		// if (aiPanels.length > 0) {
		// 	aiPanels.forEach((panel: HTMLElement) => applyAiStylesToPanel(panel));
		// }

		// if (!(window as any).__aiPanelObserverAdded) {
		// 	(window as any).__aiPanelObserverAdded = true;
		// 	const aiObserver = new MutationObserver((mutations: MutationRecord[]) => {
		// 		mutations.forEach((m: MutationRecord) => {
		// 			const target = m.target as HTMLElement | null;
		// 			if (target && target.classList && target.classList.contains('sc-ai-panel-wrap')) {
		// 				if (target.classList.contains('on')) {
		// 					applyAiStylesToPanel(target);
		// 				} else {
		// 					target.style.removeProperty('zoom');
		// 					target.style.removeProperty('bottom');
		// 				}
		// 			}

		// 			if (m.addedNodes && m.addedNodes.length) {
		// 				Array.prototype.forEach.call(m.addedNodes, (node: Node) => {
		// 					if (node.nodeType === 1) {
		// 						const el = node as HTMLElement;
		// 						if (el.classList && el.classList.contains('sc-ai-panel-wrap')) {
		// 							if (el.classList.contains('on')) applyAiStylesToPanel(el);
		// 						} else if ((el as HTMLElement).querySelectorAll) {
		// 							const desc = el.querySelectorAll('.sc-ai-panel-wrap.on');
		// 							if (desc && desc.length) {
		// 								Array.prototype.forEach.call(desc, (d: HTMLElement) => applyAiStylesToPanel(d));
		// 							}
		// 						}
		// 					}
		// 				});
		// 			}
		// 		});
		// 	});

		// 	aiObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'], childList: true });
		// }

	}
});







/* gnb
==========================================================================*/
// gnb 열기
document.addEventListener('click', function(event) {
	if (event.target.matches('#iw_gnb .btn-depth-1')) {
		var li = event.target.closest('li');
		if (li.classList.contains('on')) {
			gnbClose();
			iwWrap.classList.remove('header-view');
			
		} else {
			li.classList.add('on');
			iwWrap.classList.add('header-view');

			if (!document.querySelector('.gnb-dim')) {
				var gnbDim = document.createElement('div');
				gnbDim.classList.add('gnb-dim');
				document.body.appendChild(gnbDim);
			}
		}
		
		Array.from(li.parentNode.children).forEach(function(sibling) {
			if (sibling !== li) {
				sibling.classList.remove('on');
			}
		});


			
	}
	
});

// gnb 닫기
function gnbClose() {
	var depth1Items = document.querySelectorAll('#iw_gnb .depth-1 > li');
	depth1Items.forEach(function(li) {
		li.classList.remove('on');
	});
	
	var gnbDim = document.querySelector('.gnb-dim');
	if (gnbDim) {
		gnbDim.remove();
	}
}

document.addEventListener('keyup', function(event) {
	if (!event.target.closest("#iw_gnb")) {
		gnbClose();
	}
});

document.addEventListener('click', function(event) {
	if (event.target.matches('.gnb-dim')) {
		gnbClose();
	}
});



// header 안의 통합 검색 레이어
function openHeaderTotalSearch(btn) {
	var btnOpen = btn,
		layerId,
		layer;
	
	layerId = btnOpen.getAttribute('aria-controls');
	layer = document.getElementById(layerId);
	
	var layerWrap = layer.querySelector('.total-search-layer-wrap'),
		btnClose = layerWrap.querySelector('.btn-close-total-search'),
		layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])'),
		layerTabFirst = layerTab[0],
		layerTabLast = layerTab[layerTab.length - 1];

	// 모달 열기 핸들러
	function openModalHandler() {
		document.body.classList.add('overflow');

		layer.classList.add('on');
		
		//2025-02-12 인풋으로 포커스 바로 이동
		layerWrap.querySelector('.input').focus();

		iwHeader.style.zIndex = '101';
		
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

		iwHeader.style.zIndex = '100';
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
	// header 통합검색 열기
	if (e.target.closest('.open-total-search') && document.querySelector('#layer_totalSearch') ) {
		e.preventDefault();
		
		if (!e.target.classList.contains('disabled')) {
			openHeaderTotalSearch(e.target);
		}
	}
});

// footer 관련 사이트
var iwFooter = document.querySelector('#iw_footer');
var btn_related = document.querySelectorAll('.btn-open-related');
var all_related = document.querySelectorAll('.related-layer');

function openFooterRelated(btn) {
	var btnOpen = btn,
		layerId,
		layer;
	
	layerId = btnOpen.getAttribute('aria-controls');
	layer = document.getElementById(layerId);
	
	var layerWrap = layer.querySelector('.related-wrap'),
		btnClose = layerWrap.querySelector('.btn-close-related'),
		layerTab = layerWrap.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])'),
		layerTabFirst = layerTab[0],
		layerTabLast = layerTab[layerTab.length - 1];


	//btnOpen.classList.toggle('on');

	// 모달 열기 핸들러
	function openModalHandler() {
		layer.classList.add('on');
		layerWrap.focus();

		document.body.classList.add('mo-overflow');
		
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

		document.body.classList.remove('mo-overflow');
		// 모바일 푸터 '분야별 정책정보' 모달 안닫히는 현상 임시조치 (2025-12-09 운영사업단)
		if(layerId === 'layer_ralated_field'){
			const related = document.getElementById(layerId)
			related.classList.remove('on')
			return
		}
		
		all_related.forEach(function(related){
			related.classList.remove('on');
		});
	}
	

	btnClose.addEventListener('click', function (e) {
		e.preventDefault();
		
		if (!this.classList.contains('disabled')) {
			closeModal();
		}
	});

	/* if( btnOpen.classList.contains('on') ){
		openModalHandler();
	}
	else {
		iwFooterRelatedClose();
	} */

	openModalHandler();
}

document.addEventListener('click', function(e) {
	// 하단 관련 사이트 링크 열기
	if (e.target.closest('.btn-open-related')) {
		e.preventDefault();
		if (!e.target.classList.contains('disabled')) {
			openFooterRelated(e.target);
		}
	}
});

function iwFooterRelatedClose() {
	if(iwFooter){
		/* btn_related.forEach(function(btn){
			btn.classList.remove('on');
		}); */
		all_related.forEach(function(related){
			related.classList.remove('on');
			document.body.classList.remove('mo-overflow');
		});
	}
}




var footerToggle = document.querySelector('#iw_footer .info-footer');
var btnFooterToggle = document.querySelector('#iw_footer .info-footer .info-toggle .btn-footer-toggle');

if (footerToggle && btnFooterToggle) {
	btnFooterToggle.addEventListener('click', function() {
		this.closest('.info-footer').classList.toggle('on');

		var txtElement = btnFooterToggle.querySelector('.txt');
		if (txtElement) {
			txtElement.textContent = footerToggle.classList.contains('on') ? '닫기' : '열기';
		}
	});
}



// ※ 모바일 전체메뉴 개발쪽에서 관리하기 위해 주석 처리
// var moMenuToggleAll = document.querySelectorAll('.mo-iw-gnb .depth-2 .toggle');

// moMenuToggleAll.forEach(function(btn){
// 	btn.addEventListener('click', function() {
// 		if (btn.closest('li').classList.contains('on')) {
// 			btn.closest('li').classList.remove('on');
// 		} else {
// 			btn.closest('li').classList.add('on');
// 		}

// 		var txtElement = btn.querySelector('.sr-only em');
// 		if (txtElement) {
// 			txtElement.textContent = btn.closest('li').classList.contains('on') ? '닫기' : '펼치기';
// 		}

// 		Array.from(btn.closest('li').parentNode.children).forEach(function(sibling) {
// 			if (sibling !== btn.closest('li')) {
// 				if (sibling.classList.contains('on')) {
// 					sibling.querySelector('.sr-only em').textContent = '펼치기'
// 					sibling.classList.remove('on');
// 				}
// 			}
// 		});


// 	});
// });

// ※ 모바일 전체메뉴 개발쪽에서 관리하기 위해 주석 처리
// var moMenuAppToggleAll = document.querySelectorAll('.mo-menu-app-service .depth-2 .toggle');

// moMenuAppToggleAll.forEach(function(btn){
// 	btn.addEventListener('click', function() {
		
// 		if (btn.closest('li').classList.contains('on')) {
// 			btn.closest('li').classList.remove('on');
// 		} else {
// 			btn.closest('li').classList.add('on');
// 		}

// 		var txtElement = btn.querySelector('.sr-only em');
// 		if (txtElement) {
// 			txtElement.textContent = btn.closest('li').classList.contains('on') ? '닫기' : '펼치기';
// 		}

// 		Array.from(btn.closest('li').parentNode.children).forEach(function(sibling) {
// 			if (sibling !== btn.closest('li')) {
// 				if (sibling.classList.contains('on')) {
// 					sibling.querySelector('.sr-only em').textContent = '펼치기'
// 					sibling.classList.remove('on');
// 				}
// 			}
// 		});
// 	});
// });

var moUtilToggleAll = document.querySelectorAll('.mo-menu-util .toggle');

if(moUtilToggleAll) {
	moUtilToggleAll.forEach(function(btn){
		btn.addEventListener('click', function() {
			btn.closest('.div').classList.toggle('on');

			var txtElement = btn.querySelector('.sr-only em');
			if (txtElement) {
				txtElement.textContent = btn.closest('.div').classList.contains('on') ? '닫기' : '펼치기';
			}
		});
	});
}

var btnMoMenuOpenAll = document.querySelectorAll('.btn-open-allmenu');

var mainHeader = document.querySelector('#iw_header.main');

if(btnMoMenuOpenAll) {
	btnMoMenuOpenAll.forEach(function(btn){

		function allMenuFocusHandler() {
			var allMenuLayer = document.querySelector('.mo-allmenu-area .allmenu-layer'),
					allMenuTab = allMenuLayer.querySelectorAll('button, input:not([type="hidden"]), select, iframe, textarea, [href], [tabindex]:not([tabindex="-1"])'),
					allMenuTabFirst = allMenuTab[0],
					allMenuTabLast = allMenuTab[allMenuTab.length - 1];
	
			allMenuLayer.focus();
			if (allMenuTab.length > 0) {
				document.addEventListener('keydown', function (e) {
					if (document.activeElement === allMenuLayer && e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						allMenuTabFirst.focus();
					}
					
					if (document.activeElement === allMenuTabFirst && e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						allMenuTabLast.focus();
					}
					
					if (document.activeElement === allMenuTabLast && !e.shiftKey && e.key === 'Tab') {
						e.preventDefault();
						allMenuTabFirst.focus();
					}
				});
			}
		}

		btn.addEventListener('click', function() {
			document.body.classList.add('overflow');
			document.querySelector('.mo-allmenu-area').classList.add('on');
			document.querySelector('#iw_container').classList.add('mo-menu-opend');
			
			if(mainHeader){
				mainHeader.classList.add('mo-menu-opend');
			}

			document.querySelector('.mo-allmenu-area .allmenu-layer').setAttribute('tabindex','0');
			allMenuFocusHandler()
		});
	});
}

var btnMoMenuClose = document.querySelector('.mo-allmenu-area .btn-close-common');

if(btnMoMenuClose) {
	btnMoMenuClose.addEventListener('click', function() {
		document.body.classList.remove('overflow');
		document.querySelector('.mo-allmenu-area').classList.remove('on');
		document.querySelector('#iw_header').removeAttribute('style');
		document.querySelector('#iw_container').classList.remove('mo-menu-opend');
		
		if(mainHeader){
			mainHeader.classList.remove('mo-menu-opend');
			document.querySelector('.mo-menu .btn-open-allmenu').focus()
		} else {
			document.querySelector('.mo-only-util .btn-open-allmenu').focus()
		}
		
		document.querySelector('.mo-allmenu-area .allmenu-layer').removeAttribute('tabindex');

	});
}


function checkMoAllMenuOpen() {
	var chkWidth = window.innerWidth;
	var isAllMenuOpen = document.querySelector('.mo-allmenu-area.on');

	if (isAllMenuOpen) {
		if (chkWidth >= 1024) {
			document.body.classList.remove('overflow');
		} else {
			document.body.classList.add('overflow');
		}
	}
}
window.addEventListener('resize', checkMoAllMenuOpen);
checkMoAllMenuOpen();


// Top버튼
var adTopBtn = document.querySelector('.iw-btn-top');

function topInit() {
	window.addEventListener('scroll', function() {
		adTopBtn.classList.toggle('show', window.scrollY >= 300)
	});
}

if(adTopBtn) {
	topInit();
}

// lnb 토글. 개발 페이지로 이동