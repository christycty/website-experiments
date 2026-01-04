// js/systems/TaskSystem.js
// Task management system

export class TaskSystem {
  constructor(store) {
    this.store = store;
    this.timers = new Map();
    this.startTime = Date.now();
    
    // Initialize tasks
    this.initializeTasks();
  }

  initializeTasks() {
    // Mark daily login as completed
    this.store.updateTaskProgress('daily_login', 1);
    
    // Start timer for stay duration
    this.startStayTimer();
  }

  startStayTimer() {
    // Update stay time every second
    const timer = setInterval(() => {
      const task = this.store.state.tasks.find(t => t.id === 'stay_15s');
      
      if (task && !task.completed && task.progress < task.target) {
        // Set progress to elapsed seconds
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        task.progress = Math.min(elapsed, task.target);
        this.store.saveState();
        this.store.notify();
      }
      
      if (task && task.progress >= task.target) {
        clearInterval(timer);
      }
    }, 1000);
    
    this.timers.set('stay_timer', timer);
  }

  checkTaskCompletion(taskId) {
    const task = this.store.state.tasks.find(t => t.id === taskId);
    if (!task) return false;
    
    return task.progress >= task.target && !task.completed;
  }

  claimTaskReward(taskId) {
    if (this.checkTaskCompletion(taskId)) {
      return this.store.completeTask(taskId);
    }
    return false;
  }

  getTaskProgress(taskId) {
    const task = this.store.state.tasks.find(t => t.id === taskId);
    if (!task) return { progress: 0, target: 0, percentage: 0 };
    
    return {
      progress: task.progress,
      target: task.target,
      percentage: Math.min((task.progress / task.target) * 100, 100)
    };
  }

  getAllTasks() {
    return this.store.state.tasks.map(task => ({
      ...task,
      ...this.getTaskProgress(task.id),
      canClaim: this.checkTaskCompletion(task.id)
    }));
  }

  destroy() {
    // Clear all timers
    this.timers.forEach(timer => clearInterval(timer));
    this.timers.clear();
  }
}

