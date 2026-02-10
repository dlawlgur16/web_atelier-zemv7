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

    // goods 떠날 때 상세뷰 닫기
    if (currentSection === 'goods' && window.goodsCloseDetail) {
        window.goodsCloseDetail();
        updateSubLinkActive(null);
    }

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

// 햄버거 메뉴
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
    });
});

// 사이드바 로고 클릭
document.querySelectorAll('[data-section="home"]').forEach(el => {
    if (el.closest('.sidebar-logo')) {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection('home');
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

        if (currentSection === 'goods' && window.goodsSwitchDetail) {
            window.goodsSwitchDetail(cat);
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
    });
});

// Inquiry 폼
const inquiryForm = document.querySelector('.inquiry-form');
if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    });
}
