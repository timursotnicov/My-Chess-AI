export type AnimationState =
  | 'idle'
  | 'eating'
  | 'drinking'
  | 'playing'
  | 'petting'
  | 'training'
  | 'flying'
  | 'sleeping'
  | 'happy'
  | 'sad'
  | 'sick';

export const ANIMATION_DURATIONS: Record<AnimationState, number> = {
  idle: -1,
  eating: 2000,
  drinking: 1500,
  playing: 3000,
  petting: 2000,
  training: 2500,
  flying: 3000,
  sleeping: -1,
  happy: 2000,
  sad: -1,
  sick: -1,
};

export const ACTION_TO_ANIMATION: Record<string, AnimationState> = {
  feed: 'eating',
  water: 'drinking',
  pet: 'petting',
  play: 'playing',
  train: 'training',
  fly: 'flying',
  raid: 'training',
  kidnap: 'flying',
  siege: 'training',
};

export const MOOD_TO_ANIMATION: Record<string, AnimationState> = {
  joyful: 'idle',
  content: 'idle',
  curious: 'idle',
  anxious: 'sad',
  lonely: 'sad',
  proud: 'idle',
  sleepy: 'sleeping',
  sick: 'sick',
  excited: 'happy',
  happy: 'idle',
  neutral: 'idle',
  sad: 'sad',
  sleeping: 'sleeping',
};
