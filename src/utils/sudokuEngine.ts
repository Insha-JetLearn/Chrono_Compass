import { SudokuCellData, HintExplanation } from '../types/game';

export function createInitialGrid(
  initial: (number | null)[][],
  trapCell?: { row: number; col: number }
): SudokuCellData[][] {
  const grid: SudokuCellData[][] = [];

  for (let r = 0; r < 9; r++) {
    const row: SudokuCellData[] = [];
    for (let c = 0; c < 9; c++) {
      const val = initial[r][c];
      const isTrap = trapCell ? trapCell.row === r && trapCell.col === c : false;
      row.push({
        row: r,
        col: c,
        value: val,
        initial: val !== null,
        notes: [],
        isTrap
      });
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Returns set of coordinate strings "row-col" of cells that have conflicts
 * (duplicate numbers in the same row, column, or 3x3 box).
 */
export function findConflicts(grid: SudokuCellData[][]): Set<string> {
  const conflicts = new Set<string>();

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number[]>();
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c].value;
      if (v !== null) {
        if (!seen.has(v)) seen.set(v, []);
        seen.get(v)!.push(c);
      }
    }
    seen.forEach((cols) => {
      if (cols.length > 1) {
        cols.forEach((c) => conflicts.add(`${r}-${c}`));
      }
    });
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number[]>();
    for (let r = 0; r < 9; r++) {
      const v = grid[r][c].value;
      if (v !== null) {
        if (!seen.has(v)) seen.set(v, []);
        seen.get(v)!.push(r);
      }
    }
    seen.forEach((rows) => {
      if (rows.length > 1) {
        rows.forEach((r) => conflicts.add(`${r}-${c}`));
      }
    });
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Map<number, [number, number][]>();
      for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
        for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
          const v = grid[r][c].value;
          if (v !== null) {
            if (!seen.has(v)) seen.set(v, []);
            seen.get(v)!.push([r, c]);
          }
        }
      }
      seen.forEach((coords) => {
        if (coords.length > 1) {
          coords.forEach(([r, c]) => conflicts.add(`${r}-${c}`));
        }
      });
    }
  }

  return conflicts;
}

export function isBoardFilled(grid: SudokuCellData[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value === null) {
        return false;
      }
    }
  }
  return true;
}

export function isBoardSolved(grid: SudokuCellData[][], solution: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

export function calculateRemainingNumbers(grid: SudokuCellData[][]): Record<number, number> {
  const counts: Record<number, number> = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 };
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c].value;
      if (val !== null && val >= 1 && val <= 9) {
        counts[val] = Math.max(0, counts[val] - 1);
      }
    }
  }
  return counts;
}

/**
 * Intelligent Sacred Hint Generator:
 * Identifies a logical next step or single empty cell, and provides a clear
 * educational explanation of why the number belongs in that cell.
 */
export function getSacredHint(
  grid: SudokuCellData[][],
  solution: number[][]
): HintExplanation | null {
  // First, check if player has any incorrect filled cells
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = grid[r][c];
      if (cell.value !== null && cell.value !== solution[r][c]) {
        return {
          row: r,
          col: c,
          value: solution[r][c],
          technique: 'Sacred Correction',
          reason: `The glyph placed in row ${r + 1}, column ${c + 1} conflicts with the cosmic harmony. The true number is ${solution[r][c]}.`
        };
      }
    }
  }

  // Look for Naked Singles (cell where only one digit 1-9 is valid according to current board)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value !== null) continue;

      const candidates: number[] = [];
      for (let num = 1; num <= 9; num++) {
        let possible = true;

        // Check row
        for (let col = 0; col < 9; col++) {
          if (grid[r][col].value === num) {
            possible = false;
            break;
          }
        }
        if (!possible) continue;

        // Check col
        for (let row = 0; row < 9; row++) {
          if (grid[row][c].value === num) {
            possible = false;
            break;
          }
        }
        if (!possible) continue;

        // Check box
        const startR = Math.floor(r / 3) * 3;
        const startC = Math.floor(c / 3) * 3;
        for (let br = startR; br < startR + 3; br++) {
          for (let bc = startC; bc < startC + 3; bc++) {
            if (grid[br][bc].value === num) {
              possible = false;
              break;
            }
          }
          if (!possible) break;
        }

        if (possible) {
          candidates.push(num);
        }
      }

      if (candidates.length === 1 && candidates[0] === solution[r][c]) {
        return {
          row: r,
          col: c,
          value: solution[r][c],
          technique: 'Naked Single',
          reason: `In Row ${r + 1}, Column ${c + 1}, all other numbers (1-9) already appear in its row, column, or 3×3 stone chamber. Therefore, only ${solution[r][c]} can fit here!`
        };
      }
    }
  }

  // Fallback to any empty cell with verified solution
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value === null) {
        const correctVal = solution[r][c];
        const boxNumber = Math.floor(r / 3) * 3 + Math.floor(c / 3) + 1;
        return {
          row: r,
          col: c,
          value: correctVal,
          technique: 'Sacred Revelation',
          reason: `The celestial alignment indicates that ${correctVal} belongs in Row ${r + 1}, Column ${c + 1} (Box ${boxNumber}) to maintain cosmic balance.`
        };
      }
    }
  }

  return null;
}
