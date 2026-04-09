interface PlaybackControlsProps {
  isPlaying: boolean;
  isDisabled: boolean;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (v: number) => void;
}

export function PlaybackControls({
  isPlaying,
  isDisabled,
  volume,
  onPlayPause,
  onVolumeChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <button
        className="btn btn-primary btn-circle w-16 h-16 text-2xl shadow-lg"
        onClick={onPlayPause}
        disabled={isDisabled}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <div className="flex items-center gap-3 w-48">
        <span className="text-base-content/60 text-sm" aria-hidden="true">
          {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="range range-primary range-sm flex-1"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
