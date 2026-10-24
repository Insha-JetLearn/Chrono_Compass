import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface NuruCompanionProps {
  message: string;
  subMessage?: string;
  onAskHint?: () => void;
  canHint?: boolean;
}

export const NuruCompanion: React.FC<NuruCompanionProps> = ({
  message,
  subMessage,
  onAskHint,
  canHint = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950/90 border border-amber-500/30 p-3.5 shadow-xl shadow-amber-950/20 backdrop-blur-md">
      {/* Ancient Egyptian hieroglyph corner accents */}
      <div className="absolute top-1.5 left-2 text-[10px] text-amber-500/30 font-cinzel select-none">𓀀</div>
      <div className="absolute top-1.5 right-2 text-[10px] text-amber-500/30 font-cinzel select-none">𓆣</div>

      <div className="flex items-start gap-3.5">
        {/* Nuru Avatar with pulsating celestial ring */}
        <div className="relative shrink-0">
          <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md shadow-amber-500/30 ring-2 ring-cyan-500/20 bg-stone-900">
            <img
              src="/src/assets/images/nuru_companion_avatar_1792857284368.jpg"
              alt="Nuru Celestial Companion"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-sm font-bold text-amber-300 tracking-wide">Nuru</span>
              <span className="text-[11px] text-cyan-400/80 font-medium tracking-tight">Guardian of Time</span>
            </div>
            
            <button
              onClick={() => {
                audioSystem.playTap();
                setIsCollapsed(!isCollapsed);
              }}
              aria-label={isCollapsed ? 'Expand Nuru dialogue' : 'Collapse Nuru dialogue'}
              className="p-1 text-stone-400 hover:text-amber-300 transition-colors"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {!isCollapsed && (
            <div className="mt-1 space-y-1.5">
              <p className="text-xs md:text-sm text-stone-200 leading-relaxed font-normal">
                "{message}"
              </p>
              {subMessage && (
                <p className="text-xs text-amber-300/80 italic">
                  {subMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Action when collapsed */}
      {isCollapsed && (
        <div className="mt-1 text-xs text-stone-300 truncate">
          "{message}"
        </div>
      )}
    </div>
  );
};
