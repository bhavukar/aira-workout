'use client';

import React from 'react';
import { WorkoutMode } from '../../types/workout';

interface DynamicIslandProps {
  isSpeaking: boolean;
  mode: WorkoutMode;
  onClick?: () => void;
}

export default function DynamicIsland({ isSpeaking, mode, onClick }: DynamicIslandProps) {
  const isExpanded = isSpeaking || mode === 'recovery';

  return (
    <div
      onClick={onClick}
      className={`absolute top-[11px] left-1/2 -translate-x-1/2 h-[34px] rounded-[20px] bg-black flex items-center justify-between px-3 transition-all duration-300 shadow-lg cursor-pointer select-none z-30 ${
        isExpanded ? 'w-[146px]' : 'w-[124px]'
      }`}
      role="status"
      aria-label="Dynamic Island"
    >
      {/* Left side: Animated Waveform or Status Indicator */}
      <div className="flex items-center gap-1.5 overflow-hidden">
        {isSpeaking ? (
          <div className="flex items-center gap-[2.5px]">
            <span className="w-[2.5px] h-[8px] bg-[#F2541A] rounded-full animate-wave-1"></span>
            <span className="w-[2.5px] h-[13px] bg-[#F2541A] rounded-full animate-wave-3"></span>
            <span className="w-[2.5px] h-[7px] bg-[#F2541A] rounded-full animate-wave-2"></span>
            <span className="w-[2.5px] h-[11px] bg-[#F2541A] rounded-full animate-wave-4"></span>
          </div>
        ) : mode === 'recovery' ? (
          <span className="text-[10px] font-bold tracking-wider text-sky-400 font-mono">
            REST
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
        )}
      </div>

      {/* Right side: Hardware Camera Sensor Aperture */}
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#0a0a23]/60"></div>
        </div>
      </div>
    </div>
  );
}
