import React, { useEffect } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { AlertOctagon, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';

interface TrapModalProps {
  chamberTitle: string;
  coinsLost: number;
  onRetry: () => void;
}

export const TrapModal: React.FC<TrapModalProps> = ({
  chamberTitle,
  coinsLost,
  onRetry
}) => {
  useEffect(() => {
    audioSystem.playTrapWarning();
    const timer = setTimeout(() => {
      audioSystem.playTrapExplode();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-stone-900 border-2 border-red-500/80 p-6 sm:p-8 space-y-6 shadow-2xl shadow-red-950/90 text-center animate-bounce-short">
        
        {/* Warning Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-400">
          <AlertOctagon className="w-9 h-9" />
          <div className="absolute -inset-2 rounded-full border border-red-500/50 animate-ping" style={{ animationDuration: '2s' }} />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-cinzel font-bold text-red-400 uppercase tracking-widest">
            Ancient Tomb Trap Triggered!
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-extrabold text-stone-100">
            Cursed Ward Awakened
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            You struck a concealed trap glyph in the <span className="text-amber-300 font-semibold">{chamberTitle}</span>. The chamber’s defense wards have collapsed and reset the stone tablet!
          </p>
        </div>

        {/* Penalty details */}
        <div className="p-3.5 rounded-xl bg-stone-950/80 border border-red-500/30 flex items-center justify-between text-xs text-stone-300">
          <span className="flex items-center gap-1.5 text-red-400">
            <ShieldAlert className="w-4 h-4" />
            Ward Penalty:
          </span>
          <span className="font-bold text-amber-400 font-mono">
            -{coinsLost} Coins
          </span>
        </div>

        <p className="text-[11px] text-stone-400 italic">
          Your overall expedition progress, unlocked chambers, and collected relics remain completely safe.
        </p>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onRetry();
            }}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-stone-100 font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Chamber Tablet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
