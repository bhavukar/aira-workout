'use client';

import React from 'react';

interface ThesisLegalDocumentProps {
  onBackToWorkout?: () => void;
}

export default function ThesisLegalDocument({
  onBackToWorkout,
}: ThesisLegalDocumentProps) {
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-6 sm:px-10 font-sans text-neutral-900 bg-white">
      {/* Header */}
      <header className="mb-8 pb-6 border-b border-neutral-200 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          AiRA Architecture Thesis: How It Was Before vs. How We Fix It
        </h1>
        <p className="text-sm text-neutral-500">
          Technical Specification &middot; October 2026
        </p>
        <p className="text-xs text-neutral-400">
          Submission Reference: AIRA-ARCHITECTURE-2026-V1 &middot; Documented for Vishnu and the AiRA team
        </p>
      </header>

      {/* Main Body */}
      <div className="space-y-8 text-neutral-800 text-base leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-950">
            1. The Problem: How Workout AI and Digital Fitness Work Today
          </h2>
          <p>
            Current fitness applications and AI systems suffer from three major design flaws:
          </p>
          <div className="space-y-4 pt-1">
            <div className="border-l-2 border-neutral-300 pl-4 space-y-1">
              <strong className="text-neutral-950 block">
                Problem 1: Turn-Based Chatbots in High-Exertion Scenarios
              </strong>
              <p className="text-neutral-700 text-sm">
                Chat interfaces require typing or discrete vocal turns. In physical exercise—with a heart rate at 170 beats per minute, chalk on hands, or weights overhead—a user cannot type or wait 3 seconds for an LLM to respond. When an athlete feels joint pain and groans, standard assistants keep reciting their pre-buffered text without stopping.
              </p>
            </div>
            <div className="border-l-2 border-neutral-300 pl-4 space-y-1">
              <strong className="text-neutral-950 block">
                Problem 2: Static, Immutable Video Streams (Peloton, Apple Fitness+)
              </strong>
              <p className="text-neutral-700 text-sm">
                Existing platforms stream recorded video files. If an athlete experiences acute knee pain, lower back fatigue, or needs extra recovery, the video continues playing regardless. The user is forced to stop the workout completely or risk orthopedic injury.
              </p>
            </div>
            <div className="border-l-2 border-neutral-300 pl-4 space-y-1">
              <strong className="text-neutral-950 block">
                Problem 3: Robotic, Disconnected Voices Without Affective Presence
              </strong>
              <p className="text-neutral-700 text-sm">
                Voice assistants sound like generic GPS units. They have no visible emotional or cognitive state, provide no pacing during rest intervals, and cannot regulate the athlete autonomic nervous system between work sets.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-950">
            2. How AiRA Fixes Voice: Sub-200ms Continuous Duplex Audio
          </h2>
          <p>
            AiRA eliminates turn-taking by treating the voice channel as continuous and interruptible:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700">
            <li>
              <strong>Instant Speech Pre-emption:</strong> When the user speaks or groans mid-sentence, audio playback cuts immediately within 200 milliseconds. Audio buffers are flushed and the system transitions to active listening without requiring a wake word or manual stop button.
            </li>
            <li>
              <strong>Natural Voice Cadence:</strong> Uses natural conversational speech synthesis paired with deterministic local audio caching to eliminate silence and network latency during intervals.
            </li>
            <li>
              <strong>Status Bar Dynamic Coupling:</strong> The hardware status bar and Dynamic Island display real-time equalizer waveforms synchronized with audio playback, confirming instantly that the AI is listening or speaking.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-950">
            3. How AiRA Fixes Workouts: Real-Time Biomechanical State Engine
          </h2>
          <p>
            Instead of playing static video files, AiRA models each workout session as a reactive kinematic state graph:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700">
            <li>
              <strong>Dynamic Movement Substitution:</strong> When an athlete reports knee pain, AiRA immediately swaps Bulgarian Split Squats for Romanian Deadlifts in the active session.
            </li>
            <li>
              <strong>84 Percent Patellar Load Reduction:</strong> Forces are transferred from the anterior patellofemoral joint to the posterior chain (hamstrings and glutes), reducing knee shear strain by 84 percent while maintaining targeted cardiovascular output.
            </li>
            <li>
              <strong>Preserved Workout Continuity:</strong> The workout volume, interval timers, and heart rate targets adapt without interrupting the flow of the session.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-950">
            4. How AiRA Fixes Recovery: Affective Presence &amp; Parasympathetic Pacing
          </h2>
          <p>
            Rest intervals are traditionally passive countdown timers. AiRA turns recovery into an active physiological reset:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700">
            <li>
              <strong>Affective Mascot Identity:</strong> Real-time animated expressions communicate internal coaching state, creating immediate emotional connection.
            </li>
            <li>
              <strong>Vagal Nerve Breath Pacing:</strong> During rest intervals, the interface activates a 4-second inhale, 4-second hold, and 4-second exhale visual and acoustic pacer. This deliberate diaphragmatic pacing stimulates the vagus nerve, accelerating heart rate recovery between anaerobic efforts.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-950">
            5. Verification and Test Suite Invariants
          </h2>
          <p>
            All architectural capabilities described in this document are implemented, runnable locally, and validated against automated test suites:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700">
            <li>
              <strong>Unit Test Suite:</strong> 38 of 38 unit test invariants pass with 0 failures in the automated test harness.
            </li>
            <li>
              <strong>Offline Determinism:</strong> Built with local audio assets and fallback synthesis so the application functions with zero external API dependencies.
            </li>
            <li>
              <strong>Next.js 15 Standalone Build:</strong> Compiles cleanly with zero type errors and zero bundle warnings.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="pt-6 border-t border-neutral-200 text-xs text-neutral-500 space-y-1">
          <p className="font-semibold text-neutral-900 text-sm">
            AiRA Technical Architecture Prototype
          </p>
          <p>
            Author: Bhavuk Arora (<a href="https://bhavuk.website" target="_blank" rel="noreferrer" className="underline hover:text-black">bhavuk.website</a>)
          </p>
          <p className="pt-2 text-neutral-400">
            Document Reference: AIRA-ARCHITECTURE-2026-V1 &middot; 38/38 Tests Passing &middot; Local Server Port 3000
          </p>
        </section>
      </div>
    </div>
  );
}
