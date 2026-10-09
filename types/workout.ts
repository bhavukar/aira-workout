export type WorkoutMode =
  | 'standby'
  | 'briefing'
  | 'interval'
  | 'adaptive-swap'
  | 'recovery'
  | 'intensity'
  | 'debrief';

export type HeartRateZone = 'Zone 2' | 'Zone 3' | 'Zone 4' | 'Zone 5';

export interface ExerciseData {
  name: string;
  target: string;
  tempo: string;
  formCue: string;
  duration: number; // in seconds
  zone: HeartRateZone;
  hrBpm: number;
  adapted?: boolean;
}

export interface PresetAction {
  id: WorkoutMode;
  title: string;
  subtitle: string;
  iconClass: string;
  iconColor: string;
  userPrompt?: string;
}
