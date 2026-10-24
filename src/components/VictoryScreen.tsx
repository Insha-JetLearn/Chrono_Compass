import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameProgress } from '../types/game';
import { audioSystem } from '../utils/audioSystem';
import { Compass, Award, Sparkles, RotateCcw, MapPin } from 'lucide-react';

interface VictoryScreenProps {
  progress: GameProgress;
  onGoToMap: () => void;
  onViewRelics: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  progress,
  onGoToMap,
  onViewRelics
}) => {
  useEffect(() => {
    audioSystem.playVictory();
    try {
      const end = Date.now() + 3 * 1000;
      const interval: NodeJS.Timeout = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ['#f59e0b', '#38bdf8', '#fbbf24', '#ffffff']
        });
      }, 350);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image with dark vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/chrono_compass_title_bg_1792857283736.jpg"
          alt="Pyramid Sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 filter brightness-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-stone-950/70" />
      </div>

      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-stone-900/90 border-2 border-amber-400/80 p-6 sm:p-10 space-y-7 shadow-2xl shadow-amber-950/90 backdrop-blur-md text-center animate-fadeIn">
        
        {/* Animated Chrono Compass Artifact */}
        <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl shadow-cyan-400/40 ring-4 ring-amber-500/30">
          <img
            src="/src/assets/images/chrono_compass_artifact_1792857284437.jpg"
            alt="Revived Chrono Compass"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover animate-spin"
            style={{ animationDuration: '40s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-amber-500/20 pointer-events-none" />
        </div>

        {/* Victory Inscriptions */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-cinzel font-bold tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            EXPEDITION COMPLETE
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-100 tracking-wide">
            The Chrono Compass Awakens!
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
            By solving the sacred puzzles across all nine chambers, you have restored mathematical harmony to the Great Pyramid. The ancient gears of time turn once again!
          </p>
        </div>

        {/* Stat Highlights */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-950/80 border border-amber-700/30">
          <div className="space-y-1">
            <span className="text-xl">🏛️</span>
            <span className="font-cinzel font-bold text-lg text-amber-300 block">9 / 9</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Chambers Cleared</span>
          </div>

          <div className="space-y-1">
            <span className="text-xl">👑</span>
            <span className="font-cinzel font-bold text-lg text-cyan-300 block">
              {progress.collectedArtifacts.length} / 6
            </span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Relics Unsealed</span>
          </div>

          <div className="space-y-1">
            <span className="text-xl">🪙</span>
            <span className="font-cinzel font-bold text-lg text-yellow-300 block">
              {progress.coins}
            </span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Total Gold</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onViewRelics();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold cursor-pointer"
          >
            Admire Relics
          </button>

          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onGoToMap();
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wider shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <MapPin className="w-4 h-4" />
            <span>Revisit Any Chamber</span>
          </button>
        </div>
      </div>
    </div>
  );
};
