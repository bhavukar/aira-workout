'use client';

import React from 'react';
import Orb from '../ui/Orb';

interface ThinkingLoaderProps {
  label: string;
}

export default function ThinkingLoader({ label }: ThinkingLoaderProps) {
  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fadeIn font-sans">
      <div className="flex flex-col items-center gap-4">
        {/* Jakub Antalik's Thinking Orb used strictly on loading/thinking state */}
        <Orb state="solving" size={64} theme="light" color="#F2541A" speed={1.2} />
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-neutral-900 tracking-tight">
            {label}
          </p>
          <p className="text-xs text-neutral-500 font-mono">
            Sub-200ms Biomechanical Inference
          </p>
        </div>
      </div>
    </div>
  );
}
