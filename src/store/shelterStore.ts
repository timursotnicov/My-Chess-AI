import { create } from 'zustand';
import {
  ShelterState,
  ShelterRoomState,
  RoomType,
  ResourceInventory,
  ResourceType,
} from '../types';
import { SHELTER_ROOMS } from '../data/shelterRooms';
import { eventBus } from '../systems/eventBus';

interface ShelterStoreState {
  shelter: ShelterState;
  upgradeRoom: (roomId: RoomType) => boolean;
  unlockRoom: (roomId: RoomType) => boolean;
  addResource: (type: ResourceType, amount: number) => void;
  removeResource: (type: ResourceType, amount: number) => boolean;
  hasResources: (cost: Partial<ResourceInventory>) => boolean;
  setShelter: (shelter: ShelterState) => void;
  getRoomBonuses: () => { statRegen: Partial<Record<string, number>>; xpMultiplier: number; bondBoost: number };
}

const createInitialShelter = (): ShelterState => ({
  type: 'cave',
  level: 1,
  rooms: [
    { id: 'hearth', level: 1, isUnlocked: true },
    { id: 'sleeping_den', level: 1, isUnlocked: true },
    { id: 'shadow_garden', level: 0, isUnlocked: false },
    { id: 'training_ground', level: 0, isUnlocked: false },
    { id: 'alchemy_lab', level: 0, isUnlocked: false },
    { id: 'treasure_vault', level: 0, isUnlocked: false },
  ],
  decorations: [],
  resources: {
    stone: 10,
    wood: 10,
    herbs: 5,
    crystals: 0,
    ancient_dust: 0,
    moonwater: 0,
  },
});

export const useShelterStore = create<ShelterStoreState>((set, get) => ({
  shelter: createInitialShelter(),

  upgradeRoom: (roomId: RoomType) => {
    const { shelter } = get();
    const roomState = shelter.rooms.find((r) => r.id === roomId);
    if (!roomState || !roomState.isUnlocked) return false;

    const roomDef = SHELTER_ROOMS.find((r) => r.id === roomId);
    if (!roomDef) return false;

    if (roomState.level >= roomDef.maxLevel) return false;

    const cost = roomDef.upgradeCosts[roomState.level - 1];
    if (!cost || !get().hasResources(cost)) return false;

    // Deduct resources
    const newResources = { ...shelter.resources };
    for (const [res, amount] of Object.entries(cost)) {
      const key = res as ResourceType;
      newResources[key] -= amount ?? 0;
    }

    const newRooms = shelter.rooms.map((r) =>
      r.id === roomId ? { ...r, level: r.level + 1 } : r,
    );

    set({
      shelter: {
        ...shelter,
        rooms: newRooms,
        resources: newResources,
      },
    });

    eventBus.emit('room_upgraded', { roomId, newLevel: roomState.level + 1 });
    return true;
  },

  unlockRoom: (roomId: RoomType) => {
    const { shelter } = get();
    const roomState = shelter.rooms.find((r) => r.id === roomId);
    if (!roomState || roomState.isUnlocked) return false;

    const roomDef = SHELTER_ROOMS.find((r) => r.id === roomId);
    if (!roomDef) return false;

    // First unlock cost is upgradeCosts[0]
    const cost = roomDef.upgradeCosts[0];
    if (!cost || !get().hasResources(cost)) return false;

    const newResources = { ...shelter.resources };
    for (const [res, amount] of Object.entries(cost)) {
      const key = res as ResourceType;
      newResources[key] -= amount ?? 0;
    }

    const newRooms = shelter.rooms.map((r) =>
      r.id === roomId ? { ...r, isUnlocked: true, level: 1 } : r,
    );

    set({
      shelter: {
        ...shelter,
        rooms: newRooms,
        resources: newResources,
      },
    });

    return true;
  },

  addResource: (type: ResourceType, amount: number) => {
    set((state) => ({
      shelter: {
        ...state.shelter,
        resources: {
          ...state.shelter.resources,
          [type]: state.shelter.resources[type] + amount,
        },
      },
    }));
  },

  removeResource: (type: ResourceType, amount: number) => {
    const { shelter } = get();
    if (shelter.resources[type] < amount) return false;
    set({
      shelter: {
        ...shelter,
        resources: {
          ...shelter.resources,
          [type]: shelter.resources[type] - amount,
        },
      },
    });
    return true;
  },

  hasResources: (cost: Partial<ResourceInventory>) => {
    const { shelter } = get();
    for (const [res, amount] of Object.entries(cost)) {
      if ((shelter.resources[res as ResourceType] ?? 0) < (amount ?? 0)) {
        return false;
      }
    }
    return true;
  },

  setShelter: (shelter: ShelterState) => set({ shelter }),

  getRoomBonuses: () => {
    const { shelter } = get();
    const result = { statRegen: {} as Record<string, number>, xpMultiplier: 1, bondBoost: 0 };

    for (const room of shelter.rooms) {
      if (!room.isUnlocked || room.level === 0) continue;
      const def = SHELTER_ROOMS.find((r) => r.id === room.id);
      if (!def) continue;

      for (const bonus of def.baseBonuses) {
        const multiplier = 1 + (room.level - 1) * 0.2;
        if (bonus.type === 'stat_regen' && bonus.stat) {
          result.statRegen[bonus.stat] = (result.statRegen[bonus.stat] ?? 0) + bonus.value * multiplier;
        } else if (bonus.type === 'xp_multiplier') {
          result.xpMultiplier += bonus.value * multiplier - 1;
        } else if (bonus.type === 'bond_boost') {
          result.bondBoost += bonus.value * multiplier;
        }
      }
    }

    return result;
  },
}));
