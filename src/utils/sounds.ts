
export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio playback failed:', e);
    }
  }

  playMilestone() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.3, 'sine', 0.25), i * 150);
    });
  }

  playAchievement() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.25, 'triangle', 0.3), i * 120);
    });
  }

  playSuccess() {
    const notes = [392, 523.25];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine', 0.3), i * 100);
    });
  }

  playGoalComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine', 0.25), i * 100);
    });
  }

  playLevelUp() {
    const notes = [392, 493.88, 587.33, 659.25, 783.99, 880, 987.77, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.15, 'triangle', 0.3), i * 80);
    });
  }

  playClick() {
    this.playTone(800, 0.05, 'sine', 0.1);
  }

  playNotification() {
    this.playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(800, 0.1, 'sine', 0.2), 100);
  }

  playError() {
    this.playTone(200, 0.3, 'sawtooth', 0.2);
  }
}

export const soundManager = SoundManager.getInstance();
