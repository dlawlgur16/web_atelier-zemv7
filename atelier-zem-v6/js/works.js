// Works 무한 캐러셀 (반응형 + 터치/트랙패드/휠 지원)
(function() {
    const worksList = document.getElementById('worksList');
    const worksSection = document.getElementById('works');
    if (!worksList || !worksSection) return;

    const originalItems = Array.from(worksList.querySelectorAll('.work-item'));
    const itemCount = originalItems.length;

    // Clone items for infinite loop
    originalItems.forEach(item => {
        worksList.appendChild(item.cloneNode(true));
    });
    for (let i = itemCount - 1; i >= 0; i--) {
        worksList.insertBefore(originalItems[i].cloneNode(true), worksList.firstChild);
    }

    // ─── 반응형: CSS computed 크기 기준으로 계산 ───
    // offsetWidth는 display:none 일 때 0 반환 → computedStyle 사용
    function getMetrics() {
        const firstItem = worksList.querySelector('.work-item');
        let itemW = 220;
        if (firstItem) {
            const w = firstItem.offsetWidth || parseFloat(getComputedStyle(firstItem).width);
            if (w > 0) itemW = w;
        }
        const gap = parseFloat(getComputedStyle(worksList).gap) || 5;
        const step = itemW + gap;
        const setW = itemCount * step;
        return { itemW, gap, step, setW };
    }

    let metrics = getMetrics();
    let offset = metrics.setW;

    function render(animate) {
        if (animate) {
            worksList.classList.add('animating');
        } else {
            worksList.classList.remove('animating');
        }
        worksList.style.transform = 'translateX(' + (-offset) + 'px)';
    }

    function wrap() {
        const { setW } = metrics;
        offset = setW + ((offset - setW) % setW + setW) % setW;
    }

    render(false);

    // 리사이즈 시 재계산
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const oldSetW = metrics.setW;
            metrics = getMetrics();
            // 현재 비율 유지하며 offset 보정
            offset = (offset / oldSetW) * metrics.setW;
            wrap();
            render(false);
        }, 150);
    });

    // ─── 1) 마우스 휠 + 트랙패드 ───
    worksSection.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        offset += delta;
        wrap();
        render(false);
    }, { passive: false });

    // ─── 2) 터치 스와이프 (모바일 + 태블릿) ───
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartOffset = 0;
    let isSwiping = false;
    let lastTouchX = 0;
    let lastTouchTime = 0;
    let velocity = 0;
    let momentumId = null;

    worksSection.addEventListener('touchstart', (e) => {
        cancelMomentum();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartOffset = offset;
        isSwiping = false;
        lastTouchX = touch.clientX;
        lastTouchTime = Date.now();
        velocity = 0;
    }, { passive: true });

    worksSection.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const dx = touchStartX - touch.clientX;
        const dy = touchStartY - touch.clientY;

        if (!isSwiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
            isSwiping = true;
        }

        if (isSwiping) {
            e.preventDefault();
            offset = touchStartOffset + dx;
            wrap();
            render(false);

            const now = Date.now();
            const dt = now - lastTouchTime;
            if (dt > 0) {
                velocity = (lastTouchX - touch.clientX) / dt;
            }
            lastTouchX = touch.clientX;
            lastTouchTime = now;
        }
    }, { passive: false });

    worksSection.addEventListener('touchend', () => {
        if (isSwiping && Math.abs(velocity) > 0.2) {
            startMomentum();
        }
        isSwiping = false;
    }, { passive: true });

    // ─── 3) 모멘텀 (관성 스크롤) ───
    function startMomentum() {
        const friction = 0.95;
        let v = velocity * 15;

        function tick() {
            v *= friction;
            if (Math.abs(v) < 0.5) {
                momentumId = null;
                return;
            }
            offset += v;
            wrap();
            render(false);
            momentumId = requestAnimationFrame(tick);
        }
        momentumId = requestAnimationFrame(tick);
    }

    function cancelMomentum() {
        if (momentumId) {
            cancelAnimationFrame(momentumId);
            momentumId = null;
        }
    }

    // ─── 4) 마우스 드래그 ───
    let mouseDown = false;
    let mouseStartX = 0;
    let mouseStartOffset = 0;

    worksSection.addEventListener('mousedown', (e) => {
        if (e.target.closest('.work-item')) return;
        mouseDown = true;
        mouseStartX = e.clientX;
        mouseStartOffset = offset;
        worksSection.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;
        const dx = mouseStartX - e.clientX;
        offset = mouseStartOffset + dx;
        wrap();
        render(false);
    });

    window.addEventListener('mouseup', () => {
        mouseDown = false;
        worksSection.style.cursor = '';
    });

    // ─── 5) Hover expand + slideshow (데스크탑) + Tap expand (모바일) ───
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    worksList.querySelectorAll('.work-item').forEach(item => {
        let interval = null;
        const slides = item.querySelectorAll('.work-slide');

        function startSlideshow() {
            if (slides.length > 1) {
                let cur = 0;
                interval = setInterval(() => {
                    slides[cur].classList.remove('active');
                    cur = (cur + 1) % slides.length;
                    slides[cur].classList.add('active');
                }, 800);
            }
        }

        function stopSlideshow() {
            clearInterval(interval);
            interval = null;
            slides.forEach(s => s.classList.remove('active'));
            if (slides[0]) slides[0].classList.add('active');
        }

        if (isTouch) {
            // 모바일: 탭으로 토글 (스와이프 중이면 무시)
            item.addEventListener('click', (e) => {
                if (isSwiping) return;
                const wasExpanded = item.classList.contains('expanded');
                // 다른 확대된 아이템 닫기
                worksList.querySelectorAll('.work-item.expanded').forEach(el => {
                    el.classList.remove('expanded');
                });
                stopSlideshow();

                if (!wasExpanded) {
                    item.classList.add('expanded');
                    startSlideshow();
                }
            });
        } else {
            // 데스크탑: hover로 확대
            item.addEventListener('mouseenter', () => {
                item.classList.add('expanded');
                startSlideshow();
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('expanded');
                stopSlideshow();
            });
        }
    });
})();
