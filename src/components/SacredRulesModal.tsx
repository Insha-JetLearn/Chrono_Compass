import React from 'react';
import { X, BookOpen, Sparkles, Check, AlertTriangle, Compass } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface SacredRulesModalProps {
  onClose: () => void;
}

export const SacredRulesModal: React.FC<SacredRulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-stone-900 border-2 border-amber-500/50 shadow-2xl shadow-amber-950/80 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-amber-900/40 bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-100">
                The Sacred Rules of Sudoku
              </h2>
              <p className="text-[11px] text-amber-400/80">
                Pyramid Mathematical Codex & Scribe Guidelines
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioSystem.playTap();
              onClose();
            }}
            aria-label="Close Rules"
            className="p-1.5 text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-200 text-xs sm:text-sm">
          
          {/* Rule 1 */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-amber-600/20 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-cinzel font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-400">1</span>
              <span>The Rule of the Nine Numbers</span>
            </div>
            <p className="text-stone-300 leading-relaxed pl-7">
              Every horizontal row, vertical column, and 3×3 stone chamber must contain every digit from <strong className="text-amber-200">1 to 9 exactly once</strong>. No digit may ever repeat in the same row, column, or block.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-amber-600/20 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-cinzel font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-400">2</span>
              <span>Carved Clues vs. Explorer Glyphs</span>
            </div>
            <p className="text-stone-300 leading-relaxed pl-7">
              Digits etched in stone with golden dots are ancient clues placed by the Pharaohs; they are permanent. The numbers you enter glow in vibrant turquoise and can be edited or erased at any time.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-amber-600/20 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-cinzel font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-400">3</span>
              <span>Scribe Notes (Pencil Candidates)</span>
            </div>
            <p className="text-stone-300 leading-relaxed pl-7">
              Not sure which number fits? Toggle <strong className="text-amber-200">Notes ON</strong> to inscribe tiny candidate numbers in any empty cell. When you decide on the final number, toggle Notes OFF to place it permanently.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-amber-600/20 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-cinzel font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-400">4</span>
              <span>Sacred Hints from Nuru</span>
            </div>
            <p className="text-stone-300 leading-relaxed pl-7">
              If you become stuck, ask Nuru for a <strong className="text-cyan-300">Sacred Hint</strong>. Nuru will identify a logical cell and explain <em className="text-cyan-200">why</em> the number belongs there based on mathematical deduction. Hints are precious and limited per chamber!
            </p>
          </div>

          {/* Special Mechanics */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-stone-950/60 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-cinzel font-bold text-sm">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Chamber 7: Stargazer Diagonals</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              In the Astronomer's Chamber, illuminated stellar diagonals highlight celestial alignment lines to assist you with advanced cosmic logic.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 to-stone-950/60 border border-red-500/30 space-y-2">
            <div className="flex items-center gap-2 text-red-300 font-cinzel font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Chambers 8 & 9: Cursed Tomb Wards</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              In the final sanctums (Royal Treasury & Pharaoh's Chamber), an ancient trap ward is concealed. If triggered, the current puzzle resets and a small coin fine is incurred. Proceed with wisdom!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-amber-900/40 bg-stone-950/60 flex justify-end">
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider hover:from-amber-300 hover:to-amber-400 cursor-pointer"
          >
            I Understand the Codex
          </button>
        </div>
      </div>
    </div>
  );
};
