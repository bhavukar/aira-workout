'use client';

import React from 'react';
import MagicRings from './MagicRings';

interface HeartBeatMagicRingProps {
  bpm?: number;
  size?: number | string;
  color?: string;
  colorTwo?: string;
  className?: string;
  showBadge?: boolean;
}

export default function HeartBeatMagicRing({
  bpm = 164,
  size = '100%',
  color = '#EF4444',
  colorTwo = '#F97316',
  className = '',
  showBadge = false,
}: HeartBeatMagicRingProps) {
  // Map BPM (60 - 200) to speed multiplier (0.8 - 2.8) so it beats to the athlete's real rhythm
  const calculatedSpeed = Math.max(0.6, Math.min(3.0, bpm / 60));

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <MagicRings
        color={color}
        colorTwo={colorTwo}
        ringCount={5}
        speed={calculatedSpeed}
        attenuation={14}
        lineThickness={2.2}
        baseRadius={0.28}
        radiusStep={0.12}
        scaleRate={0.12}
        opacity={0.9}
        blur={0}
        noiseAmount={0.04}
        rotation={0}
        ringGap={1.4}
        fadeIn={0.5}
        fadeOut={0.6}
        followMouse={false}
        mouseInfluence={0.1}
        hoverScale={1.1}
        parallax={0.03}
        clickBurst={true}
        alphaMode="coverage"
      />
      {showBadge && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <i className="bx bxs-heart text-red-500 text-lg"></i>
          <span className="text-xs font-black text-neutral-950 font-mono tracking-tight mt-0.5">
            {bpm} <span className="text-[9px] font-bold text-neutral-400">BPM</span>
          </span>
        </div>
      )}
    </div>
  );
}
