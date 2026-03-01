import { DragonStage, StageDefinition } from '../types';

export const STAGES: StageDefinition[] = [
  { id: 'egg', minLevel: 0, maxLevel: 0, backgroundId: 'cave' },
  { id: 'baby', minLevel: 1, maxLevel: 3, backgroundId: 'cave' },
  { id: 'young', minLevel: 4, maxLevel: 6, backgroundId: 'meadow' },
  { id: 'juvenile', minLevel: 7, maxLevel: 9, backgroundId: 'mountain' },
  { id: 'teen', minLevel: 10, maxLevel: 13, backgroundId: 'valley' },
  { id: 'adult', minLevel: 14, maxLevel: 17, backgroundId: 'darkKingdom' },
  { id: 'legendary', minLevel: 18, maxLevel: 20, backgroundId: 'throne' },
];

export const xpForLevel = (level: number): number =>
  Math.floor(level * level * 50);

export const getStageForLevel = (level: number): DragonStage => {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (level >= STAGES[i].minLevel) {
      return STAGES[i].id;
    }
  }
  return 'egg';
};

export const getStageDefinition = (stage: DragonStage): StageDefinition =>
  STAGES.find((s) => s.id === stage) ?? STAGES[0];

export const MAX_LEVEL = 20;
