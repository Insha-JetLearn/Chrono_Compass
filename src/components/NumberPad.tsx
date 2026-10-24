import React from 'react';
import { Eraser, Edit3, Check } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface NumberPadProps {
  onNumberSelect: (num: number) => void;
  onErase: () => void;
  isNotesMode: boolean;
  onToggleNotes: () => void;
  remainingCounts: Record<number, number>;
  disabled?: boolean;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  onNumberSelect,
  onErase,
  isNotesMode,
  onToggleNotes,
  remainingCounts,
  disabled = false
}) => {
  return (
    <div className="w-full max-w-[460px] mx-auto space-y-2 select-none">
      {/* Digits 1-9 Keypad */}
      <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const remaining = remainingCounts[num] ?? 9;
          const isComplete = remaining === 0;

          return (
            <button
              key={num}
              type="button"
              disabled={disabled}
              onClick={() => {
                audioSystem.playTap();
                onNumberSelect(num);
              }}
              className={`group relative flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-xl border transition-all cursor-pointer ${
                isComplete
                  ? 'bg-stone-900/60 border-stone-800 text-stone-500 opacity-60'
                  : 'bg-stone-900/90 border-amber-600/30 text-amber-100 hover:bg-amber-950/60 hover:border-amber-400 active:scale-95 shadow-md'
              }`}
            >
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-tight">
                {num}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono leading-none mt-0.5 font-medium">
                {isComplete ? (
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                ) : (
                  <span className="text-amber-400/80">{remaining}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Auxiliary Controls: Notes Toggle & Erase */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            audioSystem.playTap();
            onToggleNotes();
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            isNotesMode
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/20 shadow-md'
              : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:text-amber-200 hover:border-stone-700'
          }`}
        >
          <Edit3 className={`w-4 h-4 ${isNotesMode ? 'text-amber-400' : 'text-stone-400'}`} />
          <span>Notes {isNotesMode ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            audioSystem.playErase();
            onErase();
          }}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-stone-800 bg-stone-900/80 text-stone-300 hover:text-red-300 hover:border-red-900/40 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
        >
          <Eraser className="w-4 h-4 text-stone-400 group-hover:text-red-300" />
          <span>Erase Cell</span>
        </button>
      </div>
    </div>
  );
};
