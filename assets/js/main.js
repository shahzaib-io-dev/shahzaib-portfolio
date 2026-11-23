// ==========================================================================
// SHAHZAIB DIGITAL — INTERSTELLAR BLACK HOLE 3D ENGINE & GLB LOADER
// Theme: Midnight Sapphire, Platinum & Relativistic Accretion Singularity
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

// 3. CINEMATIC INTERSTELLAR BLACK HOLE (GARGANTUA ACCRETION & GRAVITATIONAL LENSING)
let hasInitializedBlackHole = false;

function initCyberGlobe() {
    if (hasInitializedBlackHole) return;
    const container = document.getElementById('three-canvas-container');
    if (!container || typeof THREE === 'undefined') return;
    hasInitializedBlackHole = true;

    container.innerHTML = '';

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 6.0);

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

    // Master Black Hole Root Group
    const blackHoleGroup = new THREE.Group();
    scene.add(blackHoleGroup);

    // Initial cinematic Interstellar tilt (~18 degrees)
    blackHoleGroup.rotation.x = 0.28;

    // A. Procedural Accretion Plasma Disk Texture Generator
    function createAccretionTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        const cx = 512, cy = 512;

        ctx.clearRect(0, 0, 1024, 1024);

        // Multi-stage radial plasma gradient with Doppler asymmetry
        const maxR = 500;
        const innerR = 175;

        for (let r = maxR; r >= innerR; r -= 2) {
            const norm = (r - innerR) / (maxR - innerR);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);

            let alpha = 0;
            let rCol = 59, gCol = 130, bCol = 246; // Royal Sapphire

            if (norm < 0.15) {
                // White-hot inner boundary (Innermost Stable Circular Orbit)
                const subNorm = norm / 0.15;
                rCol = Math.round(255 - subNorm * 10);
                gCol = Math.round(255 - subNorm * 40);
                bCol = 255;
                alpha = 0.95 - subNorm * 0.15;
            } else if (norm < 0.55) {
                // Blazing Royal Sapphire & Electric Cyan plasma stream
                const subNorm = (norm - 0.15) / 0.4;
                rCol = Math.round(245 - subNorm * 186);
                gCol = Math.round(215 - subNorm * 85);
                bCol = Math.round(255 - subNorm * 9);
                alpha = 0.85 - subNorm * 0.35;
            } else {
                // Outer trailing accretion dust into deep space
                const subNorm = (norm - 0.55) / 0.45;
                rCol = Math.round(59 - subNorm * 40);
                gCol = Math.round(130 - subNorm * 90);
                bCol = Math.round(246 - subNorm * 120);
                alpha = 0.5 * (1 - subNorm);
            }

            ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Add relativistic spiral filaments & turbulence
        for (let a = 0; a < 60; a++) {
            const startAngle = Math.random() * Math.PI * 2;
            const startDist = innerR + Math.random() * 280;
            ctx.beginPath();
            ctx.arc(cx, cy, startDist, startAngle, startAngle + 1.2 + Math.random());
            ctx.strokeStyle = `rgba(226, 232, 240, ${0.15 + Math.random() * 0.25})`;
            ctx.lineWidth = 1.5 + Math.random() * 2;
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
    }

    const accretionTexture = createAccretionTexture();

    // B. Pitch-Black Event Horizon (The Singularity)
    const horizonGeom = new THREE.SphereGeometry(1.24, 64, 64);
    const horizonMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: false
    });
    const horizonMesh = new THREE.Mesh(horizonGeom, horizonMat);
    blackHoleGroup.add(horizonMesh);

    // C. Razor-Thin Photon Sphere Edge (Blinding Plasma Ring)
    const photonGeom = new THREE.RingGeometry(1.25, 1.35, 120);
    const photonMat = new THREE.MeshBasicMaterial({
        color: 0xE2E8F0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.98,
        blending: THREE.AdditiveBlending
    });
    const photonRing = new THREE.Mesh(photonGeom, photonMat);
    blackHoleGroup.add(photonRing);

    // D. Primary Equatorial Accretion Disk (Swirling Plasma Vortex)
    const diskGeom = new THREE.RingGeometry(1.35, 4.3, 128, 40);
    const diskMat = new THREE.MeshBasicMaterial({
        map: accretionTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.96,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const diskMesh = new THREE.Mesh(diskGeom, diskMat);
    diskMesh.rotation.x = Math.PI / 2.22; // ~81 degrees tilt for canonical Interstellar angle
    blackHoleGroup.add(diskMesh);

    // E. Gravitational Lensing Halo (The Famous Upper & Lower Einstein Arcs)
    // General relativity bends the back of the accretion disk over and under the event horizon:
    const topLensingGeom = new THREE.TorusGeometry(1.78, 0.42, 32, 128, Math.PI);
    const lensingMat = new THREE.MeshBasicMaterial({
        color: 0x3B82F6,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const topLensingArc = new THREE.Mesh(topLensingGeom, lensingMat);
    topLensingArc.position.z = -0.06;
    blackHoleGroup.add(topLensingArc);

    const bottomLensingGeom = new THREE.TorusGeometry(1.78, 0.36, 32, 128, Math.PI);
    const bottomLensingArc = new THREE.Mesh(bottomLensingGeom, lensingMat);
    bottomLensingArc.rotation.z = Math.PI;
    bottomLensingArc.position.z = -0.06;
    blackHoleGroup.add(bottomLensingArc);

    // Inner Lensing Flare (Platinum-hot light curvature)
    const innerLensGeom = new THREE.TorusGeometry(1.42, 0.12, 24, 128, Math.PI);
    const innerLensMat = new THREE.MeshBasicMaterial({
        color: 0xE2E8F0,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const innerLensArc = new THREE.Mesh(innerLensGeom, innerLensMat);
    innerLensArc.position.z = -0.05;
    blackHoleGroup.add(innerLensArc);

    const innerLensBottom = new THREE.Mesh(innerLensGeom, innerLensMat);
    innerLensBottom.rotation.z = Math.PI;
    innerLensBottom.position.z = -0.05;
    blackHoleGroup.add(innerLensBottom);

    // F. Relativistic Particle Infall Vortex (1,000 Keplerian Swirling Micro-Photons)
    const particleCount = 1000;
    const posArray = new Float32Array(particleCount * 3);
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
        const r = 1.38 + Math.pow(Math.random(), 1.5) * 3.1;
        const theta = Math.random() * Math.PI * 2;
        const speed = (0.028 / Math.sqrt(r)) * (0.8 + Math.random() * 0.4);
        const yOffset = (Math.random() - 0.5) * 0.12 * (r / 2);

        particleData.push({ r, theta, speed, yOffset });

        // Position on tilted disk plane
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta) * Math.cos(Math.PI / 2.22);
        const y = r * Math.sin(theta) * Math.sin(Math.PI / 2.22) + yOffset;

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;
    }

    const partGeom = new THREE.BufferGeometry();
    partGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const partMat = new THREE.PointsMaterial({
        size: 0.038,
        color: 0xE2E8F0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const particleVortex = new THREE.Points(partGeom, partMat);
    blackHoleGroup.add(particleVortex);

    // G. Ambient Starfield Dust (Cosmic Depth)
    const starCount = 380;
    const starPosArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
        const rad = 3.5 + Math.random() * 3.0;
        const u = Math.random() * Math.PI * 2;
        const v = Math.acos((Math.random() * 2) - 1);
        starPosArray[i] = rad * Math.sin(v) * Math.cos(u);
        starPosArray[i + 1] = rad * Math.sin(v) * Math.sin(u);
        starPosArray[i + 2] = rad * Math.cos(v);
    }
    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPosArray, 3));
    const starMat = new THREE.PointsMaterial({
        size: 0.026,
        color: 0x93C5FD,
        transparent: true,
        opacity: 0.65
    });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    // H. Cinematic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x060B14, 1.5);
    scene.add(ambientLight);

    const sapphireGlowLight = new THREE.PointLight(0x3B82F6, 4.0, 16);
    sapphireGlowLight.position.set(0, 0, 1.5);
    scene.add(sapphireGlowLight);

    const platinumRimLight = new THREE.DirectionalLight(0xE2E8F0, 1.8);
    platinumRimLight.position.set(4, 3, 5);
    scene.add(platinumRimLight);

    // I. Anti-Aura-Loss Clamped 3D Physics & Mouse Drag
    // The user can spin 360° horizontally as fast as they want,
    // while vertical pitch is safely clamped to preserve the glorious Interstellar aura!
    let mouseX = 0, mouseY = 0;
    let targetRotY = 0, targetRotX = 0.28;
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
            dragVelocityY = deltaY * 0.003;

            blackHoleGroup.rotation.y += dragVelocityX;
            // Anti-Aura-Loss Clamping: Never let pitch flip over or flatten!
            blackHoleGroup.rotation.x = Math.max(-0.48, Math.min(0.48, blackHoleGroup.rotation.x + dragVelocityY));

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
            dragVelocityY = deltaY * 0.0035;

            blackHoleGroup.rotation.y += dragVelocityX;
            blackHoleGroup.rotation.x = Math.max(-0.48, Math.min(0.48, blackHoleGroup.rotation.x + dragVelocityY));

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

    // GSAP ScrollTrigger Kinematic Gravitational Warping on Scroll
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(blackHoleGroup.scale, {
            x: 0.65, y: 0.65, z: 0.65,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            }
        });

        gsap.to(blackHoleGroup.position, {
            y: 0.8,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // Main 60–120 FPS Relativistic Render Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (!isHeroVisible) return; // 0% GPU load when browsing projects!

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // 1. Continuous Relativistic Disk Rotation
        diskMesh.rotation.z += 0.005;

        // 2. Photon sphere subtle energy breathing
        const photonPulse = 1 + Math.sin(time * 3.5) * 0.025;
        photonRing.scale.set(photonPulse, photonPulse, photonPulse);

        // 3. Gravitational Lensing Halo shimmering
        topLensingArc.scale.y = 1 + Math.sin(time * 2.2) * 0.03;
        bottomLensingArc.scale.y = 1 + Math.cos(time * 2.2) * 0.03;

        // 4. Keplerian Particle Infall Simulation (v ∝ 1/√r)
        const positions = particleVortex.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const p = particleData[i];
            p.theta += p.speed;

            // Inward gravitational pull
            p.r -= 0.0006;
            if (p.r < 1.34) {
                // Respawn at outer edge when swallowed by event horizon
                p.r = 4.1 + Math.random() * 0.3;
                p.speed = (0.028 / Math.sqrt(p.r)) * (0.8 + Math.random() * 0.4);
            }

            const x = p.r * Math.cos(p.theta);
            const z = p.r * Math.sin(p.theta) * Math.cos(Math.PI / 2.22);
            const y = p.r * Math.sin(p.theta) * Math.sin(Math.PI / 2.22) + p.yOffset;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        particleVortex.geometry.attributes.position.needsUpdate = true;

        // 5. Starfield slow cosmic drift
        stars.rotation.y -= 0.0003;

        // 6. Inertia Damping & Subtle Cursor Parallax
        if (!isDragging) {
            dragVelocityX *= 0.95;
            dragVelocityY *= 0.95;
            blackHoleGroup.rotation.y += dragVelocityX + 0.0015; // Natural slow galactic spin
            blackHoleGroup.rotation.x = Math.max(-0.48, Math.min(0.48, blackHoleGroup.rotation.x + dragVelocityY));

            // Parallax tracking with gentle spring
            const targetX = 0.28 - mouseY * 0.12;
            const targetY = mouseX * 0.15;
            blackHoleGroup.rotation.x += (targetX - blackHoleGroup.rotation.x) * 0.02;
        }

        renderer.render(scene, camera);
    }
    animate();
}

// 4. CLIENT .GLB / .GLTF LOADER HELPER (READY FOR PRODUCT MODELS)
window.loadGLBModel = function (modelUrl, targetGroup, onLoadCallback) {
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.warn('GLTFLoader is not loaded yet.');
        return;
    }
    const loader = new THREE.GLTFLoader();
    loader.load(
        modelUrl,
        function (gltf) {
            const model = gltf.scene;
            // Auto-center and normalize size
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.5 / maxDim;
            model.scale.set(scale, scale, scale);
            model.position.sub(center.multiplyScalar(scale));

            if (targetGroup) {
                targetGroup.add(model);
            }
            if (onLoadCallback) {
                onLoadCallback(model, gltf);
            }
            console.log('GLB Model loaded successfully:', modelUrl);
        },
        undefined,
        function (error) {
            console.error('Error loading GLB model:', error);
        }
    );
};

// 5. COLUMN-WISE PROJECT SHOWCASE CAROUSEL
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

// 6. LENIS VIRTUAL SMOOTH SCROLL (AWWWARDS TIER MOMENTUM)
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

// 7. AUDIO TOGGLE PILL IN NAVIGATION
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

// 8. CARD SPOTLIGHT GRADIENT TRACKING
document.querySelectorAll('.carousel-card, .bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

// 9. SCROLL REVEAL OBSERVER
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

// 10. GUARANTEED SINGLE-PASS BOOTSTRAP
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
