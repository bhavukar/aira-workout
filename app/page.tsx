'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { playAudioChime, speakBrowserVoice } from '../lib/audio';

export default function AiraWorkoutPage() {
  // Mode state: defaults to standby with AiRA big in the center
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

  // Coach kickoff dialogue
  const [airaDialogue, setAiraDialogue] = useState<string>(
    'Hey! Ready for your 12-minute lower body circuit? Any knee pain or soreness today, or are we locking straight into intervals?'
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Primary Audio playback: plays high-fidelity neural Indian voice clips
  const playVoiceAudio = async (audioPath: string, fallbackText: string) => {
    if (!speechEnabled || typeof window === 'undefined') return;

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
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };
      audio.onerror = (e) => {
        console.warn('Audio play error, falling back to speech synthesis:', e);
        speakBrowserVoice(
          fallbackText,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      };
      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  };

  // Play audio on initial load or first gesture
  useEffect(() => {
    // Attempt playback immediately
    playVoiceAudio('/audio/standby-kickoff.mp3', airaDialogue);

    // If blocked by browser autoplay policy, unlock on the very first user interaction
    const handleFirstGesture = () => {
      if (!currentAudioRef.current && mode === 'standby') {
        playVoiceAudio('/audio/standby-kickoff.mp3', airaDialogue);
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  // Play audio corresponding to active workout mode
  const playCurrentModeAudio = () => {
    const path = AUDIO_MAP[mode] || '/audio/standby-kickoff.mp3';
    playVoiceAudio(path, airaDialogue);
  };

  // Dynamic TTS for typed talk-over commands
  const playDynamicVoice = async (promptText: string) => {
    if (!speechEnabled || typeof window === 'undefined') return;

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promptText, speaker: 'meera' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          await playVoiceAudio(audioSrc, promptText);
          return;
        }
      }
    } catch {
      // safely fallback to pre-rendered acknowledgement
    }

    await playVoiceAudio('/audio/custom-ack.mp3', promptText);
  };

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

  // Transition modes with isolated sub-400ms ThinkingLoader
  const handleTriggerMode = (newMode: WorkoutMode, userPrompt?: string) => {
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

    setTimeout(() => {
      setIsThinking(false);
      setMode(newMode);
      setUserSpokenText(userPrompt || null);

      if (newMode === 'standby') {
        setExercise(DEFAULT_EXERCISE);
        setTimerSeconds(45);
        setTimerActive(false);
        const speech =
          'Hey! Ready for your 12-minute lower body circuit? Any knee pain or soreness today, or are we locking straight into intervals?';
        setAiraDialogue(speech);
        playVoiceAudio('/audio/standby-kickoff.mp3', speech);
      } else if (newMode === 'briefing') {
        setExercise(DEFAULT_EXERCISE);
        setTimerSeconds(45);
        setTimerActive(false);
        const speech =
          "Welcome to your 12-minute power circuit. Three focused rounds. Let's do this.";
        setAiraDialogue(speech);
        playVoiceAudio('/audio/briefing.mp3', speech);
      } else if (newMode === 'interval') {
        setExercise(DEFAULT_EXERCISE);
        setTimerSeconds(45);
        setTimerActive(true);
        const speech =
          'Lock in: 45 seconds Bulgarian Split Squats. Chest proud, drive through the midfoot.';
        setAiraDialogue(speech);
        playVoiceAudio('/audio/interval.mp3', speech);
      } else if (newMode === 'adaptive-swap') {
        setExercise(KNEE_ADAPTED_EXERCISE);
        setTimerSeconds(45);
        setTimerActive(true);
        const speech =
          'Got it! Swapping to Romanian Deadlifts. Zero patellar load, pure hamstring hinge.';
        setAiraDialogue(speech);
        playVoiceAudio('/audio/knee-swap.mp3', speech);
      } else if (newMode === 'recovery') {
        setTimerSeconds(30);
        setTimerActive(true);
        const speech =
          'Rest interval. Diaphragmatic nasal breathing. Drop your heart rate down.';
        setAiraDialogue(speech);
        playVoiceAudio('/audio/recovery.mp3', speech);
      } else if (newMode === 'intensity') {
        setExercise(INTENSITY_EXERCISE);
        setTimerSeconds(30);
        setTimerActive(true);
        const speech =
          'Zone 5 unlocked! Explosive vertical drive. Maximum speed for 30 seconds!';
        setAiraDialogue(speech);
        playVoiceAudio('/audio/intensity.mp3', speech);
      } else if (newMode === 'debrief') {
        setTimerActive(false);
        const speech =
          'Outstanding session. 184 calories burned, 96% form adherence. You crushed it!';
        setAiraDialogue(speech);
        playVoiceAudio('/audio/debrief.mp3', speech);
      }
    }, 380);
  };

  // User talk-over submission
  const handleUserCommand = (cmd: string) => {
    const text = cmd.trim().toLowerCase();
    setIsComposerOpen(false);
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
      playDynamicVoice(speech);
    }
  };

  // Unified Sound Toggle (Mute / Unmute)
  const handleToggleSpeech = () => {
    const nextState = !speechEnabled;
    setSpeechEnabled(nextState);

    if (!nextState) {
      // Mute immediately: stop all playing audio and speech synthesis
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
      // Unmute: play feedback chime and speak active mode dialogue
      playAudioChime(740, 'sine', 0.08);
      setTimeout(() => {
        const path = AUDIO_MAP[mode] || '/audio/standby-kickoff.mp3';
        playVoiceAudio(path, airaDialogue);
      }, 120);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
          onPlayAudio={playCurrentModeAudio}
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
        onClose={() => setIsThesisOpen(false)}
        onJumpToMode={handleTriggerMode}
      />
    </main>
  );
}
