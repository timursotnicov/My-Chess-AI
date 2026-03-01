import { useEffect, useRef } from 'react';
import { usePetStore } from '../store/petStore';
import { useShelterStore } from '../store/shelterStore';
import { useExplorationStore } from '../store/explorationStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useDailyStore } from '../store/dailyStore';
import { useProfileStore } from '../store/profileStore';
import { useSettingsStore } from '../store/settingsStore';
import { saveGame } from '../utils/storage';

const AUTO_SAVE_INTERVAL = 60000;

export const useAutoSave = () => {
  const dragon = usePetStore((s) => s.dragon);
  const cooldowns = usePetStore((s) => s.cooldowns);
  const shelter = useShelterStore((s) => s.shelter);
  const locations = useExplorationStore((s) => s.locations);
  const expedition = useExplorationStore((s) => s.expedition);
  const inventory = useInventoryStore((s) => s.inventory);
  const collections = useInventoryStore((s) => s.collections);
  const daily = useDailyStore((s) => s.daily);
  const profile = useProfileStore((s) => s.profile);
  const settings = useSettingsStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!dragon) return;

    const doSave = () => {
      saveGame({
        dragon,
        cooldowns,
        shelter,
        locations,
        expedition,
        inventory,
        collections,
        daily,
        profile,
        settings: {
          language: settings.language,
          soundEnabled: settings.soundEnabled,
          musicEnabled: settings.musicEnabled,
        },
      });
    };

    intervalRef.current = setInterval(doSave, AUTO_SAVE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dragon]);
};
