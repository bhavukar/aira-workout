import { ExerciseData, PresetAction, WorkoutMode } from '../types/workout';

export const DEFAULT_EXERCISE: ExerciseData = {
  name: 'Bulgarian Split Squats',
  target: 'Glutes & Quads',
  tempo: '3s lower · 1s pause · explode up',
  formCue: 'Keep torso slightly hinged, sink weight through midfoot.',
  duration: 45,
  zone: 'Zone 4',
  hrBpm: 164,
  adapted: false,
};

export const KNEE_ADAPTED_EXERCISE: ExerciseData = {
  name: 'Romanian Deadlifts',
  target: 'Posterior Chain & Hamstrings',
  tempo: '3s eccentric · neutral spine · drive hips',
  formCue: 'Zero patellar shear. Push hips back, soft knee bend.',
  duration: 45,
  zone: 'Zone 4',
  hrBpm: 158,
  adapted: true,
};

export const INTENSITY_EXERCISE: ExerciseData = {
  name: 'Explosive Bulgarian Jumps',
  target: 'Power & Explosiveness',
  tempo: '1s rapid load · max vertical propulsion',
  formCue: 'Max effort push! Land soft, absorb, immediately drive upward.',
  duration: 30,
  zone: 'Zone 5',
  hrBpm: 178,
  adapted: true,
};

export const AUDIO_MAP: Record<WorkoutMode, string> = {
  standby: '/audio/standby-kickoff.mp3',
  briefing: '/audio/briefing.mp3',
  interval: '/audio/interval.mp3',
  'adaptive-swap': '/audio/knee-swap.mp3',
  recovery: '/audio/recovery.mp3',
  intensity: '/audio/intensity.mp3',
  debrief: '/audio/debrief.mp3',
};

export const PRESET_ACTIONS: PresetAction[] = [
  {
    id: 'interval',
    title: 'Start 12-Min Circuit',
    subtitle: 'Bulgarian Split Squats',
    iconClass: 'bx-play-circle',
    iconColor: '#F2541A',
  },
  {
    id: 'adaptive-swap',
    title: 'Adapt: "My knee hurts"',
    subtitle: 'Swaps to Romanian Deadlift',
    iconClass: 'bx-refresh',
    iconColor: '#F2541A',
    userPrompt: 'Wait, my knee hurts.',
  },
  {
    id: 'recovery',
    title: 'Pacing: "Need extra rest"',
    subtitle: '+20s Breath recovery',
    iconClass: 'bx-wind',
    iconColor: '#38bdf8',
    userPrompt: 'Need extra rest.',
  },
  {
    id: 'intensity',
    title: 'Intensity: "Make it harder"',
    subtitle: 'Max Effort Push',
    iconClass: 'bxs-zap',
    iconColor: '#ef4444',
    userPrompt: 'Make it harder.',
  },
  {
    id: 'debrief',
    title: 'Finish: "Cooldown & Debrief"',
    subtitle: '184 kcal burn · Form adherence · Recovery notes',
    iconClass: 'bx-trophy',
    iconColor: '#10b981',
    userPrompt: 'Session complete!',
  },
];
