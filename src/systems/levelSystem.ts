import { DragonStage } from '../types';
import { xpForLevel, getStageForLevel, MAX_LEVEL } from '../data/levels';

export interface LevelUpResult {
  newLevel: number;
  newStage: DragonStage | null; // non-null if stage changed
  overflow: number;
}

export const processXP = (
  currentLevel: number,
  currentXP: number,
  xpToAdd: number,
): LevelUpResult => {
  if (currentLevel >= MAX_LEVEL) {
    return { newLevel: currentLevel, newStage: null, overflow: 0 };
  }

  let level = currentLevel;
  let xp = currentXP + xpToAdd;
  const oldStage = getStageForLevel(level);

  while (xp >= xpForLevel(level) && level < MAX_LEVEL) {
    xp -= xpForLevel(level);
    level++;
  }

  const newStage = getStageForLevel(level);
  return {
    newLevel: level,
    newStage: newStage !== oldStage ? newStage : null,
    overflow: xp,
  };
};

export const getXPProgress = (level: number, xp: number): number => {
  const needed = xpForLevel(level);
  if (needed === 0) return 1;
  return Math.min(1, xp / needed);
};
