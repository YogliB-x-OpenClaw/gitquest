import type { Analysis } from "@/types";

interface FromYourCodePanelProps {
  analysis: Analysis;
}

export function FromYourCodePanel({ analysis }: FromYourCodePanelProps) {
  const displayedAuthors = analysis.authors.slice(0, 3).join(", ");
  const extraAuthors = analysis.authorCount > 3 ? ` +${analysis.authorCount - 3} more` : "";

  return (
    <div className="card bg-base-200 border border-base-300 h-full">
      <div className="card-body p-5 gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
          From Your Code
        </h2>

        <dl className="flex flex-col gap-3">
          <div>
            <dt className="text-xs text-base-content/50 mb-0.5">BPM</dt>
            <dd className="font-mono font-semibold text-primary text-lg leading-none">
              {analysis.music.bpm}
            </dd>
            <dd className="text-xs text-base-content/40 mt-1">{analysis.bpmReason}</dd>
          </div>

          <div>
            <dt className="text-xs text-base-content/50 mb-0.5">Scale</dt>
            <dd className="font-mono font-semibold text-secondary capitalize leading-none">
              {analysis.music.scale}
            </dd>
            <dd className="text-xs text-base-content/40 mt-1">{analysis.scaleReason}</dd>
          </div>

          <div>
            <dt className="text-xs text-base-content/50 mb-0.5">Energy</dt>
            <dd className="font-mono font-semibold text-accent leading-none">
              {Math.round(analysis.music.energy * 100)}%
            </dd>
            <dd className="text-xs text-base-content/40 mt-1">{analysis.energyReason}</dd>
          </div>

          <div>
            <dt className="text-xs text-base-content/50 mb-0.5">Voices</dt>
            <dd className="font-mono font-semibold leading-none">{analysis.music.voices}</dd>
            <dd className="text-xs text-base-content/40 mt-1">
              {analysis.authorCount} contributor{analysis.authorCount !== 1 ? "s" : ""}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-base-content/50 mb-0.5">Contributors</dt>
            <dd className="text-sm font-medium leading-snug">
              {displayedAuthors}
              {extraAuthors && <span className="text-base-content/40 text-xs">{extraAuthors}</span>}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
