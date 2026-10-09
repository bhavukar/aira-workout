'use client';

import React, { useState, useEffect, useRef } from 'react';
import DitherVeil from '../ui/DitherVeil';
import { playBreathTap } from '../../lib/audio';

interface BreathingPacerCardProps {
  timerSeconds: number;
  onAddRest: () => void;
  onReadyToPush: () => void;
  formatTimer: (seconds: number) => string;
}

export default function BreathingPacerCard({
  timerSeconds,
  onAddRest,
  onReadyToPush,
  formatTimer,
}: BreathingPacerCardProps) {
  // Breathing cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const prevPhaseRef = useRef<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    const interval = setInterval(() => {
      const sec = Math.floor(Date.now() / 1000) % 12;
      let nextPhase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
      if (sec < 4) nextPhase = 'Inhale';
      else if (sec < 8) nextPhase = 'Hold';
      else nextPhase = 'Exhale';

      setBreathPhase((prev) => {
        if (prev !== nextPhase) {
          if (nextPhase === 'Inhale') playBreathTap('inhale');
          else if (nextPhase === 'Hold') playBreathTap('hold');
          else if (nextPhase === 'Exhale') playBreathTap('exhale');
        }
        return nextPhase;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-black/5 space-y-3 font-sans animate-slide-up-fade">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 block mb-0.5">
            Rest Interval
          </span>
          <h2 className="text-xl font-black tracking-tight text-neutral-950 leading-tight">
            Guided Breathing
          </h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-900 text-xs font-black font-mono">
          {formatTimer(timerSeconds)}
        </span>
      </div>

      {/* Phase Indicator Strip (Clean, positioned above the veil) */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#FAF9F5] border border-black/5 animate-slide-up-fade delay-75">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F2541A]" />
          <span className="text-xs font-black text-neutral-950 uppercase tracking-widest">
            {breathPhase}
          </span>
        </div>
        <span className="text-xs text-neutral-500 font-mono font-bold">
          4 seconds
        </span>
      </div>

      {/* Interactive DitherVeil Stage - Seamless with card, breathing pulse */}
      <div className={`relative w-full h-64 rounded-[28px] overflow-hidden cursor-pointer transition-transform duration-1000 ease-in-out ${
        breathPhase === 'Inhale' ? 'scale-[1.03]' : breathPhase === 'Exhale' ? 'scale-[0.97]' : 'scale-100'
      }`}>
        <DitherVeil
          src="/images/dither-head-clean.png"
          pattern="floyd"
          pixelSize={2}
          inkColor="#120f17"
          paperColor="#ffffff"
          revealRadius={160}
          softness={0.4}
          linger={2.8}
          rimColor="#F97316"
          rim={0.2}
          contrast={1.15}
          brightness={-0.04}
          wander={true}
          clickBurst={true}
        />
      </div>

      {/* Clean Symmetric Metrics Row */}
      <div className="grid grid-cols-2 gap-2 text-xs animate-slide-up-fade delay-250">
        <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-black/5 flex flex-col justify-between min-h-[64px]">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Heart Rate</span>
          <div className="flex items-center gap-1.5 mt-1">
            <i className="bx bxs-heart text-red-500 text-sm shrink-0"></i>
            <span className="text-xs font-black text-neutral-950 whitespace-nowrap">
              164 <span className="text-neutral-400 font-normal">&rarr;</span> 138 <span className="text-[10px] font-bold text-neutral-500">BPM</span>
            </span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-black/5 flex flex-col justify-between min-h-[64px]">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Pacing Cadence</span>
          <div className="flex items-center gap-1.5 mt-1">
            <i className="bx bx-time-five text-sky-600 text-sm shrink-0"></i>
            <span className="text-xs font-black text-neutral-950 whitespace-nowrap">
              4s In <span className="text-neutral-400 font-normal">&middot;</span> 4s Out
            </span>
          </div>
        </div>
      </div>

      {/* Apple-Grade Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1 animate-slide-up-fade delay-350">
        <button
          onClick={onAddRest}
          className="py-3.5 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <i className="bx bx-plus text-base"></i> +20s Rest
        </button>
        <button
          onClick={onReadyToPush}
          className="py-3.5 px-4 rounded-full bg-[#141414] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
        >
          Ready to Push <i className="bx bx-chevron-right text-base"></i>
        </button>
      </div>
    </div>
  );
}
