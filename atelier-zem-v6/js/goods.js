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

        // 히스토리 기록
        if (!isPopState) {
            history.pushState({ section: 'goods', category: cat }, '', '#goods/' + cat);
        }

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

    // ── 제품 상세 뷰 (에디토리얼) ──
    const productDetailView = document.getElementById('productDetailView');
    const productDetailBack = document.getElementById('productDetailBack');

    // 감성 스토리 텍스트 생성 (카테고리 + 제품명 기반)
    const storyTemplates = {
        curation: '아뜰리에젬이 선별한 이번 시즌의 특별한 아이템. 일상 속 작은 사치가 되어줄 오브제를 소개합니다. 하나하나 직접 경험하고 엄선한 제품만을 담았습니다.',
        writing: '손끝에서 시작되는 브랜드의 첫인상. 매일 사용하는 필기구와 데스크 아이템에 당신만의 아이덴티티를 새겨넣습니다. 정갈한 서재의 풍경을 완성하는 오브제.',
        bags: '담는 것에도 품격이 있습니다. 브랜드의 가치를 전하는 첫 번째 접점, 패키지와 캐리 아이템으로 특별한 경험을 선사합니다.',
        digital: '기술과 감성의 교차점. 차가운 디지털 디바이스에 따뜻한 브랜드 터치를 더합니다. 실용성과 디자인, 두 가지를 모두 잡은 테크 오브제.',
        home: '공간을 채우는 브랜드의 온도. 주방과 식탁 위, 일상의 모든 순간에 스며드는 프리미엄 라이프스타일 아이템입니다.',
        daily: '매일 곁에 두는 것들이 삶의 질을 결정합니다. 가장 기본적인 것에 가장 세심한 브랜딩을. 일상을 조용히 바꾸는 에센셜 아이템.'
    };

    function openProductDetail(card) {
        if (!productDetailView) return;

        // 카드에서 데이터 추출
        var img = card.querySelector('.product-card-img img');
        var name = card.querySelector('.product-card-name');
        var desc = card.querySelector('.product-card-bottom .bottom-col:first-child p:not(.bottom-title)');
        var features = card.querySelector('.product-card-bottom .bottom-col:last-child p:not(.bottom-title)');

        // 카테고리 찾기 (부모 goods-detail의 data-detail 속성)
        var detailParent = card.closest('.goods-detail');
        var category = detailParent ? detailParent.getAttribute('data-detail') : '';
        var categoryTitle = detailParent ? detailParent.querySelector('.goods-detail-title') : null;

        // 상세 뷰에 데이터 채우기
        document.getElementById('pdImg').src = img ? img.src : '';
        document.getElementById('pdImg').alt = name ? name.textContent : '';
        document.getElementById('pdName').textContent = name ? name.textContent : '';
        document.getElementById('pdCategory').textContent = categoryTitle ? categoryTitle.textContent : category;
        document.getElementById('pdStory').textContent = storyTemplates[category] || '아뜰리에젬이 정성을 담아 제작하는 프리미엄 굿즈입니다.';
        document.getElementById('pdDesc').textContent = desc ? desc.textContent : '';
        document.getElementById('pdFeatures').textContent = features ? features.textContent : '';

        // 브레드크럼 채우기
        var catName = categoryTitle ? categoryTitle.textContent : category;
        var prodName = name ? name.textContent : '';
        document.getElementById('pdCrumbCategoryText').textContent = catName;
        document.getElementById('pdCrumbProductText').textContent = prodName;

        // 브레드크럼: 카테고리 클릭 → 제품 상세 닫고 카테고리 목록으로
        document.getElementById('pdCrumbCategory').onclick = function(e) {
            e.preventDefault();
            closeProductDetail();
        };

        // 문의 버튼 → switchSection이 알아서 페이드아웃 처리
        document.getElementById('pdInquiryBtn').onclick = function(e) {
            e.preventDefault();
            if (typeof switchSection === 'function') switchSection('inquiry');
        };

        // 히스토리 기록
        if (!isPopState) {
            history.pushState({ section: 'goods', category: category, product: prodName }, '', '#goods/' + category + '/' + encodeURIComponent(prodName));
        }

        // 보여주기 + 부모 스크롤 잠금
        goodsSection.scrollTop = 0;
        goodsSection.style.overflow = 'hidden';
        productDetailView.classList.add('show');

        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                productDetailView.classList.add('visible');
            });
        });
    }

    function closeProductDetail() {
        if (!productDetailView) return;

        productDetailView.classList.remove('visible');

        setTimeout(function() {
            productDetailView.classList.remove('show');
            goodsSection.style.overflow = '';
            goodsSection.scrollTop = 0;
        }, 400);
    }

    // product-card 클릭 이벤트 (이벤트 위임)
    goodsSection.addEventListener('click', function(e) {
        var card = e.target.closest('.product-card');
        if (!card) return;
        if (e.target.closest('[contenteditable]')) return;

        // product-detail-view 안의 클릭은 무시
        if (e.target.closest('.product-detail-view')) return;

        openProductDetail(card);
    });

    // 전역 노출 (common.js에서 서브링크 클릭 시 사용)
    window.goodsSwitchDetail = switchDetail;
    window.goodsCloseDetail = closeDetail;
    window.goodsCloseProductDetail = closeProductDetail;

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
