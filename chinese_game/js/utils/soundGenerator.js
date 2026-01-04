// js/utils/soundGenerator.js
// Simple procedural sound generator for when audio files are not available

export class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // Resume audio context (required by some browsers)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Generate hit sound (short percussive sound)
  playHit(volume = 0.3) {
    if (!this.audioContext) return;
    
    this.resume();
    
    const now = this.audioContext.currentTime;
    
    // Create oscillator for the "pop" sound
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Frequency sweep from high to low (pop sound)
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    
    // Volume envelope (quick attack, quick decay)
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Generate victory sound (ascending notes)
  playVictory(volume = 0.3) {
    if (!this.audioContext) return;
    
    this.resume();
    
    const now = this.audioContext.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C (major chord)
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      const startTime = now + (i * 0.15);
      const duration = 0.3;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Generate button click sound
  playButton(volume = 0.2) {
    if (!this.audioContext) return;
    
    this.resume();
    
    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
    
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

