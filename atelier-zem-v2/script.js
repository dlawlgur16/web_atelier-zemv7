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

// Navigation scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

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

// Fade in animation on scroll
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// Form submit handler
function handleSubmit(e) {
    e.preventDefault();
    alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    e.target.reset();
}
