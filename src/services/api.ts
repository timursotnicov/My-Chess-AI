// API stubs for future social features
// All functions return local/mock data for now

export const api = {
  getLeaderboard: async () => {
    return { players: [], lastUpdated: Date.now() };
  },

  sharePetShowcase: async (_petData: unknown) => {
    return { success: true, shareId: 'local' };
  },

  getGuildInfo: async () => {
    return null;
  },

  getTournaments: async () => {
    return [];
  },

  syncSave: async (_saveData: unknown) => {
    return { synced: false, reason: 'offline_mode' };
  },
};
