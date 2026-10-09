'use client';

import React from 'react';
import { WorkoutMode } from '../../types/workout';
import { PRESET_ACTIONS } from '../../lib/constants';
import { playAudioChime } from '../../lib/audio';

interface HeroEditorialProps {
  mode: WorkoutMode;
  onTriggerMode: (mode: WorkoutMode, userPrompt?: string) => void;
  onOpenThesis: () => void;
}

export default function HeroEditorial({
  mode,
  onTriggerMode,
  onOpenThesis,
}: HeroEditorialProps) {
  return (
    <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
      <div className="space-y-3">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FAF6EE] leading-[1.06]">
          Chat was the<br />
          <span className="font-pixel text-[#FAF6EE] tracking-normal font-normal">First draft.</span>
        </h1>
        <p className="text-base md:text-lg text-[#9D9890] font-normal leading-relaxed max-w-xl pt-1">
          Chatbots were never the final form. AiRA is the first AI whose voice you can talk over, whose screen brings what you imagine to life, and whose face shows you how she feels.
        </p>
      </div>

      {/* Quick Voice Interruption Presets with Stadium Styling & Boxicons */}
      <div className="space-y-2.5 pt-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9D9890] flex items-center gap-2">
          <i className="bx bx-radio-circle-marked text-[#F2541A] text-base animate-pulse"></i>
          Interactive Workout Flow · Test Any Mode
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_ACTIONS.slice(0, 4).map((preset) => {
            const isActive = mode === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onTriggerMode(preset.id, preset.userPrompt)}
                className={`py-3.5 px-5 rounded-full border text-left transition-all flex items-center justify-between group active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#F2541A]/15 border-[#F2541A] text-white shadow-lg shadow-[#F2541A]/10'
                    : 'bg-white/5 border-white/15 text-[#C5BFB5] hover:bg-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <i
                      className={`bx ${preset.iconClass} text-xl`}
                      style={{ color: preset.iconColor }}
                    ></i>
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-1.5">
                      {preset.title}
                    </div>
                    <div className="text-xs text-[#9D9890]">{preset.subtitle}</div>
                  </div>
                </div>
                <i className="bx bx-chevron-right text-lg text-[#9D9890] group-hover:translate-x-0.5 transition-transform"></i>
              </button>
            );
          })}
        </div>

        {/* Preset 5: Debrief */}
        {PRESET_ACTIONS.slice(4, 5).map((preset) => {
          const isActive = mode === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onTriggerMode(preset.id, preset.userPrompt)}
              className={`w-full py-4 px-6 rounded-full border text-left transition-all flex items-center justify-between group active:scale-[0.98] ${
                isActive
                  ? 'bg-[#F2541A]/15 border-[#F2541A] text-white shadow-lg shadow-[#F2541A]/10'
                  : 'bg-white/5 border-white/15 text-[#C5BFB5] hover:bg-white/10 hover:border-white/25'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <i
                    className={`bx ${preset.iconClass} text-xl`}
                    style={{ color: preset.iconColor }}
                  ></i>
                </div>
                <div>
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    {preset.title}
                  </div>
                  <div className="text-xs text-[#9D9890]">{preset.subtitle}</div>
                </div>
              </div>
              <i className="bx bx-chevron-right text-lg text-[#9D9890] group-hover:translate-x-0.5 transition-transform"></i>
            </button>
          );
        })}
      </div>

      {/* Builder's Thesis Clean Stadium Card */}
      <div className="pt-1">
        <button
          onClick={() => {
            playAudioChime(580);
            onOpenThesis();
          }}
          className="w-full py-4 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#F2541A] text-left transition-all flex items-center justify-between group shadow-sm active:scale-[0.98]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#F2541A] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              <i className="bx bx-book-open"></i>
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>The Builder&apos;s Thesis</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[9px] uppercase tracking-wider font-bold text-[#FAF6EE]">
                  Legal Spec
                </span>
              </div>
              <div className="text-xs text-[#9D9890]">
                How It Was Before vs. How We Fix It &middot; Read Full Publication
              </div>
            </div>
          </div>
          <i className="bx bx-chevron-right text-2xl text-[#9D9890] group-hover:text-white group-hover:translate-x-1 transition-all"></i>
        </button>
      </div>

      {/* Tri-Pillar Architecture Note */}
      <div className="pt-0.5 flex flex-wrap items-center gap-6 text-xs text-[#9D9890]">
        <span className="flex items-center gap-1.5">
          <i className="bx bx-microphone text-[#F2541A]"></i> Talk Over Anytime
        </span>
        <span className="flex items-center gap-1.5">
          <i className="bx bx-layer text-[#F2541A]"></i> Stadium Athletic Cards
        </span>
        <span className="flex items-center gap-1.5">
          <i className="bx bx-heart text-[#F2541A]"></i> Real Biomechanical Feedback
        </span>
      </div>
    </div>
  );
}
