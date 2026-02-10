// Goods 카드 클릭 → 상세 보기
(function() {
    const goodsGrid = document.getElementById('goodsGrid');
    if (!goodsGrid) return;

    const goodsSection = document.getElementById('goods');
    const goodsCards = goodsGrid.querySelectorAll('.goods-card[data-category]');

    function switchDetail(cat) {
        const activeDetail = document.querySelector('.goods-detail.show');
        if (activeDetail && activeDetail.getAttribute('data-detail') === cat) return;

        if (activeDetail) {
            // Detail → Detail: 그리드 페이드 건너뛰고 바로 전환
            activeDetail.classList.remove('visible');
            setTimeout(() => {
                activeDetail.classList.remove('show');
                const detail = document.querySelector('.goods-detail[data-detail="' + cat + '"]');
                if (!detail) return;
                detail.classList.add('show');
                goodsSection.scrollTop = 0;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        detail.classList.add('visible');
                    });
                });
            }, 300);
        } else {
            openDetail(cat);
        }
    }

    function openDetail(cat) {
        const detail = document.querySelector('.goods-detail[data-detail="' + cat + '"]');
        if (!detail) return;

        // 그리드 페이드아웃
        goodsGrid.classList.add('fading');

        setTimeout(() => {
            goodsGrid.style.display = 'none';
            goodsGrid.classList.remove('fading');

            // 상세뷰 페이드인
            detail.classList.add('show');
            goodsSection.scrollTop = 0;

            // 다음 프레임에서 visible 추가 (트랜지션 트리거)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    detail.classList.add('visible');
                });
            });
        }, 300);
    }

    function closeDetail() {
        const activeDetail = document.querySelector('.goods-detail.show');
        if (!activeDetail) return;

        // 상세뷰 페이드아웃
        activeDetail.classList.remove('visible');

        setTimeout(() => {
            activeDetail.classList.remove('show');

            // 그리드 페이드인
            goodsGrid.style.display = '';
            goodsGrid.classList.add('fading');
            goodsSection.scrollTop = 0;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    goodsGrid.classList.remove('fading');
                });
            });
        }, 350);
    }

    goodsCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('[contenteditable]')) return;
            const cat = card.getAttribute('data-category');
            if (typeof updateSubLinkActive === 'function') updateSubLinkActive(cat);
            openDetail(cat);
        });
    });

    // 뒤로가기 버튼
    document.querySelectorAll('.goods-back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof updateSubLinkActive === 'function') updateSubLinkActive(null);
            closeDetail();
        });
    });

    // 전역 노출 (common.js에서 서브링크 클릭 시 사용)
    window.goodsSwitchDetail = switchDetail;
    window.goodsCloseDetail = closeDetail;

    // URL 파라미터로 카테고리 바로 열기
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat) {
        const detail = document.querySelector('.goods-detail[data-detail="' + cat + '"]');
        if (detail && goodsGrid) {
            goodsGrid.style.display = 'none';
            detail.classList.add('show');
            requestAnimationFrame(() => {
                detail.classList.add('visible');
            });
        }
    }
})();
