export type ChamberId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type ChamberDifficulty = 
  | 'Beginner' 
  | 'Easy' 
  | 'Easy to Medium' 
  | 'Medium' 
  | 'Medium to Hard' 
  | 'Hard' 
  | 'Expert';

export interface Artifact {
  id: string;
  name: string;
  chamberUnlockedAt: ChamberId;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  description: string;
  lore: string;
  iconName: string;
}

export interface ChamberInfo {
  id: ChamberId;
  title: string;
  subtitle: string;
  difficulty: ChamberDifficulty;
  cluesCount: number;
  objective: string;
  storyIntro: string;
  storyRevealed: string;
  rewardCoins: number;
  artifactId?: string;
  hasSpecialXRule?: boolean;
  hasTrapBomb?: boolean;
  trapWarning?: string;
  themeColor: string;
  accentColor: string;
}

export interface SudokuCellData {
  row: number;
  col: number;
  value: number | null;
  initial: boolean;
  notes: number[];
  isTrap?: boolean;
  hasConflict?: boolean;
}

export interface HintExplanation {
  row: number;
  col: number;
  value: number;
  technique: string;
  reason: string;
}

export interface AudioSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  volume: number;
}

export interface GameProgress {
  currentChamber: ChamberId;
  unlockedChambers: ChamberId[];
  completedChambers: ChamberId[];
  coins: number;
  collectedArtifacts: string[];
  tutorialCompleted: boolean;
  prologueSeen?: boolean;
  settings: AudioSettings;
  animationsEnabled: boolean;
  chamberMistakes: Record<number, number>;
  chamberBestTimes: Record<number, number>; // in seconds
}

export type ScreenView = 
  | 'MAIN_MENU'
  | 'CHAMBER_MAP'
  | 'GAMEPLAY'
  | 'STORY_INTRO'
  | 'JOURNAL'
  | 'REWARDS'
  | 'COLLECTION'
  | 'SETTINGS'
  | 'VICTORY';

