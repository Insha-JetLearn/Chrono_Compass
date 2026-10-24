import { GameProgress, ChamberId } from '../types/game';

const STORAGE_KEY = 'chrono_compass_save_v1';

const DEFAULT_PROGRESS: GameProgress = {
  currentChamber: 1,
  unlockedChambers: [1],
  completedChambers: [],
  coins: 50,
  collectedArtifacts: [],
  tutorialCompleted: false,
  settings: {
    musicEnabled: true,
    sfxEnabled: true,
    volume: 0.7
  },
  animationsEnabled: true,
  chamberMistakes: {},
  chamberBestTimes: {}
};

export function loadGameProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };

    const parsed = JSON.parse(raw);
    return {
      currentChamber: (parsed.currentChamber >= 1 && parsed.currentChamber <= 9 ? parsed.currentChamber : 1) as ChamberId,
      unlockedChambers: Array.isArray(parsed.unlockedChambers) && parsed.unlockedChambers.length > 0
        ? parsed.unlockedChambers
        : [1],
      completedChambers: Array.isArray(parsed.completedChambers) ? parsed.completedChambers : [],
      coins: typeof parsed.coins === 'number' && !isNaN(parsed.coins) ? Math.max(0, parsed.coins) : 50,
      collectedArtifacts: Array.isArray(parsed.collectedArtifacts) ? parsed.collectedArtifacts : [],
      tutorialCompleted: Boolean(parsed.tutorialCompleted),
      settings: {
        musicEnabled: parsed.settings?.musicEnabled ?? true,
        sfxEnabled: parsed.settings?.sfxEnabled ?? true,
        volume: typeof parsed.settings?.volume === 'number' ? parsed.settings.volume : 0.7
      },
      animationsEnabled: parsed.animationsEnabled ?? true,
      chamberMistakes: parsed.chamberMistakes || {},
      chamberBestTimes: parsed.chamberBestTimes || {}
    };
  } catch (err) {
    console.warn('Failed to parse saved game progress, using default:', err);
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveGameProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save game progress to localStorage:', err);
  }
}

export function resetGameProgress(): GameProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return { ...DEFAULT_PROGRESS };
}
