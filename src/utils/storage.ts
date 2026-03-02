import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSave } from '../types';

const SAVE_KEY = 'dragon-keep-save';
const SAVE_VERSION = 2;

export const saveGame = async (data: Omit<GameSave, 'version' | 'timestamp'>): Promise<void> => {
  const save: GameSave = {
    ...data,
    version: SAVE_VERSION,
    timestamp: Date.now(),
  };
  await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(save));
};

export const loadGame = async (): Promise<GameSave | null> => {
  const raw = await AsyncStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return migrateSave(data);
  } catch {
    return null;
  }
};

const migrateSave = (data: Record<string, unknown>): GameSave => {
  const version = (data.version as number) ?? 1;

  if (version === 1) {
    const dragon = (data.dragon ?? {}) as Record<string, unknown>;
    const dragonBase = dragon as unknown as GameSave['dragon'];
    return {
      version: SAVE_VERSION,
      timestamp: (data.timestamp as number) ?? Date.now(),
      dragon: {
        ...dragonBase,
        personality: (dragon.personality as GameSave['dragon']['personality']) ?? {
          traits: { brave_cautious: 0, loyal_independent: 0, playful_proud: 0, curious_shadowy: 0 },
          dominantTrait: 'curious' as const,
          quirks: [],
        },
        bond: (dragon.bond as GameSave['dragon']['bond']) ?? {
          level: 5,
          trust: 0,
          lastInteraction: Date.now(),
          totalInteractions: 0,
          neglectStreak: 0,
        },
        appearance: (dragon.appearance as GameSave['dragon']['appearance']) ?? {
          colorVariant: 'amethyst' as const,
          accessories: [],
          scars: [],
          aura: null,
        },
        mood: (dragon.mood as GameSave['dragon']['mood']) ?? ('content' as const),
      },
      cooldowns: (data.cooldowns as GameSave['cooldowns']) ?? {},
      shelter: {
        type: 'cave' as const,
        level: 1,
        rooms: [
          { id: 'hearth' as const, level: 1, isUnlocked: true },
          { id: 'sleeping_den' as const, level: 1, isUnlocked: true },
          { id: 'shadow_garden' as const, level: 0, isUnlocked: false },
          { id: 'training_ground' as const, level: 0, isUnlocked: false },
          { id: 'alchemy_lab' as const, level: 0, isUnlocked: false },
          { id: 'treasure_vault' as const, level: 0, isUnlocked: false },
        ],
        decorations: [],
        resources: { stone: 10, wood: 10, herbs: 5, crystals: 0, ancient_dust: 0, moonwater: 0 },
      },
      locations: [
        { id: 'whispering_forest' as const, isDiscovered: true, isUnlocked: true, explorationProgress: 0, secretsFound: [], visitCount: 0 },
        { id: 'drowned_ruins' as const, isDiscovered: false, isUnlocked: false, explorationProgress: 0, secretsFound: [], visitCount: 0 },
        { id: 'bellless_tower' as const, isDiscovered: false, isUnlocked: false, explorationProgress: 0, secretsFound: [], visitCount: 0 },
      ],
      expedition: null,
      inventory: [],
      collections: [],
      daily: {
        lastLoginDate: new Date().toISOString().slice(0, 10),
        loginStreak: 1,
        dailyGoals: [],
        todaysEvent: null,
        offlineFindings: [],
      },
      profile: {
        totalPlayTime: 0,
        actionsPerformed: 0,
        expeditionsCompleted: 0,
        itemsCollected: 0,
        collectionsCompleted: 0,
        miniGamesPlayed: 0,
        highestBond: 0,
        roomsUpgraded: 0,
      },
      settings: (data.settings as GameSave['settings']) ?? {
        language: 'en' as const,
        soundEnabled: true,
        musicEnabled: true,
      },
    };
  }

  return data as unknown as GameSave;
};

export const hasSave = async (): Promise<boolean> => {
  const raw = await AsyncStorage.getItem(SAVE_KEY);
  return raw !== null;
};

export const deleteSave = async (): Promise<void> => {
  await AsyncStorage.removeItem(SAVE_KEY);
};
