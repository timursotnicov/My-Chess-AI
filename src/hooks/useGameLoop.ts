import { useEffect, useRef } from 'react';
import { usePetStore } from '../store/petStore';

const TICK_INTERVAL = 5000;

export const useGameLoop = () => {
  const tick = usePetStore((s) => s.tick);
  const dragon = usePetStore((s) => s.dragon);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!dragon) return;

    intervalRef.current = setInterval(() => {
      tick(TICK_INTERVAL);
    }, TICK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dragon, tick]);
};
