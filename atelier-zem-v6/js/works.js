// Works 무한 캐러셀
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

    const ITEM_W = 220;
    const GAP = 5;
    const STEP = ITEM_W + GAP;
    const SET_W = itemCount * STEP;

    let offset = SET_W;

    function render(animate) {
        if (animate) {
            worksList.classList.add('animating');
        } else {
            worksList.classList.remove('animating');
        }
        worksList.style.transform = 'translateX(' + (-offset) + 'px)';
    }

    function wrap() {
        offset = SET_W + ((offset - SET_W) % SET_W + SET_W) % SET_W;
    }

    render(false);

    worksSection.addEventListener('wheel', (e) => {
        e.preventDefault();
        offset += e.deltaY;
        wrap();
        render(false);
    }, { passive: false });

    // Hover expand + slideshow
    worksList.querySelectorAll('.work-item').forEach(item => {
        let interval = null;
        const slides = item.querySelectorAll('.work-slide');

        item.addEventListener('mouseenter', () => {
            item.classList.add('expanded');
            if (slides.length > 1) {
                let cur = 0;
                interval = setInterval(() => {
                    slides[cur].classList.remove('active');
                    cur = (cur + 1) % slides.length;
                    slides[cur].classList.add('active');
                }, 800);
            }
        });

        item.addEventListener('mouseleave', () => {
            item.classList.remove('expanded');
            clearInterval(interval);
            interval = null;
            slides.forEach(s => s.classList.remove('active'));
            if (slides[0]) slides[0].classList.add('active');
        });
    });
})();
