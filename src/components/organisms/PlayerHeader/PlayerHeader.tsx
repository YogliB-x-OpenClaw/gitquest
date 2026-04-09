import { ThemeToggle } from "@/components/organisms/ThemeToggle/ThemeToggle";

interface PlayerHeaderProps {
  owner: string;
  repo: string;
  commitCount: number | null;
  onBack: () => void;
}

export function PlayerHeader({ owner, repo, commitCount, onBack }: PlayerHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-6 py-4 border-b border-base-300 bg-base-100/80 backdrop-blur-sm sticky top-0 z-10">
      <button
        className="btn btn-ghost btn-sm gap-1 shrink-0"
        onClick={onBack}
        aria-label="Back to home"
      >
        ← Back
      </button>
      <div className="flex items-baseline gap-2 flex-1 min-w-0">
        <h1 className="font-semibold text-base-content truncate">
          {owner}/<span className="text-primary">{repo}</span>
        </h1>
        {commitCount !== null && (
          <span className="text-xs text-base-content/40 shrink-0">{commitCount} commits</span>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
