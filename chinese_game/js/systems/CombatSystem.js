// js/systems/CombatSystem.js
import { DamageNumber } from '../entities/DamageNumber.js';
import { SoundGenerator } from '../utils/soundGenerator.js';

export class CombatSystem {
  constructor(yearBeast, store, app) {
    this.yearBeast = yearBeast;
    this.store = store;
    this.app = app;
    this.DAMAGE_PER_FIRECRACKER = 10;
    this.CRIT_CHANCE = 0.15;
    this.CRIT_MULTIPLIER = 2;
    this.damageNumbers = [];
    
    // Initialize audio
    this.sounds = {};
    this.soundGenerator = new SoundGenerator();
    this.loadSounds();
  }
  
  loadSounds() {
    const soundFiles = {
      hit: 'assets/sounds/hit.mp3',
      victory: 'assets/sounds/victory.mp3',
      button: 'assets/sounds/button.mp3'
    };
    
    for (const [name, path] of Object.entries(soundFiles)) {
      try {
        const audio = new Audio(path);
        audio.volume = 0.5;
        audio.preload = 'auto';
        // Test if file exists by trying to load it
        audio.addEventListener('error', () => {
          console.warn(`Sound file not found: ${name}, will use procedural sound`);
          this.sounds[name] = null;
        });
        audio.addEventListener('canplaythrough', () => {
          this.sounds[name] = audio;
        });
      } catch (e) {
        console.warn(`Failed to load sound: ${name}`, e);
        this.sounds[name] = null;
      }
    }
  }

  onBeastTapped(event) {
    // Check if player has firecrackers
    if (!this.store.consumeFirecracker(1)) {
      this.showMessage('爆竹不足！完成任務獲取更多爆竹');
      return;
    }

    // Calculate damage
    const { damage, isCrit } = this.calculateDamage();

    // Apply damage
    const defeated = this.store.damageYearBeast(damage);

    // Visual feedback
    this.showDamageNumber(damage, isCrit, event);
    this.yearBeast.playHurt();

    // Play sound effect (if available)
    this.playSoundEffect('hit');

    // Check if defeated
    if (defeated) {
      this.onBeastDefeated();
    }
  }

  calculateDamage() {
    const baseDamage = this.DAMAGE_PER_FIRECRACKER;
    const isCrit = Math.random() < this.CRIT_CHANCE;
    const damage = isCrit ? Math.floor(baseDamage * this.CRIT_MULTIPLIER) : baseDamage;
    return { damage, isCrit };
  }

  showDamageNumber(damage, isCrit, event) {
    // Get position from click/tap event or use beast position
    let x = this.yearBeast.sprite.x;
    let y = this.yearBeast.sprite.y - 100;

    if (event && event.global) {
      x = event.global.x;
      y = event.global.y;
    }

    const damageNum = new DamageNumber(damage, x, y, isCrit);
    this.app.stage.addChild(damageNum.text);
    this.damageNumbers.push(damageNum);

    // Clean up old damage numbers
    this.damageNumbers = this.damageNumbers.filter(dn => dn.text.parent !== null);
  }

  onBeastDefeated() {
    this.yearBeast.playDeath();
    
    // Play victory sound
    this.playSoundEffect('victory');
    
    setTimeout(() => {
      this.store.nextLevel();
      this.showMessage(`恭喜過關！進入第 ${this.store.state.level} 關`);
      
      // Reset beast
      this.yearBeast.reset();
    }, 2000);
  }

  showMessage(text) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = text;
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 20px 40px;
      border-radius: 15px;
      font-size: 18px;
      font-weight: bold;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    `;
    
    document.body.appendChild(toast);
    
    // Fade in
    gsap.from(toast, {
      opacity: 0,
      scale: 0.5,
      duration: 0.3,
      ease: 'back.out(2)'
    });
    
    // Fade out and remove
    gsap.to(toast, {
      opacity: 0,
      scale: 0.5,
      duration: 0.3,
      delay: 2,
      ease: 'power2.in',
      onComplete: () => {
        document.body.removeChild(toast);
      }
    });
  }

  playSoundEffect(name) {
    if (!this.store.state.soundEnabled) return;
    
    // Try to play audio file first
    if (this.sounds[name]) {
      try {
        // Clone and play to allow overlapping sounds
        const sound = this.sounds[name].cloneNode();
        sound.volume = 0.5;
        sound.play().catch(e => {
          console.warn(`Failed to play sound: ${name}`, e);
          this.playProceduralSound(name);
        });
        return;
      } catch (e) {
        console.warn(`Error playing sound: ${name}`, e);
      }
    }
    
    // Fallback to procedural sound
    this.playProceduralSound(name);
  }
  
  playProceduralSound(name) {
    if (!this.soundGenerator) return;
    
    switch (name) {
      case 'hit':
        this.soundGenerator.playHit();
        break;
      case 'victory':
        this.soundGenerator.playVictory();
        break;
      case 'button':
        this.soundGenerator.playButton();
        break;
    }
  }

  update() {
    // Update combat-related logic if needed
  }
}

