import { POPULAR_REPOS } from "@/lib/github";
import { RepoCard } from "@/components/molecules";

interface PopularReposGridProps {
  onSelect: (owner: string, repo: string) => void;
}

export function PopularReposGrid({ onSelect }: PopularReposGridProps) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
        Popular Repositories
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {POPULAR_REPOS.map((repo) => (
          <RepoCard key={`${repo.owner}/${repo.repo}`} repo={repo} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
