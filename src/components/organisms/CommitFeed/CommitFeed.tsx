import type { Commit } from "@/types";

const ICON_MAP: [RegExp, string][] = [
  [/fix|bug|patch|hotfix/i, "⚡"],
  [/feat|add|new|implement/i, "✨"],
  [/refactor|clean|improve|update/i, "♻"],
  [/docs?|readme|changelog/i, "📝"],
  [/test|spec/i, "🧪"],
  [/ci|deploy|release|build/i, "🚀"],
];

function getCommitIcon(subject: string): string {
  for (const [pattern, icon] of ICON_MAP) {
    if (pattern.test(subject)) return icon;
  }
  return "●";
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

interface CommitFeedProps {
  commits: Commit[];
}

export function CommitFeed({ commits }: CommitFeedProps) {
  return (
    <div className="card bg-base-200 border border-base-300">
      <div className="card-body p-5 gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Commit History
        </h2>
        <div className="max-h-56 overflow-y-auto flex flex-col gap-0 -mx-2">
          {commits.map((commit) => (
            <div
              key={commit.sha}
              className="flex items-center gap-3 px-2 py-2 rounded hover:bg-base-300/50 transition-colors"
            >
              <span className="text-sm w-5 text-center shrink-0" aria-hidden="true">
                {getCommitIcon(commit.subject)}
              </span>
              <span className="font-mono text-xs text-base-content/40 shrink-0 w-14">
                {commit.shortSha}
              </span>
              <span className="text-sm truncate flex-1 text-base-content/80">{commit.subject}</span>
              <span className="text-xs text-base-content/30 shrink-0 hidden sm:block">
                {relativeTime(commit.date)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
