import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, Check, Compass } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface InteractiveTutorialProps {
  onFinish: () => void;
  onSkip: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: 'Welcome, Explorer!',
    icon: '🧭',
    description: 'You have entered the Great Pyramid of Chronos. The magical Chrono Compass has lost its power across centuries of slumber. Your quest is to solve the sacred mathematical puzzles within nine hidden chambers to restore time itself!'
  },
  {
    title: 'The Sacred Law of Nine',
    icon: '📜',
    description: 'The ancient matrix is a 9×9 grid divided into nine 3×3 stone chambers. Every single row, column, and 3×3 chamber must contain the digits 1 through 9 with no duplicates allowed anywhere!'
  },
  {
    title: 'Inscribing Numbers',
    icon: '✍️',
    description: 'Click or tap any empty cell on the board, then use the keypad below or press keys 1–9 on your keyboard. Carved numbers with dots are permanent clues; numbers you inscribe glow in vibrant turquoise.'
  },
  {
    title: 'Scribe Candidate Notes',
    icon: '📝',
    description: 'Uncertain about a cell? Turn Notes ON to write small pencil candidates in the cell. You can mark multiple possibilities and eliminate them as you decipher surrounding rows and columns.'
  },
  {
    title: 'Sacred Hints & Wards',
    icon: '𓂀',
    description: 'If you are ever puzzled, call upon Nuru for a Sacred Hint! Nuru will explain the logical deduction. But take heed: repeated mistakes shatter protective wards, and hints are limited.'
  },
  {
    title: 'Relics & Expedition Glory',
    icon: '👑',
    description: 'Conquering each chamber earns ancient gold coins and unseals legendary Egyptian relics like the Golden Scarab and the Eye of Horus. Master all nine chambers to become the Master of Time!'
  }
];

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  onFinish,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    audioSystem.playTap();
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    audioSystem.playTap();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-stone-900 border-2 border-amber-500/60 p-6 sm:p-8 space-y-6 shadow-2xl shadow-amber-950/80">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-widest">
              Expedition Primer
            </span>
            <span className="text-xs text-stone-400 font-mono">
              ({currentStep + 1} / {TUTORIAL_STEPS.length})
            </span>
          </div>

          <button
            onClick={() => {
              audioSystem.playTap();
              onSkip();
            }}
            className="text-xs text-stone-400 hover:text-amber-200 transition-colors uppercase tracking-wider font-semibold cursor-pointer"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Content Body */}
        <div className="text-center space-y-4 py-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
            {step.icon}
          </div>

          <div className="space-y-2">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100">
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md mx-auto">
              {step.description}
            </p>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep
                  ? 'w-6 bg-amber-400'
                  : i < currentStep
                  ? 'w-2 bg-amber-600/60'
                  : 'w-2 bg-stone-700'
              }`}
            />
          ))}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wider shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>{currentStep === TUTORIAL_STEPS.length - 1 ? 'Begin Expedition' : 'Next Step'}</span>
            {currentStep === TUTORIAL_STEPS.length - 1 ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
