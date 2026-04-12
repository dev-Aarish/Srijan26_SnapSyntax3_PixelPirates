document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .segment, .social-square, .logo-text, .tilted-pill, .small-pill');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 2. Navbar Hide/Show on Scroll
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                // Scrolling down
                navbar.classList.add('hide');
            } else {
                // Scrolling up
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
                // Optional: stop observing once faded in
                // fadeObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 4. Hero Segmented Toggle Behavior (Basic Interaction)
    const segments = document.querySelectorAll('.segment');
    segments.forEach(segment => {
        segment.addEventListener('click', () => {
            // Remove active class from all
            segments.forEach(s => s.classList.remove('active'));
            // Add to clicked
            segment.classList.add('active');
        });
    });
});
