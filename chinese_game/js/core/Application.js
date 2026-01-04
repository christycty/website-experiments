// js/core/Application.js
import { YearBeast } from '../entities/YearBeast.js';
import { CombatSystem } from '../systems/CombatSystem.js';

export class GameApplication {
  constructor(options) {
    // Create PixiJS app (using global PIXI from CDN)
    this.app = new PIXI.Application({
      width: options.width,
      height: options.height,
      backgroundColor: options.backgroundColor,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    // Add canvas to container (handle both PixiJS v7 and v8)
    const canvas = this.app.view || this.app.canvas;
    options.container.appendChild(canvas);

    // Store reference
    this.store = options.store;

    // Game entities
    this.yearBeast = null;
    this.combatSystem = null;
    this.background = null;
  }

  async loadAssets() {
    console.log('Loading assets...');
    
    try {
      // Check if PIXI.Assets exists (v7+) or use Loader (v6)
      if (PIXI.Assets) {
        // PixiJS v7+ Assets API
        try {
          await PIXI.Assets.load([
            { alias: 'bg', src: 'assets/images/bg.jpg' },
            { alias: 'firecracker', src: 'assets/images/firecracker.png' },
          ]);
        } catch (e) {
          console.warn('Assets failed to load, will use fallbacks:', e);
        }
        
        // Try to load Spine assets if available
        try {
          await PIXI.Assets.load({ alias: 'beast', src: 'assets/spine/beast.json' });
        } catch (e) {
          console.warn('Spine assets not available, will use fallback');
        }
      } else {
        // Fallback for older PixiJS versions or if Assets API not available
        console.warn('PIXI.Assets not available, using direct loading');
      }
      
      console.log('Assets loaded successfully');
    } catch (error) {
      console.warn('Some assets failed to load, using fallbacks:', error);
    }
  }

  async startGame() {
    console.log('Starting game...');
    
    // Add background
    try {
      this.background = PIXI.Sprite.from('bg');
      this.background.width = this.app.screen.width;
      this.background.height = this.app.screen.height;
      this.app.stage.addChild(this.background);
    } catch (e) {
      // Fallback background
      const bg = new PIXI.Graphics();
      bg.beginFill(0x1a1a2e);
      bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
      bg.endFill();
      this.app.stage.addChild(bg);
    }

    // Create Year Beast
    this.yearBeast = new YearBeast(this.app);
    this.app.stage.addChild(this.yearBeast.sprite);

    // Initialize combat system
    this.combatSystem = new CombatSystem(this.yearBeast, this.store, this.app);

    // Add click handler (compatible with PixiJS v6 and v7+)
    this.yearBeast.sprite.interactive = true;
    this.yearBeast.sprite.buttonMode = true;
    if (this.yearBeast.sprite.eventMode !== undefined) {
      this.yearBeast.sprite.eventMode = 'static';
    }
    this.yearBeast.sprite.cursor = 'pointer';
    this.yearBeast.sprite.on('pointerdown', (event) => {
      this.combatSystem.onBeastTapped(event);
    });

    // Start game loop
    this.app.ticker.add(() => this.update());
    
    console.log('Game started successfully!');
  }

  update() {
    // Update game entities
    if (this.yearBeast) {
      this.yearBeast.update();
    }
    
    if (this.combatSystem) {
      this.combatSystem.update();
    }
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true);
    }
  }
}

