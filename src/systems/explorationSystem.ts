import {
  Expedition,
  LocationId,
  EncounterReward,
  ResourceType,
} from '../types';
import { LOCATIONS } from '../data/locations';
import { getRandomEncounter } from '../data/encounters';

export const generateExpeditionRewards = (
  locationId: LocationId,
  explorationProgress: number,
): EncounterReward[] => {
  const locDef = LOCATIONS.find((l) => l.id === locationId);
  if (!locDef) return [];

  const rewards: EncounterReward[] = [];

  // Base resource rewards
  for (const res of locDef.resources) {
    const amount = 1 + Math.floor(Math.random() * 3);
    rewards.push({ type: 'resource', id: res, amount });
  }

  // XP reward
  rewards.push({ type: 'xp', amount: 15 + Math.floor(explorationProgress * 0.5) });

  // Bond reward
  rewards.push({ type: 'bond', amount: 2 + Math.floor(explorationProgress * 0.05) });

  return rewards;
};

export const checkLocationUnlock = (
  locationId: LocationId,
  playerLevel: number,
  bondLevel: number,
): boolean => {
  const loc = LOCATIONS.find((l) => l.id === locationId);
  if (!loc) return false;
  return playerLevel >= loc.unlockLevel && bondLevel >= loc.unlockBond;
};

export const getExpeditionProgress = (expedition: Expedition): number => {
  const elapsed = Date.now() - expedition.startTime;
  return Math.min(1, elapsed / expedition.duration);
};

export const isExpeditionComplete = (expedition: Expedition): boolean => {
  return Date.now() - expedition.startTime >= expedition.duration;
};

export const triggerEncounter = (
  locationId: LocationId,
  explorationProgress: number,
): string | null => {
  const encounter = getRandomEncounter(locationId, explorationProgress);
  return encounter?.id ?? null;
};
