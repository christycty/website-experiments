// js/ui/TaskPanel.js
export class TaskController {
  constructor(store, taskSystem) {
    this.store = store;
    this.taskSystem = taskSystem;
    
    // Get DOM elements
    this.taskButton = document.getElementById('task-button');
    this.taskPanel = document.getElementById('task-panel');
    this.taskList = document.getElementById('task-list');
    this.closeButton = document.getElementById('close-tasks');
    
    // Check if all elements exist
    if (!this.taskButton || !this.taskPanel || !this.taskList || !this.closeButton) {
      console.error('Task panel elements not found');
      return;
    }
    
    // Bind event listeners
    this.taskButton.addEventListener('click', () => this.show());
    this.closeButton.addEventListener('click', () => this.hide());
    
    // Close panel when clicking outside
    this.taskPanel.addEventListener('click', (e) => {
      if (e.target === this.taskPanel) {
        this.hide();
      }
    });
    
    // Initial render
    this.update();
  }

  show() {
    this.taskPanel.classList.remove('hidden');
    this.update();
  }

  hide() {
    this.taskPanel.classList.add('hidden');
  }

  update() {
    if (!this.taskList) return;
    
    // Clear current list
    this.taskList.innerHTML = '';
    
    // Get all tasks
    const tasks = this.taskSystem ? this.taskSystem.getAllTasks() : this.store.state.tasks;
    
    // Render each task
    tasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      this.taskList.appendChild(taskElement);
    });
  }

  createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    if (task.completed) {
      taskItem.classList.add('completed');
    }
    
    // Calculate progress
    const progress = task.progress || 0;
    const target = task.target || 1;
    const percentage = Math.min((progress / target) * 100, 100);
    
    taskItem.innerHTML = `
      <div style="flex: 1;">
        <div class="task-title">${task.title}</div>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
          <div style="flex: 1; height: 8px; background: #ddd; border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; background: #667eea; width: ${percentage}%; transition: width 0.3s;"></div>
          </div>
          <div style="font-size: 12px; color: #666; min-width: 60px; text-align: right;">
            ${progress} / ${target}
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-left: 15px;">
        <div class="task-reward">+${task.reward} 爆竹</div>
        ${this.createClaimButton(task)}
      </div>
    `;
    
    return taskItem;
  }

  createClaimButton(task) {
    if (task.completed) {
      return '<span style="color: #4caf50; font-weight: bold; font-size: 14px;">✓ 已完成</span>';
    }
    
    const canClaim = task.canClaim || (task.progress >= task.target);
    
    if (canClaim) {
      const button = document.createElement('button');
      button.className = 'task-claim';
      button.textContent = '領取';
      button.onclick = (e) => {
        e.stopPropagation();
        this.claimTask(task.id);
      };
      return button.outerHTML;
    }
    
    return '<span style="color: #999; font-size: 14px;">進行中...</span>';
  }

  claimTask(taskId) {
    const success = this.taskSystem ? 
      this.taskSystem.claimTaskReward(taskId) : 
      this.store.completeTask(taskId);
    
    if (success) {
      // Show success message
      this.showClaimSuccess();
      
      // Update UI
      this.update();
    }
  }

  showClaimSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.textContent = '✓ 獎勵已領取！';
    notification.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      background: #4caf50;
      color: white;
      padding: 15px 30px;
      border-radius: 10px;
      font-weight: bold;
      z-index: 1001;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate
    gsap.from(notification, {
      y: -50,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(2)'
    });
    
    gsap.to(notification, {
      y: -50,
      opacity: 0,
      duration: 0.3,
      delay: 1.5,
      ease: 'power2.in',
      onComplete: () => {
        document.body.removeChild(notification);
      }
    });
  }
}

