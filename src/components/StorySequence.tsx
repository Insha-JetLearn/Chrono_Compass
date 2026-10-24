import React from 'react';
import { ChamberInfo } from '../types/game';
import { audioSystem } from '../utils/audioSystem';
import { Compass, Sparkles, ArrowRight, X } from 'lucide-react';

interface StorySequenceProps {
  chamber: ChamberInfo;
  onStartChamber: () => void;
  onBackToMap: () => void;
}

export const StorySequence: React.FC<StorySequenceProps> = ({
  chamber,
  onStartChamber,
  onBackToMap
}) => {
  return (
    <div className="relative min-h-[calc(100vh-60px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Cinematic Background Image with dark vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/pyramid_chamber_hall_1792857284347.jpg"
          alt="Ancient Pyramid Hall"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 filter brightness-40 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/60" />
      </div>

      {/* Main Narrative Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-stone-900/90 border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl shadow-amber-950/60 backdrop-blur-md space-y-6 animate-fadeIn">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-cinzel text-xs font-bold text-amber-300">
              0{chamber.id}
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-cinzel font-semibold">
              Chamber Expedition
            </span>
          </div>

          <button
            onClick={() => {
              audioSystem.playTap();
              onBackToMap();
            }}
            aria-label="Back to Chamber Map"
            className="p-1.5 text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chamber Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-100 tracking-wide">
            {chamber.title}
          </h1>
          <p className="text-sm font-medium text-amber-300/80 italic">
            "{chamber.subtitle}"
          </p>
        </div>

        {/* Narrative Prose */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/60 border border-amber-700/20 text-stone-200 text-sm md:text-base leading-relaxed space-y-3">
          <p>{chamber.storyIntro}</p>
          <div className="pt-2 border-t border-stone-800/80 flex items-start gap-3">
            <span className="text-lg">🧭</span>
            <div>
              <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-wider block">
                Expedition Objective
              </span>
              <span className="text-xs sm:text-sm text-stone-300">
                {chamber.objective}
              </span>
            </div>
          </div>
        </div>

        {/* Special Rules Warning */}
        {chamber.trapWarning && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5">
            <span className="text-base">⚠️</span>
            <div>
              <span className="font-bold text-red-300 uppercase block font-cinzel text-[11px]">
                Ancient Ward Warning
              </span>
              <span>{chamber.trapWarning}</span>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onBackToMap();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            Chamber Map
          </button>

          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onStartChamber();
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wider shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>Begin Chamber Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
