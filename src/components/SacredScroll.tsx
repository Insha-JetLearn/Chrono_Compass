import React, { useState } from 'react';
import { Sparkles, RotateCcw, CheckCircle2, Eye, HelpCircle, ShieldAlert } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';
import { HintExplanation } from '../types/game';

interface SacredScrollProps {
  onCheckAnswer: () => void;
  onResetPuzzle: () => void;
  onRequestHint: () => void;
  onOpenRules: () => void;
  remainingHints: number;
  mistakes: number;
  maxMistakes: number;
  activeHint: HintExplanation | null;
  onDismissHint: () => void;
  disabled?: boolean;
}

export const SacredScroll: React.FC<SacredScrollProps> = ({
  onCheckAnswer,
  onResetPuzzle,
  onRequestHint,
  onOpenRules,
  remainingHints,
  mistakes,
  maxMistakes,
  activeHint,
  onDismissHint,
  disabled = false
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="w-full max-w-[460px] mx-auto rounded-2xl bg-stone-900/90 border border-amber-600/30 p-3 sm:p-4 space-y-3 shadow-xl backdrop-blur-md">
      {/* Header Bar: Mistakes & Hints Indicators */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium pb-2 border-b border-stone-800">
        {/* Mistakes Counter */}
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400 font-cinzel text-xs uppercase tracking-wider">Wards:</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: maxMistakes }).map((_, i) => (
              <span
                key={i}
                title={i < mistakes ? 'Broken Ward' : 'Intact Ward'}
                className={`text-sm transition-all ${
                  i < mistakes ? 'text-red-500 scale-110 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]' : 'text-stone-600'
                }`}
              >
                𓂀
              </span>
            ))}
          </div>
          <span className="text-xs font-mono text-stone-400 ml-1">
            ({mistakes}/{maxMistakes})
          </span>
        </div>

        {/* Sacred Hints Counter */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-stone-400 font-cinzel text-xs uppercase tracking-wider">Sacred Hints:</span>
          <span className="text-cyan-300 font-mono font-bold">{remainingHints}</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Check Answer */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            audioSystem.playTap();
            onCheckAnswer();
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 hover:border-amber-400 font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>Verify</span>
        </button>

        {/* Request Hint */}
        <button
          type="button"
          disabled={disabled || remainingHints <= 0}
          onClick={() => {
            if (remainingHints > 0) {
              audioSystem.playHint();
              onRequestHint();
            }
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl border font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${
            remainingHints > 0
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 shadow-sm'
              : 'bg-stone-900/50 border-stone-800 text-stone-500 cursor-not-allowed opacity-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Hint</span>
        </button>

        {/* Reset Puzzle */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            audioSystem.playTap();
            setShowResetConfirm(true);
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-700/50 font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Active Hint Dialog Banner */}
      {activeHint && (
        <div className="rounded-xl bg-cyan-950/50 border border-cyan-500/40 p-3 text-xs space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-cinzel font-bold text-cyan-300 tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {activeHint.technique}
            </span>
            <button
              onClick={onDismissHint}
              className="text-stone-400 hover:text-cyan-200 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-cyan-100/90 leading-relaxed font-normal">
            {activeHint.reason}
          </p>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-stone-900 border-2 border-amber-600/50 p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-cinzel text-lg font-bold text-amber-200">Reset Chamber Grid?</h3>
              <p className="text-xs text-stone-300">
                This will clear all numbers you have inscribed in this chamber and restore the starting stone clues. Your overall expedition progress and coins will not be affected.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold cursor-pointer"
              >
                Keep Playing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetPuzzle();
                }}
                className="px-4 py-2 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 hover:bg-red-800/70 text-xs font-semibold cursor-pointer"
              >
                Yes, Reset Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
