// js/ui/HudOverlay.js
export class HudController {
  constructor(store) {
    this.store = store;
    
    // Get DOM elements
    this.hpFill = document.getElementById('hp-fill');
    this.hpText = document.getElementById('hp');
    this.maxHpText = document.getElementById('max-hp');
    this.levelText = document.getElementById('level');
    this.firecrackerText = document.getElementById('firecracker-count');
    
    // Check if all elements exist
    if (!this.hpFill || !this.hpText || !this.maxHpText || !this.levelText || !this.firecrackerText) {
      console.error('HUD elements not found');
      return;
    }
    
    // Initial update
    this.update();
  }

  update() {
    const state = this.store.state;
    
    // Update HP bar
    const hpPercent = (state.beastHP / state.beastMaxHP) * 100;
    this.hpFill.style.width = `${hpPercent}%`;
    this.hpText.textContent = state.beastHP;
    this.maxHpText.textContent = state.beastMaxHP;
    
    // Change HP bar color based on percentage
    if (hpPercent > 50) {
      this.hpFill.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
    } else if (hpPercent > 25) {
      this.hpFill.style.background = 'linear-gradient(90deg, #ff8844, #ffaa66)';
    } else {
      this.hpFill.style.background = 'linear-gradient(90deg, #ffcc44, #ffee66)';
    }
    
    // Update level
    this.levelText.textContent = state.level;
    
    // Update firecrackers with animation
    const currentCount = parseInt(this.firecrackerText.textContent) || 0;
    const newCount = state.firecrackers;
    
    if (currentCount !== newCount) {
      this.animateNumber(this.firecrackerText, currentCount, newCount, 500);
    }
  }

  animateNumber(element, from, to, duration) {
    const startTime = Date.now();
    const difference = to - from;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(from + difference * easeProgress);
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = to;
      }
    };
    
    animate();
  }

  showLevelUp(level) {
    // Create level up notification
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      <div style="font-size: 48px; font-weight: bold; color: #ffd700; text-shadow: 0 0 20px #ffd700;">
        第 ${level} 關
      </div>
      <div style="font-size: 24px; color: white; margin-top: 10px;">
        年獸變強了！
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      text-align: center;
      pointer-events: none;
    `;
    
    document.body.appendChild(notification);
    
    // Animate
    gsap.from(notification, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)'
    });
    
    gsap.to(notification, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      delay: 2,
      ease: 'back.in(2)',
      onComplete: () => {
        document.body.removeChild(notification);
      }
    });
  }
}

