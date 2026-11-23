// ==========================================================================
// SHAHZAIB DIGITAL — GOD-LEVEL 3D KINETIC ARCHITECTURE & AUDIO ENGINE
// Theme: Midnight Sapphire & Platinum
// ==========================================================================

// 1. WEB AUDIO API SYNTHESIZER (ZERO ASSET OVERHEAD)
const SoundFX = (function () {
    let ctx = null;
    let isMuted = true;

    function getContext() {
        if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
        return ctx;
    }

    function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
        if (isMuted) return;
        const c = getContext();
        if (!c) return;
        try {
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, c.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, c.currentTime + duration);

            gain.gain.setValueAtTime(gainVal, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);

            osc.connect(gain);
            gain.connect(c.destination);

            osc.start();
            osc.stop(c.currentTime + duration);
        } catch (e) {}
    }

    return {
        hover: () => playTone(880, 'sine', 0.06, 0.03),
        click: () => playTone(440, 'triangle', 0.12, 0.06),
        launch: () => playTone(660, 'sawtooth', 0.18, 0.05),
        toggle: () => {
            isMuted = !isMuted;
            if (!isMuted) getContext();
            return !isMuted;
        },
        getState: () => !isMuted
    };
})();

// 2. FLUID MAGNETIC CURSOR
(function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');
    if (!cursorDot || !cursorOutline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        
        const ambient = document.getElementById('ambient-glow');
        if (ambient) {
            ambient.style.transform = `translate(${e.clientX / 50}px, ${e.clientY / 50}px)`;
        }
    }, { passive: true });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.18;
        outlineY += (mouseY - outlineY) * 0.18;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll('a, button, .carousel-card, .bento-card, .audio-pill');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const text = el.getAttribute('data-cursor') || 'EXPLORE';
            if (cursorText) cursorText.textContent = text;
            cursorOutline.classList.add('hovering');
            SoundFX.hover();
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovering');
            setTimeout(() => {
                if (!cursorOutline.classList.contains('hovering') && cursorText) {
                    cursorText.textContent = 'EXPLORE';
                }
            }, 180);
        });
        el.addEventListener('click', () => {
            SoundFX.click();
        });
    });
})();

// 3. THE 3D KINETIC QUANTUM CHRONO-CORE (THREE.JS)
let hasInitializedGlobe = false;

function initCyberGlobe() {
    if (hasInitializedGlobe) return;
    const container = document.getElementById('three-canvas-container');
    if (!container || typeof THREE === 'undefined') return;
    hasInitializedGlobe = true;

    container.innerHTML = '';

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'mediump'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Master Engine Group
    const engineGroup = new THREE.Group();
    scene.add(engineGroup);

    // Color definitions
    const COLOR_SAPPHIRE = 0x3B82F6;
    const COLOR_PLATINUM = 0xE2E8F0;
    const COLOR_DEEP_BLUE = 0x1E3A8A;
    const COLOR_CYAN = 0x06B6D4;

    // A. Outer Gimbal Ring (Titanium / Platinum)
    const ring1Geom = new THREE.TorusGeometry(2.35, 0.038, 20, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
        color: COLOR_PLATINUM,
        metalness: 0.92,
        roughness: 0.18,
        emissive: 0x1E293B,
        emissiveIntensity: 0.25
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    engineGroup.add(ring1);

    // B. Middle Orbital Ring (Royal Sapphire)
    const ring2Geom = new THREE.TorusGeometry(1.92, 0.032, 20, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
        color: COLOR_SAPPHIRE,
        metalness: 0.85,
        roughness: 0.25,
        emissive: COLOR_SAPPHIRE,
        emissiveIntensity: 0.45
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    engineGroup.add(ring2);

    // C. Inner Gyroscopic Ring (Electric Cyan Accent)
    const ring3Geom = new THREE.TorusGeometry(1.52, 0.026, 16, 90);
    const ring3Mat = new THREE.MeshStandardMaterial({
        color: COLOR_CYAN,
        metalness: 0.8,
        roughness: 0.3,
        emissive: COLOR_CYAN,
        emissiveIntensity: 0.35
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    engineGroup.add(ring3);

    // D. Central Holographic Crystalline Core
    const coreGeom = new THREE.IcosahedronGeometry(0.95, 1);
    const coreMat = new THREE.MeshStandardMaterial({
        color: COLOR_PLATINUM,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        emissive: COLOR_SAPPHIRE,
        emissiveIntensity: 0.5
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    engineGroup.add(coreMesh);

    // E. Quantum Singularity Core (Inner glowing sphere)
    const innerGeom = new THREE.SphereGeometry(0.55, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
        color: COLOR_SAPPHIRE,
        wireframe: false,
        transparent: true,
        opacity: 0.75
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    engineGroup.add(innerCore);

    // F. Pulsating Plasma Beacons on Rings
    const beaconCount = 6;
    const beacons = [];
    for (let i = 0; i < beaconCount; i++) {
        const bGeom = new THREE.SphereGeometry(0.045, 12, 12);
        const bMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? COLOR_PLATINUM : COLOR_CYAN });
        const bMesh = new THREE.Mesh(bGeom, bMat);
        const angle = (i / beaconCount) * Math.PI * 2;
        bMesh.position.set(Math.cos(angle) * 2.35, Math.sin(angle) * 2.35, 0);
        ring1.add(bMesh);
        beacons.push(bMesh);
    }

    // G. Swirling Singularity Particle Torus (350 micro-photons)
    const particleCount = 350;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const R = 2.4 + Math.random() * 0.8;
        const r = 0.35 + Math.random() * 0.4;
        posArray[i] = (R + r * Math.cos(v)) * Math.cos(u);
        posArray[i + 1] = (R + r * Math.cos(v)) * Math.sin(u);
        posArray[i + 2] = r * Math.sin(v) + (Math.random() - 0.5) * 1.5;
    }
    const partGeom = new THREE.BufferGeometry();
    partGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const partMat = new THREE.PointsMaterial({
        size: 0.035,
        color: COLOR_PLATINUM,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(partGeom, partMat);
    engineGroup.add(particleField);

    // H. Cinematic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x060B14, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(COLOR_PLATINUM, 2.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(COLOR_SAPPHIRE, 2.8);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(COLOR_CYAN, 1.5, 12);
    fillLight.position.set(0, 0, 3);
    scene.add(fillLight);

    // I. Interactive Drag Physics & Mouse Tracking
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let isDragging = false;
    let prevPointerX = 0, prevPointerY = 0;
    let dragVelocityX = 0, dragVelocityY = 0;

    const heroEl = document.getElementById('hero');

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    if (heroEl) {
        heroEl.addEventListener('mousedown', (e) => {
            if (e.target.closest('a, button')) return;
            isDragging = true;
            prevPointerX = e.clientX;
            prevPointerY = e.clientY;
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        heroEl.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - prevPointerX;
            const deltaY = e.clientY - prevPointerY;
            dragVelocityX = deltaX * 0.005;
            dragVelocityY = deltaY * 0.005;
            engineGroup.rotation.y += dragVelocityX;
            engineGroup.rotation.x += dragVelocityY;
            prevPointerX = e.clientX;
            prevPointerY = e.clientY;
        });

        heroEl.addEventListener('touchstart', (e) => {
            if (e.target.closest('a, button')) return;
            if (e.touches.length === 1) {
                isDragging = true;
                prevPointerX = e.touches[0].clientX;
                prevPointerY = e.touches[0].clientY;
            }
        }, { passive: true });

        heroEl.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - prevPointerX;
            const deltaY = e.touches[0].clientY - prevPointerY;
            dragVelocityX = deltaX * 0.006;
            dragVelocityY = deltaY * 0.006;
            engineGroup.rotation.y += dragVelocityX;
            engineGroup.rotation.x += dragVelocityY;
            prevPointerX = e.touches[0].clientX;
            prevPointerY = e.touches[0].clientY;
        }, { passive: true });

        heroEl.addEventListener('touchend', () => { isDragging = false; });
    }

    // Canvas Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // High-Performance Visibility Culling (Zero GPU lag when scrolled past hero)
    let isHeroVisible = true;
    if ('IntersectionObserver' in window && heroEl) {
        const heroObserver = new IntersectionObserver((entries) => {
            isHeroVisible = entries[0].isIntersecting;
        }, { threshold: 0.02 });
        heroObserver.observe(heroEl);
    }

    // GSAP ScrollTrigger Kinematic Explosion on Scroll
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(ring1.scale, {
            x: 1.4, y: 1.4, z: 1.4,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            }
        });

        gsap.to(ring2.rotation, {
            z: Math.PI * 2,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        gsap.to(coreMesh.scale, {
            x: 0.4, y: 0.4, z: 0.4,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // Main 60–120 FPS Render Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (!isHeroVisible) return; // 0% GPU load when browsing projects!

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Asynchronous multi-axial ring rotations
        ring1.rotation.z += 0.0035;
        ring2.rotation.y += 0.0055;
        ring2.rotation.x += 0.0025;
        ring3.rotation.x -= 0.007;
        ring3.rotation.z += 0.004;

        // Core holographic pulse
        coreMesh.rotation.y += 0.008;
        coreMesh.rotation.x += 0.004;
        const pulse = 1 + Math.sin(time * 3) * 0.06;
        innerCore.scale.set(pulse, pulse, pulse);

        // Particle cloud slow drift
        particleField.rotation.z -= 0.0015;

        // Inertia damping & cursor parallax tracking
        if (!isDragging) {
            dragVelocityX *= 0.94;
            dragVelocityY *= 0.94;
            engineGroup.rotation.y += dragVelocityX;
            engineGroup.rotation.x += dragVelocityY;

            targetRotY = mouseX * 0.22;
            targetRotX = -mouseY * 0.22;
            engineGroup.rotation.y += (targetRotY - (engineGroup.rotation.y % (Math.PI * 2))) * 0.025;
            engineGroup.rotation.x += (targetRotX - (engineGroup.rotation.x % (Math.PI * 2))) * 0.025;
        }

        renderer.render(scene, camera);
    }
    animate();
}

// 4. COLUMN-WISE PROJECT SHOWCASE CAROUSEL
let hasInitializedCarousel = false;

function initProjectCarousel() {
    if (hasInitializedCarousel) return;
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('proj-prev');
    const nextBtn = document.getElementById('proj-next');
    const counterEl = document.getElementById('active-num');
    const totalEl = document.getElementById('total-num');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!track) return;
    hasInitializedCarousel = true;

    const cards = track.querySelectorAll('.carousel-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;

    if (totalEl) totalEl.textContent = String(totalCards).padStart(2, '0');

    let currentIndex = 0;

    // Build indicator dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to project ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                SoundFX.click();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function getMaxIndex() {
        const isDesktop = window.innerWidth > 900;
        return isDesktop ? Math.max(0, totalCards - 2) : totalCards - 1;
    }

    function updateCarousel() {
        const isDesktop = window.innerWidth > 900;
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        if (isDesktop) {
            const cardWidth = cards[0].offsetWidth;
            const gap = 32;
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
        } else {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24;
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
        }

        if (counterEl) {
            counterEl.textContent = String(currentIndex + 1).padStart(2, '0');
        }

        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= maxIdx;

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
                SoundFX.click();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < getMaxIndex()) {
                currentIndex++;
                updateCarousel();
                SoundFX.click();
            }
        });
    }

    // Keyboard arrow controls
    window.addEventListener('keydown', (e) => {
        const rect = track.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowRight' && currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
            SoundFX.click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            SoundFX.click();
        }
    });

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 40 && currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
        } else if (touchEndX > touchStartX + 40 && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }, { passive: true });

    window.addEventListener('resize', updateCarousel);
    setTimeout(updateCarousel, 100);
}

// 5. LENIS VIRTUAL SMOOTH SCROLL (AWWWARDS TIER MOMENTUM)
function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}

// 6. AUDIO TOGGLE PILL IN NAVIGATION
function initAudioToggle() {
    const btn = document.getElementById('audio-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const isActive = SoundFX.toggle();
        btn.classList.toggle('active', isActive);
        const textSpan = btn.querySelector('.audio-text');
        if (textSpan) {
            textSpan.textContent = isActive ? 'AUDIO: ON' : 'AUDIO: OFF';
        }
    });
}

// 7. CARD SPOTLIGHT GRADIENT TRACKING
document.querySelectorAll('.carousel-card, .bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

// 8. SCROLL REVEAL OBSERVER
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
}

// 9. GUARANTEED SINGLE-PASS BOOTSTRAP
function bootstrap() {
    initSmoothScroll();
    initCyberGlobe();
    initProjectCarousel();
    initAudioToggle();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
