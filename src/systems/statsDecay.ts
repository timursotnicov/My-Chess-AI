import { DragonStats, BondState, PersonalityState, PetMood } from '../types';

const DECAY_PER_MINUTE: DragonStats = {
  hunger: -0.5,
  thirst: -0.7,
  happiness: -0.3,
  energy: -0.2,
  health: 0,
};

const CRITICAL_THRESHOLD = 20;
const DANGER_THRESHOLD = 5;
const HEALTH_DECAY_WHEN_DANGER = -0.3;

export const applyDecay = (
  stats: DragonStats,
  elapsedMs: number,
  isSleeping: boolean,
): DragonStats => {
  const minutes = elapsedMs / 60000;
  const newStats = { ...stats };

  newStats.hunger = clamp(newStats.hunger + DECAY_PER_MINUTE.hunger * minutes);
  newStats.thirst = clamp(newStats.thirst + DECAY_PER_MINUTE.thirst * minutes);
  newStats.happiness = clamp(
    newStats.happiness + DECAY_PER_MINUTE.happiness * minutes,
  );

  if (isSleeping) {
    newStats.energy = clamp(newStats.energy + 2.0 * minutes);
  } else {
    newStats.energy = clamp(
      newStats.energy + DECAY_PER_MINUTE.energy * minutes,
    );
  }

  let healthDrain = 0;
  if (newStats.hunger <= DANGER_THRESHOLD) healthDrain += HEALTH_DECAY_WHEN_DANGER;
  if (newStats.thirst <= DANGER_THRESHOLD) healthDrain += HEALTH_DECAY_WHEN_DANGER;
  if (newStats.happiness <= DANGER_THRESHOLD)
    healthDrain += HEALTH_DECAY_WHEN_DANGER * 0.5;

  if (healthDrain < 0) {
    newStats.health = clamp(newStats.health + healthDrain * minutes);
  } else {
    const allAboveCritical =
      newStats.hunger > CRITICAL_THRESHOLD &&
      newStats.thirst > CRITICAL_THRESHOLD &&
      newStats.happiness > CRITICAL_THRESHOLD;
    if (allAboveCritical && newStats.health < 100) {
      newStats.health = clamp(newStats.health + 0.1 * minutes);
    }
  }

  return newStats;
};

export const applyOfflineDecay = (
  stats: DragonStats,
  elapsedMs: number,
): DragonStats => {
  const maxOffline = 8 * 60 * 60 * 1000; // 8 hours
  const effective = Math.min(elapsedMs, maxOffline);
  return applyDecay(stats, effective * 0.5, false);
};

export const calculateMood = (
  stats: DragonStats,
  bond: BondState,
  personality: PersonalityState,
): PetMood => {
  if (stats.health <= CRITICAL_THRESHOLD) return 'sick';
  if (stats.energy <= 10) return 'sleepy';

  const avg =
    (stats.hunger + stats.thirst + stats.happiness + stats.energy) / 4;

  // Bond influences mood thresholds
  const bondBonus = bond.level * 0.1;

  if (bond.neglectStreak >= 3) return 'lonely';
  if (avg < 20) return 'anxious';

  // Personality influences mood expression
  const dominant = personality.dominantTrait;

  if (avg >= 70 + bondBonus) {
    if (dominant === 'playful') return 'excited';
    if (dominant === 'proud') return 'proud';
    return 'joyful';
  }

  if (avg >= 40) {
    if (dominant === 'curious') return 'curious';
    return 'content';
  }

  return 'anxious';
};

// Keep backward compatibility
export const getMood = (
  stats: DragonStats,
): 'happy' | 'neutral' | 'sad' | 'sick' => {
  if (stats.health <= CRITICAL_THRESHOLD) return 'sick';
  const avg =
    (stats.hunger + stats.thirst + stats.happiness + stats.energy) / 4;
  if (avg >= 60) return 'happy';
  if (avg >= 30) return 'neutral';
  return 'sad';
};

export const isCritical = (stat: number): boolean => stat <= CRITICAL_THRESHOLD;

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));
