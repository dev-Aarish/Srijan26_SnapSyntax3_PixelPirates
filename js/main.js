document.addEventListener('DOMContentLoaded', () => {

    // 1. Custom Cursor — zero delay, always visible
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = -100, mouseY = -100;

    if (cursor) {
        function updateCursor() {
            cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
            requestAnimationFrame(updateCursor);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        requestAnimationFrame(updateCursor);

        const interactiveElements = document.querySelectorAll(
            'a, button, .segment, .social-square, .logo-text, .tilted-pill, .small-pill'
        );
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    }

    // 2. Navbar Hide/Show on Scroll
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                navbar.classList.add('hide');
            } else {
                navbar.classList.remove('hide');
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    // 3. Fade-in Animation Observer
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 4. Hero Segmented Toggle Behavior
    const segments = document.querySelectorAll('.segment');
    segments.forEach(segment => {
        segment.addEventListener('click', () => {
            segments.forEach(s => s.classList.remove('active'));
            segment.classList.add('active');
        });
    });
});