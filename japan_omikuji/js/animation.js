/**
 * 3D Animation Controller using Three.js
 * Handles omikuji box, stick, and paper animations
 */

const OmikujiAnimation = {
    // Three.js core objects
    scene: null,
    camera: null,
    renderer: null,
    
    // 3D objects
    omikujiBox: null,
    fortuneStick: null,
    fortunePaper: null,
    
    // Animation state
    isShaking: false,
    shakeIntensity: 0,
    shakeCount: 0,
    requiredShakes: 15,
    
    // Mouse/touch tracking
    isDragging: false,
    previousMouseX: 0,
    previousMouseY: 0,
    
    // Animation parameters
    rotationVelocity: { x: 0, y: 0 },
    
    /**
     * Initialize the 3D scene
     */
    init(canvas) {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5dc); // Beige background
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lights
        this.setupLighting();
        
        // Create omikuji box
        this.createOmikujiBox();
        
        // Create fortune stick (hidden initially)
        this.createFortuneStick();
        
        // Create fortune paper (hidden initially)
        this.createFortunePaper();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
    },
    
    /**
     * Setup scene lighting
     */
    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light for shadows and depth
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light for warm glow
        const pointLight = new THREE.PointLight(0xffddaa, 0.5);
        pointLight.position.set(-3, 3, 5);
        this.scene.add(pointLight);
    },
    
    /**
     * Create the cylindrical omikuji box
     */
    createOmikujiBox() {
        const group = new THREE.Group();
        
        // Main cylinder body
        const cylinderGeometry = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
        const cylinderMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513, // Saddle brown (wood color)
            roughness: 0.8,
            metalness: 0.1
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        group.add(cylinder);
        
        // Top cap
        const topCapGeometry = new THREE.CylinderGeometry(1.3, 1.2, 0.2, 32);
        const topCapMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.7,
            metalness: 0.1
        });
        const topCap = new THREE.Mesh(topCapGeometry, topCapMaterial);
        topCap.position.y = 1.6;
        topCap.castShadow = true;
        group.add(topCap);
        
        // Bottom cap
        const bottomCapGeometry = new THREE.CylinderGeometry(1.2, 1.3, 0.2, 32);
        const bottomCap = new THREE.Mesh(bottomCapGeometry, topCapMaterial);
        bottomCap.position.y = -1.6;
        bottomCap.castShadow = true;
        group.add(bottomCap);
        
        // Small hole at top for stick to emerge
        const holeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
        const holeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 1
        });
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.position.set(0.8, 1.6, 0);
        group.add(hole);
        
        // Add decorative bands
        for (let i = 0; i < 3; i++) {
            const bandGeometry = new THREE.TorusGeometry(1.25, 0.05, 16, 32);
            const bandMaterial = new THREE.MeshStandardMaterial({
                color: 0xCC0000, // Shrine red
                roughness: 0.5,
                metalness: 0.3
            });
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.rotation.x = Math.PI / 2;
            band.position.y = -1 + i * 1;
            group.add(band);
        }
        
        this.omikujiBox = group;
        this.scene.add(group);
    },
    
    /**
     * Create the fortune stick
     */
    createFortuneStick() {
        const group = new THREE.Group();
        
        // Stick body
        const stickGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 16);
        const stickMaterial = new THREE.MeshStandardMaterial({
            color: 0xDEB887, // Burlywood
            roughness: 0.9
        });
        const stick = new THREE.Mesh(stickGeometry, stickMaterial);
        stick.castShadow = true;
        group.add(stick);
        
        // Stick tip
        const tipGeometry = new THREE.ConeGeometry(0.08, 0.3, 16);
        const tip = new THREE.Mesh(tipGeometry, stickMaterial);
        tip.position.y = 1.4;
        group.add(tip);
        
        // Position inside box initially
        group.position.set(0.8, -0.5, 0);
        group.rotation.z = Math.PI; // Point downward
        group.visible = false;
        
        this.fortuneStick = group;
        this.scene.add(group);
    },
    
    /**
     * Create the fortune paper
     */
    createFortunePaper() {
        const group = new THREE.Group();
        
        // Rolled paper
        const paperGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
        const paperMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFAF0, // Floral white
            roughness: 0.8
        });
        const paper = new THREE.Mesh(paperGeometry, paperMaterial);
        paper.castShadow = true;
        group.add(paper);
        
        group.visible = false;
        
        this.fortunePaper = group;
        this.scene.add(group);
    },
    
    /**
     * Start shaking animation
     */
    startShake(intensity) {
        this.isShaking = true;
        this.shakeIntensity = Math.min(intensity, 1);
        this.shakeCount++;
    },
    
    /**
     * Update shake animation
     */
    updateShake() {
        if (!this.isShaking) return;
        
        // Apply rotation velocity
        this.omikujiBox.rotation.x += this.rotationVelocity.x;
        this.omikujiBox.rotation.z += this.rotationVelocity.y;
        
        // Add random shake wobble
        const wobble = this.shakeIntensity * 0.1;
        this.omikujiBox.rotation.x += (Math.random() - 0.5) * wobble;
        this.omikujiBox.rotation.z += (Math.random() - 0.5) * wobble;
        
        // Damping
        this.rotationVelocity.x *= 0.95;
        this.rotationVelocity.y *= 0.95;
        
        // Stop shaking when velocity is low
        if (Math.abs(this.rotationVelocity.x) < 0.001 && 
            Math.abs(this.rotationVelocity.y) < 0.001) {
            this.isShaking = false;
            
            // Reset rotation gradually
            this.omikujiBox.rotation.x *= 0.9;
            this.omikujiBox.rotation.z *= 0.9;
        }
    },
    
    /**
     * Animate stick sliding out
     */
    animateStickEmergence(onComplete) {
        this.fortuneStick.visible = true;
        this.fortuneStick.position.set(0.8, -0.5, 0);
        
        const startY = -0.5;
        const endY = 2.5;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.fortuneStick.position.y = startY + (endY - startY) * eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Stick fully emerged
                setTimeout(() => {
                    this.transitionToPaper(onComplete);
                }, 500);
            }
        };
        
        animate();
    },
    
    /**
     * Transition from stick to paper
     */
    transitionToPaper(onComplete) {
        // Hide stick and box
        const fadeOut = () => {
            this.fortuneStick.visible = false;
            this.omikujiBox.visible = false;
            
            // Show paper
            this.fortunePaper.visible = true;
            this.fortunePaper.position.set(0, 0, 0);
            this.fortunePaper.rotation.z = Math.PI / 2;
            this.fortunePaper.scale.set(1, 1, 1);
            
            // Zoom camera to paper
            this.animateCameraTo(0, 0, 4, onComplete);
        };
        
        fadeOut();
    },
    
    /**
     * Animate paper unfolding
     */
    animatePaperUnfold(onComplete) {
        const duration = 1500;
        const startTime = Date.now();
        const startScaleX = 1;
        const endScaleX = 3;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.fortunePaper.scale.x = startScaleX + (endScaleX - startScaleX) * eased;
            this.fortunePaper.rotation.z = (Math.PI / 2) * (1 - eased);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Paper fully unfolded, hide 3D scene
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 300);
            }
        };
        
        animate();
    },
    
    /**
     * Animate camera movement
     */
    animateCameraTo(x, y, z, onComplete) {
        const startPos = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease in-out cubic
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            this.camera.position.x = startPos.x + (x - startPos.x) * eased;
            this.camera.position.y = startPos.y + (y - startPos.y) * eased;
            this.camera.position.z = startPos.z + (z - startPos.z) * eased;
            
            this.camera.lookAt(0, 0, 0);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (onComplete) {
                onComplete();
            }
        };
        
        animate();
    },
    
    /**
     * Reset scene for new fortune
     */
    reset() {
        this.omikujiBox.visible = true;
        this.omikujiBox.rotation.set(0, 0, 0);
        this.fortuneStick.visible = false;
        this.fortunePaper.visible = false;
        this.shakeCount = 0;
        this.shakeIntensity = 0;
        this.isShaking = false;
        this.rotationVelocity = { x: 0, y: 0 };
        
        // Reset camera
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);
    },
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    },
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.updateShake();
        
        // Gentle idle rotation when not shaking
        if (!this.isShaking && this.omikujiBox.visible) {
            this.omikujiBox.rotation.y += 0.002;
        }
        
        this.renderer.render(this.scene, this.camera);
    },
    
    /**
     * Handle mouse/touch drag for shaking
     */
    onDragStart(x, y) {
        this.isDragging = true;
        this.previousMouseX = x;
        this.previousMouseY = y;
    },
    
    onDragMove(x, y) {
        if (!this.isDragging) return;
        
        const deltaX = x - this.previousMouseX;
        const deltaY = y - this.previousMouseY;
        
        // Convert mouse movement to rotation velocity
        this.rotationVelocity.x += deltaY * 0.01;
        this.rotationVelocity.y += deltaX * 0.01;
        
        // Calculate shake intensity
        const intensity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 100;
        this.startShake(intensity);
        
        this.previousMouseX = x;
        this.previousMouseY = y;
    },
    
    onDragEnd() {
        this.isDragging = false;
    }
};

