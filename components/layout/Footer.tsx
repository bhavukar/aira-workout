'use client';

import React from 'react';
import { playAudioChime } from '../../lib/audio';

interface FooterProps {
  onOpenThesis: () => void;
}

export default function Footer({ onOpenThesis }: FooterProps) {
  return (
    <footer className="w-full max-w-7xl mx-auto pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#716B64] gap-4 relative z-10 font-sans">
      <div className="flex items-center gap-3">
        <span>AiRA Multimodal Workout Experience</span>
        <button
          onClick={() => {
            playAudioChime(580);
            onOpenThesis();
          }}
          className="text-[#141414] underline hover:text-[#F2541A] transition-colors font-medium"
        >
          Read Builder Thesis
        </button>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <a
          href="/aira-workout-source.zip"
          download="aira-workout-source.zip"
          className="flex items-center gap-1 text-[#F2541A] hover:underline font-semibold"
        >
          <i className="bx bx-download"></i> Download Source Zip
        </a>
      </div>
    </footer>
  );
}
