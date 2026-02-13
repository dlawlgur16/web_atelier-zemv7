// 현재 활성 섹션
let currentSection = 'home';
let isSwitching = false;

// 섹션 전환
function switchSection(targetId) {
    if (targetId === currentSection || isSwitching) return;
    isSwitching = true;

    const current = document.getElementById(currentSection);
    const target = document.getElementById(targetId);
    if (!current || !target) { isSwitching = false; return; }

    // goods 떠날 때 — 상태 그대로 섹션 전환, 전환 후 정리
    if (currentSection === 'goods') {
        updateSubLinkActive(null);
        doSectionSwitch(current, target, targetId);

        // 섹션이 완전히 사라진 후 내부 정리 (section-exit 0.25s + 여유)
        setTimeout(function() {
            var pdv = document.getElementById('productDetailView');
            if (pdv) pdv.classList.remove('visible', 'show');
            document.querySelectorAll('.goods-detail.show').forEach(function(d) {
                d.classList.remove('visible', 'show');
            });
            var gg = document.getElementById('goodsGrid');
            if (gg) gg.style.display = '';
            // 스크롤 잠금 해제
            var gs = document.getElementById('goods');
            if (gs) { gs.style.overflow = ''; gs.scrollTop = 0; }
        }, 600);
        return;
    }

    doSectionSwitch(current, target, targetId);
}

function doSectionSwitch(current, target, targetId) {
    // active 상태 업데이트 (사이드바 반응)
    updateActiveState(targetId);

    // 현재 섹션 페이드아웃
    current.classList.add('section-exit');
    current.addEventListener('animationend', function handler() {
        current.removeEventListener('animationend', handler);
        current.classList.remove('active', 'section-exit');

        // 새 섹션 페이드인
        target.classList.add('active', 'section-enter');
        target.addEventListener('animationend', function handler2() {
            target.removeEventListener('animationend', handler2);
            target.classList.remove('section-enter');
        });

        currentSection = targetId;
        isSwitching = false;
    });
}

// active 상태 업데이트
function updateActiveState(section) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });

    // 서브네비 토글
    let indicatorHandled = false;

    document.querySelectorAll('.sub-nav').forEach(sub => {
        if (section === 'goods') {
            sub.classList.remove('closing');
            sub.classList.add('show');
            setTimeout(updateNavIndicator, 450);
        } else if (sub.classList.contains('show')) {
            sub.classList.add('closing');
            updateSubLinkActive(null);
            indicatorHandled = true;

            // 서브네비 닫기 + 바 이동 동시 진행
            animateIndicatorWithClose(sub);

            setTimeout(() => {
                sub.classList.remove('show', 'closing');
                navIndicator.style.transition = '';
            }, 280);
        }
    });

    if (!indicatorHandled) updateNavIndicator();
}

// 서브링크 active 업데이트
function updateSubLinkActive(cat) {
    document.querySelectorAll('.sub-link').forEach(link => {
        link.classList.remove('active');
        if (cat && link.dataset.category === cat) {
            link.classList.add('active');
        }
    });
}

// 슬라이딩 바 인디케이터
const sidebarNav = document.querySelector('.sidebar-nav');
let navIndicator = null;
let indicatorReady = false;

if (sidebarNav) {
    navIndicator = document.createElement('div');
    navIndicator.className = 'nav-indicator';
    sidebarNav.appendChild(navIndicator);
}

function updateNavIndicator() {
    if (!navIndicator || !sidebarNav) return;
    const activeLink = sidebarNav.querySelector(':scope > li > a.active');
    if (activeLink) {
        const navRect = sidebarNav.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const top = linkRect.top - navRect.top + (linkRect.height - 16) / 2;

        if (!indicatorReady) {
            navIndicator.style.transition = 'none';
            navIndicator.style.transform = 'translateY(' + top + 'px)';
            navIndicator.classList.add('visible');
            navIndicator.offsetHeight;
            navIndicator.style.transition = '';
            indicatorReady = true;
        } else {
            navIndicator.style.transform = 'translateY(' + top + 'px)';
            navIndicator.classList.add('visible');
        }
    }
}

// 서브네비 닫기와 동시에 바 이동
function animateIndicatorWithClose(sub) {
    if (!navIndicator || !sidebarNav) return;
    const activeLink = sidebarNav.querySelector(':scope > li > a.active');
    if (!activeLink) return;

    const navRect = sidebarNav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const linkTop = linkRect.top - navRect.top + (linkRect.height - 16) / 2;

    // 서브네비 접힌 후의 최종 위치 계산
    const goodsLi = sub.parentElement;
    const activeLi = activeLink.parentElement;
    const lis = Array.from(sidebarNav.children);
    let targetTop = linkTop;

    if (lis.indexOf(activeLi) > lis.indexOf(goodsLi)) {
        const shift = sub.offsetHeight + parseFloat(getComputedStyle(sub).marginTop || 0);
        targetTop = linkTop - shift;
    }

    // 현재 바 위치에서 최종 위치로 서브네비 닫기와 같은 속도로 이동
    navIndicator.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
    navIndicator.style.transform = 'translateY(' + targetTop + 'px)';
}

// 초기 active 설정
updateActiveState('home');

// ============================================
// 사이드바 토글 (데스크톱)
// ============================================
const sidebarToggle = document.getElementById('sidebarToggle');
const topBar = document.getElementById('topBar');
const sidebarEl = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
let sidebarOpen = false;

function toggleSidebar(open) {
    sidebarOpen = (open !== undefined) ? open : !sidebarOpen;
    if (sidebarOpen) {
        sidebarEl.classList.add('open');
        mainContent.classList.add('sidebar-open');
        sidebarToggle.classList.add('active');
    } else {
        sidebarEl.classList.remove('open');
        mainContent.classList.remove('sidebar-open');
        sidebarToggle.classList.remove('active');
    }
    updateTopBarColor();
}

// 상단바 색상 — 홈 섹션이고 사이드바 닫혀있으면 흰색
// targetSection 파라미터로 전환 '예정' 섹션을 전달 가능
function updateTopBarColor(targetSection) {
    var section = targetSection || currentSection;
    if (section === 'home' && !sidebarOpen) {
        topBar.classList.add('on-hero');
    } else {
        topBar.classList.remove('on-hero');
    }
}

sidebarToggle.addEventListener('click', () => {
    toggleSidebar();
});

// 초기 상태
updateTopBarColor();

// 햄버거 메뉴 (모바일)
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

// nav-link 클릭
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');

        // 이미 goods에서 Goods 클릭 → 그리드로 복귀
        if (section === 'goods' && currentSection === 'goods' && window.goodsCloseDetail) {
            window.goodsCloseDetail();
            updateSubLinkActive(null);
            return;
        }

        switchSection(section);

        // Home으로 갈 때만 사이드바 자동 닫기, 나머지는 열린 상태 유지
        if (section === 'home') {
            toggleSidebar(false);
        }
        updateTopBarColor(section);
    });
});

// 상단 로고 클릭 → Home으로
document.querySelectorAll('[data-section="home"]').forEach(el => {
    if (el.closest('.top-logo')) {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection('home');
            toggleSidebar(false);
        });
    }
});

// 서브링크 (Goods 카테고리)
document.querySelectorAll('.sub-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.category;
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');

        updateSubLinkActive(cat);

        if (currentSection === 'goods') {
            // 제품 상세 뷰가 열려있으면 페이드아웃 후 직접 전환 (중간 단계 없이)
            var pdv = document.getElementById('productDetailView');
            if (pdv && pdv.classList.contains('show')) {
                pdv.classList.remove('visible');
                setTimeout(function() {
                    pdv.classList.remove('show');
                    // 스크롤 잠금 해제
                    document.getElementById('goods').style.overflow = '';
                    // 현재 열린 카테고리 즉시 제거 (중간 노출 방지)
                    document.querySelectorAll('.goods-detail.show').forEach(function(d) {
                        d.classList.remove('visible', 'show');
                    });
                    // 그리드는 숨긴 채로, 새 카테고리 직접 열기
                    var gg = document.getElementById('goodsGrid');
                    if (gg) gg.style.display = 'none';
                    var targetDetail = document.querySelector('.goods-detail[data-detail="' + cat + '"]');
                    if (targetDetail) {
                        targetDetail.classList.add('show');
                        document.getElementById('goods').scrollTop = 0;
                        requestAnimationFrame(function() {
                            requestAnimationFrame(function() {
                                targetDetail.classList.add('visible');
                            });
                        });
                    }
                }, 500);
                return;
            }
            if (window.goodsSwitchDetail) window.goodsSwitchDetail(cat);
        } else {
            // goods 섹션으로 전환 후 카테고리 열기
            switchSection('goods');
            const waitForSwitch = setInterval(() => {
                if (currentSection === 'goods' && !isSwitching) {
                    clearInterval(waitForSwitch);
                    if (window.goodsSwitchDetail) window.goodsSwitchDetail(cat);
                }
            }, 50);
        }

        // Goods는 Home이 아니므로 사이드바 유지
        updateTopBarColor('goods');
    });
});

// Inquiry 폼 — inquiry.js에서 별도 처리

// ============================================
// Hero 슬라이드쇼
// ============================================
(function () {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (slides.length < 2) return;

    let current = 0;
    let interval = null;
    const DELAY = 6000; // 6초 간격

    function goToSlide(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = index;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function nextSlide() {
        goToSlide((current + 1) % slides.length);
    }

    function startAuto() {
        stopAuto();
        interval = setInterval(nextSlide, DELAY);
    }

    function stopAuto() {
        if (interval) clearInterval(interval);
    }

    // 인디케이터 클릭
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.slide);
            if (idx !== current) {
                goToSlide(idx);
                startAuto(); // 클릭 후 타이머 리셋
            }
        });
    });

    // CTA 버튼 클릭 → Goods로 이동
    const ctaBtn = document.querySelector('.hero-cta');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection('goods');
            toggleSidebar(true);
            updateTopBarColor('goods');
        });
    }

    // 시작
    startAuto();
})();
