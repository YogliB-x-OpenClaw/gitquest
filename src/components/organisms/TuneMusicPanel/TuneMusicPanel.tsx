import type { Analysis, MusicOverrides, Scale } from "@/types";

const SCALES: Scale[] = ["major", "minor", "dorian", "phrygian", "diminished", "pentatonic"];

interface TuneMusicPanelProps {
  analysis: Analysis;
  overrides: MusicOverrides;
  onOverrideChange: (overrides: MusicOverrides) => void;
  onReset: () => void;
}

export function TuneMusicPanel({
  analysis,
  overrides,
  onOverrideChange,
  onReset,
}: TuneMusicPanelProps) {
  const effectiveBpm = overrides.bpm ?? analysis.music.bpm;
  const effectiveScale = overrides.scale ?? analysis.music.scale;
  const effectiveReverb = overrides.reverb ?? 0.35;
  const effectiveVoices = overrides.voices ?? analysis.music.voices;
  const effectiveEnergy = overrides.energy ?? analysis.music.energy;

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div className="card bg-base-200 border border-base-300 h-full">
      <div className="card-body p-5 gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
            Tune the Music
          </h2>
          {hasOverrides && (
            <button
              className="btn btn-ghost btn-xs gap-1 text-base-content/50"
              onClick={onReset}
              title="Reset to git-derived values"
            >
              ↺ Reset
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* BPM */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs text-base-content/50">BPM</label>
              <span className="font-mono text-sm font-semibold text-primary">{effectiveBpm}</span>
            </div>
            <input
              type="range"
              min={40}
              max={200}
              step={1}
              value={effectiveBpm}
              onChange={(e) => onOverrideChange({ ...overrides, bpm: parseInt(e.target.value) })}
              className="range range-primary range-xs w-full"
              aria-label="BPM"
            />
            <div className="flex justify-between text-xs text-base-content/30 mt-0.5">
              <span>40</span>
              <span className="text-base-content/40">git: {analysis.music.bpm}</span>
              <span>200</span>
            </div>
          </div>

          {/* Scale */}
          <div>
            <label className="text-xs text-base-content/50 block mb-2">Scale</label>
            <div className="flex flex-wrap gap-1.5">
              {SCALES.map((s) => (
                <button
                  key={s}
                  className={`btn btn-xs capitalize ${
                    effectiveScale === s ? "btn-primary" : "btn-ghost border border-base-300"
                  }`}
                  onClick={() => onOverrideChange({ ...overrides, scale: s })}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reverb */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs text-base-content/50">Reverb</label>
              <span className="font-mono text-sm font-semibold text-primary">
                {Math.round(effectiveReverb * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={effectiveReverb}
              onChange={(e) =>
                onOverrideChange({ ...overrides, reverb: parseFloat(e.target.value) })
              }
              className="range range-primary range-xs w-full"
              aria-label="Reverb"
            />
            <div className="flex justify-between text-xs text-base-content/30 mt-0.5">
              <span>Dry</span>
              <span>Wet</span>
            </div>
          </div>

          {/* Voices */}
          <div>
            <label className="text-xs text-base-content/50 block mb-2">
              Voices
              <span className="ml-2 text-base-content/30">git: {analysis.music.voices}</span>
            </label>
            <div className="join">
              {[1, 2, 3, 4].map((v) => (
                <button
                  key={v}
                  className={`join-item btn btn-sm w-10 ${
                    effectiveVoices === v ? "btn-primary" : "btn-ghost border border-base-300"
                  }`}
                  onClick={() => onOverrideChange({ ...overrides, voices: v })}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs text-base-content/50">Energy</label>
              <span className="font-mono text-sm font-semibold text-primary">
                {Math.round(effectiveEnergy * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={effectiveEnergy}
              onChange={(e) =>
                onOverrideChange({ ...overrides, energy: parseFloat(e.target.value) })
              }
              className="range range-primary range-xs w-full"
              aria-label="Energy"
            />
            <div className="flex justify-between text-xs text-base-content/30 mt-0.5">
              <span>Calm</span>
              <span className="text-base-content/40">
                git: {Math.round(analysis.music.energy * 100)}%
              </span>
              <span>Intense</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
