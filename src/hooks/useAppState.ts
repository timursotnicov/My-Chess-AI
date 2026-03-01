import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { usePetStore } from '../store/petStore';
import { useShelterStore } from '../store/shelterStore';
import { useExplorationStore } from '../store/explorationStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useDailyStore } from '../store/dailyStore';
import { useProfileStore } from '../store/profileStore';
import { useSettingsStore } from '../store/settingsStore';
import { saveGame } from '../utils/storage';

export const useAppState = () => {
  const dragon = usePetStore((s) => s.dragon);
  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (
          appState.current.match(/active/) &&
          nextState.match(/inactive|background/)
        ) {
          // Going to background — save immediately
          backgroundTime.current = Date.now();
          const petState = usePetStore.getState();
          if (petState.dragon) {
            const settings = useSettingsStore.getState();
            saveGame({
              dragon: petState.dragon,
              cooldowns: petState.cooldowns,
              shelter: useShelterStore.getState().shelter,
              locations: useExplorationStore.getState().locations,
              expedition: useExplorationStore.getState().expedition,
              inventory: useInventoryStore.getState().inventory,
              collections: useInventoryStore.getState().collections,
              daily: useDailyStore.getState().daily,
              profile: useProfileStore.getState().profile,
              settings: {
                language: settings.language,
                soundEnabled: settings.soundEnabled,
                musicEnabled: settings.musicEnabled,
              },
            });
          }
        }

        if (
          appState.current.match(/inactive|background/) &&
          nextState === 'active'
        ) {
          // Coming back — process offline time
          if (backgroundTime.current) {
            const elapsed = Date.now() - backgroundTime.current;
            usePetStore.getState().processOfflineTime(elapsed);
            backgroundTime.current = null;
          }
        }

        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  }, [dragon]);
};
