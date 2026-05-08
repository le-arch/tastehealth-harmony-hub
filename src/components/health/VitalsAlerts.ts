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

// Heart rate (resting). Live exercise sessions skip elevated warnings.
// Refined to match AHA/ACC guidance and account for trained athletes
// where bradycardia (40–60) can be normal.
export function checkHeartRate(bpm: number, source: string) {
  if (!bpm || bpm < 20 || bpm > 250) return; // sanity
  if (bpm < 35) fire(`hr-low-${source}`, 'error', '⚠️ Critically low heart rate', `${bpm} bpm — seek medical care if not at deep rest.`);
  else if (bpm < 45 && source !== 'live-session') fire(`hr-low2-${source}`, 'warning', 'Low heart rate', `${bpm} bpm — normal for trained athletes; otherwise monitor.`);
  else if (bpm > 200) fire(`hr-high-${source}`, 'error', '⚠️ Critically high heart rate', `${bpm} bpm — slow down and breathe.`);
  else if (bpm > 110 && source !== 'live-session') fire(`hr-high2-${source}`, 'warning', 'Elevated resting heart rate', `${bpm} bpm is above the typical resting range (60–100).`);
  else if (bpm >= 60 && bpm <= 100 && source === 'manual') fire(`hr-ok-${source}-${bpm}`, 'success', 'Heart rate looks great', `${bpm} bpm is in the healthy resting range.`);
}

// Blood pressure (AHA categories).
export function checkBloodPressure(sys: number, dia: number, source: string) {
  if (!sys || !dia || sys < 50 || sys > 260 || dia < 30 || dia > 180) return;
  if (sys >= 180 || dia >= 120) fire(`bp-crisis-${source}`, 'error', '🚨 Hypertensive crisis', `${sys}/${dia} mmHg — seek medical care now.`);
  else if (sys >= 140 || dia >= 90) fire(`bp-stage2-${source}`, 'warning', 'Stage 2 hypertension', `${sys}/${dia} mmHg is high — consult a doctor.`);
  else if (sys >= 130 || dia >= 80) fire(`bp-stage1-${source}`, 'warning', 'Stage 1 hypertension', `${sys}/${dia} mmHg is above target.`);
  else if (sys >= 120 && dia < 80) fire(`bp-elevated-${source}`, 'warning', 'Elevated blood pressure', `${sys}/${dia} mmHg — adopt heart-healthy habits.`);
  else if (sys < 90 || dia < 60) fire(`bp-low-${source}`, 'warning', 'Low blood pressure', `${sys}/${dia} mmHg — hydrate and rise slowly.`);
  else if (source === 'manual') fire(`bp-ok-${source}-${sys}-${dia}`, 'success', 'Blood pressure looks healthy', `${sys}/${dia} mmHg is in the normal range.`);
}

// Body temperature (°C) — clinical thresholds.
export function checkBodyTemp(c: number, source: string) {
  if (!c || c < 25 || c > 45) return;
  if (c >= 40) fire(`temp-high-${source}`, 'error', '🌡️ Very high fever', `${c.toFixed(1)} °C — rest, hydrate, monitor closely.`);
  else if (c >= 39) fire(`temp-fever2-${source}`, 'warning', 'High fever', `${c.toFixed(1)} °C — keep an eye on symptoms.`);
  else if (c >= 38) fire(`temp-fever-${source}`, 'warning', 'Fever detected', `${c.toFixed(1)} °C — drink fluids and rest.`);
  else if (c >= 37.5) fire(`temp-mild-${source}`, 'warning', 'Mildly elevated temperature', `${c.toFixed(1)} °C — slightly above normal.`);
  else if (c < 35) fire(`temp-low-${source}`, 'error', '⚠️ Hypothermia', `${c.toFixed(1)} °C — warm up and seek help if persistent.`);
  else if (c < 36) fire(`temp-low2-${source}`, 'warning', 'Low body temperature', `${c.toFixed(1)} °C is below normal.`);
  else if (source === 'manual') fire(`temp-ok-${source}-${c}`, 'success', 'Temperature is normal', `${c.toFixed(1)} °C is in the healthy range.`);
}
