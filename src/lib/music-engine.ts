import * as Tone from "tone";
import type { Analysis, MusicOverrides } from "@/types";

// ─── Music Theory Constants ───────────────────────────────────────────────────

const SCALES: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  diminished: [0, 2, 3, 5, 6, 8, 9, 11],
  pentatonic: [0, 2, 4, 7, 9],
};

const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const ENGINE_CONFIG = {
  reverbDecay: 2.5,
  reverbWet: 0.35,
  delayWet: 0.15,
  octaveRange: [3, 5] as [number, number],
};

// ─── Seeded RNG ───────────────────────────────────────────────────────────────

class SeededRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed >>> 0;
  }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 0xffffffff;
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }
}

// ─── Music Engine ─────────────────────────────────────────────────────────────

class MusicEngine {
  isPlaying = false;
  volume = 0.6;
  analysis: Analysis | null = null;
  private parts: Tone.Sequence[] = [];
  private synths: (
    | Tone.Synth
    | Tone.FMSynth
    | Tone.AMSynth
    | Tone.PluckSynth
    | Tone.MembraneSynth
    | Tone.PolySynth
  )[] = [];
  private effects: Record<string, Tone.ToneAudioNode> = {};
  private masterVol: Tone.Volume | null = null;
  initialized = false;

  async init(analysis: Analysis, overrides?: MusicOverrides) {
    this.analysis = analysis;
    this.dispose();

    const music = analysis.music;

    const effectiveBpm = overrides?.bpm ?? music.bpm;
    const effectiveScale = overrides?.scale ?? music.scale;
    const effectiveVoices = overrides?.voices ?? music.voices;
    const effectiveEnergy = overrides?.energy ?? music.energy;
    const effectiveReverb = overrides?.reverb ?? ENGINE_CONFIG.reverbWet;

    const rootIdx = analysis.hashSeed % 12;
    const root = ROOTS[rootIdx];
    const scale = SCALES[effectiveScale] ?? SCALES.major;
    const octave = ENGINE_CONFIG.octaveRange[0] + 1;

    const notePool = buildNotePool(root, scale, octave, ENGINE_CONFIG.octaveRange);

    Tone.getTransport().bpm.value = effectiveBpm;

    const reverb = new Tone.Reverb({
      decay: ENGINE_CONFIG.reverbDecay,
      wet: effectiveReverb,
    }).toDestination();
    const delay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.2,
      wet: ENGINE_CONFIG.delayWet,
    }).connect(reverb);
    const limiter = new Tone.Limiter(-3).toDestination();
    this.effects = { reverb, delay, limiter };

    this.masterVol = new Tone.Volume(Tone.gainToDb(this.volume)).connect(limiter);

    const melody = buildMelody(analysis, notePool, effectiveEnergy);
    const bassLine = buildBassLine(root, scale, octave - 1);
    const rhythm = buildRhythm();

    const melodySynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 },
    });
    melodySynth.connect(this.masterVol);
    this.synths.push(melodySynth);

    const melodyPart = new Tone.Sequence(
      (time, note: any) => {
        if (note) melodySynth.triggerAttackRelease(note.pitch, note.dur, time, note.vel);
      },
      melody,
      "8n",
    );
    melodyPart.loop = true;
    this.parts.push(melodyPart);

    if (effectiveVoices >= 2) {
      const bassSynth = new Tone.FMSynth({
        harmonicity: 2,
        modulationIndex: 5,
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 },
        modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 },
      });
      bassSynth.connect(this.masterVol);
      this.synths.push(bassSynth);

      const bassPart = new Tone.Sequence(
        (time, note: any) => {
          if (note) bassSynth.triggerAttackRelease(note.pitch, note.dur, time, note.vel * 0.7);
        },
        bassLine,
        "4n",
      );
      bassPart.loop = true;
      this.parts.push(bassPart);
    }

    if (effectiveVoices >= 3) {
      const padSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.4, decay: 0.5, sustain: 0.8, release: 2 },
      });
      padSynth.connect(reverb);
      this.synths.push(padSynth as any);

      const chords = buildChords(root, scale, octave);
      const padPart = new Tone.Sequence(
        (time, chord: any) => {
          if (chord)
            chord.forEach((n: string) => padSynth.triggerAttackRelease(n, "2n", time, 0.3));
        },
        chords,
        "2n",
      );
      padPart.loop = true;
      this.parts.push(padPart);
    }

    if (effectiveVoices >= 4) {
      const percPart = buildPercussion(rhythm, this.masterVol);
      if (percPart) this.parts.push(percPart);
    }

    this.initialized = true;
  }

  async play() {
    if (!this.initialized) return;
    await Tone.start();
    this.parts.forEach((p) => p.start(0));
    Tone.getTransport().start();
    this.isPlaying = true;
  }

  pause() {
    Tone.getTransport().pause();
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) this.pause();
    else this.play();
    return this.isPlaying;
  }

  setVolume(val: number) {
    this.volume = val;
    if (this.masterVol) {
      this.masterVol.volume.value = Tone.gainToDb(val);
    }
  }

  dispose() {
    Tone.getTransport().stop();
    this.parts.forEach((p) => {
      try {
        p.stop();
        p.dispose();
      } catch {}
    });
    this.synths.forEach((s) => {
      try {
        s.dispose();
      } catch {}
    });
    Object.values(this.effects).forEach((e) => {
      try {
        e.dispose();
      } catch {}
    });
    if (this.masterVol) {
      try {
        this.masterVol.dispose();
      } catch {}
    }
    this.parts = [];
    this.synths = [];
    this.effects = {};
    this.initialized = false;
    this.isPlaying = false;
  }
}

// ─── Music Construction Helpers ───────────────────────────────────────────────

function buildNotePool(
  root: string,
  scale: number[],
  baseOctave: number,
  octaveRange: [number, number],
): string[] {
  const rootIdx = ROOTS.indexOf(root);
  const notes: string[] = [];
  for (let oct = octaveRange[0]; oct <= octaveRange[1]; oct++) {
    scale.forEach((interval) => {
      const noteIdx = (rootIdx + interval) % 12;
      notes.push(`${ROOTS[noteIdx]}${oct}`);
    });
  }
  return notes;
}

function buildMelody(analysis: Analysis, notePool: string[], energy: number) {
  const length = 16;
  const melody = [];
  const rng = new SeededRNG(analysis.hashSeed);

  for (let i = 0; i < length; i++) {
    if (rng.next() < analysis.fixRatio * 0.3) {
      melody.push(null);
      continue;
    }
    const noteIdx = Math.floor(
      Math.abs(Math.sin(i * 0.7 + analysis.hashSeed * 0.001)) * notePool.length,
    );
    const pitch = notePool[noteIdx % notePool.length];
    const durOptions = energy > 0.6 ? ["16n", "8n", "8n", "4n"] : ["8n", "4n", "4n", "2n"];
    const dur = rng.pick(durOptions);
    const vel = 0.4 + rng.next() * 0.5;
    melody.push({ pitch, dur, vel });
  }
  return melody;
}

function buildBassLine(root: string, scale: number[], octave: number) {
  const rootIdx = ROOTS.indexOf(root);
  const bassNotes = scale.slice(0, 4).map((interval) => {
    const idx = (rootIdx + interval) % 12;
    return `${ROOTS[idx]}${octave}`;
  });
  const pattern = [];
  const length = 8;
  for (let i = 0; i < length; i++) {
    const noteIdx = [0, 0, 2, 0, 1, 0, 3, 0][i];
    pattern.push({ pitch: bassNotes[noteIdx], dur: "4n", vel: 0.6 });
  }
  return pattern;
}

function buildChords(root: string, scale: number[], octave: number) {
  const rootIdx = ROOTS.indexOf(root);
  const chordDegrees = [0, 3, 4, 5];
  const chords = chordDegrees.map((degree) => {
    const intervals = [
      scale[degree],
      scale[(degree + 2) % scale.length],
      scale[(degree + 4) % scale.length],
    ];
    return intervals.map((interval) => {
      const noteIdx = (rootIdx + interval) % 12;
      return `${ROOTS[noteIdx]}${octave}`;
    });
  });
  return [...chords, ...chords];
}

function buildRhythm(): number[] {
  return [1, 0, 0.5, 0, 1, 0, 0.5, 0.3, 1, 0, 0.5, 0, 1, 0.3, 0.5, 0];
}

function buildPercussion(rhythm: number[], destination: Tone.Volume): Tone.Sequence | null {
  try {
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).connect(destination);

    const part = new Tone.Sequence(
      (time, vel) => {
        if ((vel as number) > 0) kick.triggerAttackRelease("C1", "8n", time, (vel as number) * 0.8);
      },
      rhythm,
      "8n",
    );
    part.loop = true;
    return part;
  } catch {
    return null;
  }
}

export const musicEngine = new MusicEngine();
