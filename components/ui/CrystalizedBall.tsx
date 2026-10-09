'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import './CrystalizedBall.css';
import { CrystalizedBallProps } from './crystalized-ball/types';
import {
  BALL_PRESETS,
  MOTIONS,
  SHAPES,
  parseColor,
  buildPalette,
} from './crystalized-ball/palette';
import { initCrystalizedBallEngine } from './crystalized-ball/engine';

export default function CrystalizedBall({
  preset = 'plasma',
  color,
  theme = 'dark',
  size = 0.7,
  strands,
  crackle,
  flares,
  glow,
  sparks,
  particleCount,
  fill,
  motion,
  particleShape,
  depth,
  sway,
  twinkle,
  haze,
  speed = 1,
  dustSpeed,
  interactive = true,
  hoverStrength = 0.7,
  intro = true,
  paused = false,
  className = '',
  style,
}: CrystalizedBallProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<any>(null);
  const wakeRef = useRef<(() => void) | null>(null);

  const base = BALL_PRESETS[preset] || BALL_PRESETS.plasma;
  const pick = <T,>(value: T | undefined | null, key: keyof typeof base): T =>
    value === undefined || value === null ? (base[key] as unknown as T) : value;
  const tint = pick(color, 'color');

  const colors = useMemo(() => {
    const light = theme === 'light';
    return { light, palette: buildPalette(parseColor(tint, [0.95, 0.36, 0.82]), light) };
  }, [tint, theme]);

  const rawMotion = pick(motion, 'motion');
  const rawShape = pick(particleShape, 'particleShape');

  useEffect(() => {
    settingsRef.current = {
      ...colors,
      size,
      strands: pick(strands, 'strands'),
      crackle: pick(crackle, 'crackle'),
      flares: pick(flares, 'flares'),
      glow: pick(glow, 'glow'),
      sparks: pick(sparks, 'sparks'),
      particleCount: pick(particleCount, 'particleCount'),
      fill: pick(fill, 'fill'),
      motion: MOTIONS[rawMotion] ?? 0,
      particleShape: SHAPES[rawShape] ?? 0,
      depth: pick(depth, 'depth'),
      sway: pick(sway, 'sway'),
      twinkle: pick(twinkle, 'twinkle'),
      haze: pick(haze, 'haze'),
      dustSpeed: pick(dustSpeed, 'dustSpeed'),
      speed,
      interactive,
      hoverStrength,
      intro,
      paused,
    };
    wakeRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    return initCrystalizedBallEngine(container, settingsRef, wakeRef);
  }, []);

  return <div ref={containerRef} className={`crystalized-ball ${className}`.trim()} style={style} />;
}

export type { CrystalizedBallProps } from './crystalized-ball/types';
