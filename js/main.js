document.addEventListener('DOMContentLoaded', () => {

    // ── LOADING SCREEN ────────────────────────────────────────
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-inner">
            <div class="loader-wordmark">AuraSync</div>
            <div class="loader-bar-track"><div class="loader-bar-fill"></div></div>
            <div class="loader-label">Initializing Aura...</div>
        </div>
    `;
    document.body.appendChild(loader);
    document.body.classList.add('no-scroll');

    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
        #loader {
            position: fixed; inset: 0;
            background: #000;
            z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        #loader.hide {
            opacity: 0;
            pointer-events: none;
        }
        .loader-inner {
            display: flex; flex-direction: column;
            align-items: center; gap: 24px;
        }
        .loader-wordmark {
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: clamp(3rem, 8vw, 6rem);
            color: white;
            letter-spacing: -2px;
            animation: loaderPulse 1s ease-in-out infinite alternate;
        }
        @keyframes loaderPulse {
            from { opacity: 0.4; transform: scale(0.97); }
            to   { opacity: 1;   transform: scale(1); }
        }
        .loader-bar-track {
            width: 260px; height: 4px;
            background: rgba(255,255,255,0.15);
            border-radius: 99px; overflow: hidden;
        }
        .loader-bar-fill {
            height: 100%; width: 0%;
            background: #FFD166;
            border-radius: 99px;
            transition: width 0.05s linear;
        }
        .loader-label {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.85rem;
            color: rgba(255,255,255,0.5);
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        body.no-scroll { overflow: hidden; }
    `;
    document.head.appendChild(loaderStyle);

    // Animate loader bar then dismiss
    let progress = 0;
    const fill = loader.querySelector('.loader-bar-fill');
    const loaderLabel = loader.querySelector('.loader-label');
    const labels = ['Initializing Aura...', 'Loading models...', 'Calibrating voice...', 'Ready.'];
    let labelIndex = 0;

    const loaderInterval = setInterval(() => {
        progress += Math.random() * 18;
        if (progress > 100) progress = 100;
        fill.style.width = progress + '%';

        const newLabel = labels[Math.min(Math.floor(progress / 30), labels.length - 1)];
        if (newLabel !== loaderLabel.textContent) loaderLabel.textContent = newLabel;

        if (progress >= 100) {
            clearInterval(loaderInterval);
            setTimeout(() => {
                loader.classList.add('hide');
                document.body.classList.remove('no-scroll');
                setTimeout(() => loader.remove(), 700);
                triggerHeroEntrance();
            }, 400);
        }
    }, 60);

    // ── HERO ENTRANCE ─────────────────────────────────────────
    function triggerHeroEntrance() {
        const pills = document.querySelectorAll('.tilted-pill');
        const card  = document.querySelector('.hero-card');
        const smallPills = document.querySelectorAll('.small-pill');
        const segments   = document.querySelector('.hero-segmented');
        const lowerMid   = document.querySelector('.hero-lower-middle');
        const grids      = document.querySelectorAll('.hero-grid-table, .hero-grid-table-4cols');

        // Pre-hide
        [...pills, card, ...smallPills, segments, lowerMid, ...grids].forEach(el => {
            if (el) { el.style.opacity = '0'; el.style.transform += ' translateY(40px)'; }
        });

        const reveal = (el, delay, extraTransform = '') => {
            if (!el) return;
            setTimeout(() => {
                el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
                el.style.opacity = '1';
                el.style.transform = extraTransform || 'translateY(0)';
            }, delay);
        };

        pills.forEach((p, i) => reveal(p, 100 + i * 120, 'rotate(-5deg) translateY(0)'));
        reveal(card, 450);
        smallPills.forEach((p, i) => reveal(p, 700 + i * 80));
        reveal(segments, 900);
        reveal(lowerMid, 1100);
        grids.forEach((g, i) => reveal(g, 1300 + i * 150));
    }

    // ── CUSTOM CURSOR ─────────────────────────────────────────
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = -100, mouseY = -100;

    if (cursor) {
        function updateCursor() {
            cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
            requestAnimationFrame(updateCursor);
        }
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
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

    // ── NAVBAR HIDE/SHOW ──────────────────────────────────────
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

    // ── SCROLL ANIMATIONS ─────────────────────────────────────
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
        .anim-ready {
            opacity: 0;
            will-change: opacity, transform;
            transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                        transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        .anim-slide-up   { transform: translateY(60px); }
        .anim-slide-left { transform: translateX(-60px); }
        .anim-slide-right{ transform: translateX(60px); }
        .anim-scale      { transform: scale(0.85); }
        .anim-rotate     { transform: rotate(-6deg) translateY(40px); }

        .anim-ready.in-view {
            opacity: 1 !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(scrollStyle);

    // Assign animations to elements
    const animMap = [
        ['.secondary-section .subtitle',        'anim-slide-up'],
        ['.secondary-section .bold-title',       'anim-slide-up'],
        ['.secondary-section .large-paragraph-box', 'anim-scale'],
        ['.secondary-section .cta-buttons',      'anim-slide-up'],
        ['.tiers-header',                        'anim-slide-up'],
        ['.pricing-card',                        'anim-scale'],
        ['.trust-cards .grid-cell',              'anim-slide-up'],
        ['.final-cta-section .cta-box',          'anim-scale'],
        ['.pricing-hero-left',                   'anim-slide-left'],
        ['.pricing-hero-right',                  'anim-slide-right'],
        ['.mini-table',                          'anim-scale'],
    ];

    animMap.forEach(([selector, animClass]) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('anim-ready', animClass);
            el.style.transitionDelay = `${i * 80}ms`;
        });
    });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.anim-ready').forEach(el => scrollObserver.observe(el));

    // ── FADE-IN (existing sections) ───────────────────────────
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => fadeObserver.observe(el));

    // ── SEGMENT TOGGLE ────────────────────────────────────────
    const segments = document.querySelectorAll('.segment');
    segments.forEach(segment => {
        segment.addEventListener('click', () => {
            segments.forEach(s => s.classList.remove('active'));
            segment.classList.add('active');
        });
    });

    // ── PARALLAX ON TILTED PILLS ──────────────────────────────
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        document.querySelectorAll('.tilted-pill').forEach((pill, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            pill.style.transform = `rotate(-5deg) translateY(${scrollY * 0.015 * dir}px)`;
        });
    }, { passive: true });

    // ── GRID CELL HOVER TILT ──────────────────────────────────
    document.querySelectorAll('.grid-cell, .pricing-card, .trust-cards .grid-cell').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
            el.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(4px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

});