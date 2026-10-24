import React from 'react';
import { ChamberInfo, ChamberId, GameProgress } from '../types/game';
import { CHAMBERS } from '../data/chambers';
import { SACRED_ARTIFACTS } from '../data/artifacts';
import { Lock, CheckCircle, Play, Sparkles, AlertTriangle, Compass } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface ChamberMapProps {
  progress: GameProgress;
  onSelectChamber: (chamberId: ChamberId) => void;
  onBackToMenu: () => void;
}

export const ChamberMap: React.FC<ChamberMapProps> = ({
  progress,
  onSelectChamber,
  onBackToMenu
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-fadeIn">
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-semibold tracking-wider">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          PYRAMID EXPEDITION MAP
        </div>
        <h1 className="font-cinzel text-2xl md:text-4xl font-extrabold text-amber-100 tracking-wide">
          Chambers of Eternity
        </h1>
        <p className="text-stone-300 text-xs md:text-sm max-w-xl mx-auto">
          Traverse the nine sanctums of the ancient pyramid. Restore mathematical balance to awaken the lost Chrono Compass.
        </p>
      </div>

      {/* 9 Chambers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHAMBERS.map((chamber) => {
          const isUnlocked = progress.unlockedChambers.includes(chamber.id);
          const isCompleted = progress.completedChambers.includes(chamber.id);
          const isCurrent = progress.currentChamber === chamber.id;
          const artifact = chamber.artifactId ? SACRED_ARTIFACTS[chamber.artifactId] : null;

          return (
            <div
              key={chamber.id}
              className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                isCompleted
                  ? 'bg-stone-900/80 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : isCurrent
                  ? 'bg-stone-900/90 border-amber-400/80 ring-2 ring-amber-400/30 shadow-xl shadow-amber-950/30'
                  : isUnlocked
                  ? 'bg-stone-900/60 border-amber-600/30 hover:border-amber-500/60'
                  : 'bg-stone-950/60 border-stone-800 opacity-65 cursor-not-allowed'
              }`}
            >
              {/* Top Row: Index, Status Badge, Difficulty */}
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-stone-950 border border-amber-500/30 flex items-center justify-center font-cinzel text-xs font-bold text-amber-300">
                      0{chamber.id}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wider text-amber-400/90 font-cinzel">
                      {chamber.difficulty}
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1 text-xs text-amber-300 font-medium animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Active Trial
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-xs text-stone-400">Unlocked</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-stone-500">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                {/* Chamber Title & Subtitle */}
                <div className="mt-3 space-y-1">
                  <h2 className="font-cinzel text-lg font-bold text-stone-100 group-hover:text-amber-200">
                    {chamber.title}
                  </h2>
                  <p className="text-xs text-amber-400/70 italic">
                    {chamber.subtitle}
                  </p>
                  <p className="text-xs text-stone-300 line-clamp-2 mt-2 leading-relaxed">
                    {chamber.objective}
                  </p>
                </div>

                {/* Special Chamber Rules Indicators */}
                {chamber.hasSpecialXRule && (
                  <div className="mt-2 text-[11px] text-indigo-300/90 flex items-center gap-1 font-medium">
                    <span>✦ Stargazer Diagonals Special Trial</span>
                  </div>
                )}
                {chamber.hasTrapBomb && (
                  <div className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Cursed Tomb Ward Concealed</span>
                  </div>
                )}

                {/* Rewards Indicator */}
                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1 text-amber-300">
                    🪙 +{chamber.rewardCoins} coins
                  </span>
                  {artifact && (
                    <span className="text-[11px] text-cyan-300 font-medium">
                      Relic: {artifact.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5">
                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      audioSystem.playTap();
                      onSelectChamber(chamber.id);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 hover:from-amber-300 hover:to-amber-400 shadow-md font-bold'
                        : isCompleted
                        ? 'bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-amber-200'
                        : 'bg-amber-950/40 border border-amber-600/40 text-amber-200 hover:bg-amber-900/50'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'Replay Chamber' : isCurrent ? 'Continue Trial' : 'Enter Chamber'}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-stone-500 bg-stone-950/60 border border-stone-900 flex items-center justify-center gap-2 select-none">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Complete Chamber {chamber.id - 1} to Unlock</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to Main Menu */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => {
            audioSystem.playTap();
            onBackToMenu();
          }}
          className="text-xs font-cinzel text-stone-400 hover:text-amber-300 transition-colors uppercase tracking-widest cursor-pointer"
        >
          ← Return to Main Entrance
        </button>
      </div>
    </div>
  );
};
