'use client';

import React from 'react';
import { ExerciseData } from '../../types/workout';
import { unlockAudio, playAudioChime } from '../../lib/audio';

interface BiomechanicalCardProps {
  exercise: ExerciseData;
  timerSeconds: number;
  timerActive: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onNext: () => void;
  onFinishWorkout?: () => void;
  formatTimer: (seconds: number) => string;
}

export default function BiomechanicalCard({
  exercise,
  timerSeconds,
  timerActive,
  onToggleTimer,
  onResetTimer,
  onNext,
  onFinishWorkout,
  formatTimer,
}: BiomechanicalCardProps) {
  const progressRatio = exercise.duration > 0 ? timerSeconds / exercise.duration : 0;
  const strokeDashoffset = 264 - 264 * progressRatio;

  const handleFinish = () => {
    unlockAudio();
    playAudioChime(640, 'sine', 0.08);
    onFinishWorkout?.();
  };

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-black/5 space-y-3.5 font-sans animate-slide-up-fade">
      {/* Adaptation Banner if knee was swapped */}
      {exercise.adapted && (
        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-950 flex items-center justify-between shadow-2xs animate-scale-up-fade">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100/90 flex items-center justify-center flex-shrink-0 text-amber-700">
              <i className="bx bx-shield text-base"></i>
            </div>
            <div>
              <div className="text-xs font-bold leading-tight text-amber-950">
                Adapted for Knee Comfort
              </div>
              <div className="text-[11px] text-amber-800/80 font-medium">
                Swapped to Romanian Deadlifts &middot; Reduced joint load
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header: Exercise Name & Heart Rate */}
      <div className="flex items-start justify-between animate-slide-up-fade">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-0.5">
            Current Interval
          </span>
          <h2 className="text-xl font-black tracking-tight text-neutral-950 leading-tight">
            {exercise.name}
          </h2>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            {exercise.target}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 font-bold text-xs shadow-xs border border-red-100/60">
          <i className="bx bxs-heart text-red-500 text-sm"></i>
          <span>{exercise.hrBpm} BPM</span>
        </div>
      </div>

      {/* Circular Countdown Timer */}
      <div className="relative py-1 flex items-center justify-center animate-scale-up-fade delay-150">
        <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#F4F3EE"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#F2541A"
              strokeWidth="5.5"
              strokeDasharray="264"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-3xl font-black tracking-tight text-neutral-950 font-mono tabular-nums leading-none">
              {formatTimer(timerSeconds)}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mt-1.5">
              {timerActive ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Form & Tempo */}
      <div className="pt-2.5 border-t border-black/5 space-y-1 text-xs animate-slide-up-fade delay-250">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-bold text-neutral-900 flex-shrink-0">Tempo</span>
          <span className="font-mono text-neutral-800 font-bold text-[11px] text-right">
            {exercise.tempo}
          </span>
        </div>
        <p className="text-xs text-neutral-600 leading-snug">
          {exercise.formCue}
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-2 pt-1 animate-slide-up-fade delay-350">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onToggleTimer}
            className={`py-3 px-2 rounded-full font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 ${
              timerActive
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200/80'
                : 'bg-[#141414] hover:bg-black text-white shadow-xs'
            }`}
          >
            <i className={`bx ${timerActive ? 'bx-pause' : 'bx-play'} text-base`}></i>
            {timerActive ? 'Pause' : 'Resume'}
          </button>

          <button
            onClick={onResetTimer}
            className="py-3 px-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <i className="bx bx-refresh text-base"></i> Reset
          </button>

          <button
            onClick={onNext}
            className="py-3 px-2 rounded-full bg-[#141414] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
          >
            Rest <i className="bx bx-chevron-right text-base"></i>
          </button>
        </div>

        {/* End Workout CTA button */}
        {onFinishWorkout && (
          <button
            onClick={handleFinish}
            className="w-full py-2.5 px-4 rounded-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <i className="bx bx-check-circle text-emerald-600 text-sm"></i>
            End Session &amp; View Debrief
          </button>
        )}
      </div>
    </div>
  );
}
