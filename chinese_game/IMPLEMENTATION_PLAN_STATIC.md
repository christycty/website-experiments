# 打年獸遊戲 - 純靜態實施計劃
## Pure Static Implementation (Zero Build Tools)

**Version:** 2.0  
**Date:** 2026-01-04  
**Target:** Pure Static Website (No npm, No build step)  
**Timeline:** 3-4 Weeks

---

## 🎯 Philosophy: True Static

- **No build tools** - No Vite, Webpack, or npm scripts
- **No compilation** - Pure JavaScript (ES6 modules)
- **No dependencies** - CDN for libraries
- **Drag & drop deployment** - Just upload files to GitHub Pages

---

## 🛠️ Revised Technology Stack

| Layer | Technology | How to Include | Size |
|-------|-----------|----------------|------|
| **Rendering** | PixiJS 8 | CDN (`<script>` tag) | ~200KB |
| **Animation** | GSAP 3 | CDN | ~50KB |
| **Spine Runtime** | pixi-spine | CDN | ~100KB |
| **UI** | Vanilla JS + Web Components | Native browser API | 0KB |
| **State** | LocalStorage | Native browser API | 0KB |
| **Modules** | ES6 Modules | Native `<script type="module">` | 0KB |

**Total from CDN:** ~350KB (gzipped: ~120KB)  
**Your code:** ~50KB  
**Assets:** ~500KB (images, audio)

**Grand Total:** ~670KB (much lighter than npm approach!)

---

## 📁 Project Structure (Simplified)

```
chinese_game/
├── index.html                    # Entry point
├── styles/
│   └── main.css                  # Global styles
├── js/
│   ├── main.js                   # Entry point
│   ├── config/
│   │   ├── game.js               # Game constants
│   │   └── levels.js             # Level definitions
│   ├── core/
│   │   ├── Application.js        # PixiJS wrapper
│   │   ├── AssetLoader.js        # Resource loader
│   │   └── GameLoop.js           # Update loop
│   ├── entities/
│   │   ├── YearBeast.js          # Year Beast
│   │   └── DamageNumber.js       # Floating text
│   ├── systems/
│   │   ├── StateMachine.js       # Animation states
│   │   ├── CombatSystem.js       # Combat logic
│   │   └── TaskSystem.js         # Task management
│   ├── ui/
│   │   ├── HudOverlay.js         # HUD component
│   │   └── TaskPanel.js          # Task UI
│   └── utils/
│       ├── store.js              # State management
│       └── security.js           # Anti-cheat
├── assets/
│   ├── images/
│   │   ├── bg.jpg                # Background
│   │   ├── firecracker.png       # Icon
│   │   └── particles/            # Effects
│   ├── spine/
│   │   ├── beast.json            # Spine data
│   │   ├── beast.atlas
│   │   └── beast.png
│   └── sounds/
│       ├── bgm.mp3
│       └── hit.mp3
└── README.md
```

**Total files:** ~20 files, ~2MB uncompressed

---

## 🚀 Implementation Guide

### **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>打年獸 - 2026 年貨節</title>
  <link rel="stylesheet" href="styles/main.css">
  
  <!-- Load libraries from CDN -->
  <script src="https://cdn.jsdelivr.net/npm/pixi.js@8.0.0/dist/pixi.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pixi-spine@4.0.4/dist/pixi-spine.min.js"></script>
</head>
<body>
  <div id="game-container"></div>
  
  <!-- UI Overlays -->
  <div id="hud">
    <div class="hp-bar-container">
      <div class="level">第 <span id="level">1</span> 關</div>
      <div class="hp-bar">
        <div class="hp-fill" id="hp-fill" style="width: 100%"></div>
      </div>
      <div class="hp-text"><span id="hp">1000</span> / <span id="max-hp">1000</span></div>
    </div>
    
    <div class="firecracker-count">
      <img src="assets/images/firecracker.png" width="32" height="32">
      <span id="firecracker-count">100</span>
    </div>
  </div>

  <button id="task-button" class="floating-button">任務</button>
  
  <!-- Task Panel (hidden by default) -->
  <div id="task-panel" class="panel hidden">
    <h2>每日任務</h2>
    <div id="task-list"></div>
    <button id="close-tasks">關閉</button>
  </div>

  <!-- Load game (ES6 modules) -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

### **Step 2: Create js/main.js (Entry Point)**

```javascript
// js/main.js
import { GameApplication } from './core/Application.js';
import { GameStore } from './utils/store.js';
import { HudController } from './ui/HudOverlay.js';
import { TaskController } from './ui/TaskPanel.js';

// Initialize game store
const store = new GameStore();

// Initialize UI controllers
const hud = new HudController(store);
const tasks = new TaskController(store);

// Initialize PixiJS application
const app = new GameApplication({
  container: document.getElementById('game-container'),
  width: 750,
  height: 1334,
  backgroundColor: 0x1a1a2e,
});

// Start game
async function init() {
  try {
    await app.loadAssets();
    await app.startGame();
    
    // Subscribe to state changes
    store.subscribe(() => {
      hud.update();
      tasks.update();
    });
    
    console.log('Game started successfully!');
  } catch (error) {
    console.error('Failed to start game:', error);
  }
}

init();
```

---

### **Step 3: Create js/utils/store.js (State Management)**

```javascript
// js/utils/store.js
export class GameStore {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  // Load from localStorage
  loadState() {
    const saved = localStorage.getItem('year-beast-game');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load saved state');
      }
    }
    
    // Default state
    return {
      firecrackers: 100,
      totalClicks: 0,
      level: 1,
      beastHP: 1000,
      beastMaxHP: 1000,
      tasks: [
        { id: 'daily_login', title: '每日登入', reward: 50, completed: false },
        { id: 'stay_15s', title: '停留15秒', reward: 30, completed: false },
        { id: 'click_100', title: '點擊100次', reward: 100, completed: false }
      ],
      soundEnabled: true,
      musicEnabled: true
    };
  }

  // Save to localStorage
  saveState() {
    localStorage.setItem('year-beast-game', JSON.stringify(this.state));
  }

  // Subscribe to changes
  subscribe(callback) {
    this.listeners.push(callback);
  }

  // Notify listeners
  notify() {
    this.listeners.forEach(cb => cb(this.state));
  }

  // Actions
  consumeFirecracker(amount = 1) {
    if (this.state.firecrackers >= amount) {
      this.state.firecrackers -= amount;
      this.state.totalClicks += 1;
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  damageYearBeast(damage) {
    this.state.beastHP = Math.max(0, this.state.beastHP - damage);
    this.saveState();
    this.notify();
    
    if (this.state.beastHP === 0) {
      return true; // Beast defeated
    }
    return false;
  }

  addFirecrackers(amount) {
    this.state.firecrackers += amount;
    this.saveState();
    this.notify();
  }

  nextLevel() {
    this.state.level += 1;
    this.state.beastMaxHP = 1000 + (this.state.level - 1) * 500;
    this.state.beastHP = this.state.beastMaxHP;
    this.saveState();
    this.notify();
  }

  completeTask(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      task.completed = true;
      this.addFirecrackers(task.reward);
      return true;
    }
    return false;
  }
}
```

---

### **Step 4: Create js/core/Application.js (PixiJS Wrapper)**

```javascript
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

    // Add canvas to container
    options.container.appendChild(this.app.view);

    // Game entities
    this.yearBeast = null;
    this.combatSystem = null;
  }

  async loadAssets() {
    // Load assets using PIXI.Assets
    await PIXI.Assets.load([
      { alias: 'bg', src: 'assets/images/bg.jpg' },
      { alias: 'firecracker', src: 'assets/images/firecracker.png' },
      // Spine assets
      { alias: 'beast', src: 'assets/spine/beast.json' }
    ]);
  }

  async startGame() {
    // Add background
    const bg = PIXI.Sprite.from('bg');
    bg.width = this.app.screen.width;
    bg.height = this.app.screen.height;
    this.app.stage.addChild(bg);

    // Create Year Beast
    this.yearBeast = new YearBeast(this.app);
    this.app.stage.addChild(this.yearBeast.sprite);

    // Initialize combat system
    this.combatSystem = new CombatSystem(this.yearBeast, window.gameStore);

    // Add click handler
    this.yearBeast.sprite.eventMode = 'static';
    this.yearBeast.sprite.cursor = 'pointer';
    this.yearBeast.sprite.on('pointerdown', () => {
      this.combatSystem.onBeastTapped();
    });

    // Start game loop
    this.app.ticker.add(() => this.update());
  }

  update() {
    // Update game entities
    if (this.yearBeast) {
      this.yearBeast.update();
    }
  }
}
```

---

### **Step 5: Create js/entities/YearBeast.js**

```javascript
// js/entities/YearBeast.js
export class YearBeast {
  constructor(app) {
    this.app = app;
    
    // Create Spine animation (using global pixi-spine from CDN)
    try {
      this.sprite = PIXI.spine.Spine.from('beast');
    } catch (e) {
      // Fallback to simple sprite if Spine fails
      console.warn('Spine not available, using fallback sprite');
      this.sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
      this.sprite.width = 300;
      this.sprite.height = 300;
      this.sprite.tint = 0xff0000;
    }

    // Position in center
    this.sprite.x = app.screen.width / 2;
    this.sprite.y = app.screen.height / 2;
    this.sprite.anchor?.set(0.5);

    // Animation state
    this.currentState = 'idle';
    
    // Play idle animation
    this.playAnimation('idle', true);
  }

  playAnimation(name, loop = false) {
    if (this.sprite.state) {
      this.sprite.state.setAnimation(0, name, loop);
    }
  }

  playHurt() {
    this.playAnimation('hurt', false);
    
    // Shake effect using GSAP (from CDN)
    gsap.to(this.sprite, {
      x: '+=10',
      yoyo: true,
      repeat: 5,
      duration: 0.05,
      onComplete: () => {
        this.playAnimation('idle', true);
      }
    });
  }

  playDeath() {
    this.playAnimation('death', false);
    
    // Fade out
    gsap.to(this.sprite, {
      alpha: 0,
      duration: 1,
      ease: 'power2.out'
    });
  }

  update() {
    // Update animation if needed
  }
}
```

---

### **Step 6: Create js/systems/CombatSystem.js**

```javascript
// js/systems/CombatSystem.js
import { DamageNumber } from '../entities/DamageNumber.js';

export class CombatSystem {
  constructor(yearBeast, store) {
    this.yearBeast = yearBeast;
    this.store = store;
    this.DAMAGE_PER_FIRECRACKER = 10;
  }

  onBeastTapped() {
    // Check if player has firecrackers
    if (!this.store.consumeFirecracker(1)) {
      this.showMessage('爆竹不足！');
      return;
    }

    // Calculate damage
    const damage = this.calculateDamage();

    // Apply damage
    const defeated = this.store.damageYearBeast(damage);

    // Visual feedback
    this.showDamageNumber(damage);
    this.yearBeast.playHurt();

    // Check if defeated
    if (defeated) {
      this.onBeastDefeated();
    }
  }

  calculateDamage() {
    const baseDamage = this.DAMAGE_PER_FIRECRACKER;
    const critChance = 0.15;
    const isCrit = Math.random() < critChance;
    return isCrit ? baseDamage * 2 : baseDamage;
  }

  showDamageNumber(damage) {
    const damageNum = new DamageNumber(
      damage,
      this.yearBeast.sprite.x,
      this.yearBeast.sprite.y - 100
    );
    this.yearBeast.app.stage.addChild(damageNum.text);
  }

  onBeastDefeated() {
    this.yearBeast.playDeath();
    
    setTimeout(() => {
      this.store.nextLevel();
      this.showMessage('恭喜過關！');
      // Reload beast
      this.yearBeast.sprite.alpha = 1;
      this.yearBeast.playAnimation('idle', true);
    }, 2000);
  }

  showMessage(text) {
    // Simple alert for now
    alert(text);
  }
}
```

---

### **Step 7: Create js/entities/DamageNumber.js**

```javascript
// js/entities/DamageNumber.js
export class DamageNumber {
  constructor(damage, x, y) {
    // Create text
    this.text = new PIXI.Text(damage.toString(), {
      fontSize: 48,
      fill: 0xffff00,
      fontWeight: 'bold',
      stroke: 0x000000,
      strokeThickness: 4
    });

    this.text.x = x;
    this.text.y = y;
    this.text.anchor.set(0.5);

    // Animate with GSAP
    gsap.to(this.text, {
      y: y - 100,
      alpha: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        this.text.destroy();
      }
    });
  }
}
```

---

### **Step 8: Create js/ui/HudOverlay.js**

```javascript
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
    
    // Update level
    this.levelText.textContent = state.level;
    
    // Update firecrackers
    this.firecrackerText.textContent = state.firecrackers;
  }
}
```

---

### **Step 9: Create styles/main.css**

```css
/* styles/main.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', Arial, sans-serif;
  overflow: hidden;
  background: #000;
}

#game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#game-container canvas {
  max-width: 100%;
  max-height: 100%;
}

/* HUD Overlay */
#hud {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 100;
  pointer-events: none;
}

.hp-bar-container {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 15px;
  backdrop-filter: blur(10px);
  margin-bottom: 15px;
}

.level {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.hp-bar {
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 8px;
}

.hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4444, #ff6666);
  border-radius: 15px;
  transition: width 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
}

.hp-text {
  color: white;
  font-size: 14px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.firecracker-count {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 10px 15px;
  backdrop-filter: blur(10px);
  width: fit-content;
}

.firecracker-count span {
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

/* Floating Button */
.floating-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.floating-button:hover {
  transform: scale(1.05);
}

.floating-button:active {
  transform: scale(0.95);
}

/* Task Panel */
.panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
}

.panel.hidden {
  display: none;
}

.panel h2 {
  margin-bottom: 20px;
  color: #333;
}

#task-list {
  margin-bottom: 20px;
}

.task-item {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 10px;
}

.task-item.completed {
  opacity: 0.5;
  text-decoration: line-through;
}

#close-tasks {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  #hud {
    top: 10px;
    left: 10px;
    right: 10px;
  }

  .floating-button {
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    font-size: 16px;
  }
}
```

---

## 🚀 Deployment to GitHub Pages

### **Option 1: Manual Upload**

1. Create a new repo on GitHub
2. Enable GitHub Pages (Settings → Pages → Source: main branch)
3. Drag and drop all files to the repo
4. Access at `https://yourusername.github.io/chinese_game/`

### **Option 2: Git Commands**

```bash
# In your chinese_game folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/chinese_game.git
git push -u origin main

# Enable Pages in repo settings
```

---

## ✅ Advantages of This Approach

| Feature | npm/Vite | Pure Static |
|---------|----------|-------------|
| **Setup Time** | 30 min | 5 min |
| **Dependencies** | 50+ packages | 0 packages |
| **Build Time** | 10-30s | 0s (instant) |
| **Deploy** | Need CI/CD | Drag & drop |
| **Debug** | Source maps | Direct code |
| **File Size** | ~800KB | ~670KB |
| **Maintenance** | Update deps | Never breaks |

---

## ⚠️ Trade-offs

**You Lose:**
- TypeScript type checking (but can use JSDoc comments)
- Advanced code splitting
- Automatic minification
- Hot module replacement

**You Gain:**
- Zero setup complexity
- No dependency hell
- Instant deployment
- Easier debugging
- Never breaks from outdated packages

---

## 🎯 Recommendation

For your use case (experimental static game), I recommend:

### **Start with Pure Static** (this plan)
- Get it working fast
- No build complexity
- Easy to iterate

### **Upgrade to Vite later** (if needed)
- Only if you need TypeScript badly
- Only if bundle size becomes an issue
- Only if you add 10+ JS files

---

## 📝 Next Steps

1. Create the folder structure
2. Copy the code examples above
3. Replace Spine assets with placeholder images (if no Spine yet)
4. Test locally by opening `index.html` in browser
5. Upload to GitHub Pages

**Want me to generate the complete starter files for you?** I can create all the HTML/JS/CSS files ready to use!

