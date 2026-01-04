/**
 * Main Application Controller
 * State machine managing the omikuji experience
 */

const OmikujiApp = {
    // Application states
    states: {
        INITIAL: 'initial',
        SHAKING: 'shaking',
        STICK_EMERGING: 'stick_emerging',
        READY_TO_UNFOLD: 'ready_to_unfold',
        UNFOLDING: 'unfolding',
        SHOWING_FORTUNE: 'showing_fortune'
    },
    
    currentState: null,
    currentFortune: null,
    
    // DOM elements
    elements: {
        canvas: null,
        canvasContainer: null,
        instructionText: null,
        fortuneDisplay: null,
        fortuneLevelJp: null,
        fortuneLevelEn: null,
        wishesText: null,
        loveText: null,
        healthText: null,
        businessText: null,
        studiesText: null,
        travelText: null,
        resetButton: null,
        loadingIndicator: null,
        titleSection: null
    },
    
    /**
     * Initialize the application
     */
    init() {
        // Get DOM elements
        this.elements.canvas = document.getElementById('omikujiCanvas');
        this.elements.canvasContainer = document.getElementById('canvasContainer');
        this.elements.instructionText = document.getElementById('instructionText');
        this.elements.fortuneDisplay = document.getElementById('fortuneDisplay');
        this.elements.fortuneLevelJp = document.getElementById('fortuneLevelJp');
        this.elements.fortuneLevelEn = document.getElementById('fortuneLevelEn');
        this.elements.wishesText = document.getElementById('wishesText');
        this.elements.loveText = document.getElementById('loveText');
        this.elements.healthText = document.getElementById('healthText');
        this.elements.businessText = document.getElementById('businessText');
        this.elements.studiesText = document.getElementById('studiesText');
        this.elements.travelText = document.getElementById('travelText');
        this.elements.resetButton = document.getElementById('resetButton');
        this.elements.loadingIndicator = document.getElementById('loadingIndicator');
        this.elements.titleSection = document.getElementById('titleSection');
        
        // Initialize 3D animation
        OmikujiAnimation.init(this.elements.canvas);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Create sakura petals
        this.createSakuraPetals();
        
        // Set initial state
        this.setState(this.states.INITIAL);
        
        console.log('Omikuji app initialized');
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse events for shaking
        this.elements.canvas.addEventListener('mousedown', (e) => this.onPointerDown(e));
        this.elements.canvas.addEventListener('mousemove', (e) => this.onPointerMove(e));
        this.elements.canvas.addEventListener('mouseup', () => this.onPointerUp());
        this.elements.canvas.addEventListener('mouseleave', () => this.onPointerUp());
        
        // Touch events for mobile
        this.elements.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.onPointerDown(touch);
        }, { passive: false });
        
        this.elements.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.onPointerMove(touch);
        }, { passive: false });
        
        this.elements.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.onPointerUp();
        }, { passive: false });
        
        // Click to unfold (desktop)
        this.elements.canvasContainer.addEventListener('click', () => {
            if (this.currentState === this.states.READY_TO_UNFOLD) {
                this.unfoldPaper();
            }
        });
        
        // Touch to unfold (mobile)
        this.elements.canvasContainer.addEventListener('touchstart', (e) => {
            if (this.currentState === this.states.READY_TO_UNFOLD) {
                e.preventDefault();
                this.unfoldPaper();
            }
        }, { passive: false });
        
        // Reset button
        this.elements.resetButton.addEventListener('click', () => this.reset());
        
        // Keyboard accessibility
        this.elements.canvas.setAttribute('tabindex', '0');
        this.elements.canvas.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (this.currentState === this.states.INITIAL) {
                    // Simulate shake with keyboard
                    this.simulateShake();
                } else if (this.currentState === this.states.READY_TO_UNFOLD) {
                    this.unfoldPaper();
                }
            }
        });
    },
    
    /**
     * Handle pointer down event
     */
    onPointerDown(e) {
        if (this.currentState !== this.states.INITIAL && 
            this.currentState !== this.states.SHAKING) {
            return;
        }
        
        const rect = this.elements.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        OmikujiAnimation.onDragStart(x, y);
        this.setState(this.states.SHAKING);
    },
    
    /**
     * Handle pointer move event
     */
    onPointerMove(e) {
        if (this.currentState !== this.states.SHAKING) return;
        
        const rect = this.elements.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        OmikujiAnimation.onDragMove(x, y);
        
        // Check if enough shaking has occurred
        if (OmikujiAnimation.shakeCount >= OmikujiAnimation.requiredShakes) {
            this.onShakeComplete();
        }
    },
    
    /**
     * Handle pointer up event
     */
    onPointerUp() {
        OmikujiAnimation.onDragEnd();
        
        if (this.currentState === this.states.SHAKING) {
            // Return to initial if not enough shaking
            if (OmikujiAnimation.shakeCount < OmikujiAnimation.requiredShakes) {
                this.setState(this.states.INITIAL);
            }
        }
    },
    
    /**
     * Simulate shake for keyboard users
     */
    simulateShake() {
        this.setState(this.states.SHAKING);
        this.elements.instructionText.textContent = 'Shaking...';
        
        // Simulate shake animation
        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
            const intensity = 0.5 + Math.random() * 0.5;
            OmikujiAnimation.startShake(intensity);
            OmikujiAnimation.rotationVelocity.x = (Math.random() - 0.5) * 0.2;
            OmikujiAnimation.rotationVelocity.y = (Math.random() - 0.5) * 0.2;
            
            shakeCount++;
            OmikujiAnimation.shakeCount = shakeCount;
            
            if (shakeCount >= OmikujiAnimation.requiredShakes) {
                clearInterval(shakeInterval);
                this.onShakeComplete();
            }
        }, 100);
    },
    
    /**
     * Handle shake completion
     */
    onShakeComplete() {
        this.setState(this.states.STICK_EMERGING);
        this.elements.instructionText.textContent = 'Your fortune is emerging...';
        
        // Generate fortune
        this.currentFortune = FortuneSystem.generateFortune();
        
        // Animate stick emergence
        OmikujiAnimation.animateStickEmergence(() => {
            this.setState(this.states.READY_TO_UNFOLD);
            this.elements.instructionText.textContent = 'Click to unfold your fortune';
        });
    },
    
    /**
     * Unfold the paper to reveal fortune
     */
    unfoldPaper() {
        this.setState(this.states.UNFOLDING);
        this.elements.instructionText.textContent = 'Unfolding...';
        
        // Animate paper unfolding
        OmikujiAnimation.animatePaperUnfold(() => {
            this.showFortune();
        });
    },
    
    /**
     * Display the fortune
     */
    showFortune() {
        this.setState(this.states.SHOWING_FORTUNE);
        
        // Hide canvas and instruction
        this.elements.canvasContainer.style.display = 'none';
        this.elements.instructionText.classList.add('hidden');
        
        // Populate fortune data
        this.elements.fortuneLevelJp.textContent = this.currentFortune.level.japanese;
        this.elements.fortuneLevelEn.textContent = this.currentFortune.level.english;
        
        // Apply color based on fortune level
        const color = FortuneSystem.getLevelColor(this.currentFortune.level.id);
        this.elements.fortuneLevelJp.style.color = color;
        
        this.elements.wishesText.textContent = this.currentFortune.categories.wishes;
        this.elements.loveText.textContent = this.currentFortune.categories.love;
        this.elements.healthText.textContent = this.currentFortune.categories.health;
        this.elements.businessText.textContent = this.currentFortune.categories.business;
        this.elements.studiesText.textContent = this.currentFortune.categories.studies;
        this.elements.travelText.textContent = this.currentFortune.categories.travel;
        
        // Show fortune display
        this.elements.fortuneDisplay.classList.remove('hidden');
        
        // Scroll to fortune
        setTimeout(() => {
            this.elements.fortuneDisplay.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    },
    
    /**
     * Reset to draw another fortune
     */
    reset() {
        // Hide fortune display
        this.elements.fortuneDisplay.classList.add('hidden');
        
        // Show canvas
        this.elements.canvasContainer.style.display = 'block';
        
        // Reset animation
        OmikujiAnimation.reset();
        
        // Reset state
        this.currentFortune = null;
        this.setState(this.states.INITIAL);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    /**
     * Set application state
     */
    setState(newState) {
        this.currentState = newState;
        console.log('State changed to:', newState);
        
        // Update instruction text based on state
        switch (newState) {
            case this.states.INITIAL:
                this.elements.instructionText.textContent = 'Click and drag to shake the box';
                this.elements.instructionText.classList.remove('hidden');
                break;
            case this.states.SHAKING:
                this.elements.instructionText.textContent = 'Keep shaking...';
                break;
            case this.states.STICK_EMERGING:
                this.elements.instructionText.textContent = 'Your fortune is emerging...';
                break;
            case this.states.READY_TO_UNFOLD:
                this.elements.instructionText.textContent = 'Click to unfold your fortune';
                break;
            case this.states.UNFOLDING:
                this.elements.instructionText.textContent = 'Unfolding...';
                break;
            case this.states.SHOWING_FORTUNE:
                this.elements.instructionText.classList.add('hidden');
                break;
        }
    },
    
    /**
     * Create animated sakura petals
     */
    createSakuraPetals() {
        const container = document.getElementById('sakuraContainer');
        const petalCount = 15;
        
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal';
            
            // Random starting position
            petal.style.left = Math.random() * 100 + '%';
            
            // Random animation duration (slower fall)
            const duration = 15 + Math.random() * 15;
            petal.style.animationDuration = duration + 's';
            
            // Random delay for staggered effect
            petal.style.animationDelay = Math.random() * 10 + 's';
            
            // Random size variation
            const size = 8 + Math.random() * 6;
            petal.style.width = size + 'px';
            petal.style.height = size + 'px';
            
            container.appendChild(petal);
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => OmikujiApp.init());
} else {
    OmikujiApp.init();
}

