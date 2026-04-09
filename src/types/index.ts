export type ColorTheme = "light" | "dark" | "system";

export type Scale = "major" | "minor" | "dorian" | "phrygian" | "diminished" | "pentatonic";

export interface MusicOverrides {
  bpm?: number; // 40–200
  scale?: Scale;
  reverb?: number; // 0–1
  voices?: number; // 1–4
  energy?: number; // 0–1
}

export interface Commit {
  sha: string;
  shortSha: string;
  message: string;
  subject: string;
  body: string;
  author: {
    name: string;
    login: string | null;
    avatar: string | null;
  };
  date: Date;
  hour: number;
  dayOfWeek: number;
  timestamp: number;
  stats: { additions: number; deletions: number; total: number } | null;
}

export interface MusicParams {
  bpm: number;
  voices: number;
  scale: Scale;
  complexity: number;
  energy: number;
}

export interface Analysis {
  totalCommits: number;
  authors: string[];
  authorCount: number;
  peakHour: number;
  avgMsgLen: number;
  fixRatio: number;
  featRatio: number;
  refactorRatio: number;
  commitsPerDay: number;
  daySpan: number;
  hashSeed: number;
  music: MusicParams;
  bpmReason: string;
  scaleReason: string;
  energyReason: string;
}

export interface Settings {
  githubToken: string;
  colorTheme: ColorTheme;
  volume: number;
}

export interface PopularRepo {
  owner: string;
  repo: string;
  desc: string;
  stars: string;
  lang: string;
}

export interface RateLimitStatus {
  remaining: number | null;
  reset: number | null;
}
