'use client';

import React from 'react';
import { playAudioChime } from '../../lib/audio';

interface NavbarProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  onOpenThesis: () => void;
}

export default function Navbar({
  speechEnabled,
  onToggleSpeech,
  onOpenThesis,
}: NavbarProps) {
  return (
    <header className="w-full max-w-7xl mx-auto flex items-center justify-between pb-4 border-b border-black/10 relative z-10 font-sans">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-black tracking-tight text-[#141414] flex items-center">
          aira<span className="inline-block w-2 h-2 rounded-full bg-[#F2541A] ml-1"></span>
        </span>
        <span className="text-xs uppercase tracking-widest text-[#716B64] border-l border-black/10 pl-3">
          workout companion
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Builder's Thesis CTA */}
        <button
          onClick={() => {
            playAudioChime(580);
            onOpenThesis();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-950 hover:bg-black text-white text-xs font-bold border border-neutral-950 transition-all active:scale-95 shadow-xs"
          title="Read The Builder's Thesis"
        >
          <i className="bx bx-book-open text-[#F2541A] text-base"></i>
          <span>Builder Thesis</span>
        </button>

        {/* Download Source Zip CTA */}
        <a
          href="/aira-workout-source.zip"
          download="aira-workout-source.zip"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-neutral-50 border border-neutral-300 text-xs font-semibold text-neutral-800 transition-all active:scale-95 shadow-xs"
          title="Download Submission Zip Archive"
        >
          <i className="bx bx-download text-base text-neutral-500"></i>
          <span className="hidden md:inline">Source .zip</span>
        </a>

        {/* Voice Audio Toggle */}
        <button
          onClick={onToggleSpeech}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-neutral-50 border border-neutral-300 text-xs font-semibold text-neutral-800 transition-colors shadow-xs"
          title="Toggle Voice Audio"
        >
          <i
            className={`bx ${speechEnabled ? 'bx-volume-full text-[#F2541A]' : 'bx-volume-mute text-neutral-400'} text-base`}
          ></i>
          <span className="hidden sm:inline">{speechEnabled ? 'Voice On' : 'Muted'}</span>
        </button>

        <a
          href="https://airaai.in/intro"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[#716B64] hover:text-[#141414] transition-colors flex items-center gap-1"
        >
          <span>airaai.in</span>
          <i className="bx bx-link-external text-xs"></i>
        </a>
      </div>
    </header>
  );
}
