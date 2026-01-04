// js/utils/security.js
// Basic anti-cheat utilities

export class SecurityManager {
  constructor(store) {
    this.store = store;
    this.clickTimestamps = [];
    this.MAX_CLICKS_PER_SECOND = 10;
    this.CLICK_WINDOW_MS = 1000;
  }

  // Check if click rate is suspicious
  validateClick() {
    const now = Date.now();
    
    // Remove old timestamps outside the window
    this.clickTimestamps = this.clickTimestamps.filter(
      timestamp => now - timestamp < this.CLICK_WINDOW_MS
    );
    
    // Check if too many clicks
    if (this.clickTimestamps.length >= this.MAX_CLICKS_PER_SECOND) {
      console.warn('Click rate too high, possible bot detected');
      return false;
    }
    
    // Add current timestamp
    this.clickTimestamps.push(now);
    return true;
  }

  // Validate state integrity
  validateState(state) {
    // Check for impossible values
    if (state.firecrackers < 0 || state.firecrackers > 999999) {
      console.error('Invalid firecracker count detected');
      return false;
    }
    
    if (state.beastHP < 0 || state.beastHP > state.beastMaxHP) {
      console.error('Invalid HP values detected');
      return false;
    }
    
    if (state.level < 1 || state.level > 100) {
      console.error('Invalid level detected');
      return false;
    }
    
    return true;
  }

  // Simple checksum for saved data
  generateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  verifyChecksum(data, checksum) {
    return this.generateChecksum(data) === checksum;
  }
}

