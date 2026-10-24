import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ChamberInfo, Artifact } from '../types/game';
import { audioSystem } from '../utils/audioSystem';
import { Award, Sparkles, ArrowRight, BookOpen, CheckCircle2, Scroll } from 'lucide-react';

interface RewardModalProps {
  chamber: ChamberInfo;
  coinsEarned: number;
  artifactUnlocked: Artifact | null;
  onProceedNext: () => void;
  onGoToMap: () => void;
  onViewCollection: () => void;
  onViewJournal?: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  chamber,
  coinsEarned,
  artifactUnlocked,
  onProceedNext,
  onGoToMap,
  onViewCollection,
  onViewJournal
}) => {
  useEffect(() => {
    // Play celebratory sound
    audioSystem.playVictory();
    if (artifactUnlocked) {
      setTimeout(() => audioSystem.playArtifact(), 600);
    }

    // Launch celebratory golden and cyan confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#e0f2fe', '#d97706']
      });
    } catch {
      // ignore
    }
  }, [artifactUnlocked]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-stone-900 border-2 border-amber-500/60 p-6 sm:p-8 space-y-5 shadow-2xl shadow-amber-950/80 text-center">
        
        {/* Victory Emblem */}
        <div className="relative mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-xl shadow-amber-500/40">
          <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5]" />
          <div className="absolute -inset-2 rounded-full border border-amber-400/40 animate-ping" style={{ animationDuration: '3s' }} />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-widest">
            Chamber Completed
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-100">
            {chamber.title} Solved!
          </h2>
        </div>

        {/* Story Revelation Papyrus Card */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-left space-y-1.5 shadow-inner">
          <div className="flex items-center gap-1.5 text-amber-400 font-cinzel text-xs font-bold uppercase tracking-wider">
            <Scroll className="w-3.5 h-3.5" />
            <span>Story Revelation Unsealed</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic">
            "{chamber.storyRevealed}"
          </p>
        </div>

        {/* Reward Box */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-950/70 border border-amber-700/30">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-950/20 border border-amber-600/20">
            <span className="text-xl">🪙</span>
            <span className="font-cinzel text-lg font-bold text-amber-300">+{coinsEarned}</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Ancient Coins</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
            <span className="text-xl">𓂀</span>
            <span className="font-cinzel text-lg font-bold text-cyan-300">Awakened</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Pyramid Resonance</span>
          </div>
        </div>

        {/* Artifact Unlocked Card */}
        {artifactUnlocked && (
          <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-stone-950/70 border border-amber-400/50 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-cinzel font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Sacred Relic Discovered!
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {artifactUnlocked.rarity}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-xl bg-stone-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-cinzel font-bold text-amber-200 text-sm">
                  {artifactUnlocked.name}
                </h4>
                <p className="text-xs text-stone-300 line-clamp-2">
                  {artifactUnlocked.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onGoToMap();
            }}
            className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold cursor-pointer"
          >
            Chamber Map
          </button>

          {onViewJournal && (
            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onViewJournal();
              }}
              className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>Read Chronicle</span>
            </button>
          )}

          {artifactUnlocked && (
            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onViewCollection();
              }}
              className="px-4 py-2 rounded-xl border border-amber-600/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 text-xs font-semibold cursor-pointer"
            >
              View Relics
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onProceedNext();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <span>Proceed Forward</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
