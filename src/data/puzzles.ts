// Pre-validated complete Sudoku solutions and puzzle presets for each chamber.

export interface ChamberPuzzlePreset {
  chamberId: number;
  solution: number[][];
  initial: (number | null)[][];
  trapCell?: { row: number; col: number };
}

// Base verified solution 1
const S1 = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

// Base verified solution 2 (Permutation by cycling digits 1->2->3...9->1)
const S2 = S1.map(row => row.map(v => (v % 9) + 1));

// Base verified solution 3 (Digit permutation [9,8,7,6,5,4,3,2,1])
const S3 = S1.map(row => row.map(v => 10 - v));

// Base verified solution 4 (Transpose)
const S4 = S1[0].map((_, colIndex) => S1.map(row => row[colIndex]));

// Base verified solution 5
const S5 = S2[0].map((_, colIndex) => S2.map(row => row[colIndex]));

// Base verified solution 6
const S6 = S3[0].map((_, colIndex) => S3.map(row => row[colIndex]));

// Helper to mask cells according to difficulty
function maskGrid(solution: number[][], clueCount: number, seed: number): (number | null)[][] {
  const result: (number | null)[][] = solution.map(row => [...row]);
  const cells: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      cells.push([r, c]);
    }
  }

  // Deterministic shuffle with seed
  let s = seed;
  for (let i = cells.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  const cellsToRemove = 81 - clueCount;
  for (let i = 0; i < cellsToRemove; i++) {
    const [r, c] = cells[i];
    result[r][c] = null;
  }

  return result;
}

export function getChamberPuzzle(chamberId: number, seed = 42): ChamberPuzzlePreset {
  let solution: number[][];
  let clueCount = 52;
  let trapCell: { row: number; col: number } | undefined;

  switch (chamberId) {
    case 1:
      solution = S1;
      clueCount = 52; // Beginner
      break;
    case 2:
      solution = S2;
      clueCount = 46; // Easy
      break;
    case 3:
      solution = S3;
      clueCount = 40; // Easy-Medium
      break;
    case 4:
      solution = S4;
      clueCount = 36; // Medium
      break;
    case 5:
      solution = S5;
      clueCount = 34; // Medium
      break;
    case 6:
      solution = S6;
      clueCount = 32; // Medium-Hard
      break;
    case 7:
      solution = S1;
      clueCount = 30; // Hard
      break;
    case 8:
      solution = S2;
      clueCount = 28; // Hard + Trap
      break;
    case 9:
    default:
      solution = S3;
      clueCount = 26; // Expert + Trap
      break;
  }

  const initial = maskGrid(solution, clueCount, seed + chamberId * 17);

  // For chambers 8 and 9, pick a non-initial cell as the trap cell
  if (chamberId === 8 || chamberId === 9) {
    // Find an empty cell to host the ancient cursed ward
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        // Target an empty cell in the inner blocks (e.g. center box)
        if (initial[r][c] === null && r >= 3 && r <= 5 && c >= 3 && c <= 5) {
          trapCell = { row: r, col: c };
          break;
        }
      }
      if (trapCell) break;
    }
    // Fallback if not found
    if (!trapCell) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (initial[r][c] === null) {
            trapCell = { row: r, col: c };
            break;
          }
        }
        if (trapCell) break;
      }
    }
  }

  return {
    chamberId,
    solution,
    initial,
    trapCell
  };
}
