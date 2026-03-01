import { create } from 'zustand';
import {
  DragonState,
  DragonStats,
  DragonMood,
  ActionId,
  CooldownMap,
} from '../types';
import { applyDecay, applyOfflineDecay, getMood } from '../systems/statsDecay';
import { processXP, getXPProgress } from '../systems/levelSystem';
import {
  canPerformAction,
  performAction,
  getAvailableActions,
  getCooldownRemaining,
} from '../systems/actionSystem';
import { getStageForLevel } from '../data/levels';
import { saveGame, loadGame, deleteSave } from '../utils/storage';

interface GameState {
  // Dragon state
  dragon: DragonState | null;
  cooldowns: CooldownMap;
  isLoaded: boolean;
  hasExistingSave: boolean;

  // Derived
  xpProgress: number;

  // Actions
  initNewGame: (name: string) => void;
  loadSavedGame: () => Promise<void>;
  tick: (elapsedMs: number) => void;
  performDragonAction: (actionId: ActionId) => boolean;
  canDoAction: (actionId: ActionId) => { success: boolean; reason?: string };
  getActionCooldown: (actionId: ActionId) => number;
  save: () => Promise<void>;
  resetGame: () => Promise<void>;
  checkForSave: () => Promise<void>;
}

const createInitialStats = (): DragonStats => ({
  hunger: 80,
  thirst: 80,
  happiness: 70,
  energy: 100,
  health: 100,
});

export const useGameStore = create<GameState>((set, get) => ({
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
      mood: 'happy',
      isSleeping: false,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
    set({ dragon, cooldowns: {}, isLoaded: true });
  },

  loadSavedGame: async () => {
    const save = await loadGame();
    if (save) {
      // Process offline time
      const elapsed = Date.now() - save.timestamp;
      const updatedStats = applyOfflineDecay(save.dragon.stats, elapsed);
      const mood = getMood(updatedStats);

      set({
        dragon: {
          ...save.dragon,
          stats: updatedStats,
          mood,
          lastUpdated: Date.now(),
        },
        cooldowns: save.cooldowns,
        isLoaded: true,
      });
    }
  },

  tick: (elapsedMs: number) => {
    const { dragon } = get();
    if (!dragon || dragon.isSleeping) return;

    const newStats = applyDecay(dragon.stats, elapsedMs, dragon.isSleeping);
    const mood = getMood(newStats);
    const isSleeping = newStats.energy <= 0;

    set({
      dragon: {
        ...dragon,
        stats: newStats,
        mood: isSleeping ? 'sleeping' : mood,
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

    set({
      dragon: {
        ...dragon,
        stats: newStats,
        experience: levelResult.overflow,
        level: levelResult.newLevel,
        stage: newStage,
        mood: getMood(newStats),
        isSleeping: false,
        lastUpdated: Date.now(),
      },
      cooldowns: newCooldowns,
      xpProgress: getXPProgress(levelResult.newLevel, levelResult.overflow),
    });

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

  save: async () => {
    const { dragon, cooldowns } = get();
    if (!dragon) return;
    const { language, soundEnabled, musicEnabled } =
      require('./settingsStore').useSettingsStore.getState();
    await saveGame({
      dragon,
      cooldowns,
      settings: { language, soundEnabled, musicEnabled },
    });
  },

  resetGame: async () => {
    await deleteSave();
    set({
      dragon: null,
      cooldowns: {},
      isLoaded: false,
      hasExistingSave: false,
    });
  },

  checkForSave: async () => {
    const save = await loadGame();
    set({ hasExistingSave: save !== null });
  },
}));
