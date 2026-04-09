import type { Commit, Analysis, MusicOverrides } from "@/types";

export interface RepoSlice {
  commits: Commit[];
  analysis: Analysis | null;
  overrides: MusicOverrides;
  urlError: string | null;
  isLoading: boolean;
  loadError: string | null;
  setCommits: (commits: Commit[]) => void;
  setAnalysis: (analysis: Analysis) => void;
  setOverrides: (overrides: MusicOverrides) => void;
  resetOverrides: () => void;
  setUrlError: (msg: string | null) => void;
  setIsLoading: (val: boolean) => void;
  setLoadError: (msg: string | null) => void;
}

export function createRepoSlice(
  set: (fn: (state: RepoSlice) => Partial<RepoSlice>) => void,
): RepoSlice {
  return {
    commits: [],
    analysis: null,
    overrides: {},
    urlError: null,
    isLoading: false,
    loadError: null,
    setCommits: (commits) => set(() => ({ commits })),
    setAnalysis: (analysis) => set(() => ({ analysis })),
    setOverrides: (overrides) => set(() => ({ overrides })),
    resetOverrides: () => set(() => ({ overrides: {} })),
    setUrlError: (msg) => set(() => ({ urlError: msg })),
    setIsLoading: (val) => set(() => ({ isLoading: val })),
    setLoadError: (msg) => set(() => ({ loadError: msg })),
  };
}
