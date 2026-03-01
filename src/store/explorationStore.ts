import { create } from 'zustand';
import {
  LocationState,
  LocationId,
  Expedition,
  ExpeditionStatus,
  EncounterReward,
} from '../types';
import { LOCATIONS } from '../data/locations';
import { eventBus } from '../systems/eventBus';

interface ExplorationStoreState {
  locations: LocationState[];
  expedition: Expedition | null;

  discoverLocation: (id: LocationId) => void;
  unlockLocation: (id: LocationId) => void;
  startExpedition: (locationId: LocationId) => boolean;
  updateExpedition: () => void;
  completeExpedition: () => EncounterReward[];
  addExplorationProgress: (locationId: LocationId, amount: number) => void;
  addSecret: (locationId: LocationId, secretId: string) => void;
  setLocations: (locations: LocationState[]) => void;
  setExpedition: (expedition: Expedition | null) => void;
  isLocationUnlocked: (id: LocationId, playerLevel: number, bondLevel: number) => boolean;
}

const createInitialLocations = (): LocationState[] =>
  LOCATIONS.map((loc) => ({
    id: loc.id,
    isDiscovered: loc.id === 'whispering_forest',
    isUnlocked: loc.id === 'whispering_forest',
    explorationProgress: 0,
    secretsFound: [],
    visitCount: 0,
  }));

export const useExplorationStore = create<ExplorationStoreState>((set, get) => ({
  locations: createInitialLocations(),
  expedition: null,

  discoverLocation: (id: LocationId) => {
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === id ? { ...loc, isDiscovered: true } : loc,
      ),
    }));
  },

  unlockLocation: (id: LocationId) => {
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === id ? { ...loc, isUnlocked: true, isDiscovered: true } : loc,
      ),
    }));
  },

  startExpedition: (locationId: LocationId) => {
    const { expedition, locations } = get();
    if (expedition && expedition.status !== 'completed' && expedition.status !== 'idle') {
      return false;
    }

    const location = locations.find((l) => l.id === locationId);
    if (!location || !location.isUnlocked) return false;

    const locDef = LOCATIONS.find((l) => l.id === locationId);
    if (!locDef) return false;

    const newExpedition: Expedition = {
      locationId,
      startTime: Date.now(),
      duration: locDef.explorationTimeMs,
      status: 'traveling',
      encounters: [],
      rewards: [],
    };

    // Increment visit count
    set({
      expedition: newExpedition,
      locations: locations.map((l) =>
        l.id === locationId ? { ...l, visitCount: l.visitCount + 1 } : l,
      ),
    });

    return true;
  },

  updateExpedition: () => {
    const { expedition } = get();
    if (!expedition || expedition.status === 'completed' || expedition.status === 'idle') return;

    const elapsed = Date.now() - expedition.startTime;
    const progress = Math.min(1, elapsed / expedition.duration);

    let newStatus: ExpeditionStatus = expedition.status;
    if (progress < 0.2) newStatus = 'traveling';
    else if (progress < 0.8) newStatus = 'exploring';
    else if (progress < 1) newStatus = 'returning';
    else newStatus = 'completed';

    if (newStatus !== expedition.status) {
      set({ expedition: { ...expedition, status: newStatus } });
    }
  },

  completeExpedition: () => {
    const { expedition } = get();
    if (!expedition || expedition.status !== 'completed') return [];

    const rewards = expedition.rewards;

    // Add exploration progress
    get().addExplorationProgress(expedition.locationId, 5);

    eventBus.emit('expedition_complete', {
      locationId: expedition.locationId,
      rewards,
    });

    set({ expedition: null });
    return rewards;
  },

  addExplorationProgress: (locationId: LocationId, amount: number) => {
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === locationId
          ? { ...loc, explorationProgress: Math.min(100, loc.explorationProgress + amount) }
          : loc,
      ),
    }));
  },

  addSecret: (locationId: LocationId, secretId: string) => {
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === locationId && !loc.secretsFound.includes(secretId)
          ? { ...loc, secretsFound: [...loc.secretsFound, secretId] }
          : loc,
      ),
    }));
  },

  setLocations: (locations: LocationState[]) => set({ locations }),
  setExpedition: (expedition: Expedition | null) => set({ expedition }),

  isLocationUnlocked: (id: LocationId, playerLevel: number, bondLevel: number) => {
    const locDef = LOCATIONS.find((l) => l.id === id);
    if (!locDef) return false;
    return playerLevel >= locDef.unlockLevel && bondLevel >= locDef.unlockBond;
  },
}));
