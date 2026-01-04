// js/entities/YearBeast.js
export class YearBeast {
  constructor(app) {
    this.app = app;
    
    // Try to create Spine animation (using global pixi-spine from CDN)
    try {
      if (window.PIXI && window.PIXI.spine) {
        this.sprite = PIXI.spine.Spine.from('beast');
        this.isSpine = true;
      } else {
        throw new Error('Spine not available');
      }
    } catch (e) {
      // Fallback to simple sprite if Spine fails
      console.warn('Spine not available, using fallback sprite');
      this.createFallbackSprite();
      this.isSpine = false;
    }

    // Position in center
    this.sprite.x = app.screen.width / 2;
    this.sprite.y = app.screen.height / 2 + 100;
    
    // Store original position for reset
    this.originalX = this.sprite.x;
    this.originalY = this.sprite.y;
    
    if (this.sprite.anchor) {
      this.sprite.anchor.set(0.5);
    }

    // Animation state
    this.currentState = 'idle';
    
    // Play idle animation
    this.playAnimation('idle', true);
  }

  createFallbackSprite() {
    // Create a simple colored rectangle as fallback
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xff3333);
    graphics.drawRoundedRect(-100, -100, 200, 200, 20);
    graphics.endFill();
    
    // Add eyes
    graphics.beginFill(0xffffff);
    graphics.drawCircle(-40, -30, 20);
    graphics.drawCircle(40, -30, 20);
    graphics.endFill();
    
    graphics.beginFill(0x000000);
    graphics.drawCircle(-40, -30, 10);
    graphics.drawCircle(40, -30, 10);
    graphics.endFill();
    
    // Add mouth
    graphics.lineStyle(5, 0x000000);
    graphics.arc(0, 20, 40, 0, Math.PI);
    
    const texture = this.app.renderer.generateTexture(graphics);
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5);
  }

  playAnimation(name, loop = false) {
    if (this.isSpine && this.sprite.state) {
      try {
        this.sprite.state.setAnimation(0, name, loop);
      } catch (e) {
        console.warn(`Animation '${name}' not found`);
      }
    }
    this.currentState = name;
  }

  playHurt() {
    this.playAnimation('hurt', false);
    
    // Store original position if not already stored
    if (!this.originalX) {
      this.originalX = this.sprite.x;
    }
    
    // Shake effect using GSAP (from CDN)
    gsap.to(this.sprite, {
      x: `+=${10}`,
      yoyo: true,
      repeat: 5,
      duration: 0.05,
      ease: 'none',
      onComplete: () => {
        // Force reset to original position
        this.sprite.x = this.originalX;
        if (this.currentState !== 'death') {
          this.playAnimation('idle', true);
        }
      }
    });
    
    // Flash red tint
    if (!this.isSpine) {
      gsap.to(this.sprite, {
        tint: 0xff0000,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          this.sprite.tint = 0xffffff;
        }
      });
    }
  }

  playDeath() {
    this.playAnimation('death', false);
    
    // Fade out and scale down
    gsap.to(this.sprite, {
      alpha: 0,
      scale: 0.5,
      duration: 1,
      ease: 'power2.out'
    });
  }

  reset() {
    // Reset to initial state
    gsap.killTweensOf(this.sprite);
    this.sprite.alpha = 1;
    this.sprite.scale.set(1);
    this.sprite.tint = 0xffffff;
    
    // Reset position to original
    if (this.originalX !== undefined) {
      this.sprite.x = this.originalX;
    }
    if (this.originalY !== undefined) {
      this.sprite.y = this.originalY;
    }
    
    this.playAnimation('idle', true);
  }

  update() {
    // Update animation if needed
    // Spine animations update automatically
  }
}

