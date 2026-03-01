import { create } from 'zustand';
import { ProfileStats } from '../types';

interface ProfileStoreState {
  profile: ProfileStats;

  incrementStat: (stat: keyof ProfileStats, amount?: number) => void;
  setProfile: (profile: ProfileStats) => void;
}

const createInitialProfile = (): ProfileStats => ({
  totalPlayTime: 0,
  actionsPerformed: 0,
  expeditionsCompleted: 0,
  itemsCollected: 0,
  collectionsCompleted: 0,
  miniGamesPlayed: 0,
  highestBond: 0,
  roomsUpgraded: 0,
});

export const useProfileStore = create<ProfileStoreState>((set) => ({
  profile: createInitialProfile(),

  incrementStat: (stat: keyof ProfileStats, amount = 1) => {
    set((state) => ({
      profile: {
        ...state.profile,
        [stat]: state.profile[stat] + amount,
      },
    }));
  },

  setProfile: (profile: ProfileStats) => set({ profile }),
}));
