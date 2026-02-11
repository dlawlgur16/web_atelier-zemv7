/* ═══════════════════════════════════════════
   ATELIER ZEM v7 — Main JavaScript
   Based on GESTE.co interaction patterns
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Page fade-in ──────────────────────── */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    /* ── Hamburger + Mobile Nav ────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.contains('active');
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = isOpen ? '' : 'hidden';

            // Update aria
            hamburger.setAttribute('aria-expanded', (!isOpen).toString());
            hamburger.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', '메뉴 열기');
            });
        });

        // Keyboard: Enter/Space to toggle, Escape to close
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', '메뉴 열기');
            }
        });
    }

    /* ── Header scroll behavior ────────────── */
    const headerWrapper = document.getElementById('headerWrapper');

    if (headerWrapper) {
        let lastScroll = 0;
        const isDark = headerWrapper.classList.contains('--dark');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const isMenuOpen = mobileNav && mobileNav.classList.contains('active');
            if (isMenuOpen) return;

            if (scrollY > 80) {
                headerWrapper.classList.add('scrolled');
            } else {
                headerWrapper.classList.remove('scrolled');
            }

            lastScroll = scrollY;
        }, { passive: true });
    }


    /* ── Scroll Reveal (IntersectionObserver) ─ */
    const revealEls = document.querySelectorAll('.reveal, .stagger-up');

    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px'
        });

        revealEls.forEach(el => revealObserver.observe(el));
    }


    /* ── Goods: Grid / Index view toggle ───── */
    const gridViewBtn = document.getElementById('gridViewBtn');
    const indexViewBtn = document.getElementById('indexViewBtn');
    const productGrid = document.querySelector('.product-list__grid');
    const goodsIndex = document.querySelector('.goods-index');
    const newsletterEl = document.querySelector('.newsletter-form');
    const footerEl = document.querySelector('footer');

    if (gridViewBtn && indexViewBtn && productGrid && goodsIndex) {
        gridViewBtn.addEventListener('click', () => {
            productGrid.style.display = '';
            goodsIndex.classList.remove('active');
            gridViewBtn.classList.add('active');
            indexViewBtn.classList.remove('active');
            if (newsletterEl) newsletterEl.style.display = '';
            if (footerEl) footerEl.style.display = '';
        });

        indexViewBtn.addEventListener('click', () => {
            productGrid.style.display = 'none';
            goodsIndex.classList.add('active');
            indexViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            if (newsletterEl) newsletterEl.style.display = 'none';
            if (footerEl) footerEl.style.display = 'none';
        });
    }


    /* ── Product bar scroll visibility ─────── */
    const productBar = document.querySelector('.product-bar');
    if (productBar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                productBar.classList.add('visible');
            } else {
                productBar.classList.remove('visible');
            }
        }, { passive: true });
    }


    /* ── Image hover preload (product tiles) ── */
    document.querySelectorAll('.product-tile__hover-back').forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preload = new Image();
            preload.src = src;
        }
    });

});
