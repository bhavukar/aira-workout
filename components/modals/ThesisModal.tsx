'use client';

import React, { useState, useRef, useEffect } from 'react';
import ThesisLegalDocument from './ThesisLegalDocument';
import { WorkoutMode } from '../../types/workout';
import { unlockAudio, playAudioChime } from '../../lib/audio';

interface ThesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToMode?: (mode: WorkoutMode) => void;
}

export default function ThesisModal({ isOpen, onClose }: ThesisModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      setScrollProgress(0);
    }
  }, [isOpen]);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    const progress =
      maxScroll > 0 ? Math.min(100, Math.round((scrollTop / maxScroll) * 100)) : 100;
    setScrollProgress(progress);

    if (scrollTop + clientHeight >= scrollHeight - 35) {
      setHasScrolledToBottom(true);
    }
  };

  const handleDismiss = () => {
    unlockAudio();
    playAudioChime(640, 'sine', 0.08);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-sans">
      {/* Slide-Up Sheet Container */}
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_16px_48px_rgba(0,0,0,0.2)] border border-black/10 flex flex-col overflow-hidden animate-slide-up-fade">
        {/* Top Sticky Header */}
        <div className="px-6 py-4 border-b border-black/5 bg-white/95 backdrop-blur-md flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2541A]" />
            <span className="text-xs font-black tracking-tight text-neutral-900 uppercase">
              AiRA &middot; Interactive Prototype Thesis
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/aira-workout-source.zip"
              download="aira-workout-source.zip"
              className="text-xs font-bold text-neutral-500 hover:text-black transition-colors hidden sm:inline"
            >
              Source .zip
            </a>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-transform active:scale-90"
              aria-label="Close"
            >
              <i className="bx bx-x text-lg"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-1 pb-4 no-scrollbar"
        >
          <ThesisLegalDocument onBackToWorkout={handleDismiss} />
        </div>

        {/* Bottom Sticky Action Bar with Scroll Requirement */}
        <div className="p-4 sm:px-6 border-t border-black/5 bg-[#FAF9F5]/95 backdrop-blur-md flex items-center justify-between gap-3 z-20 flex-shrink-0">
          {/* Reading Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-[#F2541A] transition-all duration-150"
                style={{ width: `${hasScrolledToBottom ? 100 : scrollProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-neutral-500 font-mono">
              {hasScrolledToBottom ? '100%' : `${scrollProgress}%`}
            </span>
          </div>

          {/* Try It Out CTA Button */}
          <button
            onClick={hasScrolledToBottom ? handleDismiss : undefined}
            disabled={!hasScrolledToBottom}
            className={`py-3 px-6 rounded-full font-black text-xs flex items-center gap-2 transition-all shadow-sm ${
              hasScrolledToBottom
                ? 'bg-[#141414] hover:bg-black text-white cursor-pointer active:scale-95'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <span>Try It Out &middot; Launch Workout</span>
            <i className="bx bx-right-arrow-alt text-base text-[#F2541A]"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
