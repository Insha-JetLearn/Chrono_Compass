import React, { useState } from 'react';
import { EXPEDITION_CHRONICLES, StoryChapter } from '../data/storyChronicles';
import { GameProgress } from '../types/game';
import { audioSystem } from '../utils/audioSystem';
import { BookOpen, Lock, Sparkles, ArrowLeft, Play, Scroll, CheckCircle2 } from 'lucide-react';

interface ExpeditionJournalProps {
  progress: GameProgress;
  onBack: () => void;
  onReplayPrologue: () => void;
}

export const ExpeditionJournal: React.FC<ExpeditionJournalProps> = ({
  progress,
  onBack,
  onReplayPrologue
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const activeChapter = EXPEDITION_CHRONICLES[activeChapterIndex];
  const isUnlocked = progress.unlockedChambers.includes(activeChapter.chamberId as any);
  const isCompleted = progress.completedChambers.includes(activeChapter.chamberId as any);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-fadeIn">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-900/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-semibold tracking-wider">
            <Scroll className="w-3.5 h-3.5 text-amber-400" />
            CHRONICLES OF THE SCRIBE
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-amber-100 mt-2">
            Expedition Lore & Decoded Hieroglyphs
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            As you conquer the pyramid's chambers, ancient inscriptions and royal mathematical secrets are unsealed here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onReplayPrologue();
            }}
            className="px-3.5 py-2 rounded-xl border border-amber-600/40 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Replay Prologue</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onBack();
            }}
            className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Chapter Selector & Papyrus Reading Desk */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: 9 Chapters List */}
        <div className="md:col-span-5 space-y-2">
          <span className="text-[11px] font-cinzel font-bold text-amber-400 uppercase tracking-wider block px-1">
            Pyramid Tablets (9 Chapters)
          </span>

          <div className="space-y-1.5 max-h-[540px] overflow-y-auto pr-1">
            {EXPEDITION_CHRONICLES.map((chap, idx) => {
              const chapUnlocked = progress.unlockedChambers.includes(chap.chamberId as any);
              const chapCompleted = progress.completedChambers.includes(chap.chamberId as any);
              const isSelected = activeChapterIndex === idx;

              return (
                <button
                  key={chap.chamberId}
                  type="button"
                  onClick={() => {
                    audioSystem.playTap();
                    setActiveChapterIndex(idx);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/20 text-amber-100 shadow-md'
                      : chapUnlocked
                      ? 'bg-stone-900/80 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-amber-700/40'
                      : 'bg-stone-950/50 border-stone-900 text-stone-600 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-stone-950 border border-amber-500/30 flex items-center justify-center font-cinzel text-xs font-bold text-amber-400 shrink-0">
                      0{chap.chamberId}
                    </span>
                    <div className="min-w-0">
                      <span className="font-cinzel text-xs font-bold block truncate">
                        {chap.chamberTitle}
                      </span>
                      <span className="text-[10px] text-stone-400 truncate block">
                        {chapUnlocked ? chap.chapterTitle : 'Undiscovered Chamber'}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {chapCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : chapUnlocked ? (
                      <span className="text-[10px] text-amber-400 font-cinzel uppercase font-semibold">Active</span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-stone-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Papyrus Scroll Viewer */}
        <div className="md:col-span-7">
          <div className="relative rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-600/40 p-6 sm:p-8 shadow-2xl shadow-amber-950/50 space-y-6">
            
            {/* Egyptian Hieroglyphs Cartouche Top */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
              <span className="font-cinzel text-xs font-bold text-amber-400 uppercase tracking-widest">
                Chamber 0{activeChapter.chamberId} Chronicle
              </span>
              <span className="text-sm font-cinzel text-amber-500/60 select-none">
                𓊹𓊹𓊹
              </span>
            </div>

            {isUnlocked ? (
              <div className="space-y-6 animate-fadeIn">
                {/* Title */}
                <div className="space-y-1">
                  <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-100">
                    {activeChapter.chapterTitle}
                  </h2>
                  <p className="text-xs font-cinzel text-amber-400/80">
                    Location: {activeChapter.chamberTitle}
                  </p>
                </div>

                {/* Hieroglyphic Inscription Banner */}
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium italic space-y-1">
                  <span className="text-[10px] uppercase font-cinzel font-bold text-amber-400 block tracking-wider">
                    Decoded Stone Wall Inscription
                  </span>
                  <p className="leading-relaxed font-cinzel">
                    {activeChapter.inscriptionText}
                  </p>
                </div>

                {/* Narrative Tale */}
                <div className="space-y-2">
                  <span className="text-xs font-cinzel font-bold text-stone-300 uppercase tracking-wider block">
                    Archaeologist's Field Journal
                  </span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
                    {activeChapter.narrativeText}
                  </p>
                </div>

                {/* Historical Math & Astronomy Lore Box */}
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-cinzel font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ancient Mathematics & Astronomy Insight</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {activeChapter.historicalMathLore}
                  </p>
                </div>
              </div>
            ) : (
              /* Locked State */
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-600">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="font-cinzel text-lg font-bold text-stone-300">
                    Sanctum Sealed in Stone
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    You have not yet reached Chamber 0{activeChapter.chamberId} ({activeChapter.chamberTitle}). Complete prior chambers to unseal this chapter and its mathematical secrets!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
