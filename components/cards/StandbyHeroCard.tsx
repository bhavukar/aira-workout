'use client';

import React, { useState, useEffect } from 'react';
import AiraAvatarStage from '../avatar/AiraAvatarStage';
import { WorkoutMode } from '../../types/workout';
import { playAudioChime, unlockAudio } from '../../lib/audio';

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
  const [hasCompletedAudio, setHasCompletedAudio] = useState<boolean>(false);
  const [hasStartedAudio, setHasStartedAudio] = useState<boolean>(false);

  // Track speech lifecycle
  useEffect(() => {
    if (isSpeaking) {
      setHasStartedAudio(true);
      setHasCompletedAudio(false);
    } else if (hasStartedAudio) {
      // Audio finished playing
      const timer = setTimeout(() => {
        setHasCompletedAudio(true);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, hasStartedAudio]);

  // Fallback: If audio was muted or autoplay blocked, reveal cards after 6s
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setHasCompletedAudio(true);
    }, 6000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  const handleStart = () => {
    unlockAudio();
    playAudioChime(640, 'sine', 0.08);
    onStartCircuit();
  };

  const handleKneeAdapt = () => {
    unlockAudio();
    playAudioChime(580, 'sine', 0.08);
    onAdaptKnee();
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-1 font-sans">
      {/* Centered AiRA Avatar */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 animate-scale-up-fade">
        <AiraAvatarStage
          isSpeaking={isSpeaking}
          mode={mode}
          size="hero"
          onAvatarClick={onAvatarClick}
        />
      </div>

      {/* Apple-Style Coach Speech Bubble */}
      <div className="bg-white rounded-[28px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 space-y-2 mb-2.5 animate-slide-up-fade">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400">
          <span className="flex items-center gap-1.5 text-neutral-900">
            <i className="bx bx-bot text-[#F2541A] text-base"></i>
            AiRA Kickoff Briefing
          </span>
          {isSpeaking ? (
            <span className="text-[10px] text-[#F2541A] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2541A] animate-ping" />
              SPEAKING...
            </span>
          ) : (
            <span className="text-[10px] text-neutral-400 font-mono">
              READY
            </span>
          )}
        </div>
        <p className="font-sans font-medium text-[14px] leading-snug text-neutral-950">
          &ldquo;{airaDialogue}&rdquo;
        </p>
      </div>

      {/* Option Cards: Reveal strictly after audio finishes playing */}
      {hasCompletedAudio && !isSpeaking ? (
        <div className="space-y-2 mb-2 animate-slide-up-fade">
          <button
            onClick={handleStart}
            className="w-full py-3.5 px-5 rounded-full bg-[#141414] hover:bg-black text-white font-bold text-xs flex items-center justify-between transition-all active:scale-95 shadow-xs"
          >
            <span className="flex items-center gap-2">
              <i className="bx bx-play text-lg text-[#F2541A]"></i>
              &quot;All good! Start 12-Min Circuit&quot;
            </span>
            <i className="bx bx-chevron-right text-neutral-400 text-base"></i>
          </button>

          <button
            onClick={handleKneeAdapt}
            className="w-full py-3.5 px-5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-900 font-bold text-xs flex items-center justify-between transition-all active:scale-95"
          >
            <span className="flex items-center gap-2">
              <i className="bx bx-shield-quarter text-amber-600 text-base"></i>
              &quot;Knee hurts, swap to Romanian Deadlift&quot;
            </span>
            <i className="bx bx-chevron-right text-neutral-400 text-base"></i>
          </button>
        </div>
      ) : (
        /* While speaking, keep a sleek listening placeholder space with zero distracting layout shift */
        <div className="h-[96px] mb-2 flex items-center justify-center select-none text-neutral-400 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2541A] animate-pulse" />
            <span>Listening to coach briefing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
