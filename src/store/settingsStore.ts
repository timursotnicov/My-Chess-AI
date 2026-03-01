import { create } from 'zustand';
import i18n from '../i18n';
import { GameSettings } from '../types';

interface SettingsState extends GameSettings {
  setLanguage: (lang: 'ru' | 'en') => void;
  toggleSound: () => void;
  toggleMusic: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: (i18n.language as 'ru' | 'en') || 'en',
  soundEnabled: true,
  musicEnabled: true,

  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
}));
