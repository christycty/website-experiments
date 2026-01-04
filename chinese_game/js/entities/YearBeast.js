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

    // Position at top of screen
    this.sprite.x = app.screen.width / 2;
    this.sprite.y = 150; // Top area
    
    // Store original position for reset
    this.originalX = this.sprite.x;
    this.originalY = this.sprite.y;
    
    if (this.sprite.anchor) {
      this.sprite.anchor.set(0.5);
    }

    // Movement properties
    this.moveSpeed = 1; // Reduced from 2 to 1
    this.moveDirection = 1; // 1 for right, -1 for left
    this.minX = 100;
    this.maxX = app.screen.width - 100;

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
    if (!this.sprite) return; // Safety check
    
    this.playAnimation('hurt', false);
    
    // Flash red tint
    if (!this.isSpine && this.sprite) {
      gsap.to(this.sprite, {
        tint: 0xff0000,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          if (this.sprite) {
            this.sprite.tint = 0xffffff;
          }
        }
      });
    }
    
    // Scale pulse effect - with safety checks
    if (this.sprite && this.sprite.scale) {
      const originalScaleX = Math.abs(this.sprite.scale.x);
      const originalScaleY = Math.abs(this.sprite.scale.y);
      const flipDirection = this.sprite.scale.x < 0 ? -1 : 1;
      
      gsap.to(this.sprite.scale, {
        x: originalScaleX * 1.2 * flipDirection,
        y: originalScaleY * 1.2,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        onComplete: () => {
          if (this.sprite && this.currentState !== 'death') {
            this.playAnimation('idle', true);
          }
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
    gsap.killTweensOf(this.sprite.scale);
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
    
    // Reset movement
    this.moveDirection = 1;
    
    this.playAnimation('idle', true);
  }

  update() {
    // Move left and right
    this.sprite.x += this.moveSpeed * this.moveDirection;
    
    // Bounce at edges
    if (this.sprite.x >= this.maxX) {
      this.moveDirection = -1;
      this.sprite.scale.x = Math.abs(this.sprite.scale.x) * -1; // Flip sprite
    } else if (this.sprite.x <= this.minX) {
      this.moveDirection = 1;
      this.sprite.scale.x = Math.abs(this.sprite.scale.x); // Flip sprite back
    }
  }
}

