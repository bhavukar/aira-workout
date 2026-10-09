'use client';

import React from 'react';
import { playAudioChime } from '../../lib/audio';

interface BottomComposerBarProps {
  isSpeaking: boolean;
  onPaperclipClick: () => void;
  onMicClick: () => void;
  onKeyboardClick: () => void;
  onIntensityClick: () => void;
}

export default function BottomComposerBar({
  isSpeaking,
  onPaperclipClick,
  onMicClick,
  onKeyboardClick,
  onIntensityClick,
}: BottomComposerBarProps) {
  return (
    <div className="absolute bottom-5 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
      {/* Left Action Cap: Plan Overview / Standby */}
      <button
        onClick={() => {
          playAudioChime(480);
          onPaperclipClick();
        }}
        className="w-[44px] h-[44px] rounded-full liquid-glass flex items-center justify-center text-neutral-700 hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all shadow-xs"
        title="Session Overview / Standby"
        aria-label="Overview"
      >
        <i className="bx bx-list-ul text-xl"></i>
      </button>

      {/* Central Capsule: Apple Siri-Style Live Waveform & Keyboard */}
      <div className="flex items-center px-1.5 py-1 rounded-full liquid-glass border border-black/5 shadow-md">
        <button
          onClick={onMicClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] text-white shadow-xs active:scale-95 transition-transform"
          title="AiRA Live Voice Waveform"
          aria-label="Live Voice"
        >
          {/* 5 Equalizer Waveform Bars */}
          <div className="flex items-center gap-[3px] h-3.5">
            <span
              className={`w-[2.5px] bg-white rounded-full transition-all ${
                isSpeaking ? 'animate-wave-1' : 'h-1'
              }`}
            ></span>
            <span
              className={`w-[2.5px] bg-white rounded-full transition-all ${
                isSpeaking ? 'animate-wave-3' : 'h-2'
              }`}
            ></span>
            <span
              className={`w-[2.5px] bg-white rounded-full transition-all ${
                isSpeaking ? 'animate-wave-5' : 'h-3.5'
              }`}
            ></span>
            <span
              className={`w-[2.5px] bg-white rounded-full transition-all ${
                isSpeaking ? 'animate-wave-2' : 'h-2'
              }`}
            ></span>
            <span
              className={`w-[2.5px] bg-white rounded-full transition-all ${
                isSpeaking ? 'animate-wave-4' : 'h-1'
              }`}
            ></span>
          </div>
        </button>

        <button
          onClick={() => {
            playAudioChime(540);
            onKeyboardClick();
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 active:scale-95 transition-transform ml-0.5"
          title="Type a voice command"
          aria-label="Type Command"
        >
          <i className="bx bx-message-rounded-dots text-lg"></i>
        </button>
      </div>

      {/* Right Action Cap: Lightning Zone 5 Boost */}
      <button
        onClick={onIntensityClick}
        className="w-[44px] h-[44px] rounded-full liquid-glass flex items-center justify-center text-[#F2541A] hover:scale-105 active:scale-95 transition-all shadow-xs"
        title="Zone 5 Turbo Boost"
        aria-label="Zone 5 Boost"
      >
        <i className="bx bx-bolt-circle text-2xl"></i>
      </button>
    </div>
  );
}
