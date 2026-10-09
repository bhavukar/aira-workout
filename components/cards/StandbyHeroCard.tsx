'use client';

import React, { useState, useEffect } from 'react';
import AiraAvatarStage from '../avatar/AiraAvatarStage';
import { WorkoutMode } from '../../types/workout';

interface StandbyHeroCardProps {
  isSpeaking: boolean;
  mode: WorkoutMode;
  airaDialogue: string;
  onAvatarClick: () => void;
  onStartCircuit: () => void;
  onAdaptKnee: () => void;
}

export default function StandbyHeroCard({
  isSpeaking,
  mode,
  airaDialogue,
  onAvatarClick,
  onStartCircuit,
  onAdaptKnee,
}: StandbyHeroCardProps) {
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Track speech cycle: when speaking starts, record it; when it ends, show the buttons
  useEffect(() => {
    if (isSpeaking) {
      setHasStartedAudio(true);
      setShowOptions(false);
    } else if (hasStartedAudio) {
      const timer = setTimeout(() => {
        setShowOptions(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, hasStartedAudio]);

  // Fallback: If autoplay was blocked, reveal buttons after 4.5s
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setShowOptions(true);
    }, 4500);
    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between py-1">
      {/* Centered AiRA Avatar */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 animate-scale-up-fade">
        <AiraAvatarStage
          isSpeaking={isSpeaking}
          mode={mode}
          size="hero"
          onAvatarClick={onAvatarClick}
        />
      </div>

      {/* Apple-Style Coach Speech Card */}
      <div className="bg-white rounded-[28px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 space-y-2 mb-2.5 animate-slide-up-fade">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400">
          <span className="flex items-center gap-1.5 text-neutral-900">
            <i className="bx bx-bot text-[#F2541A] text-base"></i>
            AiRA Kickoff Briefing
          </span>
          {isSpeaking && (
            <span className="text-[10px] text-[#F2541A] font-mono font-bold animate-pulse">
              SPEAKING
            </span>
          )}
        </div>
        <p className="font-sans font-medium text-[14px] leading-snug text-neutral-950">
          &ldquo;{airaDialogue}&rdquo;
        </p>
      </div>

      {/* Action Buttons: Animate in after audio completes */}
      {showOptions ? (
        <div className="space-y-2 mb-2 animate-slide-up-fade">
          <button
            onClick={onStartCircuit}
            className="w-full py-3.5 px-5 rounded-full bg-[#141414] hover:bg-black text-white font-bold text-xs flex items-center justify-between transition-all active:scale-95 shadow-xs animate-slide-up-fade"
          >
            <span className="flex items-center gap-2">
              <i className="bx bx-play text-lg text-[#F2541A]"></i>
              &quot;All good! Start 12-Min Circuit&quot;
            </span>
            <i className="bx bx-chevron-right text-neutral-400 text-base"></i>
          </button>

          <button
            onClick={onAdaptKnee}
            className="w-full py-3.5 px-5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-900 font-bold text-xs flex items-center justify-between transition-all active:scale-95 animate-slide-up-fade delay-100"
          >
            <span className="flex items-center gap-2">
              <i className="bx bx-shield-quarter text-amber-600 text-base"></i>
              &quot;Knee hurts, swap to Romanian Deadlift&quot;
            </span>
            <i className="bx bx-chevron-right text-neutral-400 text-base"></i>
          </button>
        </div>
      ) : (
        <div className="h-[96px] mb-2 flex items-center justify-center animate-fade-in">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/5 text-xs text-neutral-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#F2541A] animate-pulse" />
            <span>AiRA speaking...</span>
          </div>
        </div>
      )}

      {/* Workout Meta */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-medium px-2 pb-1">
        <span>
          Target: <b className="text-neutral-900">Lower Body Power</b>
        </span>
        <span>
          Pacing: <b className="text-neutral-900">Adaptive Voice</b>
        </span>
      </div>
    </div>
  );
}
