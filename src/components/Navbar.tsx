import React from 'react';
import { ScreenView, GameProgress } from '../types/game';
import { Compass, Volume2, VolumeX } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface NavbarProps {
  currentView: ScreenView;
  setView: (view: ScreenView) => void;
  progress: GameProgress;
  onUpdateSettings: (music: boolean, sfx: boolean, vol: number) => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  progress,
  onUpdateSettings,
  onOpenRules,
  onOpenSettings
}) => {
  const isMuted = !progress.settings.musicEnabled && !progress.settings.sfxEnabled;

  const toggleSound = () => {
    audioSystem.playTap();
    if (isMuted) {
      onUpdateSettings(true, true, progress.settings.volume || 0.7);
    } else {
      onUpdateSettings(false, false, progress.settings.volume || 0.7);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 backdrop-blur-md border-b border-amber-900/30 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand title, single element */}
        <button
          onClick={() => {
            audioSystem.playTap();
            setView('MAIN_MENU');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-400 transition-colors">
            <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
          </div>
          <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider text-amber-200 group-hover:text-amber-100 whitespace-nowrap">
            CHRONO COMPASS
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={() => {
              audioSystem.playTap();
              setView('CHAMBER_MAP');
            }}
            className={`transition-colors whitespace-nowrap hover:text-amber-300 cursor-pointer ${
              currentView === 'CHAMBER_MAP' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Chambers
          </button>
          <button
            onClick={() => {
              audioSystem.playTap();
              setView('COLLECTION');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-amber-300 cursor-pointer ${
              currentView === 'COLLECTION' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <span>Relics</span>
            <span className="text-xs text-amber-400/80">({progress.collectedArtifacts.length}/6)</span>
          </button>
          <button
            onClick={() => {
              audioSystem.playTap();
              onOpenRules();
            }}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-amber-300 cursor-pointer"
          >
            <span>Sacred Rules</span>
          </button>
          <button
            onClick={() => {
              audioSystem.playTap();
              onOpenSettings();
            }}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-amber-300 cursor-pointer"
          >
            <span>Settings</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Coin HUD */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Coin Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-300 text-sm font-semibold tabular-nums shadow-inner">
            <span className="text-amber-400 text-xs font-cinzel">🪙</span>
            <span>{progress.coins}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-700/50 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Quick Expedition Button when in secondary view */}
          {currentView !== 'GAMEPLAY' ? (
            <button
              onClick={() => {
                audioSystem.playTap();
                setView('GAMEPLAY');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              Play
            </button>
          ) : (
            <button
              onClick={() => {
                audioSystem.playTap();
                setView('CHAMBER_MAP');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/50 border border-amber-600/40 hover:bg-amber-900/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Chambers
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
