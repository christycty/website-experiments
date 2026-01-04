// js/config/levels.js
// Level definitions and progression

export const LEVELS = [
  {
    level: 1,
    hp: 1000,
    name: '初級年獸',
    description: '剛剛甦醒的年獸',
    reward: 50,
  },
  {
    level: 2,
    hp: 1500,
    name: '憤怒年獸',
    description: '開始發怒的年獸',
    reward: 75,
  },
  {
    level: 3,
    hp: 2000,
    name: '狂暴年獸',
    description: '進入狂暴狀態',
    reward: 100,
  },
  {
    level: 4,
    hp: 2500,
    name: '強化年獸',
    description: '力量大幅提升',
    reward: 125,
  },
  {
    level: 5,
    hp: 3000,
    name: '霸主年獸',
    description: '年獸之王',
    reward: 150,
  },
];

// Calculate HP for any level
export function getLevelHP(level) {
  const baseHP = 1000;
  const increment = 500;
  return baseHP + (level - 1) * increment;
}

// Get level info
export function getLevelInfo(level) {
  if (level <= LEVELS.length) {
    return LEVELS[level - 1];
  }
  
  // Generate info for levels beyond predefined ones
  return {
    level,
    hp: getLevelHP(level),
    name: `第 ${level} 級年獸`,
    description: '更加強大的年獸',
    reward: 50 + level * 25,
  };
}

// Calculate total firecrackers needed to defeat a level
export function getFirecrackersNeeded(level, damagePerFirecracker = 10) {
  const hp = getLevelHP(level);
  return Math.ceil(hp / damagePerFirecracker);
}

