// js/entities/DamageNumber.js
export class DamageNumber {
  constructor(damage, x, y, isCrit = false) {
    // Create text
    this.text = new PIXI.Text(damage.toString(), {
      fontSize: isCrit ? 64 : 48,
      fill: isCrit ? 0xffff00 : 0xffffff,
      fontWeight: 'bold',
      stroke: isCrit ? 0xff0000 : 0x000000,
      strokeThickness: isCrit ? 6 : 4,
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 2,
    });

    this.text.x = x;
    this.text.y = y;
    this.text.anchor.set(0.5);

    // Add random horizontal offset
    const randomOffset = (Math.random() - 0.5) * 50;

    // Animate with GSAP
    gsap.to(this.text, {
      y: y - 150,
      x: x + randomOffset,
      alpha: 0,
      duration: 1.5,
      ease: 'power2.out',
      onComplete: () => {
        this.destroy();
      }
    });

    // Scale animation
    this.text.scale.set(0);
    gsap.to(this.text.scale, {
      x: 1,
      y: 1,
      duration: 0.2,
      ease: 'back.out(2)'
    });
  }

  destroy() {
    if (this.text && this.text.parent) {
      this.text.destroy();
    }
  }
}

