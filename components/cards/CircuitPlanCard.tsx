'use client';

import React, { useState } from 'react';

interface CircuitPlanCardProps {
  onStart: () => void;
}

export default function CircuitPlanCard({ onStart }: CircuitPlanCardProps) {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);

  const exercises = [
    {
      id: 1,
      name: '1. Bulgarian Split Squats',
      sets: '3 Sets · 45s',
      cue: 'Elevate rear foot, hinge torso slightly, drive through midfoot.',
    },
    {
      id: 2,
      name: '2. Hollow Body Holds',
      sets: '3 Sets · 35s',
      cue: 'Press lumbar spine into floor, reach toes, engage core.',
    },
    {
      id: 3,
      name: '3. Kettlebell Swing Finisher',
      sets: '3 Sets · 40s',
      cue: 'Explosive hip snap, neutral neck, avoid squatting.',
    },
  ];

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-black/5 space-y-4 font-sans animate-slide-up-fade">
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2541A] block mb-0.5">
            Circuit Structure
          </span>
          <h2 className="text-xl font-black tracking-tight text-neutral-950">
            Lower Body Power
          </h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold font-mono">
          12:00 Total
        </span>
      </div>

      <div className="space-y-2 text-xs animate-slide-up-fade delay-150">
        {exercises.map((ex, idx) => (
          <div
            key={ex.id}
            onClick={() => setSelectedExercise(selectedExercise === idx ? null : idx)}
            className="p-3.5 rounded-2xl bg-[#FAF9F5] hover:bg-neutral-100/80 border border-black/5 cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900">{ex.name}</span>
              <span className="text-neutral-500 font-mono text-[11px] font-semibold">{ex.sets}</span>
            </div>
            {selectedExercise === idx && (
              <p className="mt-2.5 pt-2.5 border-t border-black/5 text-xs text-neutral-600 leading-snug animate-fadeIn">
                <span className="font-bold text-neutral-900">Form Cue: </span>
                {ex.cue}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 font-medium px-1 animate-slide-up-fade delay-250">
        <span>Target: <b className="text-neutral-900">155–170 BPM</b></span>
        <span>Rest: <b className="text-neutral-900">30s</b></span>
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 px-6 rounded-full bg-[#141414] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 animate-slide-up-fade delay-350"
      >
        <i className="bx bx-play text-lg text-[#F2541A]"></i>
        Start 12-Min Circuit
      </button>
    </div>
  );
}
