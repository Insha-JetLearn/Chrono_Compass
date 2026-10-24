import React, { useEffect } from 'react';
import { SudokuCellData } from '../types/game';
import { SudokuCell } from './SudokuCell';

interface SudokuBoardProps {
  grid: SudokuCellData[];
  selectedCell: { row: number; col: number } | null;
  onSelectCell: (row: number, col: number) => void;
  onNumberInput: (num: number) => void;
  onErase: () => void;
  conflicts: Set<string>;
  hasSpecialXRule?: boolean;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  grid,
  selectedCell,
  onSelectCell,
  onNumberInput,
  onErase,
  conflicts,
  hasSpecialXRule = false
}) => {
  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (!selectedCell) {
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          onSelectCell(0, 0);
        }
        return;
      }

      const { row, col } = selectedCell;

      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        onNumberInput(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        e.preventDefault();
        onErase();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onSelectCell(Math.max(0, row - 1), col);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onSelectCell(Math.min(8, row + 1), col);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onSelectCell(row, Math.max(0, col - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onSelectCell(row, Math.min(8, col + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, onNumberInput, onErase, onSelectCell]);

  // Selected cell value for matching highlights
  const selectedCellValue = selectedCell
    ? grid.find((c) => c.row === selectedCell.row && c.col === selectedCell.col)?.value ?? null
    : null;

  return (
    <div className="relative mx-auto w-full max-w-[460px] p-2.5 sm:p-3.5 rounded-2xl bg-stone-950/95 border-2 border-amber-500/40 shadow-2xl shadow-amber-950/50 backdrop-blur-md">
      {/* Decorative Egyptian Hieroglyphs on board border */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-stone-900 border border-amber-500/40 text-[11px] font-cinzel text-amber-300 font-semibold tracking-widest flex items-center gap-2 select-none">
        <span>𓆃</span>
        <span>SACRED GRID</span>
        <span>𓆃</span>
      </div>

      {/* 9x9 Grid Table */}
      <div className="grid grid-cols-9 grid-rows-9 border-2 border-amber-500/50 rounded-xl overflow-hidden bg-stone-900 shadow-inner">
        {grid.map((cell) => {
          const isSelected = selectedCell?.row === cell.row && selectedCell?.col === cell.col;
          
          // Check if cell is in same row, column, or 3x3 block
          const isInSelectedScope = Boolean(
            selectedCell &&
              (selectedCell.row === cell.row ||
                selectedCell.col === cell.col ||
                (Math.floor(selectedCell.row / 3) === Math.floor(cell.row / 3) &&
                  Math.floor(selectedCell.col / 3) === Math.floor(cell.col / 3)))
          );

          const isSameNumber = Boolean(
            selectedCellValue !== null && cell.value === selectedCellValue
          );

          // Diagonal X rule check for Chamber 7
          const isSpecialDiagonal = Boolean(
            hasSpecialXRule && (cell.row === cell.col || cell.row + cell.col === 8)
          );

          const cellKey = `${cell.row}-${cell.col}`;
          const cellWithConflict = {
            ...cell,
            hasConflict: conflicts.has(cellKey)
          };

          return (
            <SudokuCell
              key={cellKey}
              cell={cellWithConflict}
              isSelected={isSelected}
              isInSelectedScope={isInSelectedScope}
              isSameNumber={isSameNumber}
              isSpecialDiagonal={isSpecialDiagonal}
              onSelect={onSelectCell}
            />
          );
        })}
      </div>
    </div>
  );
};
