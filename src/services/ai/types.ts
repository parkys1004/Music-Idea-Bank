export interface MusicIdea {
  title: string;
  lyrics: string;
  stylePrompt: string;
  genre?: string;
}

export interface IdeaMetadata {
  title: string;
  stylePrompt: string;
}

export interface LanguageConfig {
  main: string;
  sub: string;
  mainPercent: number;
}
