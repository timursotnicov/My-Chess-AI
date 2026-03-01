import { BondState } from '../types';

const BOND_MAX = 100;
const TRUST_PER_BOND_LEVEL = 50;
const NEGLECT_THRESHOLD_HOURS = 24;
const NEGLECT_PENALTY = 3;
const MAX_NEGLECT_STREAK = 7;

export const createInitialBond = (): BondState => ({
  level: 5,
  trust: 0,
  lastInteraction: Date.now(),
  totalInteractions: 0,
  neglectStreak: 0,
});

export const addBondXp = (bond: BondState, xp: number): BondState => {
  const newTrust = bond.trust + xp;
  let newLevel = bond.level;

  // Level up bond when enough trust accumulated
  while (newTrust >= trustForNextLevel(newLevel) && newLevel < BOND_MAX) {
    newLevel++;
  }

  return {
    ...bond,
    level: Math.min(newLevel, BOND_MAX),
    trust: newTrust,
    lastInteraction: Date.now(),
    totalInteractions: bond.totalInteractions + 1,
    neglectStreak: 0,
  };
};

export const processNeglect = (bond: BondState, currentTime: number): BondState => {
  const hoursSinceInteraction = (currentTime - bond.lastInteraction) / (1000 * 60 * 60);

  if (hoursSinceInteraction < NEGLECT_THRESHOLD_HOURS) {
    return bond;
  }

  const neglectDays = Math.floor(hoursSinceInteraction / 24);
  const newNeglectStreak = Math.min(bond.neglectStreak + neglectDays, MAX_NEGLECT_STREAK);
  const penalty = neglectDays * NEGLECT_PENALTY;
  const newLevel = Math.max(0, bond.level - penalty);

  return {
    ...bond,
    level: newLevel,
    neglectStreak: newNeglectStreak,
  };
};

export const trustForNextLevel = (currentLevel: number): number => {
  return currentLevel * TRUST_PER_BOND_LEVEL + TRUST_PER_BOND_LEVEL;
};

export const getBondTier = (level: number): 'stranger' | 'acquaintance' | 'companion' | 'friend' | 'soulbound' => {
  if (level < 10) return 'stranger';
  if (level < 30) return 'acquaintance';
  if (level < 55) return 'companion';
  if (level < 80) return 'friend';
  return 'soulbound';
};

export const getBondMultiplier = (level: number): number => {
  // Bond level affects rewards from actions
  return 1 + (level / BOND_MAX) * 0.5; // 1.0x at 0, 1.5x at 100
};

export const canUnlockWithBond = (required: number, current: number): boolean => {
  return current >= required;
};
