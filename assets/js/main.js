// ==========================================================
// SHAHZAIB DIGITAL — FLAGSHIP CONTROLLER & 3D CYBERNETIC WEB
// ==========================================================

// 1. FLUID MAGNETIC CURSOR
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
            ambient.style.transform = `translate(${e.clientX / 45}px, ${e.clientY / 45}px)`;
        }
    }, { passive: true });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.16;
        outlineY += (mouseY - outlineY) * 0.16;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll('a, button, .carousel-card, .service-card, .interactive-item, .carousel-nav-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const text = el.getAttribute('data-cursor') || 'VIEW';
            if (cursorText) cursorText.textContent = text;
            cursorOutline.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovering');
            setTimeout(() => {
                if (!cursorOutline.classList.contains('hovering') && cursorText) {
                    cursorText.textContent = 'VIEW';
                }
            }, 180);
        });
    });
})();

// 2. PHOTOREALISTIC 3D EARTH FROM SPACE & GLOBAL LIVE NETWORK
let hasInitializedGlobe = false;

function initCyberGlobe() {
    if (hasInitializedGlobe) return;
    const container = document.getElementById('three-canvas-container');
    if (!container || typeof THREE === 'undefined') return;
    hasInitializedGlobe = true;

    container.innerHTML = '';

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

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

    // Master Group with Earth's 23.4° Axial Tilt
    const globeRoot = new THREE.Group();
    globeRoot.rotation.z = 0.409; // 23.44 degrees tilt
    scene.add(globeRoot);

    const GLOBE_RADIUS = 2.15;

    // Texture Loader with cache busting & crossOrigin
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    const earthMap = textureLoader.load('images/earth_daymap.jpg', () => { renderer.render(scene, camera); });
    const specularMap = textureLoader.load('images/earth_specular.jpg', () => { renderer.render(scene, camera); });
    const cloudMap = textureLoader.load('images/earth_clouds.png', () => { renderer.render(scene, camera); });

    // 1. Realistic Photorealistic Earth Sphere
    const earthGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
        map: earthMap,
        roughness: 0.65,
        metalness: 0.15,
        roughnessMap: specularMap
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    globeRoot.add(earthMesh);

    // 2. Volumetric Cloud Layer (drifts over Earth surface)
    const cloudsGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.016, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeom, cloudsMat);
    globeRoot.add(cloudsMesh);

    // 3. Cyan-Blue Atmospheric Fresnel Glow (Limb Aura seen in NASA space photos)
    const atmoGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.055, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * vec4(vPosition, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vec3 viewDir = normalize(-vPosition);
                float dotNV = dot(vNormal, viewDir);
                float rim = 1.0 - max(0.0, dotNV);
                float intensity = pow(max(0.0, rim), 2.5);
                vec3 glowColor = vec3(0.08, 0.78, 1.0); // Vibrant NASA atmospheric cyan-blue
                gl_FragColor = vec4(glowColor, intensity * 0.95);
            }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true,
        side: THREE.FrontSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeom, atmoMat);
    globeRoot.add(atmoMesh);

    // Convert Lat/Lon to 3D Cartesian coordinates on sphere
    function latLonToVector3(lat, lon, radius, alt = 0) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const r = radius + alt;
        return new THREE.Vector3(
            -(r * Math.sin(phi) * Math.cos(theta)),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
    }

    // 4. Global Network Tech Hubs (Coordinates)
    const techHubs = [
        { name: 'Silicon Valley', lat: 37.77, lon: -122.41, color: 0x00f0ff },
        { name: 'New York', lat: 40.71, lon: -74.00, color: 0xff2e93 },
        { name: 'London', lat: 51.50, lon: -0.12, color: 0x00f0ff },
        { name: 'Frankfurt', lat: 50.11, lon: 8.68, color: 0x00f0ff },
        { name: 'Dubai', lat: 25.20, lon: 55.27, color: 0xff2e93 },
        { name: 'Karachi', lat: 24.86, lon: 67.00, color: 0x00f0ff },
        { name: 'Singapore', lat: 1.35, lon: 103.81, color: 0x00f0ff },
        { name: 'Tokyo', lat: 35.67, lon: 139.65, color: 0xff2e93 },
        { name: 'Sydney', lat: -33.86, lon: 151.20, color: 0x00f0ff },
        { name: 'São Paulo', lat: -23.55, lon: -46.63, color: 0x00f0ff }
    ];

    // Pulsating Radar Rings & Node Points
    const nodeRings = [];
    techHubs.forEach(hub => {
        const pos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS, 0.025);
        
        // Node Core Dot
        const dotGeom = new THREE.SphereGeometry(0.038, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: hub.color });
        const dotMesh = new THREE.Mesh(dotGeom, dotMat);
        dotMesh.position.copy(pos);
        globeRoot.add(dotMesh);

        // Vertical Marker Beam
        const beamNormal = pos.clone().normalize();
        const beamGeom = new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8);
        const beamMat = new THREE.MeshBasicMaterial({ color: hub.color, transparent: true, opacity: 0.85 });
        const beamMesh = new THREE.Mesh(beamGeom, beamMat);
        beamMesh.position.copy(pos.clone().add(beamNormal.clone().multiplyScalar(0.08)));
        beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beamNormal);
        globeRoot.add(beamMesh);

        // Expanding Radar Ring
        const ringGeom = new THREE.RingGeometry(0.04, 0.065, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: hub.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.95
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.copy(pos.clone().add(beamNormal.clone().multiplyScalar(0.006)));
        ringMesh.lookAt(pos.clone().add(beamNormal));
        globeRoot.add(ringMesh);

        nodeRings.push({ mesh: ringMesh, scale: 1, baseOpacity: 0.95 });
    });

    // 5. Inter-City Global Arcs & Traveling Photons
    const connections = [
        [0, 1], // Silicon Valley - New York
        [1, 2], // New York - London
        [2, 3], // London - Frankfurt
        [3, 4], // Frankfurt - Dubai
        [4, 5], // Dubai - Karachi
        [5, 6], // Karachi - Singapore
        [6, 7], // Singapore - Tokyo
        [7, 0], // Tokyo - Silicon Valley (Trans-Pacific Arc)
        [7, 8], // Tokyo - Sydney
        [2, 9], // London - São Paulo
        [9, 1]  // São Paulo - New York
    ];

    const travelingPulses = [];

    connections.forEach((conn, index) => {
        const start = latLonToVector3(techHubs[conn[0]].lat, techHubs[conn[0]].lon, GLOBE_RADIUS, 0.025);
        const end = latLonToVector3(techHubs[conn[1]].lat, techHubs[conn[1]].lon, GLOBE_RADIUS, 0.025);

        // High arch midpoint elevated in space above clouds
        const distance = start.distanceTo(end);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const elevation = GLOBE_RADIUS + Math.min(distance * 0.38, 1.25);
        mid.normalize().multiplyScalar(elevation);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(50);
        const arcGeom = new THREE.BufferGeometry().setFromPoints(points);

        const arcMat = new THREE.LineBasicMaterial({
            color: index % 2 === 0 ? 0x00f0ff : 0xff2e93,
            transparent: true,
            opacity: 0.65,
            linewidth: 1
        });
        const arcLine = new THREE.Line(arcGeom, arcMat);
        globeRoot.add(arcLine);

        // Data Pulse Photon
        const pulseGeom = new THREE.SphereGeometry(0.038, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({
            color: index % 2 === 0 ? 0xffffff : 0x00f0ff
        });
        const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        globeRoot.add(pulseMesh);

        travelingPulses.push({
            curve: curve,
            mesh: pulseMesh,
            progress: (index * 0.12) % 1,
            speed: 0.003 + Math.random() * 0.002
        });
    });

    // 6. Deep Space Starfield
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        const r = GLOBE_RADIUS * 1.5 + Math.random() * 2.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);
    }
    const partGeom = new THREE.BufferGeometry();
    partGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const partMat = new THREE.PointsMaterial({
        size: 0.032,
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.75
    });
    const starField = new THREE.Points(partGeom, partMat);
    scene.add(starField);

    // 7. Daylight & Space Lighting (Full Earth Illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // Sun directional light (illuminates Earth vividly from front-top-right)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(3, 4, 6);
    scene.add(sunLight);

    // Soft celestial rim fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    fillLight.position.set(-4, -1, 4);
    scene.add(fillLight);

    // 8. Interactive Mouse / Touch Drag & Parallax
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

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        heroEl.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - prevPointerX;
            const deltaY = e.clientY - prevPointerY;
            dragVelocityX = deltaX * 0.005;
            dragVelocityY = deltaY * 0.005;
            globeRoot.rotation.y += dragVelocityX;
            globeRoot.rotation.x += dragVelocityY;
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
            globeRoot.rotation.y += dragVelocityX;
            globeRoot.rotation.x += dragVelocityY;
            prevPointerX = e.touches[0].clientX;
            prevPointerY = e.touches[0].clientY;
        }, { passive: true });

        heroEl.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // Responsive Canvas Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // High-Performance Visibility Pause (Zero GPU lag when scrolled past hero)
    let isHeroVisible = true;
    if ('IntersectionObserver' in window && heroEl) {
        const heroObserver = new IntersectionObserver((entries) => {
            isHeroVisible = entries[0].isIntersecting;
        }, { threshold: 0.02 });
        heroObserver.observe(heroEl);
    }

    // Main 60 FPS Render Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (!isHeroVisible) return; // Instantly pauses WebGL loop when user scrolls down to projects!
        const delta = clock.getDelta();

        // Natural continuous Earth rotation
        if (!isDragging) {
            globeRoot.rotation.y += 0.002;
            dragVelocityX *= 0.94;
            dragVelocityY *= 0.94;
            globeRoot.rotation.y += dragVelocityX;
            globeRoot.rotation.x += dragVelocityY;

            // Parallax tilt tracking cursor
            targetRotY = mouseX * 0.18;
            targetRotX = -mouseY * 0.18;
            globeRoot.rotation.y += (targetRotY - (globeRoot.rotation.y % (Math.PI * 2))) * 0.02;
        }

        // Realistic clouds drift slightly faster over Earth
        cloudsMesh.rotation.y += 0.0006;

        // Animate radar rings
        nodeRings.forEach(item => {
            item.scale += delta * 1.6;
            if (item.scale > 2.8) {
                item.scale = 1;
            }
            item.mesh.scale.set(item.scale, item.scale, item.scale);
            const fade = Math.max(0, 1 - (item.scale - 1) / 1.8);
            item.mesh.material.opacity = fade * item.baseOpacity;
        });

        // Animate traveling data pulses
        travelingPulses.forEach(item => {
            item.progress = (item.progress + item.speed) % 1;
            const pos = item.curve.getPoint(item.progress);
            item.mesh.position.copy(pos);
        });

        // Ambient stars slow orbit
        starField.rotation.y -= 0.0004;

        renderer.render(scene, camera);
    }
    animate();
}

// 3. COLUMN-WISE PROJECT SHOWCASE CAROUSEL
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

    // Create dot indicators
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to project ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
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
            const gap = 32; // 2rem
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
        } else {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24; // 1.5rem
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
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < getMaxIndex()) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        const rect = track.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowRight' && currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
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
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
            if (currentIndex < getMaxIndex()) {
                currentIndex++;
                updateCarousel();
            }
        }
        if (touchEndX > touchStartX + threshold) {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
    }

    window.addEventListener('resize', updateCarousel);
    setTimeout(updateCarousel, 100);
}

// 4. SPOTLIGHT HOVER FOR CARDS
document.querySelectorAll('.service-card, .carousel-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 5. SCROLL REVEAL OBSERVER
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

// 6. SINGLE-PASS GUARANTEED INITIALIZATION
function bootstrap() {
    initCyberGlobe();
    initProjectCarousel();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
