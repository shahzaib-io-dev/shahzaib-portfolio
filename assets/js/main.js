// =========================================
// SHAHZAIB DIGITAL — MULTI-PAGE CONTROLLER
// =========================================

// 1. ADVANCED FLUID CURSOR
(function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');
    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        const ambient = document.getElementById('ambient-glow');
        if (ambient) {
            ambient.style.transform = `translate(${e.clientX / 40}px, ${e.clientY / 40}px)`;
        }
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.16;
        outlineY += (mouseY - outlineY) * 0.16;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll('a, button, .project-card, .service-card, .interactive-item');
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
            }, 200);
        });
    });
})();

// 2. THREE.JS 3D CYBERNETIC MESH (HERO)
function initThreeMesh() {
    const container = document.getElementById('three-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3D Geometry: Glowing Wireframe Core
    const geom = new THREE.IcosahedronGeometry(2.1, 2);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xff2e93,
        wireframe: true,
        transparent: true,
        opacity: 0.18
    });
    const mesh = new THREE.Mesh(geom, wireMat);
    scene.add(mesh);

    // Star particle cloud around the 3D core
    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        const r = 2.4 + Math.random() * 2.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);
    }
    const partGeom = new THREE.BufferGeometry();
    partGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const partMat = new THREE.PointsMaterial({
        size: 0.045,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.75
    });
    const particles = new THREE.Points(partGeom, partMat);
    scene.add(particles);

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function render() {
        requestAnimationFrame(render);
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        mesh.rotation.x += targetY * 0.01;
        mesh.rotation.y += targetX * 0.01;

        particles.rotation.y -= 0.002;
        particles.rotation.x -= targetY * 0.005;

        renderer.render(scene, camera);
    }
    render();
}

// 3. CARD SPOTLIGHT GRADIENT TRACKING
document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 4. SCROLL REVEAL OBSERVER
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));
}

// Initialize Three.js if container exists
if (document.getElementById('three-canvas-container')) {
    initThreeMesh();
}
