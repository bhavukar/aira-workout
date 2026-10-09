'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import IPhoneMockup from '../components/device/IPhoneMockup';
import ThesisModal from '../components/modals/ThesisModal';
import { WorkoutMode, ExerciseData } from '../types/workout';
import {
  DEFAULT_EXERCISE,
  KNEE_ADAPTED_EXERCISE,
  INTENSITY_EXERCISE,
  AUDIO_MAP,
} from '../lib/constants';
import {
  unlockAudio,
  playAudioChime,
  speakBrowserVoice,
} from '../lib/audio';

const KICKOFF_SPEECH =
  'Hey! Ready for your 12-minute lower body circuit? Any knee pain or soreness today, or are we locking straight into intervals?';

export default function AiraWorkoutPage() {
  // Workout State
  const [mode, setMode] = useState<WorkoutMode>('standby');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [thinkingLabel, setThinkingLabel] = useState<string>(
    'AiRA initializing workout...'
  );
  const [exercise, setExercise] = useState<ExerciseData>(DEFAULT_EXERCISE);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isThesisOpen, setIsThesisOpen] = useState<boolean>(true);
  const [userSpokenText, setUserSpokenText] = useState<string | null>(null);
  const [airaDialogue, setAiraDialogue] = useState<string>(KICKOFF_SPEECH);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasEverUnlockedAudioRef = useRef<boolean>(false);

  // Play audio track with graceful fallback to browser speech synthesis
  const playVoiceAudio = useCallback(
    async (audioPath: string, fallbackText: string) => {
      if (!speechEnabled || typeof window === 'undefined') return;

      // Stop previous audio & synthesis
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      try {
        const cacheBustedUrl = audioPath.includes('?')
          ? audioPath
          : `${audioPath}?t=${Date.now()}`;
        const audio = new Audio(cacheBustedUrl);
        currentAudioRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
        };
        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
        };
        audio.onerror = () => {
          speakBrowserVoice(
            fallbackText,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false)
          );
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch {
        // Autoplay policy prevented playback, fall back gracefully
        setIsSpeaking(false);
      }
    },
    [speechEnabled]
  );

  // Unlocks audio and immediately plays active mode audio
  const startAudioPlayback = useCallback(
    (targetPath?: string, targetText?: string) => {
      unlockAudio();
      hasEverUnlockedAudioRef.current = true;
      const path = targetPath || AUDIO_MAP[mode] || '/audio/standby-kickoff.mp3';
      const text = targetText || airaDialogue;
      playVoiceAudio(path, text);
    },
    [mode, airaDialogue, playVoiceAudio]
  );

  // Close thesis sheet & trigger kickoff audio immediately
  const handleCloseThesis = useCallback(() => {
    setIsThesisOpen(false);
    startAudioPlayback('/audio/standby-kickoff.mp3', KICKOFF_SPEECH);
  }, [startAudioPlayback]);

  // Handle global first gesture to unlock audio if blocked
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!hasEverUnlockedAudioRef.current) {
        unlockAudio();
        hasEverUnlockedAudioRef.current = true;
      }
    };

    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Interval countdown timer
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            playAudioChime(880, 'triangle', 0.2);
            if (
              mode === 'interval' ||
              mode === 'adaptive-swap' ||
              mode === 'intensity'
            ) {
              handleTriggerMode('recovery');
            }
            return 0;
          }
          if (prev <= 4) {
            playAudioChime(520, 'sine', 0.05);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timerSeconds, mode]);

  // Transition modes with quick cognitive thinking state & instant audio
  const handleTriggerMode = useCallback(
    (newMode: WorkoutMode, userPrompt?: string) => {
      unlockAudio();
      playAudioChime(640, 'sine', 0.08);

      setIsThinking(true);
      const label =
        newMode === 'adaptive-swap'
          ? 'Kinematic Re-solving: Knee shear reduction...'
          : newMode === 'interval'
          ? 'AiRA calibrating 12-min intervals...'
          : newMode === 'intensity'
          ? 'Turbo mode: Zone 5 threshold calibration...'
          : newMode === 'recovery'
          ? 'Switching to autonomic parasympathetic reset...'
          : newMode === 'debrief'
          ? 'Compiling biometric adherence & summary...'
          : 'AiRA configuring session...';
      setThinkingLabel(label);

      let nextDialogue = airaDialogue;
      let nextExercise = exercise;
      let nextDuration = timerSeconds;
      let nextTimerActive = false;

      if (newMode === 'standby') {
        nextExercise = DEFAULT_EXERCISE;
        nextDuration = 45;
        nextTimerActive = false;
        nextDialogue = KICKOFF_SPEECH;
      } else if (newMode === 'briefing') {
        nextExercise = DEFAULT_EXERCISE;
        nextDuration = 45;
        nextTimerActive = false;
        nextDialogue =
          "Welcome to your 12-minute power circuit. Three focused rounds. Let's do this.";
      } else if (newMode === 'interval') {
        nextExercise = DEFAULT_EXERCISE;
        nextDuration = 45;
        nextTimerActive = true;
        nextDialogue =
          'Lock in: 45 seconds Bulgarian Split Squats. Chest proud, drive through the midfoot.';
      } else if (newMode === 'adaptive-swap') {
        nextExercise = KNEE_ADAPTED_EXERCISE;
        nextDuration = 45;
        nextTimerActive = true;
        nextDialogue =
          'Got it! Swapping to Romanian Deadlifts. Zero patellar load, pure hamstring hinge.';
      } else if (newMode === 'recovery') {
        nextDuration = 30;
        nextTimerActive = true;
        nextDialogue =
          'Rest interval. Diaphragmatic nasal breathing. Drop your heart rate down.';
      } else if (newMode === 'intensity') {
        nextExercise = INTENSITY_EXERCISE;
        nextDuration = 30;
        nextTimerActive = true;
        nextDialogue =
          'Zone 5 unlocked! Explosive vertical drive. Maximum speed for 30 seconds!';
      } else if (newMode === 'debrief') {
        nextTimerActive = false;
        nextDialogue =
          'Outstanding session. 184 calories burned, 96% form adherence. You crushed it!';
      }

      setMode(newMode);
      setExercise(nextExercise);
      setTimerSeconds(nextDuration);
      setTimerActive(nextTimerActive);
      setAiraDialogue(nextDialogue);
      setUserSpokenText(userPrompt || null);

      const targetAudio = AUDIO_MAP[newMode] || '/audio/standby-kickoff.mp3';

      setTimeout(() => {
        setIsThinking(false);
        playVoiceAudio(targetAudio, nextDialogue);
      }, 300);
    },
    [airaDialogue, exercise, timerSeconds, playVoiceAudio]
  );

  // Dynamic voice / User talk-over submission
  const handleUserCommand = useCallback(
    async (cmd: string) => {
      const text = cmd.trim().toLowerCase();
      setIsComposerOpen(false);
      unlockAudio();
      playAudioChime(720, 'sine', 0.06);

      if (
        text.includes('knee') ||
        text.includes('hurt') ||
        text.includes('pain') ||
        text.includes('joint')
      ) {
        handleTriggerMode('adaptive-swap', cmd);
      } else if (
        text.includes('rest') ||
        text.includes('break') ||
        text.includes('breath') ||
        text.includes('tired')
      ) {
        setTimerSeconds((prev) => prev + 20);
        const speech =
          'Adding 20 seconds to recovery. Inhale 4 seconds, hold, and smooth exhale.';
        setUserSpokenText(cmd);
        setAiraDialogue(speech);
        playVoiceAudio('/audio/extra-rest.mp3', speech);
        if (mode !== 'recovery') {
          setMode('recovery');
          setTimerActive(true);
        }
      } else if (
        text.includes('hard') ||
        text.includes('more') ||
        text.includes('zone 5') ||
        text.includes('intensity') ||
        text.includes('faster')
      ) {
        handleTriggerMode('intensity', cmd);
      } else if (
        text.includes('finish') ||
        text.includes('done') ||
        text.includes('cool') ||
        text.includes('stop')
      ) {
        handleTriggerMode('debrief', cmd);
      } else if (
        text.includes('start') ||
        text.includes('go') ||
        text.includes('begin')
      ) {
        handleTriggerMode('interval', cmd);
      } else {
        setUserSpokenText(cmd);
        const speech = `Understood: "${cmd}". Adapting your circuit pacing in real time.`;
        setAiraDialogue(speech);

        try {
          const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: speech, speaker: 'meera' }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.audioBase64) {
              const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
              await playVoiceAudio(audioSrc, speech);
              return;
            }
          }
        } catch {
          // fallback
        }

        await playVoiceAudio('/audio/custom-ack.mp3', speech);
      }
    },
    [handleTriggerMode, mode, playVoiceAudio]
  );

  // Sound Toggle (Mute / Unmute)
  const handleToggleSpeech = useCallback(() => {
    const nextState = !speechEnabled;
    setSpeechEnabled(nextState);

    if (!nextState) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      playAudioChime(320, 'sine', 0.05);
    } else {
      playAudioChime(740, 'sine', 0.08);
      unlockAudio();
      setTimeout(() => {
        const path = AUDIO_MAP[mode] || '/audio/standby-kickoff.mp3';
        playVoiceAudio(path, airaDialogue);
      }, 100);
    }
  }, [speechEnabled, mode, airaDialogue, playVoiceAudio]);

  const formatTimer = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#141414] flex flex-col justify-between p-4 md:p-6 lg:p-8 relative overflow-x-hidden font-sans">
      {/* Top Header */}
      <Navbar
        speechEnabled={speechEnabled}
        onToggleSpeech={handleToggleSpeech}
        onOpenThesis={() => setIsThesisOpen(true)}
      />

      {/* Center Stage: iPhone Device Mockup Centered Gracefully */}
      <div className="w-full max-w-7xl mx-auto flex justify-center items-center my-auto py-4 sm:py-6 relative z-10">
        <IPhoneMockup
          mode={mode}
          exercise={exercise}
          isSpeaking={isSpeaking}
          speechEnabled={speechEnabled}
          isThinking={isThinking}
          thinkingLabel={thinkingLabel}
          airaDialogue={airaDialogue}
          userSpokenText={userSpokenText}
          timerSeconds={timerSeconds}
          timerActive={timerActive}
          isComposerOpen={isComposerOpen}
          menuOpen={menuOpen}
          formatTimer={formatTimer}
          onToggleMenu={() => {
            playAudioChime(500);
            setMenuOpen(!menuOpen);
          }}
          onCloseMenu={() => setMenuOpen(false)}
          onToggleSpeech={handleToggleSpeech}
          onPlayAudio={() => startAudioPlayback()}
          onSelectMode={handleTriggerMode}
          onToggleTimer={() => setTimerActive(!timerActive)}
          onResetTimer={() => setTimerSeconds(exercise.duration)}
          onAddRest={() => setTimerSeconds((prev) => prev + 20)}
          onToggleComposer={() => setIsComposerOpen(!isComposerOpen)}
          onCloseComposer={() => setIsComposerOpen(false)}
          onSubmitCommand={handleUserCommand}
          onOpenThesis={() => setIsThesisOpen(true)}
        />
      </div>

      {/* Minimal Footer */}
      <Footer onOpenThesis={() => setIsThesisOpen(true)} />

      {/* Full-Screen Builder Thesis Modal */}
      <ThesisModal
        isOpen={isThesisOpen}
        onClose={handleCloseThesis}
        onJumpToMode={handleTriggerMode}
      />
    </main>
  );
}
