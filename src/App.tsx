/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ScreenView, GameProgress, ChamberId } from './types/game';
import { CHAMBERS } from './data/chambers';
import { loadGameProgress, saveGameProgress, resetGameProgress } from './utils/storage';
import { audioSystem } from './utils/audioSystem';
import { Navbar } from './components/Navbar';
import { MainMenu } from './components/MainMenu';
import { ChamberMap } from './components/ChamberMap';
import { GameScreen } from './components/GameScreen';
import { StorySequence } from './components/StorySequence';
import { ArtifactCollection } from './components/ArtifactCollection';
import { SacredRulesModal } from './components/SacredRulesModal';
import { SettingsModal } from './components/SettingsModal';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import { VictoryScreen } from './components/VictoryScreen';
import { ExpeditionJournal } from './components/ExpeditionJournal';
import { PrologueModal } from './components/PrologueModal';

export default function App() {
  const [progress, setProgress] = useState<GameProgress>(loadGameProgress);
  const [currentView, setCurrentView] = useState<ScreenView>('MAIN_MENU');
  const [activeChamberId, setActiveChamberId] = useState<ChamberId>(progress.currentChamber);
  
  // Modals
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPrologueModal, setShowPrologueModal] = useState(false);

  // Sync settings to Audio System
  useEffect(() => {
    audioSystem.setSettings(
      progress.settings.musicEnabled,
      progress.settings.sfxEnabled,
      progress.settings.volume
    );
  }, [progress.settings]);

  // Persist progress changes
  useEffect(() => {
    saveGameProgress(progress);
  }, [progress]);

  // Handle first user interaction to unlock audio
  useEffect(() => {
    const handleFirstInteraction = () => {
      audioSystem.startMusic();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Update Settings
  const handleUpdateSettings = useCallback((music: boolean, sfx: boolean, volume: number) => {
    setProgress((prev) => ({
      ...prev,
      settings: {
        musicEnabled: music,
        sfxEnabled: sfx,
        volume
      }
    }));
  }, []);

  const handleToggleAnimations = useCallback((enabled: boolean) => {
    setProgress((prev) => ({
      ...prev,
      animationsEnabled: enabled
    }));
  }, []);

  // Reset Progress
  const handleResetProgress = useCallback(() => {
    const fresh = resetGameProgress();
    setProgress(fresh);
    setActiveChamberId(1);
    setCurrentView('MAIN_MENU');
  }, []);

  // Navigation handlers
  const handleBeginExpedition = useCallback(() => {
    setActiveChamberId(1);
    if (!progress.prologueSeen) {
      setShowPrologueModal(true);
    } else {
      if (!progress.tutorialCompleted) {
        setShowTutorial(true);
      }
      setCurrentView('STORY_INTRO');
    }
  }, [progress.prologueSeen, progress.tutorialCompleted]);

  const handleContinueExpedition = useCallback(() => {
    setActiveChamberId(progress.currentChamber);
    setCurrentView('GAMEPLAY');
  }, [progress.currentChamber]);

  const handleSelectChamberFromMap = useCallback((id: ChamberId) => {
    setActiveChamberId(id);
    setCurrentView('STORY_INTRO');
  }, []);

  // Chamber Completion Handler
  const handleChamberComplete = useCallback((chamberId: ChamberId, coinsEarned: number, artifactId?: string) => {
    setProgress((prev) => {
      const nextUnlocked = [...prev.unlockedChambers];
      if (chamberId < 9) {
        const nextId = (chamberId + 1) as ChamberId;
        if (!nextUnlocked.includes(nextId)) {
          nextUnlocked.push(nextId);
        }
      }

      const nextCompleted = prev.completedChambers.includes(chamberId)
        ? prev.completedChambers
        : [...prev.completedChambers, chamberId];

      const nextArtifacts = artifactId && !prev.collectedArtifacts.includes(artifactId)
        ? [...prev.collectedArtifacts, artifactId]
        : prev.collectedArtifacts;

      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        unlockedChambers: nextUnlocked,
        completedChambers: nextCompleted,
        collectedArtifacts: nextArtifacts,
        currentChamber: chamberId < 9 ? ((chamberId + 1) as ChamberId) : chamberId
      };
    });

    if (chamberId === 9) {
      setTimeout(() => {
        setCurrentView('VICTORY');
      }, 1500);
    }
  }, []);

  const currentChamberInfo = CHAMBERS.find((c) => c.id === activeChamberId) || CHAMBERS[0];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        progress={progress}
        onUpdateSettings={handleUpdateSettings}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Screen Views */}
      <main className="flex-1 flex flex-col">
        {currentView === 'MAIN_MENU' && (
          <MainMenu
            progress={progress}
            onBeginExpedition={handleBeginExpedition}
            onContinueExpedition={handleContinueExpedition}
            onOpenMap={() => setCurrentView('CHAMBER_MAP')}
            onOpenRelics={() => setCurrentView('COLLECTION')}
            onOpenJournal={() => setCurrentView('JOURNAL')}
            onOpenRules={() => setShowRulesModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        )}

        {currentView === 'CHAMBER_MAP' && (
          <ChamberMap
            progress={progress}
            onSelectChamber={handleSelectChamberFromMap}
            onBackToMenu={() => setCurrentView('MAIN_MENU')}
          />
        )}

        {currentView === 'STORY_INTRO' && (
          <StorySequence
            chamber={currentChamberInfo}
            onStartChamber={() => setCurrentView('GAMEPLAY')}
            onBackToMap={() => setCurrentView('CHAMBER_MAP')}
          />
        )}

        {currentView === 'GAMEPLAY' && (
          <GameScreen
            chamberId={activeChamberId}
            progress={progress}
            onUpdateProgress={setProgress}
            onGoToMap={() => setCurrentView('CHAMBER_MAP')}
            onViewCollection={() => setCurrentView('COLLECTION')}
            onViewJournal={() => setCurrentView('JOURNAL')}
            onOpenRules={() => setShowRulesModal(true)}
            onChamberComplete={handleChamberComplete}
          />
        )}

        {currentView === 'COLLECTION' && (
          <ArtifactCollection
            progress={progress}
            onBack={() => setCurrentView('MAIN_MENU')}
          />
        )}

        {currentView === 'JOURNAL' && (
          <ExpeditionJournal
            progress={progress}
            onBack={() => setCurrentView('CHAMBER_MAP')}
            onReplayPrologue={() => setShowPrologueModal(true)}
          />
        )}

        {currentView === 'VICTORY' && (
          <VictoryScreen
            progress={progress}
            onGoToMap={() => setCurrentView('CHAMBER_MAP')}
            onViewRelics={() => setCurrentView('COLLECTION')}
          />
        )}
      </main>

      {/* Modals */}
      {showRulesModal && (
        <SacredRulesModal onClose={() => setShowRulesModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal
          progress={progress}
          onUpdateSettings={handleUpdateSettings}
          onToggleAnimations={handleToggleAnimations}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showTutorial && (
        <InteractiveTutorial
          onFinish={() => {
            setShowTutorial(false);
            setProgress((prev) => ({ ...prev, tutorialCompleted: true }));
          }}
          onSkip={() => {
            setShowTutorial(false);
            setProgress((prev) => ({ ...prev, tutorialCompleted: true }));
          }}
        />
      )}

      {showPrologueModal && (
        <PrologueModal
          onFinish={() => {
            setShowPrologueModal(false);
            setProgress((prev) => ({ ...prev, prologueSeen: true }));
            if (!progress.tutorialCompleted) {
              setShowTutorial(true);
            }
            setCurrentView('STORY_INTRO');
          }}
          onSkip={() => {
            setShowPrologueModal(false);
            setProgress((prev) => ({ ...prev, prologueSeen: true }));
            if (!progress.tutorialCompleted) {
              setShowTutorial(true);
            }
            setCurrentView('STORY_INTRO');
          }}
        />
      )}
    </div>
  );
}
