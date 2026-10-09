# AiRA · Multimodal Workout Companion

> **"Chat was the first draft."**  
> Chatbots were never the final form. AiRA is the first AI whose voice you can talk over, whose screen brings what you imagine to life, and whose face shows you how she feels.

Handcrafted for Vishnu and the AiRA team, strictly adhering to the design language of [airaai.in/intro](https://airaai.in/intro).

---

## 🌟 What We Built

### 1. Thinking Orbs Integration (`thinking-orbs`)
Integrated Jakub Antalik's [`thinking-orbs`](https://github.com/Jakubantalik/thinking-orbs.git) library with SSR-safe client rendering across all key UI states:
- **Hero / Header**: Inline thinking orb (`working` state, cosmic orange tint) signifying live agent cognition.
- **Dynamic Island**: Hardware pill housing micro thinking orbs that transition dynamically (`listening` when AiRA speaks, `breathing` in calm cyan during rest, `solving` during adaptation).
- **AiRA Avatar Stage**: Floating avatar badge equipped with real-time cognitive status orbs (`listening`, `coaching`, `breathing`, `solving`, `weaving`).
- **Parasympathetic Breathing Pacer**: 64px `breathing` thinking orb in calming sky cyan (`#0284c7`, 0.85x speed) centered inside the recovery card, pacing diaphragmatic 4s-4s-4s respiration.
- **Biomechanical Re-solver**: Real-time kinematic solver card with `solving` thinking orb showing joint shear reduction (-84%).
- **Interactive Scenarios & Drawer**: Dedicated scenario triggers and Talk-Over bottom sheet featuring active `searching` and `connecting` orbs.

### 2. Clean, Modular Animated Components
Engineered a set of production-grade, highly responsive components in `components/`:
- [`components/Orb.tsx`](file:///Users/bhavukarora/IdeaProjects/aira-workout/components/Orb.tsx): SSR-safe wrapper for `ThinkingOrb` with pulse placeholder and theme auto-detection.
- [`components/DynamicIsland.tsx`](file:///Users/bhavukarora/IdeaProjects/aira-workout/components/DynamicIsland.tsx): Authentic Apple Dynamic Island with hardware camera aperture, audio waveform equalizer, and thinking orb states.
- [`components/AiraAvatarStage.tsx`](file:///Users/bhavukarora/IdeaProjects/aira-workout/components/AiraAvatarStage.tsx): Character stage with reactive holographic speech halo, float animation, and cognitive badge.
- [`components/BreathingPacerCard.tsx`](file:///Users/bhavukarora/IdeaProjects/aira-workout/components/BreathingPacerCard.tsx): Diaphragmatic breath pacer with 64px breathing orb, concentric pulse rings, and HR/HRV metrics.
- [`components/BiomechanicalCard.tsx`](file:///Users/bhavukarora/IdeaProjects/aira-workout/components/BiomechanicalCard.tsx): Interval card with circular animated SVG timer gauge, kinematic solver note, tempo cues, and workout controls.
- [`components/CircuitPlanCard.tsx`](file:///Users/bhavukarora/IdeaProjects/aira-workout/components/CircuitPlanCard.tsx): Circuit protocol briefing with round previews and zone requirements.
- [`components/DebriefCard.tsx`](file:///Users/bhavukarora/IdeaProjects/aira-workout/components/DebriefCard.tsx): Post-session debrief with caloric burn, peak HR, form adherence, and coach takeaway.
- [`components/TalkOverDrawer.tsx`](file:///Users/bhavukarora/IdeaProjects/aira-workout/components/TalkOverDrawer.tsx): iOS-style bottom sheet modal with sheet drag pill, one-tap voice interruption chips, and active listener input.

### 3. Audio & Voice Architecture (Sarvam AI & Studio Audio)
- **Natural Voice Playback**: 8 studio-engineered audio clips pre-rendered in `public/audio/` for instant local execution without API latency.
- **Sarvam AI TTS API Route**: Serverless endpoint at [`app/api/tts/route.ts`](file:///Users/bhavukarora/IdeaProjects/aira-workout/app/api/tts/route.ts) configured for dynamic text synthesis with Sarvam AI's `bulbul:v1` model (`meera` speaker).
- **Dynamic Island Waveforms**: 5-bar audio equalizer bars synchronized with audio playback and vocal cadences.

### 4. Authentic Device Architecture
- **Contained iPhone 16 Pro Chassis**: 390px × 844px form factor with cosmic orange bezel (`#F2541A`), specular rim highlights, and Apple Dynamic Island.
- **Apple System Status Bar**: 9:41 clock, cellular bars, Wi-Fi icon, and battery indicator with terminal nub.
- **Liquid Glass Materials**: Translucent frosted surfaces (`backdrop-filter: blur(28px)`), subtle borders, and layered shadows.
- **Boxicons Exclusively**: Zero Lucide icon dependencies (`bx bx-*` throughout).

---

## 🚀 Tested Scenarios & Modes

| Mode | Trigger / Voice Prompt | Thinking Orb State | Real-Time AI Adaptation |
| :--- | :--- | :--- | :--- |
| **1. Circuit Briefing** | *Start 12-Min Workout* | `connecting` (20px, Orange) | Loads 3-round functional power protocol with target zones and movement previews. |
| **2. Work Interval** | *Start Round 1* | `working` (20px, Orange) | Live circular countdown ring (45s), form tempo (3s down, 1s pause, explode up), Zone 4 pulse indicator. |
| **3. Joint Adaptation** | *"My knee hurts"* | `solving` (20px, Orange) | Instantly replaces split squats with Romanian Deadlifts; zero patellar stress; preserves workout volume. |
| **4. Breath Recovery** | *"Need extra rest"* | `breathing` (64px, Cyan) | Extends rest timer by +20s; engages 64px Thinking Orb and diaphragmatic breath pacer ring. |
| **5. Intensity Push** | *"Make it harder"* | `shaping` (20px, Red) | Unlocks Zone 5 Anaerobic Max (178 BPM); accelerates tempo to explosive vertical jumps. |
| **6. Debrief** | *"Cooldown & Debrief"* | `weaving` (20px, Emerald) | Comprehensive stats breakdown: 184 kcal, 96% form score, and recovery nutrition prescription. |

---

## 🛠️ Local Development & Running

### Requirements
- Node.js 18+ (tested on Node v22.17.0)
- npm 10+

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Build for production (verified clean compilation)
npm run build

# 3. Start local server
npm run start
# or for hot reloading:
npm run dev

# App runs locally at: http://localhost:3000
```

---

## 📦 Submission Files
- **Source Zip**: `aira-workout-source.zip` (Clean, self-contained Next.js project with zero extraneous files).
- **Starter Kit Compatibility**: 38/38 unit tests pass in `workout-starter`.
