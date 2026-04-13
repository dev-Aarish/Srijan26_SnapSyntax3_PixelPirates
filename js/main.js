// Load GSAP scripts sequentially, then boot
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

async function init() {
    try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js');
        gsap.registerPlugin(ScrollTrigger, CustomEase);
        CustomEase.create('spring', 'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1');
        boot();
    } catch (e) {
        // GSAP failed to load (offline/blocked) — fall back to CSS-only animations
        console.warn('GSAP CDN unavailable, falling back to CSS animations.');
        fallback();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ─── INJECT STYLES ─────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
body.no-scroll { overflow: hidden; }

/* Loader */
#as-loader {
    position: fixed; inset: 0; z-index: 99999;
    background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 28px;
}
.loader-logo {
    font-family: 'Outfit', sans-serif; font-weight: 900;
    font-size: clamp(3rem, 8vw, 6rem);
    color: #fff; letter-spacing: -3px;
    overflow: hidden;
}
.loader-logo-inner {
    display: block;
    transform: translateY(100%);
}
.loader-track {
    width: 260px; height: 3px;
    background: rgba(255,255,255,0.12);
    border-radius: 99px; overflow: hidden;
}
.loader-fill {
    height: 100%; width: 0%;
    background: linear-gradient(90deg, #FFD166, #FF443A);
    border-radius: 99px;
    transition: width 0.08s linear;
}
.loader-status {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.72rem; letter-spacing: 3px;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
}
.loader-pct {
    font-family: 'Outfit', sans-serif; font-weight: 800;
    font-size: 0.8rem; color: rgba(255,255,255,0.2);
    position: absolute; bottom: 28px; right: 28px;
}

/* Scroll progress */
#as-progress {
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #FFD166, #FF443A, #8338EC);
    z-index: 99998; width: 0%;
    pointer-events: none; transform-origin: left;
}

/* Marquee */
.as-marquee-wrap {
    overflow: hidden;
    border-top: 3px solid #000;
    border-bottom: 3px solid #000;
    background: #000; padding: 13px 0;
}
.as-marquee-track {
    display: flex; gap: 48px;
    width: max-content; white-space: nowrap;
    will-change: transform;
}
.as-marquee-item {
    font-family: 'Outfit', sans-serif;
    font-weight: 800; font-size: 0.9rem;
    color: #fff; text-transform: uppercase;
    letter-spacing: 2px;
    display: flex; align-items: center; gap: 14px;
}
.as-marquee-item span { color: #FFD166; }

/* Toast */
#as-toast-wrap {
    position: fixed; bottom: 28px; right: 28px;
    z-index: 99990; display: flex; flex-direction: column; gap: 10px;
    pointer-events: none;
}
.as-toast {
    pointer-events: all;
    background: #fff; border: 2.5px solid #000;
    border-radius: 12px; padding: 13px 18px;
    box-shadow: 4px 4px 0 #000;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.88rem;
    display: flex; align-items: center; gap: 10px;
    min-width: 250px;
    opacity: 0; transform: translateX(50px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}
.as-toast.show { opacity: 1; transform: translateX(0); }
.as-toast .dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.as-toast.success .dot { background: #06D6A0; }
.as-toast.info    .dot { background: #8338EC; }

/* Tooltip */
[data-tip] { position: relative; }
[data-tip]::after {
    content: attr(data-tip);
    position: absolute; bottom: calc(100% + 8px); left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: #000; color: #fff;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.72rem;
    white-space: nowrap; padding: 5px 11px; border-radius: 6px;
    pointer-events: none; opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 9999;
}
[data-tip]:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }

/* Spotlight — no overflow:hidden so bleeding children (LIVE pill, Aura badge) aren't clipped */
.spotlight { position: relative; }
.spotlight::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(500px circle at var(--sx,50%) var(--sy,50%),
        rgba(131,56,236,0.07), transparent 65%);
    opacity: 0; transition: opacity 0.4s;
    pointer-events: none; z-index: 0; border-radius: inherit;
}
.spotlight:hover::before { opacity: 1; }
.spotlight > * { position: relative; z-index: 1; }

/* Segment active underline */
.segment { position: relative; }
.segment::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    height: 3px; width: 0%; background: #000;
    transition: width 0.35s ease;
}
.segment.active::after { width: 100%; }

/* When GSAP is active, override the CSS .fade-in so content is always visible.
   GSAP handles all entrance animations itself. */
.gsap-ready .hero-anim { opacity: 0; }
.gsap-ready .fade-in {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
}
`;
document.head.appendChild(style);

// ─── FALLBACK (no GSAP) ────────────────────────────────────────
function fallback() {
    // Just run the old simple observer-based fade-ins
    const fadeEls = document.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => obs.observe(el));

    // Cursor
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        let mx = -100, my = -100, cx = -100, cy = -100;
        const loop = () => {
            cx += (mx - cx) * 0.15;
            cy += (my - cy) * 0.15;
            cursor.style.transform = `translate(${cx - 10}px,${cy - 10}px)`;
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    }

    // Segments
    document.querySelectorAll('.segment').forEach(seg => {
        seg.addEventListener('click', () => {
            document.querySelectorAll('.segment').forEach(s => s.classList.remove('active'));
            seg.classList.add('active');
        });
    });

    // Navbar
    let lastY = 0;
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastY && window.scrollY > 100) nav.classList.add('hide');
            else nav.classList.remove('hide');
            lastY = window.scrollY;
        }, { passive: true });
    }

    injectMarquee();
    injectToastWrap();
}

// ─── MAIN BOOT ─────────────────────────────────────────────────
function boot() {
    document.body.classList.add('gsap-ready');

    // Detect which page we're on
    const isHomePage = !!document.querySelector('.hero-tilted-pills');

    buildLoader(isHomePage);
    buildScrollProgress();
    setupCursor();
    setupNavbar();
    setupSegmentToggle();
    setupSpotlight();
    setupMagnetic();
    setupTooltips();
    injectMarquee();
    injectToastWrap();
}

// ─── LOADER ────────────────────────────────────────────────────
function buildLoader(hasHeroEntrance) {
    const el = document.createElement('div');
    el.id = 'as-loader';
    el.innerHTML = `
        <div class="loader-logo"><span class="loader-logo-inner">AuraSync</span></div>
        <div class="loader-track"><div class="loader-fill" id="lf"></div></div>
        <div class="loader-status" id="ls">Initializing</div>
        <div class="loader-pct" id="lp">0%</div>
    `;
    document.body.appendChild(el);
    document.body.classList.add('no-scroll');

    const fill   = document.getElementById('lf');
    const status = document.getElementById('ls');
    const pctEl  = document.getElementById('lp');
    const labels = ['Initializing', 'Loading models', 'Calibrating voice', 'Syncing AI', 'Ready'];

    // Animate logo inner up
    gsap.to('.loader-logo-inner', { y: '0%', duration: 0.7, ease: 'expo.out', delay: 0.15 });

    const obj = { v: 0 };
    gsap.to(obj, {
        v: 100, duration: 1.7, ease: 'power2.inOut',
        onUpdate() {
            const v = Math.round(obj.v);
            fill.style.width = v + '%';
            pctEl.textContent = v + '%';
            status.textContent = labels[Math.min(Math.floor(v / 22), labels.length - 1)];
        },
        onComplete() {
            gsap.to('#as-loader', {
                yPercent: -100, duration: 0.8, ease: 'expo.inOut', delay: 0.3,
                onComplete() {
                    el.remove();
                    document.body.classList.remove('no-scroll');
                    if (hasHeroEntrance) {
                        runHeroEntrance();
                    } else {
                        // No hero entrance on this page — go straight to scroll animations
                        setupScrollAnimations();
                    }
                }
            });
        }
    });
}

// ─── HERO ENTRANCE ─────────────────────────────────────────────
function runHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'spring', duration: 1 } });

    tl.from('.tilted-pill', { x: -100, opacity: 0, rotation: -12, stagger: 0.13 }, 0)
      .from('.hero-card',   { x: 120,  opacity: 0, rotation: 3 }, 0.15)
      .from('.floating-pill-tl', { scale: 0, rotation: -35, opacity: 0, ease: 'back.out(2)', duration: 0.6 }, 0.75)
      .from('.small-pill',  { y: 28, opacity: 0, stagger: 0.1, duration: 0.7 }, 0.55)
      .from('.hero-segmented', { y: 36, opacity: 0, duration: 0.7 }, 0.7)
      .from('.hero-lower-middle', { y: 48, opacity: 0, duration: 0.8 }, 0.85)
      .from('.hero-grid-table', { y: 56, opacity: 0, duration: 0.8 }, 1.0)
      .from('.hero-grid-table-4cols .grid-cell', { y: 36, opacity: 0, stagger: 0.09, duration: 0.6 }, 1.15)
      .from('.card-bleeding-badge', { scale: 0, opacity: 0, ease: 'back.out(3)', duration: 0.5 }, 0.95);

    tl.eventCallback('onComplete', setupScrollAnimations);
}

// ─── SCROLL ANIMATIONS (positional micro-nudges only, no opacity) ─────
function setupScrollAnimations() {

    // Word-split title — signature clip-mask reveal (no opacity, just slide-up)
    const titleEl = document.querySelector('.secondary-section .bold-title');
    if (titleEl) {
        const words = titleEl.textContent.trim().split(' ');
        titleEl.innerHTML = words.map(w =>
            `<span style="display:inline-block;overflow:hidden;margin-right:0.28em;vertical-align:bottom">` +
            `<span class="wi" style="display:inline-block">${w}</span></span>`
        ).join('');
        gsap.from('.wi', {
            y: '100%', stagger: 0.06, duration: 0.55, ease: 'expo.out',
            immediateRender: false,
            scrollTrigger: { trigger: '.secondary-section', start: 'top 80%' }
        });
    }

    // Helper — fires once, very early
    const st = (trigger, start = 'top 90%') => ({ trigger, start, toggleActions: 'play none none none' });

    // ── Index page sections (transform-only, no opacity) ──
    if (document.querySelector('.secondary-section .subtitle')) {
        gsap.from('.secondary-section .subtitle', {
            y: 8, duration: 0.35, ease: 'power2.out', immediateRender: false,
            scrollTrigger: st('.secondary-section')
        });
    }
    if (document.querySelector('.secondary-section .large-paragraph-box')) {
        gsap.from('.secondary-section .large-paragraph-box', {
            y: 12, duration: 0.4, ease: 'power2.out', immediateRender: false,
            scrollTrigger: st('.large-paragraph-box')
        });
    }
    if (document.querySelector('.secondary-section .cta-buttons a')) {
        gsap.from('.secondary-section .cta-buttons a', {
            y: 8, stagger: 0.04, duration: 0.35, ease: 'power2.out', immediateRender: false,
            scrollTrigger: st('.cta-buttons')
        });
    }

    // ── Pricing page sections ──
    if (document.querySelector('.pricing-hero-content')) {
        gsap.from('.pricing-hero-left',  { x: -20, duration: 0.45, ease: 'power2.out', immediateRender: false, scrollTrigger: st('.pricing-hero-content') });
        gsap.from('.pricing-hero-right', { x:  20, duration: 0.45, ease: 'power2.out', immediateRender: false, scrollTrigger: st('.pricing-hero-content') });
    }
    if (document.querySelector('.four-tables-grid')) {
        gsap.from('.mini-table', { y: 10, stagger: 0.04, duration: 0.35, ease: 'power2.out', immediateRender: false, scrollTrigger: st('.four-tables-grid') });
    }
    if (document.querySelector('.tiers-header')) {
        gsap.from('.tiers-header', { y: 8, duration: 0.35, ease: 'power2.out', immediateRender: false, scrollTrigger: st('.tiers-header') });
    }
    if (document.querySelector('.pricing-cards-container')) {
        gsap.from('.pricing-card', {
            y: 16, stagger: 0.05, duration: 0.4, ease: 'power2.out', immediateRender: false,
            scrollTrigger: st('.pricing-cards-container')
        });
    }
    if (document.querySelector('.trust-cards')) {
        gsap.from('.trust-cards .grid-cell', { y: 10, stagger: 0.04, duration: 0.35, ease: 'power2.out', immediateRender: false, scrollTrigger: st('.trust-cards') });
    }
    if (document.querySelector('.final-cta-section')) {
        gsap.from('.final-cta-section .cta-box', { y: 10, duration: 0.4, ease: 'power2.out', immediateRender: false, scrollTrigger: st('.final-cta-section') });
    }

    // ── Footer (both pages) ──
    if (document.querySelector('.main-footer')) {
        gsap.from('.footer-left', { x: -12, duration: 0.4, ease: 'power2.out', immediateRender: false, scrollTrigger: st('.main-footer', 'top 94%') });
    }
    if (document.querySelector('.footer-right')) {
        gsap.from('.footer-col', { y: 8, stagger: 0.03, duration: 0.3, ease: 'power2.out', immediateRender: false, scrollTrigger: st('.footer-right', 'top 94%') });
    }

    // Marquee
    const track = document.querySelector('.as-marquee-track');
    if (track) gsap.to(track, { x: '-50%', duration: 20, ease: 'none', repeat: -1 });

    // 3D tilt on cards
    document.querySelectorAll('.grid-cell, .pricing-card').forEach(el => {
        el.style.willChange = 'transform';
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
            const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
            gsap.to(el, { rotateX: -y, rotateY: x, transformPerspective: 700, z: 8, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, z: 0, duration: 0.55, ease: 'spring', overwrite: 'auto' });
        });
    });

    // Refresh ScrollTrigger after all animations are registered
    ScrollTrigger.refresh();
}

// ─── SCROLL PROGRESS ───────────────────────────────────────────
function buildScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'as-progress';
    document.body.appendChild(bar);
    gsap.to('#as-progress', {
        width: '100%', ease: 'none',
        scrollTrigger: { scrub: 0.4, start: 'top top', end: 'bottom bottom' }
    });
}

// ─── CURSOR (smooth lerped, no GSAP conflicts) ─────────────────
function setupCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    // Use CSS will-change for GPU compositing
    cursor.style.willChange = 'transform, width, height, background-color, border-color, opacity';

    let mx = -100, my = -100;   // mouse position (target)
    let cx = -100, cy = -100;   // cursor position (current, lerped)
    const lerpFactor = 0.18;    // smoothing
    let cursorVisible = false;

    const loop = () => {
        cx += (mx - cx) * lerpFactor;
        cy += (my - cy) * lerpFactor;
        cursor.style.transform = `translate(${cx - 10}px, ${cy - 10}px)`;
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        if (!cursorVisible) {
            cursorVisible = true;
            cursor.style.opacity = '1';
        }
    }, { passive: true });

    // Orange filled hover — ONLY on actual buttons and links
    document.querySelectorAll('a, button, .segment, .social-square, .logo-text')
        .forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.remove('hover-interact');
                cursor.classList.add('hover');
            }, { passive: true });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            }, { passive: true });
        });

    // Subtle scale hover — on cards/boxes (no color fill)
    document.querySelectorAll('.tilted-pill, .small-pill, .pricing-card, .grid-cell')
        .forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!cursor.classList.contains('hover')) {
                    cursor.classList.add('hover-interact');
                }
            }, { passive: true });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-interact');
            }, { passive: true });
        });

    // Dark background detection — cursor ring turns white on dark sections
    const darkSections = document.querySelectorAll('.main-footer, .pricing-card.highlighted, #as-loader');
    darkSections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-light');
        }, { passive: true });
        section.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-light');
        }, { passive: true });
    });

    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorVisible = true;
        cursor.style.opacity = '1';
    });
}

// ─── NAVBAR (debounced direction check) ────────────────────────
function setupNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    let navHidden = false;

    ScrollTrigger.create({
        onUpdate(self) {
            const shouldHide = self.direction === 1 && window.scrollY > 100;
            if (shouldHide && !navHidden) {
                navHidden = true;
                gsap.to(nav, { yPercent: -100, duration: 0.35, ease: 'power2.inOut', overwrite: true });
            } else if (!shouldHide && navHidden) {
                navHidden = false;
                gsap.to(nav, { yPercent: 0, duration: 0.35, ease: 'power2.out', overwrite: true });
            }
        }
    });
}

// ─── SEGMENT TOGGLE ────────────────────────────────────────────
function setupSegmentToggle() {
    document.querySelectorAll('.segment').forEach(seg => {
        seg.addEventListener('click', () => {
            document.querySelectorAll('.segment').forEach(s => s.classList.remove('active'));
            seg.classList.add('active');
            gsap.from(seg, { scale: 0.96, duration: 0.3, ease: 'spring' });
        });
    });
}

// ─── SPOTLIGHT CARDS ───────────────────────────────────────────
function setupSpotlight() {
    // Note: .hero-card is excluded because it has bleeding children (LIVE pill, Aura badge)
    // that must remain visible outside the card boundaries
    document.querySelectorAll('.pricing-card, .trust-cards .grid-cell, .mini-table').forEach(el => {
        el.classList.add('spotlight');
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--sx', ((e.clientX - r.left) / r.width  * 100) + '%');
            el.style.setProperty('--sy', ((e.clientY - r.top)  / r.height * 100) + '%');
        });
    });
}

// ─── MAGNETIC BUTTONS ──────────────────────────────────────────
function setupMagnetic() {
    // Exclude .large CTA buttons — the magnetic GSAP x/y transform fights
    // with CSS :hover translate(-2px,-2px), causing the buttons to jump.
    document.querySelectorAll('.btn-primary:not(.large), .btn-secondary:not(.large)').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, {
                x: (e.clientX - (r.left + r.width  / 2)) * 0.3,
                y: (e.clientY - (r.top  + r.height / 2)) * 0.3,
                duration: 0.35, ease: 'power2.out', overwrite: 'auto'
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'spring', overwrite: 'auto' });
        });
    });
}

// ─── TOOLTIPS ──────────────────────────────────────────────────
function setupTooltips() {
    const map = {
        '.btn-ghost':            'Already a member?',
        '.card-bleeding-badge':  'Powered by Aura AI',
        '.logo-text':            'Go to homepage',
    };
    Object.entries(map).forEach(([sel, tip]) => {
        document.querySelectorAll(sel).forEach(el => { el.dataset.tip = tip; });
    });
}

// ─── TOAST ─────────────────────────────────────────────────────
function injectToastWrap() {
    const wrap = document.createElement('div');
    wrap.id = 'as-toast-wrap';
    document.body.appendChild(wrap);

    function toast(msg, type = 'info', delay = 0) {
        setTimeout(() => {
            const t = document.createElement('div');
            t.className = `as-toast ${type}`;
            t.innerHTML = `<div class="dot"></div><span>${msg}</span>`;
            wrap.appendChild(t);
            requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
            setTimeout(() => {
                t.classList.remove('show');
                setTimeout(() => t.remove(), 450);
            }, 4200);
        }, delay);
    }

    setTimeout(() => {
        toast('🎙 Aura is ready to analyze your voice.', 'success', 300);
        toast('✨ Trusted by 12,000+ professionals.', 'info', 2600);
    }, 2400);

    document.querySelectorAll('.btn-primary.large, .full-width').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            toast('🚀 Taking you to onboarding...', 'success');
        });
    });
}

// ─── MARQUEE ───────────────────────────────────────────────────
function injectMarquee() {
    const items = ['Real-time Analysis','AI Voice Modeling','Tone Detection','Pacing Insights','Clarity Score','Vocal Coaching','Emotion Tracking','Aura Sync'];
    const html  = items.map(i => `<div class="as-marquee-item"><span>✦</span>${i}</div>`).join('');
    const wrap  = document.createElement('div');
    wrap.className = 'as-marquee-wrap';
    wrap.innerHTML = `<div class="as-marquee-track">${html}${html}</div>`;
    const sec = document.querySelector('.secondary-section');
    if (sec) sec.parentNode.insertBefore(wrap, sec);

    // CSS fallback animation if GSAP isn't available yet
    const track = wrap.querySelector('.as-marquee-track');
    if (typeof gsap === 'undefined') {
        track.style.animation = 'marqueeScroll 20s linear infinite';
        const ks = document.createElement('style');
        ks.textContent = `@keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }`;
        document.head.appendChild(ks);
    }
}