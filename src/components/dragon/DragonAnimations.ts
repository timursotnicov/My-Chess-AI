import { DragonMood } from '../../types';

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
  idle: -1, // loops
  eating: 2000,
  drinking: 1500,
  playing: 3000,
  petting: 2000,
  training: 2500,
  flying: 3000,
  sleeping: -1, // loops
  happy: 2000,
  sad: -1, // loops
  sick: -1, // loops
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

export const MOOD_TO_ANIMATION: Record<DragonMood, AnimationState> = {
  happy: 'idle',
  neutral: 'idle',
  sad: 'sad',
  sick: 'sick',
  sleeping: 'sleeping',
};
