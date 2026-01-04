// js/main.js
import { GameApplication } from './core/Application.js';
import { GameStore } from './utils/store.js';
import { SecurityManager } from './utils/security.js';
import { HudController } from './ui/HudOverlay.js';
import { TaskController } from './ui/TaskPanel.js';
import { TaskSystem } from './systems/TaskSystem.js';
import { GAME_CONFIG } from './config/game.js';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Initialize game
async function initGame() {
  try {
    console.log('Initializing Year Beast Game...');
    
    // Initialize game store
    const store = new GameStore();
    window.gameStore = store; // Make available globally for debugging
    
    // Initialize security manager
    const security = new SecurityManager(store);
    window.gameSecurity = security;
    
    // Initialize task system
    const taskSystem = new TaskSystem(store);
    window.taskSystem = taskSystem;
    
    // Initialize UI controllers
    const hud = new HudController(store);
    const tasks = new TaskController(store, taskSystem);
    
    // Initialize PixiJS application
    const app = new GameApplication({
      container: document.getElementById('game-container'),
      width: GAME_CONFIG.SCREEN_WIDTH,
      height: GAME_CONFIG.SCREEN_HEIGHT,
      backgroundColor: 0x1a1a2e,
      store: store,
    });
    
    window.gameApp = app; // Make available globally for debugging
    
    // Load assets
    console.log('Loading assets...');
    await app.loadAssets();
    
    // Start game
    console.log('Starting game...');
    await app.startGame();
    
    // Subscribe to state changes
    store.subscribe(() => {
      hud.update();
      tasks.update();
    });
    
    console.log('✓ Game initialized successfully!');
    
    // Show welcome message
    showWelcomeMessage();
    
  } catch (error) {
    console.error('Failed to initialize game:', error);
    showErrorMessage('遊戲載入失敗，請重新整理頁面');
  }
}

function showWelcomeMessage() {
  const message = document.createElement('div');
  message.innerHTML = `
    <div style="font-size: 32px; font-weight: bold; color: #ffd700; margin-bottom: 10px;">
      🧨 打年獸 🧨
    </div>
    <div style="font-size: 18px; color: white;">
      點擊年獸開始遊戲！
    </div>
  `;
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    z-index: 1000;
    pointer-events: none;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  `;
  
  document.body.appendChild(message);
  
  // Animate in
  gsap.from(message, {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(2)',
  });
  
  // Animate out
  gsap.to(message, {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    delay: 3,
    ease: 'back.in(2)',
    onComplete: () => {
      document.body.removeChild(message);
    }
  });
}

function showErrorMessage(text) {
  const error = document.createElement('div');
  error.textContent = text;
  error.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ff4444;
    color: white;
    padding: 30px;
    border-radius: 15px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    z-index: 1000;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  `;
  
  document.body.appendChild(error);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Game paused (tab hidden)');
    // Pause game if needed
  } else {
    console.log('Game resumed (tab visible)');
    // Resume game if needed
  }
});

// Prevent accidental page unload
window.addEventListener('beforeunload', (event) => {
  // Save game state one last time
  if (window.gameStore) {
    window.gameStore.saveState();
  }
});

