'use client';

import React from 'react';
import DynamicIsland from './DynamicIsland';
import { WorkoutMode } from '../../types/workout';

interface StatusBarProps {
  isSpeaking: boolean;
  mode: WorkoutMode;
  onDynamicIslandClick: () => void;
}

export default function StatusBar({
  isSpeaking,
  mode,
  onDynamicIslandClick,
}: StatusBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 h-[54px] px-8 flex items-center justify-between z-30 font-semibold text-[15px] text-[#141414] pointer-events-none">
      <span>9:41</span>

      {/* Dynamic Island Component */}
      <div className="pointer-events-auto">
        <DynamicIsland
          isSpeaking={isSpeaking}
          mode={mode}
          onClick={onDynamicIslandClick}
        />
      </div>

      {/* Cellular bars, Wifi, Battery */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px]">
          <span className="w-[3px] h-[4px] bg-[#141414] rounded-[1px]"></span>
          <span className="w-[3px] h-[7px] bg-[#141414] rounded-[1px]"></span>
          <span className="w-[3px] h-[10px] bg-[#141414] rounded-[1px]"></span>
          <span className="w-[3px] h-[13px] bg-[#141414] rounded-[1px]"></span>
        </div>
        <i className="bx bx-wifi text-sm leading-none ml-0.5"></i>
        {/* Apple style battery with nub */}
        <div className="flex items-center ml-0.5">
          <div className="w-[22px] h-[11px] border-[1.5px] border-[#141414] rounded-[4px] p-[1.5px] flex items-center">
            <div className="w-[85%] h-full bg-[#141414] rounded-[1.5px]"></div>
          </div>
          <div className="w-[1.5px] h-[4px] bg-[#141414] rounded-r-[1px]"></div>
        </div>
      </div>
    </div>
  );
}
