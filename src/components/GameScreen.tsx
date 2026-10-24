import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChamberInfo, ChamberId, SudokuCellData, GameProgress, HintExplanation } from '../types/game';
import { CHAMBERS } from '../data/chambers';
import { SACRED_ARTIFACTS } from '../data/artifacts';
import { getChamberPuzzle } from '../data/puzzles';
import {
  createInitialGrid,
  findConflicts,
  isBoardFilled,
  isBoardSolved,
  calculateRemainingNumbers,
  getSacredHint
} from '../utils/sudokuEngine';
import { audioSystem } from '../utils/audioSystem';
import { SudokuBoard } from './SudokuBoard';
import { NumberPad } from './NumberPad';
import { SacredScroll } from './SacredScroll';
import { NuruCompanion } from './NuruCompanion';
import { TrapModal } from './TrapModal';
import { RewardModal } from './RewardModal';
import { Map, ArrowLeft, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';

interface GameScreenProps {
  chamberId: ChamberId;
  progress: GameProgress;
  onUpdateProgress: (updater: (prev: GameProgress) => GameProgress) => void;
  onGoToMap: () => void;
  onViewCollection: () => void;
  onOpenRules: () => void;
  onChamberComplete: (chamberId: ChamberId, coinsEarned: number, artifactId?: string) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  chamberId,
  progress,
  onUpdateProgress,
  onGoToMap,
  onViewCollection,
  onOpenRules,
  onChamberComplete
}) => {
  const chamber = useMemo(() => CHAMBERS.find((c) => c.id === chamberId) || CHAMBERS[0], [chamberId]);

  // Load puzzle data for this chamber
  const puzzlePreset = useMemo(() => getChamberPuzzle(chamber.id), [chamber.id]);

  // Board state
  const [grid, setGrid] = useState<SudokuCellData[]>(() => {
    const grid2d = createInitialGrid(puzzlePreset.initial, puzzlePreset.trapCell);
    return grid2d.flat();
  });

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 3;
  const [remainingHints, setRemainingHints] = useState(3);
  const [activeHint, setActiveHint] = useState<HintExplanation | null>(null);

  // Modals & Traps
  const [isTrapTriggered, setIsTrapTriggered] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [unlockedArtifact, setUnlockedArtifact] = useState<typeof SACRED_ARTIFACTS[keyof typeof SACRED_ARTIFACTS] | null>(null);

  // Companion dialogue
  const [nuruMessage, setNuruMessage] = useState(chamber.storyIntro);
  const [nuruSubMessage, setNuruSubMessage] = useState<string | undefined>(chamber.objective);

  // Reset board when chamberId changes
  useEffect(() => {
    const grid2d = createInitialGrid(puzzlePreset.initial, puzzlePreset.trapCell);
    setGrid(grid2d.flat());
    setSelectedCell({ row: 0, col: 0 });
    setIsNotesMode(false);
    setMistakes(0);
    setRemainingHints(3);
    setActiveHint(null);
    setIsTrapTriggered(false);
    setShowReward(false);
    setNuruMessage(chamber.storyIntro);
    setNuruSubMessage(chamber.objective);
  }, [chamberId, puzzlePreset, chamber]);

  // Helper 2D grid representation
  const grid2D = useMemo(() => {
    const res: SudokuCellData[][] = Array.from({ length: 9 }, () => []);
    grid.forEach((c) => {
      res[c.row][c.col] = c;
    });
    return res;
  }, [grid]);

  // Conflicts calculation
  const conflicts = useMemo(() => findConflicts(grid2D), [grid2D]);

  // Remaining counts for keypad
  const remainingCounts = useMemo(() => calculateRemainingNumbers(grid2D), [grid2D]);

  // Cell Selection Handler
  const handleSelectCell = useCallback((row: number, col: number) => {
    audioSystem.playTap();
    setSelectedCell({ row, col });
  }, []);

  // Check board victory
  const checkVictory = useCallback((currentGrid2D: SudokuCellData[][]) => {
    if (isBoardFilled(currentGrid2D) && isBoardSolved(currentGrid2D, puzzlePreset.solution)) {
      // Chamber victory!
      const isFirstTime = !progress.completedChambers.includes(chamber.id);
      const coins = isFirstTime ? chamber.rewardCoins : Math.round(chamber.rewardCoins * 0.4);
      setEarnedCoins(coins);

      let artifact = null;
      if (chamber.artifactId && !progress.collectedArtifacts.includes(chamber.artifactId)) {
        artifact = SACRED_ARTIFACTS[chamber.artifactId];
        setUnlockedArtifact(artifact);
      } else {
        setUnlockedArtifact(null);
      }

      setNuruMessage(chamber.storyRevealed);
      setNuruSubMessage('The Chrono Compass pulses with new cosmic radiance!');
      setShowReward(true);

      onChamberComplete(chamber.id, coins, artifact?.id);
    }
  }, [chamber, puzzlePreset.solution, progress.completedChambers, progress.collectedArtifacts, onChamberComplete]);

  // Number Input Handler
  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const targetCell = grid.find((c) => c.row === row && c.col === col);
    if (!targetCell || targetCell.initial) return;

    // Check if this cell is a concealed trap in Chamber 8 or 9
    if (targetCell.isTrap && (chamber.id === 8 || chamber.id === 9)) {
      // Trigger trap bomb!
      setIsTrapTriggered(true);
      const penalty = Math.min(progress.coins, 25);
      onUpdateProgress((prev) => ({
        ...prev,
        coins: Math.max(0, prev.coins - penalty)
      }));
      return;
    }

    if (isNotesMode) {
      // Toggle note candidate
      setGrid((prev) =>
        prev.map((c) => {
          if (c.row === row && c.col === col) {
            const hasNote = c.notes.includes(num);
            const newNotes = hasNote ? c.notes.filter((n) => n !== num) : [...c.notes, num].sort();
            return { ...c, notes: newNotes, value: null };
          }
          return c;
        })
      );
      audioSystem.playTap();
    } else {
      // Standard digit entry
      const correctVal = puzzlePreset.solution[row][col];
      const isCorrect = num === correctVal;

      if (!isCorrect) {
        audioSystem.playMistake();
        setMistakes((m) => {
          const next = m + 1;
          if (next >= maxMistakes) {
            setNuruMessage('The ancient wards are trembling! Clear your mind and verify the stone matrix.');
            setNuruSubMessage('Tip: Use Sacred Hints or Notes mode to eliminate doubts.');
          } else {
            setNuruMessage(`A slight disturbance in row ${row + 1}. Even ancient scribes made adjustments!`);
          }
          return next;
        });
      } else {
        audioSystem.playNumberPlaced();
        setNuruMessage('A harmonious placement! The glyph locks into place.');
      }

      const updatedGrid = grid.map((c) => {
        if (c.row === row && c.col === col) {
          return { ...c, value: num, notes: [] };
        }
        return c;
      });

      setGrid(updatedGrid);

      // Check for board victory
      const updated2D: SudokuCellData[][] = Array.from({ length: 9 }, () => []);
      updatedGrid.forEach((c) => {
        updated2D[c.row][c.col] = c;
      });
      checkVictory(updated2D);
    }
  }, [selectedCell, grid, isNotesMode, chamber.id, puzzlePreset.solution, progress.coins, maxMistakes, checkVictory, onUpdateProgress]);

  // Erase Cell Handler
  const handleErase = useCallback(() => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const targetCell = grid.find((c) => c.row === row && c.col === col);
    if (!targetCell || targetCell.initial) return;

    setGrid((prev) =>
      prev.map((c) => {
        if (c.row === row && c.col === col) {
          return { ...c, value: null, notes: [] };
        }
        return c;
      })
    );
  }, [selectedCell, grid]);

  // Sacred Hint Request
  const handleRequestHint = useCallback(() => {
    if (remainingHints <= 0) return;

    const hint = getSacredHint(grid2D, puzzlePreset.solution);
    if (hint) {
      setActiveHint(hint);
      setSelectedCell({ row: hint.row, col: hint.col });
      setRemainingHints((h) => h - 1);

      // Auto-inscribe the hint value for the player
      setGrid((prev) =>
        prev.map((c) => {
          if (c.row === hint.row && c.col === hint.col) {
            return { ...c, value: hint.value, notes: [] };
          }
          return c;
        })
      );

      setNuruMessage(`I have revealed the glyph: ${hint.value} belongs in Row ${hint.row + 1}, Column ${hint.col + 1}!`);
      setNuruSubMessage(hint.reason);

      // Recheck board
      setTimeout(() => {
        const updatedGrid = grid.map((c) => {
          if (c.row === hint.row && c.col === hint.col) {
            return { ...c, value: hint.value, notes: [] };
          }
          return c;
        });
        const updated2D: SudokuCellData[][] = Array.from({ length: 9 }, () => []);
        updatedGrid.forEach((c) => {
          updated2D[c.row][c.col] = c;
        });
        checkVictory(updated2D);
      }, 200);
    }
  }, [remainingHints, grid2D, puzzlePreset.solution, grid, checkVictory]);

  // Reset Puzzle Handler
  const handleResetPuzzle = useCallback(() => {
    audioSystem.playTap();
    const grid2d = createInitialGrid(puzzlePreset.initial, puzzlePreset.trapCell);
    setGrid(grid2d.flat());
    setMistakes(0);
    setActiveHint(null);
    setNuruMessage('The chamber tablet has been restored to its original ancient state.');
    setNuruSubMessage(chamber.objective);
  }, [puzzlePreset, chamber.objective]);

  // Check Answer Button
  const handleCheckAnswer = useCallback(() => {
    if (conflicts.size > 0) {
      audioSystem.playMistake();
      setNuruMessage('Take care! There are conflicting numbers on the tablet. Check the red glowing glyphs.');
    } else if (!isBoardFilled(grid2D)) {
      audioSystem.playTap();
      setNuruMessage('The glyphs placed so far are harmonious! Continue filling the remaining empty cells.');
    } else {
      checkVictory(grid2D);
    }
  }, [conflicts.size, grid2D, checkVictory]);

  // Trap Retry Handler
  const handleRetryAfterTrap = () => {
    setIsTrapTriggered(false);
    handleResetPuzzle();
  };

  // Next Chamber Navigation
  const handleProceedNext = () => {
    setShowReward(false);
    const nextChamberId = Math.min(9, chamber.id + 1) as ChamberId;
    if (chamber.id < 9) {
      onUpdateProgress((prev) => ({
        ...prev,
        currentChamber: nextChamberId,
        unlockedChambers: prev.unlockedChambers.includes(nextChamberId)
          ? prev.unlockedChambers
          : [...prev.unlockedChambers, nextChamberId]
      }));
    } else {
      // Chamber 9 complete -> Go to Victory
      onGoToMap();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 md:py-6 space-y-4 md:space-y-6 animate-fadeIn">
      
      {/* Top Chamber Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/30 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onGoToMap();
            }}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-700/40 transition-colors cursor-pointer"
            title="Return to Chamber Map"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs text-amber-400 font-bold tracking-widest uppercase">
                Chamber 0{chamber.id}
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-stone-300 font-medium">
                {chamber.difficulty}
              </span>
              {chamber.hasTrapBomb && (
                <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Trap Ward
                </span>
              )}
            </div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-amber-100 tracking-wide">
              {chamber.title}
            </h1>
          </div>
        </div>

        {/* Quick Rules & Map Link */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onOpenRules();
            }}
            className="px-3 py-1.5 rounded-lg border border-stone-800 bg-stone-900 text-stone-300 hover:text-amber-300 text-xs font-semibold cursor-pointer"
          >
            Codex Rules
          </button>
          <button
            type="button"
            onClick={() => {
              audioSystem.playTap();
              onGoToMap();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-300 hover:bg-amber-900/50 text-xs font-semibold cursor-pointer"
          >
            Map
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Layout: Board & Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left / Center Column: Sudoku Board & Keypad */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          <SudokuBoard
            grid={grid}
            selectedCell={selectedCell}
            onSelectCell={handleSelectCell}
            onNumberInput={handleNumberInput}
            onErase={handleErase}
            conflicts={conflicts}
            hasSpecialXRule={chamber.hasSpecialXRule}
          />

          <NumberPad
            onNumberSelect={handleNumberInput}
            onErase={handleErase}
            isNotesMode={isNotesMode}
            onToggleNotes={() => setIsNotesMode(!isNotesMode)}
            remainingCounts={remainingCounts}
          />
        </div>

        {/* Right Column: Nuru Companion & Sacred Scroll Tools */}
        <div className="lg:col-span-5 space-y-4">
          {/* Nuru Magical Companion Dialogue */}
          <NuruCompanion
            message={nuruMessage}
            subMessage={nuruSubMessage}
            onAskHint={handleRequestHint}
            canHint={remainingHints > 0}
          />

          {/* Sacred Scroll Action Panel */}
          <SacredScroll
            onCheckAnswer={handleCheckAnswer}
            onResetPuzzle={handleResetPuzzle}
            onRequestHint={handleRequestHint}
            onOpenRules={onOpenRules}
            remainingHints={remainingHints}
            mistakes={mistakes}
            maxMistakes={maxMistakes}
            activeHint={activeHint}
            onDismissHint={() => setActiveHint(null)}
          />

          {/* Chamber Lore Brief */}
          <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 text-xs text-stone-400 space-y-1">
            <span className="font-cinzel text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Sanctum Lore
            </span>
            <p className="leading-relaxed">
              {chamber.storyIntro}
            </p>
          </div>
        </div>
      </div>

      {/* Trap Triggered Modal */}
      {isTrapTriggered && (
        <TrapModal
          chamberTitle={chamber.title}
          coinsLost={Math.min(progress.coins, 25)}
          onRetry={handleRetryAfterTrap}
        />
      )}

      {/* Reward Completion Modal */}
      {showReward && (
        <RewardModal
          chamber={chamber}
          coinsEarned={earnedCoins}
          artifactUnlocked={unlockedArtifact}
          onProceedNext={handleProceedNext}
          onGoToMap={onGoToMap}
          onViewCollection={onViewCollection}
        />
      )}
    </div>
  );
};
