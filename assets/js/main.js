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
    // Disable completely on touch devices to conserve 100% mobile CPU/GPU
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');
    if (!cursorDot || !cursorOutline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    const ambient = document.getElementById('ambient-glow');

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
        // Hardware-accelerated 3D transforms with zero layout reflow
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        
        if (ambient) {
            ambient.style.transform = `translate3d(${mouseX / 50}px, ${mouseY / 50}px, 0)`;
        }

        outlineX += (mouseX - outlineX) * 0.18;
        outlineY += (mouseY - outlineY) * 0.18;
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

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

// 3. CINEMATIC EARTH HERO — REAL TEXTURES, CLOUDS, ATMOSPHERE
let hasInitializedEarth = false;

function initCyberGlobe() {
    if (hasInitializedEarth) return;
    const container = document.getElementById('three-canvas-container');
    if (!container || typeof THREE === 'undefined') return;
    hasInitializedEarth = true;

    container.innerHTML = '';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0.15, 0.08, 5.25);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
        precision: 'mediump'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    earthGroup.position.set(0.5, 0.04, 0);
    earthGroup.rotation.set(0.08, -0.48, -0.06);
    scene.add(earthGroup);

    const loader = new THREE.TextureLoader();
    const textureCache = {};
    const loadTexture = (path) => {
        if (!textureCache[path]) {
            textureCache[path] = loader.load(path);
            textureCache[path].encoding = THREE.sRGBEncoding;
            textureCache[path].anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
        }
        return textureCache[path];
    };

    const dayTexture = loadTexture('images/earth_daymap.jpg');
    const cloudsTexture = loadTexture('images/earth_clouds.png');
    const specularTexture = loadTexture('images/earth_specular.jpg');

    // A softly lit deep-space backdrop keeps the hero cinematic without another heavy image.
    const starCount = window.innerWidth < 700 ? 520 : 900;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
        const radius = 11 + Math.random() * 9;
        const u = Math.random() * Math.PI * 2;
        const v = Math.acos(Math.random() * 2 - 1);
        starPositions[i * 3] = radius * Math.sin(v) * Math.cos(u);
        starPositions[i * 3 + 1] = radius * Math.sin(v) * Math.sin(u);
        starPositions[i * 3 + 2] = radius * Math.cos(v) - 2;
        starSizes[i] = 0.018 + Math.random() * 0.045;
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    const stars = new THREE.Points(starsGeometry, new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `attribute float size; varying float vAlpha; void main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.0); gl_PointSize=size*(300.0/-mvPosition.z); gl_Position=projectionMatrix*mvPosition; vAlpha=0.45+size*5.0; }`,
        fragmentShader: `varying float vAlpha; void main(){ float d=distance(gl_PointCoord,vec2(0.5)); if(d>0.5) discard; float glow=1.0-smoothstep(0.05,0.5,d); gl_FragColor=vec4(0.62,0.78,1.0,glow*vAlpha); }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }));
    scene.add(stars);

    // Earth surface: real day map, specular ocean response, and a directional sun.
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(1.62, 96, 64),
        new THREE.MeshPhongMaterial({
            map: dayTexture,
            specularMap: specularTexture,
            specular: new THREE.Color(0x244b73),
            shininess: 9,
            color: 0xffffff
        })
    );
    earthGroup.add(earth);

    // Independent cloud shell creates depth and a believable atmospheric movement.
    const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(1.645, 72, 48),
        new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.44,
            color: 0xb8d9ff,
            depthWrite: false,
            blending: THREE.NormalBlending,
            side: THREE.DoubleSide
        })
    );
    earthGroup.add(clouds);

    // Fresnel-style blue rim: the key visual cue that sells “Earth from space”.
    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.72, 72, 48),
        new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(0x3f9dff) },
                viewVector: { value: camera.position }
            },
            vertexShader: `uniform vec3 viewVector; varying float intensity; void main(){ vec3 vNormal=normalize(normalMatrix*normal); vec3 vNormel=normalize(normalMatrix*viewVector); intensity=pow(0.72-dot(vNormal,vNormel),2.4); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
            fragmentShader: `uniform vec3 glowColor; varying float intensity; void main(){ gl_FragColor=vec4(glowColor,intensity*0.72); }`,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        })
    );
    earthGroup.add(atmosphere);

    const ambientLight = new THREE.AmbientLight(0x182946, 0.26);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffe7c2, 1.72);
    sunLight.position.set(-4, 2.4, 5.5);
    scene.add(sunLight);
    const rimLight = new THREE.PointLight(0x2e8dff, 1.15, 10);
    rimLight.position.set(2.7, -0.4, 3.4);
    scene.add(rimLight);

    const heroEl = document.getElementById('hero');
    let isHeroVisible = true;
    let mouseX = 0, mouseY = 0;
    let isDragging = false;
    let prevPointerX = 0, prevPointerY = 0;
    let dragVelocityX = 0, dragVelocityY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    function beginDrag(x, y) {
        isDragging = true;
        prevPointerX = x;
        prevPointerY = y;
    }
    function moveDrag(x, y) {
        if (!isDragging) return;
        dragVelocityX = (x - prevPointerX) * 0.0045;
        dragVelocityY = (y - prevPointerY) * 0.0028;
        earthGroup.rotation.y += dragVelocityX;
        earthGroup.rotation.x = Math.max(-0.36, Math.min(0.36, earthGroup.rotation.x + dragVelocityY));
        prevPointerX = x;
        prevPointerY = y;
    }
    if (heroEl) {
        heroEl.addEventListener('mousedown', (e) => {
            if (!e.target.closest('a, button')) beginDrag(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => { isDragging = false; });
        heroEl.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
        heroEl.addEventListener('touchstart', (e) => {
            if (!e.target.closest('a, button') && e.touches.length === 1) beginDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        heroEl.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        heroEl.addEventListener('touchend', () => { isDragging = false; }, { passive: true });
    }
    if ('IntersectionObserver' in window && heroEl) {
        const heroObserver = new IntersectionObserver((entries) => { isHeroVisible = entries[0].isIntersecting; }, { threshold: 0.02 });
        heroObserver.observe(heroEl);
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(earthGroup.scale, { x: 0.7, y: 0.7, z: 0.7, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
        gsap.to(earthGroup.position, { y: 0.72, x: 0.72, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    // Pause the render loop when the hero is off-screen or the tab is backgrounded.
    let clock = new THREE.Clock();
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && isHeroVisible) clock.getDelta();
    });

    function animate() {
        requestAnimationFrame(animate);
        if (!isHeroVisible || document.hidden) return;
        clock.getDelta();
        const time = clock.getElapsedTime();
        earth.rotation.y += 0.00115;
        clouds.rotation.y += 0.00155;
        stars.rotation.y -= 0.00004;
        atmosphere.material.uniforms.viewVector.value = camera.position;
        atmosphere.material.uniforms.glowColor.value.setHSL(0.57 + Math.sin(time * 0.18) * 0.012, 0.82, 0.64);
        if (!isDragging) {
            dragVelocityX *= 0.94;
            dragVelocityY *= 0.94;
            earthGroup.rotation.y += dragVelocityX;
            earthGroup.rotation.x += dragVelocityY;
            const targetX = 0.08 - mouseY * 0.06;
            const targetY = -0.48 + mouseX * 0.08;
            earthGroup.rotation.x += (targetX - earthGroup.rotation.x) * 0.018;
            earthGroup.rotation.y += (targetY - earthGroup.rotation.y) * 0.018;
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

// 6. LENIS VIRTUAL SMOOTH SCROLL (AWWWARDS TIER MOMENTUM - ZERO JITTER)
function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1
    });

    // Unified Ticker Pipeline: Prevents duplicate RAF calls and micro-stutter
    if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
        }
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
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
