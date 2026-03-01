import { ActionId, DragonStats, DragonStage, CooldownMap } from '../types';
import { ACTIONS, getAction } from '../data/actions';
import { STAGES } from '../data/levels';

export interface ActionResult {
  success: boolean;
  reason?: string;
  statChanges?: Partial<DragonStats>;
  xpGained?: number;
}

const STAGE_ORDER: DragonStage[] = STAGES.map((s) => s.id);

const stageIndex = (stage: DragonStage): number =>
  STAGE_ORDER.indexOf(stage);

export const canPerformAction = (
  actionId: ActionId,
  level: number,
  stage: DragonStage,
  energy: number,
  cooldowns: CooldownMap,
): ActionResult => {
  const action = getAction(actionId);
  if (!action) return { success: false, reason: 'unknown_action' };

  if (level < action.unlockLevel)
    return { success: false, reason: 'level_too_low' };

  if (stageIndex(stage) < stageIndex(action.unlockStage))
    return { success: false, reason: 'stage_too_low' };

  if (energy < action.energyCost)
    return { success: false, reason: 'not_enough_energy' };

  const cooldownEnd = cooldowns[actionId] ?? 0;
  if (Date.now() < cooldownEnd)
    return { success: false, reason: 'on_cooldown' };

  return { success: true };
};

export const performAction = (
  actionId: ActionId,
  stats: DragonStats,
  cooldowns: CooldownMap,
): { newStats: DragonStats; newCooldowns: CooldownMap; xp: number } => {
  const action = getAction(actionId)!;
  const newStats = { ...stats };

  // Apply stat effects
  for (const [key, value] of Object.entries(action.effects)) {
    const statKey = key as keyof DragonStats;
    newStats[statKey] = clamp(newStats[statKey] + (value ?? 0));
  }

  // Set cooldown
  const newCooldowns = {
    ...cooldowns,
    [actionId]: Date.now() + action.cooldownMs,
  };

  return {
    newStats,
    newCooldowns,
    xp: action.xp,
  };
};

export const getAvailableActions = (
  level: number,
  stage: DragonStage,
): typeof ACTIONS => {
  return ACTIONS.filter(
    (a) =>
      level >= a.unlockLevel &&
      stageIndex(stage) >= stageIndex(a.unlockStage),
  );
};

export const getCooldownRemaining = (
  actionId: ActionId,
  cooldowns: CooldownMap,
): number => {
  const end = cooldowns[actionId] ?? 0;
  return Math.max(0, end - Date.now());
};

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));
