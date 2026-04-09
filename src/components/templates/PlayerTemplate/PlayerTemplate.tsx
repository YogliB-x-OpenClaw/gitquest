import type { Analysis, Commit, MusicOverrides } from "@/types";
import { PlayerHeader } from "@/components/organisms/PlayerHeader/PlayerHeader";
import { WaveformViz } from "@/components/organisms/WaveformViz/WaveformViz";
import { PlaybackControls } from "@/components/organisms/PlaybackControls/PlaybackControls";
import { FromYourCodePanel } from "@/components/organisms/FromYourCodePanel/FromYourCodePanel";
import { TuneMusicPanel } from "@/components/organisms/TuneMusicPanel/TuneMusicPanel";
import { CommitFeed } from "@/components/organisms/CommitFeed/CommitFeed";

interface PlayerTemplateProps {
  owner: string;
  repo: string;
  analysis: Analysis;
  commits: Commit[];
  isPlaying: boolean;
  volume: number;
  overrides: MusicOverrides;
  onPlayPause: () => void;
  onVolumeChange: (v: number) => void;
  onOverrideChange: (overrides: MusicOverrides) => void;
  onResetOverrides: () => void;
  onBack: () => void;
}

export function PlayerTemplate({
  owner,
  repo,
  analysis,
  commits,
  isPlaying,
  volume,
  overrides,
  onPlayPause,
  onVolumeChange,
  onOverrideChange,
  onResetOverrides,
  onBack,
}: PlayerTemplateProps) {
  const effectiveBpm = overrides.bpm ?? analysis.music.bpm;

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <PlayerHeader owner={owner} repo={repo} commitCount={analysis.totalCommits} onBack={onBack} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Visualizer + Controls */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-4 gap-0">
            <WaveformViz analysis={analysis} isPlaying={isPlaying} effectiveBpm={effectiveBpm} />
            <PlaybackControls
              isPlaying={isPlaying}
              isDisabled={false}
              volume={volume}
              onPlayPause={onPlayPause}
              onVolumeChange={onVolumeChange}
            />
          </div>
        </div>

        {/* Two-panel row */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4">
          <FromYourCodePanel analysis={analysis} />
          <TuneMusicPanel
            analysis={analysis}
            overrides={overrides}
            onOverrideChange={onOverrideChange}
            onReset={onResetOverrides}
          />
        </div>

        {/* Commit feed */}
        <CommitFeed commits={commits} />
      </main>
    </div>
  );
}
