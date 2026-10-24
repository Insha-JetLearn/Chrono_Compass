import React, { useState } from 'react';
import { SACRED_ARTIFACTS } from '../data/artifacts';
import { Artifact, GameProgress } from '../types/game';
import { Lock, Sparkles, Award, ArrowLeft, Shield, Eye, Key, Compass, Sun, Crown } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface ArtifactCollectionProps {
  progress: GameProgress;
  onBack: () => void;
}

export const ArtifactCollection: React.FC<ArtifactCollectionProps> = ({
  progress,
  onBack
}) => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case 'scarab':
        return <Shield className="w-8 h-8 text-amber-400" />;
      case 'eye_of_horus':
        return <Eye className="w-8 h-8 text-cyan-400" />;
      case 'crystal_ankh':
        return <Key className="w-8 h-8 text-emerald-400" />;
      case 'celestial_compass':
        return <Compass className="w-8 h-8 text-indigo-400" />;
      case 'royal_sunstone':
        return <Sun className="w-8 h-8 text-amber-400" />;
      case 'pharaoh_seal':
      default:
        return <Crown className="w-8 h-8 text-yellow-300" />;
    }
  };

  const getRarityBadge = (rarity: Artifact['rarity']) => {
    switch (rarity) {
      case 'Common':
        return 'text-stone-300 bg-stone-800 border-stone-700';
      case 'Rare':
        return 'text-cyan-300 bg-cyan-950/40 border-cyan-500/40';
      case 'Epic':
        return 'text-purple-300 bg-purple-950/40 border-purple-500/40';
      case 'Legendary':
        return 'text-amber-300 bg-amber-950/40 border-amber-500/40';
      case 'Mythic':
        return 'text-yellow-200 bg-yellow-950/50 border-yellow-400/50';
    }
  };

  const artifactList = Object.values(SACRED_ARTIFACTS);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-900/40 pb-6">
        <div>
          <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-widest block">
            Pyramid Treasury
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-amber-100">
            Sacred Relics of Chronos
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            Ancient treasures retrieved from the pyramid's deepest puzzle sanctums.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold font-cinzel">
            Collected: {progress.collectedArtifacts.length} / {artifactList.length}
          </div>
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

      {/* Relics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {artifactList.map((artifact) => {
          const isCollected = progress.collectedArtifacts.includes(artifact.id);

          return (
            <div
              key={artifact.id}
              onClick={() => {
                if (isCollected) {
                  audioSystem.playTap();
                  setSelectedArtifact(artifact);
                }
              }}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                isCollected
                  ? 'bg-stone-900/90 border-amber-500/40 hover:border-amber-400 shadow-xl shadow-amber-950/30 cursor-pointer active:scale-98'
                  : 'bg-stone-950/60 border-stone-800 opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                {/* Rarity & Chamber Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRarityBadge(artifact.rarity)}`}>
                    {artifact.rarity}
                  </span>
                  <span className="text-[11px] text-stone-400 font-cinzel">
                    Chamber {artifact.chamberUnlockedAt}
                  </span>
                </div>

                {/* Relic Icon & Title */}
                <div className="my-4 flex flex-col items-center text-center space-y-2">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner ${
                    isCollected
                      ? 'bg-amber-950/30 border-amber-500/40 shadow-amber-500/10'
                      : 'bg-stone-900 border-stone-800 text-stone-600'
                  }`}>
                    {isCollected ? getIcon(artifact.id) : <Lock className="w-6 h-6 text-stone-600" />}
                  </div>

                  <h3 className="font-cinzel text-base font-bold text-stone-100">
                    {isCollected ? artifact.name : 'Unknown Ancient Relic'}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                    {isCollected ? artifact.description : `Conquer Chamber 0${artifact.chamberUnlockedAt} to unseal this relic.`}
                  </p>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-stone-800/80 text-center">
                {isCollected ? (
                  <span className="text-xs font-cinzel text-amber-400 font-semibold flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Inspect Relic</span>
                  </span>
                ) : (
                  <span className="text-xs text-stone-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Encased in Sandstone</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-stone-900 border-2 border-amber-500/60 p-6 space-y-5 shadow-2xl text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-center shadow-lg">
              {getIcon(selectedArtifact.id)}
            </div>

            <div className="space-y-1">
              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRarityBadge(selectedArtifact.rarity)}`}>
                {selectedArtifact.rarity} Relic
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-amber-100">
                {selectedArtifact.name}
              </h2>
              <p className="text-xs text-amber-300/80 italic font-cinzel">
                Unsealed in Chamber 0{selectedArtifact.chamberUnlockedAt}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/70 border border-amber-700/20 text-xs text-stone-300 leading-relaxed space-y-2 text-left">
              <p><strong>Description:</strong> {selectedArtifact.description}</p>
              <p className="pt-2 border-t border-stone-800 text-stone-400 italic">
                "{selectedArtifact.lore}"
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedArtifact(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider hover:from-amber-300 cursor-pointer"
            >
              Close Codex
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
