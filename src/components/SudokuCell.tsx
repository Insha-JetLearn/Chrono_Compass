import React from 'react';
import { SudokuCellData } from '../types/game';
import { AlertCircle, Sparkles } from 'lucide-react';

interface SudokuCellProps {
  cell: SudokuCellData;
  isSelected: boolean;
  isInSelectedScope: boolean; // same row, col, or box
  isSameNumber: boolean;
  isSpecialDiagonal?: boolean;
  onSelect: (r: number, c: number) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  isSelected,
  isInSelectedScope,
  isSameNumber,
  isSpecialDiagonal = false,
  onSelect
}) => {
  const { row, col, value, initial, notes, hasConflict, isTrap } = cell;

  // Background styling
  let bgClass = 'bg-stone-900/80';
  if (isSelected) {
    bgClass = 'bg-amber-500/25 ring-2 ring-amber-400 z-10';
  } else if (hasConflict) {
    bgClass = 'bg-red-950/60 ring-1 ring-red-500/80';
  } else if (isSameNumber && value !== null) {
    bgClass = 'bg-cyan-950/50 ring-1 ring-cyan-400/50';
  } else if (isInSelectedScope) {
    bgClass = 'bg-stone-800/60';
  } else if (isSpecialDiagonal) {
    bgClass = 'bg-indigo-950/30';
  }

  // Border thickness for 3x3 grid boxes
  const borderRight = (col + 1) % 3 === 0 && col < 8 ? 'border-r-2 border-r-amber-500/40' : 'border-r border-r-stone-800/80';
  const borderBottom = (row + 1) % 3 === 0 && row < 8 ? 'border-b-2 border-b-amber-500/40' : 'border-b border-b-stone-800/80';

  return (
    <button
      type="button"
      onClick={() => onSelect(row, col)}
      aria-label={`Row ${row + 1}, Column ${col + 1}${value ? `, Value ${value}` : ', Empty'}${initial ? ', Clue' : ''}`}
      className={`relative aspect-square w-full flex items-center justify-center select-none transition-all duration-150 cursor-pointer ${bgClass} ${borderRight} ${borderBottom} group`}
    >
      {/* Ancient stone glyph corner dot for initial clues */}
      {initial && (
        <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-amber-500/40" />
      )}

      {/* Special Diagonal Stargazer indicator */}
      {isSpecialDiagonal && !value && (
        <span className="absolute text-[8px] text-indigo-400/30 font-cinzel select-none pointer-events-none">✦</span>
      )}

      {/* Value Display */}
      {value !== null ? (
        <span
          className={`font-semibold text-lg sm:text-xl md:text-2xl transition-transform ${
            initial
              ? 'font-cinzel text-amber-200/95 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
              : hasConflict
              ? 'text-red-400 font-bold animate-pulse'
              : 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]'
          }`}
        >
          {value}
        </span>
      ) : notes.length > 0 ? (
        /* Candidate Notes Mini-Grid */
        <div className="w-full h-full p-0.5 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div
              key={n}
              className="flex items-center justify-center text-[8px] sm:text-[9px] md:text-[10px] font-mono leading-none text-amber-300/80"
            >
              {notes.includes(n) ? n : ''}
            </div>
          ))}
        </div>
      ) : null}

      {/* Conflict Warning badge */}
      {hasConflict && (
        <div className="absolute -top-1 -right-1 text-red-400 bg-stone-950 rounded-full p-0.5">
          <AlertCircle className="w-3 h-3" />
        </div>
      )}
    </button>
  );
};
