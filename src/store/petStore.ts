import { create } from 'zustand';
import {
  DragonState,
  DragonStats,
  PetMood,
  ActionId,
  CooldownMap,
  PersonalityState,
  BondState,
  AppearanceState,
} from '../types';
import { applyDecay, applyOfflineDecay, calculateMood } from '../systems/statsDecay';
import { processXP, getXPProgress } from '../systems/levelSystem';
import {
  canPerformAction,
  performAction,
  getAvailableActions,
  getCooldownRemaining,
} from '../systems/actionSystem';
import { getStageForLevel } from '../data/levels';
import { createInitialPersonality, applyPersonalityShift } from '../systems/personalitySystem';
import { createInitialBond, addBondXp, processNeglect } from '../systems/bondSystem';
import { getAction } from '../data/actions';
import { eventBus } from '../systems/eventBus';

interface PetStoreState {
  dragon: DragonState | null;
  cooldowns: CooldownMap;
  isLoaded: boolean;
  hasExistingSave: boolean;
  xpProgress: number;

  initNewGame: (name: string) => void;
  setDragon: (dragon: DragonState, cooldowns?: CooldownMap) => void;
  tick: (elapsedMs: number) => void;
  performDragonAction: (actionId: ActionId) => boolean;
  canDoAction: (actionId: ActionId) => { success: boolean; reason?: string };
  getActionCooldown: (actionId: ActionId) => number;
  setLoaded: (loaded: boolean) => void;
  setHasExistingSave: (has: boolean) => void;
  processOfflineTime: (elapsedMs: number) => void;
}

const createInitialStats = (): DragonStats => ({
  hunger: 80,
  thirst: 80,
  happiness: 70,
  energy: 100,
  health: 100,
});

const createInitialAppearance = (): AppearanceState => ({
  colorVariant: 'amethyst',
  accessories: [],
  scars: [],
  aura: null,
});

export const usePetStore = create<PetStoreState>((set, get) => ({
  dragon: null,
  cooldowns: {},
  isLoaded: false,
  hasExistingSave: false,
  xpProgress: 0,

  initNewGame: (name: string) => {
    const dragon: DragonState = {
      name,
      stats: createInitialStats(),
      experience: 0,
      level: 1,
      age: 0,
      stage: 'baby',
      mood: 'content',
      isSleeping: false,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      personality: createInitialPersonality(),
      bond: createInitialBond(),
      appearance: createInitialAppearance(),
    };
    set({ dragon, cooldowns: {}, isLoaded: true });
  },

  setDragon: (dragon: DragonState, cooldowns?: CooldownMap) => {
    set({
      dragon,
      cooldowns: cooldowns ?? get().cooldowns,
      isLoaded: true,
    });
  },

  processOfflineTime: (elapsedMs: number) => {
    const { dragon } = get();
    if (!dragon) return;

    const updatedStats = applyOfflineDecay(dragon.stats, elapsedMs);
    const mood = calculateMood(updatedStats, dragon.bond, dragon.personality);
    const bond = processNeglect(dragon.bond, Date.now());

    set({
      dragon: {
        ...dragon,
        stats: updatedStats,
        mood,
        bond,
        lastUpdated: Date.now(),
      },
    });
  },

  tick: (elapsedMs: number) => {
    const { dragon } = get();
    if (!dragon || dragon.isSleeping) return;

    const newStats = applyDecay(dragon.stats, elapsedMs, dragon.isSleeping);
    const mood = calculateMood(newStats, dragon.bond, dragon.personality);
    const isSleeping = newStats.energy <= 0;

    set({
      dragon: {
        ...dragon,
        stats: newStats,
        mood: isSleeping ? 'sleepy' : mood,
        isSleeping,
        lastUpdated: Date.now(),
        age: Math.floor(
          (Date.now() - dragon.createdAt) / (24 * 60 * 60 * 1000),
        ),
      },
    });
  },

  performDragonAction: (actionId: ActionId) => {
    const { dragon, cooldowns } = get();
    if (!dragon) return false;

    const check = canPerformAction(
      actionId,
      dragon.level,
      dragon.stage,
      dragon.stats.energy,
      cooldowns,
    );
    if (!check.success) return false;

    const { newStats, newCooldowns, xp } = performAction(
      actionId,
      dragon.stats,
      cooldowns,
    );

    const levelResult = processXP(dragon.level, dragon.experience, xp);
    const newStage = levelResult.newStage ?? dragon.stage;

    // Get action definition for personality/bond effects
    const actionDef = getAction(actionId);
    const newPersonality = actionDef
      ? applyPersonalityShift(dragon.personality, actionDef.personalityWeights)
      : dragon.personality;
    const newBond = actionDef
      ? addBondXp(dragon.bond, actionDef.bondXp)
      : dragon.bond;

    const newMood = calculateMood(newStats, newBond, newPersonality);

    set({
      dragon: {
        ...dragon,
        stats: newStats,
        experience: levelResult.overflow,
        level: levelResult.newLevel,
        stage: newStage,
        mood: newMood,
        isSleeping: false,
        lastUpdated: Date.now(),
        personality: newPersonality,
        bond: newBond,
      },
      cooldowns: newCooldowns,
      xpProgress: getXPProgress(levelResult.newLevel, levelResult.overflow),
    });

    // Emit events
    eventBus.emit('action_performed', { actionId, xp, bondXp: actionDef?.bondXp ?? 0 });

    if (levelResult.newLevel > dragon.level) {
      eventBus.emit('level_up', { oldLevel: dragon.level, newLevel: levelResult.newLevel });
    }
    if (levelResult.newStage) {
      eventBus.emit('stage_evolved', { oldStage: dragon.stage, newStage: levelResult.newStage });
    }
    if (newPersonality.dominantTrait !== dragon.personality.dominantTrait) {
      eventBus.emit('personality_shifted', {
        oldTrait: dragon.personality.dominantTrait,
        newTrait: newPersonality.dominantTrait,
      });
    }

    return true;
  },

  canDoAction: (actionId: ActionId) => {
    const { dragon, cooldowns } = get();
    if (!dragon) return { success: false, reason: 'no_dragon' };
    return canPerformAction(
      actionId,
      dragon.level,
      dragon.stage,
      dragon.stats.energy,
      cooldowns,
    );
  },

  getActionCooldown: (actionId: ActionId) => {
    return getCooldownRemaining(actionId, get().cooldowns);
  },

  setLoaded: (loaded: boolean) => set({ isLoaded: loaded }),
  setHasExistingSave: (has: boolean) => set({ hasExistingSave: has }),
}));
