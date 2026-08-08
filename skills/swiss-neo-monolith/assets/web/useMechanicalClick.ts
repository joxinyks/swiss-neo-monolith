/**
 * Swiss Neo-Monolith — synthesized mechanical keyclick.
 *
 * No audio files: a short filtered noise burst plus a low thud, shaped to sound
 * like a stiff mechanical switch. See references/03-motion-sound.md for the
 * rules this implements — the important ones are that sound is OFF by default,
 * the AudioContext is only created after a real user gesture, and reduced-motion
 * silences it entirely.
 */

const STORAGE_KEY = 'snm.sound';
const PEAK_GAIN = 0.08; // hard ceiling — this is a tick, not a tone

type Edge = 'down' | 'up';

let ctx: AudioContext | null = null;

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isSoundEnabled(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'on';
}

export function setSoundEnabled(on: boolean): void {
  localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  if (!on && ctx) {
    void ctx.close();
    ctx = null;
  }
}

/** Must be called from inside a user-gesture handler; browsers block otherwise. */
function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function playMechanicalClick(edge: Edge = 'down'): void {
  if (!isSoundEnabled() || prefersReducedMotion()) return;

  const ac = getContext();
  if (!ac || ac.state !== 'running') return;

  const t = ac.currentTime;
  // The release is quieter and duller than the press — same asymmetry a real
  // switch has.
  const dur = edge === 'down' ? 0.028 : 0.018;
  const level = edge === 'down' ? PEAK_GAIN : PEAK_GAIN * 0.55;

  const out = ac.createGain();
  out.gain.setValueAtTime(level, t);
  out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  out.connect(ac.destination);

  // Click transient: short white-noise burst through a band-pass.
  const frames = Math.ceil(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const noise = ac.createBufferSource();
  noise.buffer = buffer;

  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = edge === 'down' ? 2600 : 1900;
  band.Q.value = 1.4;

  noise.connect(band).connect(out);
  noise.start(t);
  noise.stop(t + dur);

  // Body: a fast-decaying low sine gives the press its weight.
  if (edge === 'down') {
    const thud = ac.createOscillator();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(180, t);
    thud.frequency.exponentialRampToValueAtTime(90, t + dur);
    const thudGain = ac.createGain();
    thudGain.gain.setValueAtTime(level * 0.5, t);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    thud.connect(thudGain).connect(ac.destination);
    thud.start(t);
    thud.stop(t + dur);
  }
}

/** Spread onto any pressable element. */
export const mechanicalPressProps = {
  onPointerDown: () => playMechanicalClick('down'),
  onPointerUp: () => playMechanicalClick('up'),
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') playMechanicalClick('down');
  },
  onKeyUp: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') playMechanicalClick('up');
  },
};
