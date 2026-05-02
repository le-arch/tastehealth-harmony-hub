import { toast } from 'sonner';

const lastFiredAt: Record<string, number> = {};
const COOLDOWN_MS = 60_000;

const fire = (key: string, type: 'success' | 'warning' | 'error', title: string, msg: string) => {
  const now = Date.now();
  if (lastFiredAt[key] && now - lastFiredAt[key] < COOLDOWN_MS) return;
  lastFiredAt[key] = now;
  if (type === 'error') toast.error(`${title}`, { description: msg, duration: 6000 });
  else if (type === 'warning') toast.warning(`${title}`, { description: msg, duration: 5000 });
  else toast.success(`${title}`, { description: msg });
};

export function checkHeartRate(bpm: number, source: string) {
  if (!bpm) return;
  if (bpm < 40) fire(`hr-low-${source}`, 'error', '⚠️ Very low heart rate', `${bpm} bpm — consult a clinician if not at deep rest.`);
  else if (bpm < 50) fire(`hr-low2-${source}`, 'warning', 'Low heart rate', `${bpm} bpm is below the typical resting range (60–100).`);
  else if (bpm > 180) fire(`hr-high-${source}`, 'error', '⚠️ Very high heart rate', `${bpm} bpm — slow down and breathe.`);
  else if (bpm > 100 && source !== 'live-session') fire(`hr-high2-${source}`, 'warning', 'Elevated heart rate', `${bpm} bpm is above the typical resting range.`);
}

export function checkBloodPressure(sys: number, dia: number, source: string) {
  if (!sys || !dia) return;
  if (sys >= 180 || dia >= 120) fire(`bp-crisis-${source}`, 'error', '🚨 Hypertensive crisis', `${sys}/${dia} mmHg — seek medical care now.`);
  else if (sys >= 140 || dia >= 90) fire(`bp-stage2-${source}`, 'warning', 'Stage 2 hypertension', `${sys}/${dia} mmHg is high — track and consult a doctor.`);
  else if (sys >= 130 || dia >= 80) fire(`bp-stage1-${source}`, 'warning', 'Stage 1 hypertension', `${sys}/${dia} mmHg is above target.`);
  else if (sys < 90 || dia < 60) fire(`bp-low-${source}`, 'warning', 'Low blood pressure', `${sys}/${dia} mmHg — hydrate and rise slowly.`);
}

export function checkBodyTemp(c: number, source: string) {
  if (!c) return;
  if (c >= 39.5) fire(`temp-high-${source}`, 'error', '🌡️ High fever', `${c} °C — rest, hydrate, monitor closely.`);
  else if (c >= 38) fire(`temp-fever-${source}`, 'warning', 'Fever detected', `${c} °C — keep an eye on symptoms.`);
  else if (c < 35) fire(`temp-low-${source}`, 'error', '⚠️ Hypothermia', `${c} °C — warm up and seek help if persistent.`);
  else if (c < 36) fire(`temp-low2-${source}`, 'warning', 'Low body temperature', `${c} °C is below normal.`);
}
