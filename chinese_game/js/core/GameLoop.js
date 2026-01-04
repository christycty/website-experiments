// js/core/GameLoop.js
// Game loop utilities

export class GameLoop {
  constructor() {
    this.isRunning = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.fps = 60;
    this.frameCount = 0;
    this.updateCallbacks = [];
    this.animationFrameId = null;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  loop = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    this.frameCount++;

    // Call all update callbacks
    this.updateCallbacks.forEach(callback => {
      try {
        callback(this.deltaTime);
      } catch (error) {
        console.error('Error in game loop callback:', error);
      }
    });

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  addUpdateCallback(callback) {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  getDeltaTime() {
    return this.deltaTime;
  }

  getFPS() {
    return this.deltaTime > 0 ? 1 / this.deltaTime : 60;
  }
}

