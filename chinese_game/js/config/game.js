// js/config/game.js
// Game configuration constants

export const GAME_CONFIG = {
  // Screen dimensions
  SCREEN_WIDTH: 750,
  SCREEN_HEIGHT: 1334,
  
  // Combat settings
  DAMAGE_PER_FIRECRACKER: 10,
  CRIT_CHANCE: 0.15,
  CRIT_MULTIPLIER: 2,
  
  // Level progression
  BASE_HP: 1000,
  HP_INCREMENT_PER_LEVEL: 500,
  
  // Starting resources
  STARTING_FIRECRACKERS: 100,
  
  // Security settings
  MAX_CLICKS_PER_SECOND: 10,
  CLICK_WINDOW_MS: 1000,
  
  // Animation settings
  DAMAGE_NUMBER_DURATION: 1.5,
  SHAKE_DURATION: 0.3,
  DEATH_ANIMATION_DURATION: 2,
  
  // UI settings
  TOAST_DURATION: 2,
  NOTIFICATION_DURATION: 1.5,
};

export const COLORS = {
  PRIMARY: 0x667eea,
  SECONDARY: 0x764ba2,
  DANGER: 0xff4444,
  SUCCESS: 0x4caf50,
  WARNING: 0xffcc44,
  INFO: 0x2196f3,
  
  // HP bar colors
  HP_HIGH: 0xff4444,
  HP_MEDIUM: 0xff8844,
  HP_LOW: 0xffcc44,
  
  // Damage numbers
  DAMAGE_NORMAL: 0xffffff,
  DAMAGE_CRIT: 0xffff00,
};

export const AUDIO = {
  BGM: 'assets/sounds/bgm.mp3',
  HIT: 'assets/sounds/hit.mp3',
  VICTORY: 'assets/sounds/victory.mp3',
  BUTTON_CLICK: 'assets/sounds/button.mp3',
};

export const ASSETS = {
  BACKGROUND: 'assets/images/bg.jpg',
  FIRECRACKER_ICON: 'assets/images/firecracker.png',
  BEAST_SPINE: 'assets/spine/beast.json',
};

