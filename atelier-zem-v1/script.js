// Page transition
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Handle page exit animation
document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Skip for hash links, external links, or javascript
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('javascript')) {
            return;
        }

        e.preventDefault();
        document.body.classList.add('page-exit');

        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
});

// Handle browser back/forward
window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        document.body.classList.remove('page-exit');
        document.body.classList.add('loaded');
    }
});

// Mobile menu toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');

    if (navLinks && menuToggle) {
        const isActive = navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.querySelector('.menu-toggle');

        if (navLinks && menuToggle) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.querySelector('.menu-toggle');

        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Close menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.querySelector('.menu-toggle');

        if (navLinks && menuToggle) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
