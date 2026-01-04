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
        const parsed = JSON.parse(saved);
        // Validate and migrate if needed
        return this.validateState(parsed);
      } catch (e) {
        console.warn('Failed to load saved state:', e);
      }
    }
    
    // Default state
    return this.getDefaultState();
  }

  getDefaultState() {
    return {
      firecrackers: 5000,
      totalClicks: 0,
      level: 1,
      beastHP: 1000,
      beastMaxHP: 1000,
      tasks: [
        { id: 'daily_login', title: '每日登入', reward: 50, completed: false, progress: 0, target: 1 },
        { id: 'stay_15s', title: '停留15秒', reward: 30, completed: false, progress: 0, target: 15 },
        { id: 'click_100', title: '點擊100次', reward: 100, completed: false, progress: 0, target: 100 }
      ],
      soundEnabled: true,
      musicEnabled: true,
      lastPlayDate: new Date().toDateString()
    };
  }

  validateState(state) {
    const defaultState = this.getDefaultState();
    
    // Reset daily tasks if new day
    const today = new Date().toDateString();
    if (state.lastPlayDate !== today) {
      state.tasks = defaultState.tasks;
      state.lastPlayDate = today;
    }
    
    return {
      ...defaultState,
      ...state,
      tasks: state.tasks || defaultState.tasks
    };
  }

  // Save to localStorage
  saveState() {
    try {
      localStorage.setItem('year-beast-game', JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  // Subscribe to changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify listeners
  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.state);
      } catch (e) {
        console.error('Error in state listener:', e);
      }
    });
  }

  // Actions
  consumeFirecracker(amount = 1) {
    if (this.state.firecrackers >= amount) {
      this.state.firecrackers -= amount;
      this.state.totalClicks += 1;
      
      // Update click task progress
      this.updateTaskProgress('click_100', 1);
      
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

  updateTaskProgress(taskId, increment = 1) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      task.progress = Math.min(task.progress + increment, task.target);
      if (task.progress >= task.target) {
        // Task is ready to be claimed
      }
      this.saveState();
      this.notify();
    }
  }

  completeTask(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task && !task.completed && task.progress >= task.target) {
      task.completed = true;
      this.addFirecrackers(task.reward);
      return true;
    }
    return false;
  }

  // Reset game (for testing)
  reset() {
    this.state = this.getDefaultState();
    this.saveState();
    this.notify();
  }
}

