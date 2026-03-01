import { useEffect, useRef } from 'react';
import { useDailyStore } from '../store/dailyStore';

export const useDailyReset = () => {
  const checkDailyReset = useDailyStore((s) => s.checkDailyReset);
  const lastCheck = useRef<string>('');

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastCheck.current !== today) {
      lastCheck.current = today;
      checkDailyReset();
    }

    const interval = setInterval(() => {
      const now = new Date().toISOString().slice(0, 10);
      if (lastCheck.current !== now) {
        lastCheck.current = now;
        checkDailyReset();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [checkDailyReset]);
};
