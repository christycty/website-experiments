// js/entities/Firework.js
export class Firework {
  constructor(app, x, y, angle) {
    this.app = app;
    this.speed = 12; // Increased from 8 to 12
    this.active = true;
    
    // Create firework sprite
    this.sprite = this.createFireworkSprite();
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.anchor.set(0.5);
    
    // Calculate velocity based on angle
    this.vx = Math.sin(angle) * this.speed;
    this.vy = -Math.cos(angle) * this.speed;
    
    // Rotation to match direction
    this.sprite.rotation = angle;
  }
  
  createFireworkSprite() {
    const graphics = new PIXI.Graphics();
    
    // Draw firework rocket
    graphics.beginFill(0xff3333);
    graphics.drawCircle(0, 0, 8);
    graphics.endFill();
    
    // Add trail effect
    graphics.beginFill(0xff6666, 0.5);
    graphics.drawCircle(0, 10, 6);
    graphics.endFill();
    
    graphics.beginFill(0xff9999, 0.3);
    graphics.drawCircle(0, 18, 4);
    graphics.endFill();
    
    const texture = this.app.renderer.generateTexture(graphics);
    return new PIXI.Sprite(texture);
  }
  
  update() {
    if (!this.active) return;
    
    // Move firework
    this.sprite.x += this.vx;
    this.sprite.y += this.vy;
    
    // Bounce off left and right walls
    if (this.sprite.x <= 0 || this.sprite.x >= this.app.screen.width) {
      this.vx = -this.vx; // Reverse horizontal direction
      // Keep within bounds
      this.sprite.x = Math.max(0, Math.min(this.app.screen.width, this.sprite.x));
    }
    
    // Check if out of bounds (top and bottom only)
    if (this.sprite.y < -50 || this.sprite.y > this.app.screen.height + 50) {
      this.active = false;
    }
  }
  
  checkCollision(target) {
    if (!this.active) return false;
    
    const dx = this.sprite.x - target.x;
    const dy = this.sprite.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Collision radius (firework + beast)
    const collisionDistance = 50;
    
    return distance < collisionDistance;
  }
  
  explode() {
    this.active = false;
    
    // Create explosion effect
    gsap.to(this.sprite, {
      alpha: 0,
      scale: 2,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
  
  destroy() {
    if (this.sprite.parent) {
      this.sprite.parent.removeChild(this.sprite);
    }
    this.sprite.destroy();
  }
}

