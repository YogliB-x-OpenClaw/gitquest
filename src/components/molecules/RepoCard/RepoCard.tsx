import type { PopularRepo } from "@/types";

interface RepoCardProps {
  repo: PopularRepo;
  onSelect: (owner: string, repo: string) => void;
}

export function RepoCard({ repo, onSelect }: RepoCardProps) {
  return (
    <div
      className="card card-bordered bg-base-200 border-base-300 hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
      onClick={() => onSelect(repo.owner, repo.repo)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(repo.owner, repo.repo);
      }}
    >
      <div className="card-body p-3 gap-1">
        <div className="font-semibold text-primary text-sm leading-tight">{repo.repo}</div>
        <div className="text-base-content/40 text-xs">{repo.owner}</div>
        <div className="text-base-content/60 text-xs line-clamp-2 mt-0.5 leading-snug">
          {repo.desc}
        </div>
        <div className="flex gap-2 text-xs text-base-content/35 mt-1.5">
          <span>⭐ {repo.stars}</span>
          <span>{repo.lang}</span>
        </div>
      </div>
    </div>
  );
}
