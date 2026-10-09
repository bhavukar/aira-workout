'use client';

import React, { useState } from 'react';

interface DebriefCardProps {
  onRestart: () => void;
}

export default function DebriefCard({ onRestart }: DebriefCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = `AiRA Workout Summary:
• Active Time: 12m 14s
• Energy Burn: 184 kcal
• Peak Heart Rate: 178 BPM
• Form Score: 96%
• Adaptation: Romanian Deadlifts
• Takeaway: Target 30g protein for recovery.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-black/5 space-y-4 font-sans animate-slide-up-fade">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-0.5">
            Workout Complete
          </span>
          <h2 className="text-xl font-black tracking-tight text-neutral-950">
            Session Debrief
          </h2>
        </div>
        <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold text-base">
          <i className="bx bx-check"></i>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-neutral-900 animate-slide-up-fade delay-150">
        <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-black/5 flex flex-col justify-between min-h-[64px]">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Active Time</span>
          <span className="text-sm font-black text-neutral-950 mt-1 block">12m 14s</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-black/5 flex flex-col justify-between min-h-[64px]">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Energy Burn</span>
          <span className="text-sm font-black text-[#F2541A] mt-1 block">184 kcal</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-black/5 flex flex-col justify-between min-h-[64px]">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Peak Heart Rate</span>
          <span className="text-sm font-black text-neutral-950 mt-1 flex items-center gap-1.5">
            <i className="bx bxs-heart text-red-500 text-sm"></i> 178 BPM
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-black/5 flex flex-col justify-between min-h-[64px]">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Form Quality</span>
          <span className="text-sm font-black text-neutral-950 mt-1 block">96%</span>
        </div>
      </div>

      {/* Coach Takeaway */}
      <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-black/5 text-xs text-neutral-700 space-y-1 animate-slide-up-fade delay-250">
        <span className="font-bold text-neutral-950 block text-[11px]">
          Coach AiRA Summary:
        </span>
        <p className="leading-snug text-[11px] text-neutral-600">
          Full lower body session completed. Joint-friendly knee adaptation applied. Target 30g protein for optimal recovery.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1 animate-slide-up-fade delay-350">
        <button
          onClick={handleCopySummary}
          className="py-3.5 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <i className={`bx ${copied ? 'bx-check text-neutral-900' : 'bx-copy'} text-base`}></i>
          {copied ? 'Copied Log!' : 'Copy Summary'}
        </button>

        <button
          onClick={onRestart}
          className="py-3.5 px-4 rounded-full bg-[#141414] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
        >
          <i className="bx bx-refresh text-base"></i> Restart
        </button>
      </div>
    </div>
  );
}
