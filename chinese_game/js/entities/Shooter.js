// js/entities/Shooter.js
export class Shooter {
  constructor(app) {
    this.app = app;
    this.rotation = 0;
    this.rotationSpeed = 0.01; // Reduced from 0.02 to 0.01 (slower rotation)
    this.maxRotation = Math.PI / 2; // 90 degrees (pointing up)
    this.rotationDirection = 1; // 1 for right, -1 for left
    
    // Create shooter sprite
    this.sprite = this.createShooterSprite();
    this.sprite.x = app.screen.width / 2;
    this.sprite.y = app.screen.height - 100;
    this.sprite.anchor.set(0.5, 0.8); // Anchor at bottom center for rotation
    
    // Store base position
    this.baseX = this.sprite.x;
    this.baseY = this.sprite.y;
  }
  
  createShooterSprite() {
    const graphics = new PIXI.Graphics();
    
    // Draw launcher base
    graphics.beginFill(0x333333);
    graphics.drawRect(-30, 0, 60, 20);
    graphics.endFill();
    
    // Draw launcher barrel
    graphics.beginFill(0x666666);
    graphics.drawRoundedRect(-15, -60, 30, 60, 5);
    graphics.endFill();
    
    // Draw barrel tip
    graphics.beginFill(0xff3333);
    graphics.drawCircle(0, -60, 12);
    graphics.endFill();
    
    // Add details
    graphics.lineStyle(2, 0x999999);
    graphics.moveTo(-15, -40);
    graphics.lineTo(15, -40);
    graphics.moveTo(-15, -20);
    graphics.lineTo(15, -20);
    
    const texture = this.app.renderer.generateTexture(graphics);
    const sprite = new PIXI.Sprite(texture);
    
    return sprite;
  }
  
  update() {
    // Rotate back and forth
    this.rotation += this.rotationSpeed * this.rotationDirection;
    
    // Change direction at limits
    if (this.rotation >= this.maxRotation / 2) {
      this.rotationDirection = -1;
    } else if (this.rotation <= -this.maxRotation / 2) {
      this.rotationDirection = 1;
    }
    
    // Apply rotation
    this.sprite.rotation = this.rotation;
  }
  
  getFirePosition() {
    // Calculate position at the tip of the barrel
    const barrelLength = 60;
    const angle = this.rotation;
    
    return {
      x: this.sprite.x + Math.sin(angle) * barrelLength,
      y: this.sprite.y - Math.cos(angle) * barrelLength,
      angle: angle
    };
  }
  
  playFireAnimation() {
    // Recoil effect
    const originalScale = this.sprite.scale.x;
    
    gsap.to(this.sprite.scale, {
      x: originalScale * 0.9,
      y: originalScale * 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
  }
}

