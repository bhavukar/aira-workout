'use client';

import React from 'react';
import StatusBar from './StatusBar';
import TopMenuModal from './TopMenuModal';
import BottomComposerBar from './BottomComposerBar';
import StandbyHeroCard from '../cards/StandbyHeroCard';
import CircuitPlanCard from '../cards/CircuitPlanCard';
import BiomechanicalCard from '../cards/BiomechanicalCard';
import BreathingPacerCard from '../cards/BreathingPacerCard';
import DebriefCard from '../cards/DebriefCard';
import AiraAvatarStage from '../avatar/AiraAvatarStage';
import TalkOverDrawer from '../modals/TalkOverDrawer';
import ThinkingLoader from '../modals/ThinkingLoader';
import { ExerciseData, WorkoutMode } from '../../types/workout';
import { playAudioChime } from '../../lib/audio';

interface IPhoneMockupProps {
  mode: WorkoutMode;
  exercise: ExerciseData;
  isSpeaking: boolean;
  speechEnabled: boolean;
  isThinking: boolean;
  thinkingLabel: string;
  airaDialogue: string;
  userSpokenText: string | null;
  timerSeconds: number;
  timerActive: boolean;
  isComposerOpen: boolean;
  menuOpen: boolean;
  formatTimer: (sec: number) => string;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onToggleSpeech: () => void;
  onPlayAudio: () => void;
  onSelectMode: (mode: WorkoutMode, userPrompt?: string) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onAddRest: () => void;
  onToggleComposer: () => void;
  onCloseComposer: () => void;
  onSubmitCommand: (cmd: string) => void;
  onOpenThesis: () => void;
}

export default function IPhoneMockup({
  mode,
  exercise,
  isSpeaking,
  speechEnabled,
  isThinking,
  thinkingLabel,
  airaDialogue,
  userSpokenText,
  timerSeconds,
  timerActive,
  isComposerOpen,
  menuOpen,
  formatTimer,
  onToggleMenu,
  onCloseMenu,
  onToggleSpeech,
  onPlayAudio,
  onSelectMode,
  onToggleTimer,
  onResetTimer,
  onAddRest,
  onToggleComposer,
  onCloseComposer,
  onSubmitCommand,
  onOpenThesis,
}: IPhoneMockupProps) {
  return (
    <div className="transform scale-[0.84] sm:scale-[0.86] lg:scale-[0.88] xl:scale-[0.92] 2xl:scale-100 origin-center transition-transform">
      {/* Outer iPhone Chassis with vivid cosmic orange bezel */}
      <div
        className="relative rounded-[64px] bg-[#060606] p-[10px] iphone-orange-bezel select-none"
        style={{ width: '390px', height: '844px' }}
      >
        {/* Inner Phone Screen */}
        <div className="relative w-full h-full rounded-[54px] bg-[#FAFAF8] text-[#141414] overflow-hidden flex flex-col justify-between shadow-inner">
          {/* Hardware Status Bar */}
          <StatusBar
            isSpeaking={isSpeaking}
            mode={mode}
            onDynamicIslandClick={() => {
              playAudioChime(660);
              onPlayAudio();
            }}
          />

          {/* In-Phone Thinking Loader: Jakub Antalik's Thinking Orb strictly on loading */}
          {isThinking && <ThinkingLoader label={thinkingLabel} />}

          {/* Action Bar Header */}
          <div className="pt-[58px] px-4 flex items-center justify-between z-20">
            <button
              onClick={onToggleMenu}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-[#141414] hover:scale-105 active:scale-95 transition-transform"
              aria-label="Menu"
            >
              <i className="bx bx-menu text-xl"></i>
            </button>

            {/* Session Title Pill */}
            <div
              onClick={() => {
                playAudioChime(660);
                onPlayAudio();
              }}
              className="cursor-pointer px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-[11px] font-bold tracking-wide uppercase text-[#555] flex items-center gap-1.5 hover:bg-white transition-colors"
            >
              {isSpeaking && (
                <span className="w-2 h-2 rounded-full bg-[#F2541A]" />
              )}
              AiRA ATHLETIC 12M
            </div>

            <button
              onClick={onToggleSpeech}
              className={`w-10 h-10 rounded-full liquid-glass flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
                speechEnabled ? 'text-[#F2541A]' : 'text-[#888]'
              }`}
              aria-label="Toggle voice"
            >
              <i
                className={`bx ${speechEnabled ? 'bx-volume-full' : 'bx-volume-mute'} text-xl`}
              ></i>
            </button>
          </div>

          {/* Top Menu Dropdown Modal */}
          <TopMenuModal
            isOpen={menuOpen}
            onClose={onCloseMenu}
            onSelectMode={onSelectMode}
            onOpenThesis={onOpenThesis}
          />

          {/* Scrollable Center Content */}
          <div className="flex-1 px-4 pt-2 pb-28 overflow-y-auto no-scrollbar space-y-3 flex flex-col">
            {/* 1. STANDBY MODE: AiRA in the center BIG, asks questions */}
            {mode === 'standby' ? (
              <StandbyHeroCard
                isSpeaking={isSpeaking}
                mode={mode}
                airaDialogue={airaDialogue}
                onAvatarClick={() => {
                  playAudioChime(660);
                  onPlayAudio();
                }}
                onStartCircuit={() => onSelectMode('interval')}
                onAdaptKnee={() =>
                  onSelectMode('adaptive-swap', 'Wait, my knee hurts.')
                }
              />
            ) : (
              /* ACTIVE WORKOUT STATES: Compact companion + Dynamic Cards */
              <>
                {/* Unified Apple-Style Live Coach Capsule */}
                <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-black/5 space-y-1.5 transition-all">
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => {
                        playAudioChime(660);
                        onPlayAudio();
                      }}
                      className="flex items-center gap-2.5 cursor-pointer select-none"
                    >
                      <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
                        <img
                          src="/images/aira/aira-idle.png"
                          alt="AiRA Companion"
                          className="w-8 h-8 object-contain animate-float"
                        />
                        {isSpeaking && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#F2541A] border-2 border-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-900">AiRA</span>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                          {isSpeaking ? 'Speaking' : 'Coaching'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playAudioChime(660);
                        onPlayAudio();
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors"
                      title="Replay coach audio"
                    >
                      <i className="bx bx-volume-full text-base"></i>
                    </button>
                  </div>

                  {userSpokenText && (
                    <div className="text-[11px] text-neutral-500 font-medium flex items-center gap-1.5 pt-0.5 border-t border-black/5">
                      <i className="bx bx-user text-[#F2541A] text-xs"></i>
                      <span className="truncate">&quot;{userSpokenText}&quot;</span>
                    </div>
                  )}

                  <p className="font-sans font-medium text-[13.5px] leading-[19px] text-neutral-950">
                    &ldquo;{airaDialogue}&rdquo;
                  </p>
                </div>

                {/* DYNAMIC CANVAS CARDS */}
                {mode === 'briefing' && (
                  <CircuitPlanCard onStart={() => onSelectMode('interval')} />
                )}

                {(mode === 'interval' ||
                  mode === 'adaptive-swap' ||
                  mode === 'intensity') && (
                  <BiomechanicalCard
                    exercise={exercise}
                    timerSeconds={timerSeconds}
                    timerActive={timerActive}
                    onToggleTimer={onToggleTimer}
                    onResetTimer={onResetTimer}
                    onNext={() => onSelectMode('recovery')}
                    formatTimer={formatTimer}
                  />
                )}

                {mode === 'recovery' && (
                  <BreathingPacerCard
                    timerSeconds={timerSeconds}
                    onAddRest={onAddRest}
                    onReadyToPush={() => onSelectMode('interval')}
                    formatTimer={formatTimer}
                  />
                )}

                {mode === 'debrief' && (
                  <DebriefCard onRestart={() => onSelectMode('standby')} />
                )}
              </>
            )}
          </div>

          {/* Bottom Interactive Talk-Over Bar */}
          <BottomComposerBar
            isSpeaking={isSpeaking}
            onPaperclipClick={() =>
              onSelectMode(mode === 'standby' ? 'briefing' : 'standby')
            }
            onMicClick={onPlayAudio}
            onKeyboardClick={onToggleComposer}
            onIntensityClick={() =>
              onSelectMode('intensity', 'Pumping up intensity!')
            }
          />

          {/* Talk-Over Interactive Drawer Modal */}
          <TalkOverDrawer
            isOpen={isComposerOpen}
            onClose={onCloseComposer}
            onSubmitCommand={onSubmitCommand}
          />

          {/* iPhone Bottom Home Bar Indicator */}
          <div
            onClick={() => {
              playAudioChime(400);
              onCloseComposer();
              onCloseMenu();
            }}
            className="cursor-pointer absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 hover:bg-black/40 rounded-full z-30 transition-colors"
            title="Home Indicator"
          ></div>
        </div>
      </div>
    </div>
  );
}
