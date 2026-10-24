import React, { useState } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { ArrowRight, ArrowLeft, Sparkles, Compass, Check } from 'lucide-react';

interface PrologueModalProps {
  onFinish: () => void;
  onSkip: () => void;
}

const PROLOGUE_SLIDES = [
  {
    chapter: 'Prologue · Scene I',
    title: 'The Whispering Sands of Giza',
    image: '/src/assets/images/chrono_compass_title_bg_1792857283736.jpg',
    text: 'A fierce desert sandstorm has unsealed a buried colossal limestone portal untouched for over three thousand years. As an archaeologist and mathematician, you step across the threshold into the dark, echoing chambers of the lost Pyramid of Chronos.'
  },
  {
    chapter: 'Prologue · Scene II',
    title: 'The Dormant Astrolabe',
    image: '/src/assets/images/chrono_compass_artifact_1792857284437.jpg',
    text: 'At the heart of the entrance altar lies an astonishing mechanical relic: the Chrono Compass. Forged from celestial gold and deep blue lapis lazuli, its rotating concentric rings are locked in place. The ancient gears of time have fallen silent.'
  },
  {
    chapter: 'Prologue · Scene III',
    title: 'Awakening of the Guardian',
    image: '/src/assets/images/nuru_companion_avatar_1792857284368.jpg',
    text: 'As your fingers trace the astronomical glyphs, a spark of celestial turquoise light erupts! Nuru, the winged guardian spirit of the temple, materializes: "Explorer! The nine chambers ahead hold the nine mathematical keys. Inscribe the sacred matrices of numbers to reignite the Chrono Compass!"'
  }
];

export const PrologueModal: React.FC<PrologueModalProps> = ({ onFinish, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    audioSystem.playTap();
    if (currentSlide < PROLOGUE_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      audioSystem.playHint();
      onFinish();
    }
  };

  const handleBack = () => {
    audioSystem.playTap();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = PROLOGUE_SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-stone-900 border-2 border-amber-500/60 shadow-2xl shadow-amber-950/90 overflow-hidden flex flex-col">
        
        {/* Cinematic Header Image */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-950">
          <img
            src={slide.image}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-85 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

          {/* Top Bar with Skip */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-stone-950/80 border border-amber-500/40 font-cinzel text-[11px] font-bold text-amber-300 uppercase tracking-widest backdrop-blur-sm">
              {slide.chapter}
            </span>
            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                onSkip();
              }}
              className="px-3 py-1 rounded-full bg-stone-950/80 border border-stone-700 text-stone-300 hover:text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm cursor-pointer"
            >
              Skip Prologue
            </button>
          </div>
        </div>

        {/* Narrative Prose */}
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-100 tracking-wide">
            {slide.title}
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed min-h-[72px]">
            {slide.text}
          </p>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {PROLOGUE_SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentSlide
                    ? 'w-6 bg-amber-400'
                    : i < currentSlide
                    ? 'w-2 bg-amber-600/60'
                    : 'w-2 bg-stone-700'
                }`}
              />
            ))}
          </div>

          {/* Action Navigation */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-800">
            {currentSlide > 0 ? (
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
              <span>{currentSlide === PROLOGUE_SLIDES.length - 1 ? 'Enter Chamber 01' : 'Continue Tale'}</span>
              {currentSlide === PROLOGUE_SLIDES.length - 1 ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
