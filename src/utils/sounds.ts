// Sound system with enable/disable support via localStorage
const SOUND_KEY = 'th_sound_enabled';

export const isSoundEnabled = (): boolean => {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled: boolean) => {
  localStorage.setItem(SOUND_KEY, String(enabled));
};

const audioCtx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

export const playMilestoneSound = (type: 'success' | 'levelup' | 'streak' | 'reward' = 'success') => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.15, now);

    switch (type) {
      case 'levelup':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        osc.frequency.setValueAtTime(1047, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'streak':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.15);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
      case 'reward':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.setValueAtTime(523, now + 0.1);
        osc.frequency.setValueAtTime(659, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(784, now + 0.25);
        gain2.gain.setValueAtTime(0.1, now + 0.25);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc2.start(now + 0.25);
        osc2.stop(now + 0.5);
        break;
      default:
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
  } catch {}
};

export const playReminderSound = () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = audioCtx();
    const now = ctx.currentTime;

    // Two-tone chime for reminders
    [0, 0.15].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(i === 0 ? 880 : 1100, now + delay);
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.25);
      osc.start(now + delay);
      osc.stop(now + delay + 0.25);
    });
  } catch {}
};

export const playNotificationSound = () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(800, now + 0.08);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch {}
};
