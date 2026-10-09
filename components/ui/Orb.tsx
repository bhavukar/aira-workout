'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { OrbState, OrbSize, OrbTheme } from 'thinking-orbs';

const DynamicThinkingOrb = dynamic(
  () => import('thinking-orbs').then((mod) => mod.ThinkingOrb),
  { ssr: false }
);

export interface OrbProps {
  state?: OrbState;
  size?: OrbSize;
  theme?: OrbTheme;
  color?: string;
  speed?: number;
  paused?: boolean;
  className?: string;
  label?: string;
}

export default function Orb({
  state = 'working',
  size = 20,
  theme = 'auto',
  color,
  speed = 1,
  paused = false,
  className = '',
  label,
}: OrbProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const px = size === 64 ? 64 : size === 32 ? 32 : 20;

  if (!mounted) {
    return (
      <span
        className={`inline-block rounded-full bg-current/15 ${className}`}
        style={{ width: px, height: px }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center select-none ${className}`}
      title={label || `AiRA orb: ${state}`}
      style={{ width: px, height: px }}
    >
      <DynamicThinkingOrb
        state={state}
        size={size}
        theme={theme}
        color={color}
        speed={speed}
        paused={paused}
        aria-label={label || `AiRA thought orb: ${state}`}
      />
    </span>
  );
}
