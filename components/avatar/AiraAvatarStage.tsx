'use client';

import React from 'react';
import { WorkoutMode } from '../../types/workout';

interface AiraAvatarStageProps {
  isSpeaking: boolean;
  mode: WorkoutMode;
  onAvatarClick?: () => void;
  size?: 'hero' | 'compact';
}

export default function AiraAvatarStage({
  isSpeaking,
  mode,
  onAvatarClick,
  size = 'compact',
}: AiraAvatarStageProps) {
  const isHero = size === 'hero' || mode === 'standby';

  let statusLabel = 'Tap to Start';
  if (isSpeaking) {
    statusLabel = 'Speaking';
  } else if (mode === 'interval' || mode === 'adaptive-swap' || mode === 'intensity') {
    statusLabel = 'Coaching';
  } else if (mode === 'recovery') {
    statusLabel = 'Rest Pacer';
  } else if (mode === 'debrief') {
    statusLabel = 'Complete';
  }

  if (isHero) {
    return (
      <div
        onClick={onAvatarClick}
        className="flex flex-col items-center justify-center py-2 cursor-pointer select-none group"
        title="Tap AiRA"
      >
        {/* Apple-style Hero Avatar with gentle ambient lift */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-b from-[#F2541A]/10 to-transparent blur-xl pointer-events-none" />
          <img
            src="/images/aira/aira-idle.png"
            alt="AiRA AI Companion"
            className="w-36 h-36 sm:w-40 sm:h-40 object-contain relative z-10 animate-float drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    );
  }

  // Compact Companion Avatar
  return (
    <div
      onClick={onAvatarClick}
      className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-black/5 shadow-xs cursor-pointer select-none transition-all hover:bg-white active:scale-[0.98]"
      title="Tap to hear AiRA coaching"
    >
      <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
        <img
          src="/images/aira/aira-idle.png"
          alt="AiRA Companion"
          className="w-11 h-11 object-contain animate-float"
        />
        {isSpeaking && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#F2541A] border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900">AiRA</span>
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-neutral-600 truncate mt-0.5">
          {isSpeaking ? 'Speaking...' : 'Listening in background'}
        </p>
      </div>

      <i className="bx bx-volume-full text-base text-neutral-400"></i>
    </div>
  );
}
