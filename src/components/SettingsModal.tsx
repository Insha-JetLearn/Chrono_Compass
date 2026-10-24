import React, { useState } from 'react';
import { GameProgress, AudioSettings } from '../types/game';
import { audioSystem } from '../utils/audioSystem';
import { X, Volume2, VolumeX, Music, Zap, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  progress: GameProgress;
  onUpdateSettings: (music: boolean, sfx: boolean, volume: number) => void;
  onToggleAnimations: (enabled: boolean) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onUpdateSettings,
  onToggleAnimations,
  onResetProgress,
  onClose
}) => {
  const [music, setMusic] = useState(progress.settings.musicEnabled);
  const [sfx, setSfx] = useState(progress.settings.sfxEnabled);
  const [volume, setVolume] = useState(progress.settings.volume);
  const [animations, setAnimations] = useState(progress.animationsEnabled);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    onUpdateSettings(music, sfx, val);
  };

  const handleToggleMusic = () => {
    audioSystem.playTap();
    const next = !music;
    setMusic(next);
    onUpdateSettings(next, sfx, volume);
  };

  const handleToggleSfx = () => {
    audioSystem.playTap();
    const next = !sfx;
    setSfx(next);
    onUpdateSettings(music, next, volume);
  };

  const handleToggleAnim = () => {
    audioSystem.playTap();
    const next = !animations;
    setAnimations(next);
    onToggleAnimations(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-stone-900 border-2 border-amber-500/50 shadow-2xl shadow-amber-950/80 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-lg font-bold text-amber-100">
              Expedition Settings
            </span>
          </div>

          <button
            onClick={() => {
              audioSystem.playTap();
              onClose();
            }}
            aria-label="Close Settings"
            className="p-1 text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-4 text-xs sm:text-sm">
          
          {/* Music Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-950/60 border border-stone-800">
            <div className="flex items-center gap-2.5">
              <Music className={`w-4 h-4 ${music ? 'text-amber-400' : 'text-stone-500'}`} />
              <div>
                <span className="font-semibold text-stone-200 block">Atmospheric Music</span>
                <span className="text-[11px] text-stone-400">Ancient temple ambient soundscapes</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleMusic}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                music
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-500'
              }`}
            >
              {music ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* SFX Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-950/60 border border-stone-800">
            <div className="flex items-center gap-2.5">
              <Volume2 className={`w-4 h-4 ${sfx ? 'text-cyan-400' : 'text-stone-500'}`} />
              <div>
                <span className="font-semibold text-stone-200 block">Sound Effects</span>
                <span className="text-[11px] text-stone-400">Tile taps, chimes, and relic fanfares</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSfx}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                sfx
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-stone-900 border-stone-800 text-stone-500'
              }`}
            >
              {sfx ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Master Volume Slider */}
          <div className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-200">Master Volume</span>
              <span className="font-mono text-xs text-amber-400 font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Reduced Motion / Animations */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-950/60 border border-stone-800">
            <div className="flex items-center gap-2.5">
              <Zap className={`w-4 h-4 ${animations ? 'text-amber-400' : 'text-stone-500'}`} />
              <div>
                <span className="font-semibold text-stone-200 block">Visual Animations</span>
                <span className="text-[11px] text-stone-400">Chamber dust particles & smooth transitions</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleAnim}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                animations
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-500'
              }`}
            >
              {animations ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Danger Zone: Reset Progress */}
        <div className="pt-2 border-t border-stone-800">
          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => {
                audioSystem.playTap();
                setShowConfirmReset(true);
              }}
              className="w-full py-2.5 rounded-xl border border-red-900/40 text-red-400 hover:bg-red-950/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Expedition Progress</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-red-950/50 border border-red-500/60 space-y-3 animate-fadeIn text-center">
              <div className="flex items-center justify-center gap-1.5 text-red-300 text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Confirm Full Expedition Reset</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Are you sure? This will wipe all unlocked chambers, coins, and relics!
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800 text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playTrapExplode();
                    onResetProgress();
                    setShowConfirmReset(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-700 text-stone-100 text-xs font-bold hover:bg-red-600 cursor-pointer"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
