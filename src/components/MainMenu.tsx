import React from 'react';
import { GameProgress } from '../types/game';
import { audioSystem } from '../utils/audioSystem';
import { Compass, Play, BookOpen, Settings, Award, Map, Sparkles } from 'lucide-react';

interface MainMenuProps {
  progress: GameProgress;
  onBeginExpedition: () => void;
  onContinueExpedition: () => void;
  onOpenMap: () => void;
  onOpenRelics: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onBeginExpedition,
  onContinueExpedition,
  onOpenMap,
  onOpenRelics,
  onOpenRules,
  onOpenSettings
}) => {
  const hasSavedProgress = progress.completedChambers.length > 0 || progress.unlockedChambers.length > 1;

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image with dark atmospheric gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/chrono_compass_title_bg_1792857283736.jpg"
          alt="Pyramid Interior lit with blue crystal torches"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 filter brightness-45 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/50" />
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-fadeIn">
        
        {/* Animated Chrono Compass Artifact Emblem */}
        <div className="relative group cursor-pointer" onClick={() => audioSystem.playHint()}>
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-tr from-amber-500 via-amber-300 to-cyan-400 shadow-2xl shadow-amber-500/30">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-stone-900 bg-stone-950 shadow-inner">
              <img
                src="/src/assets/images/chrono_compass_artifact_1792857284437.jpg"
                alt="Chrono Compass"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover animate-spin group-hover:scale-105 transition-transform"
                style={{ animationDuration: '60s' }}
              />
            </div>
          </div>
          {/* Subtle celestial sparkle badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-stone-950 border border-amber-500/50 text-[10px] font-cinzel text-amber-300 tracking-widest uppercase shadow-md">
            Sacred Astrolabe
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-2 max-w-xl">
          <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-cinzel font-bold">
            An Ancient Egyptian Mathematical Odyssey
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-black text-amber-100 tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            CHRONO COMPASS
          </h1>
          <p className="font-cinzel text-sm sm:text-base md:text-lg font-bold text-amber-400/90 tracking-widest">
            SECRETS OF THE PYRAMID
          </p>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-2">
            Enter the sacred pyramid, solve the ancient Sudoku matrix in each chamber, recover legendary relics, and unlock the celestial power of time.
          </p>
        </div>

        {/* Navigation / Action Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3 pt-2">
          {/* Begin or Continue */}
          {hasSavedProgress ? (
            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onContinueExpedition();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-cinzel font-extrabold text-sm sm:text-base tracking-widest shadow-xl shadow-amber-900/40 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>CONTINUE JOURNEY</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onBeginExpedition();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-cinzel font-extrabold text-sm sm:text-base tracking-widest shadow-xl shadow-amber-900/40 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>BEGIN EXPEDITION</span>
            </button>
          )}

          {/* Chamber Map & Relics secondary row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onOpenMap();
              }}
              className="py-2.5 px-4 rounded-xl border border-amber-600/40 bg-stone-900/80 hover:bg-stone-800 text-amber-200 text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Map className="w-4 h-4 text-amber-400" />
              <span>Chambers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onOpenRelics();
              }}
              className="py-2.5 px-4 rounded-xl border border-amber-600/40 bg-stone-900/80 hover:bg-stone-800 text-amber-200 text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Relics ({progress.collectedArtifacts.length}/6)</span>
            </button>
          </div>

          {/* How to play & Settings */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onOpenRules();
              }}
              className="py-2 px-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
              <span>How to Play</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onOpenSettings();
              }}
              className="py-2 px-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-stone-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Small Progress Tag */}
        {hasSavedProgress && (
          <div className="text-[11px] text-amber-400/80 font-cinzel">
            Current Position: Chamber 0{progress.currentChamber} · {progress.coins} Gold Coins
          </div>
        )}
      </div>
    </div>
  );
};
