'use client';

import React from 'react';
import { WorkoutMode } from '../../types/workout';

interface TopMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: WorkoutMode) => void;
  onOpenThesis: () => void;
}

export default function TopMenuModal({
  isOpen,
  onClose,
  onSelectMode,
  onOpenThesis,
}: TopMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-[108px] left-4 right-4 liquid-glass rounded-[28px] p-4 z-40 shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-white/80 text-[#141414] animate-fadeIn backdrop-blur-2xl font-sans">
      <div className="flex items-center justify-between pb-2.5 border-b border-black/5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Workout Modes
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-black/5 transition-colors"
          aria-label="Close"
        >
          <i className="bx bx-x text-lg"></i>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3">
        <button
          onClick={() => {
            onSelectMode('standby');
            onClose();
          }}
          className="text-left p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-900 transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="bx bx-home-alt text-base text-[#F2541A]"></i>
          <span>Standby</span>
        </button>

        <button
          onClick={() => {
            onSelectMode('briefing');
            onClose();
          }}
          className="text-left p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-900 transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="bx bx-info-circle text-base text-[#F2541A]"></i>
          <span>Circuit Plan</span>
        </button>

        <button
          onClick={() => {
            onSelectMode('interval');
            onClose();
          }}
          className="text-left p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-900 transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="bx bx-dumbbell text-base text-[#F2541A]"></i>
          <span>Intervals</span>
        </button>

        <button
          onClick={() => {
            onSelectMode('recovery');
            onClose();
          }}
          className="text-left p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-900 transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="bx bx-wind text-base text-sky-600"></i>
          <span>Rest Pacer</span>
        </button>

        <button
          onClick={() => {
            onSelectMode('debrief');
            onClose();
          }}
          className="col-span-2 text-left p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-900 transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="bx bx-trophy text-base text-emerald-600"></i>
          <span>Session Debrief</span>
        </button>

        {/* Builder Thesis inside Phone Menu */}
        <button
          onClick={() => {
            onOpenThesis();
            onClose();
          }}
          className="col-span-2 text-left p-3 rounded-2xl bg-[#141414] hover:bg-black text-white text-xs font-bold flex items-center justify-between transition-all active:scale-95 shadow-xs"
        >
          <span className="flex items-center gap-2">
            <i className="bx bx-book-open text-base text-[#F2541A]"></i>
            <span>The Builder&apos;s Thesis</span>
          </span>
          <span className="text-[10px] text-neutral-300 font-bold uppercase">Read &rarr;</span>
        </button>
      </div>
    </div>
  );
}
