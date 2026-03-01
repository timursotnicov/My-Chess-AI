import { create } from 'zustand';
import {
  DailyState,
  DailyGoal,
  DailyEvent,
  OfflineFinding,
} from '../types';
import { generateDailyGoals, generateDailyEvent, generateOfflineFindings } from '../systems/dailySystem';
import { eventBus } from '../systems/eventBus';

interface DailyStoreState {
  daily: DailyState;

  checkDailyReset: () => boolean;
  updateGoalProgress: (goalType: string, amount?: number) => void;
  completeGoal: (goalId: string) => void;
  processOfflineReturn: (offlineMs: number) => OfflineFinding[];
  setDaily: (daily: DailyState) => void;
}

const getTodayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const createInitialDaily = (): DailyState => ({
  lastLoginDate: getTodayStr(),
  loginStreak: 1,
  dailyGoals: generateDailyGoals(),
  todaysEvent: generateDailyEvent(),
  offlineFindings: [],
});

export const useDailyStore = create<DailyStoreState>((set, get) => ({
  daily: createInitialDaily(),

  checkDailyReset: () => {
    const { daily } = get();
    const today = getTodayStr();

    if (daily.lastLoginDate === today) return false;

    // Check if consecutive day
    const lastDate = new Date(daily.lastLoginDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    const newStreak = diffDays === 1 ? daily.loginStreak + 1 : 1;

    set({
      daily: {
        lastLoginDate: today,
        loginStreak: newStreak,
        dailyGoals: generateDailyGoals(),
        todaysEvent: generateDailyEvent(),
        offlineFindings: [],
      },
    });

    return true;
  },

  updateGoalProgress: (goalType: string, amount = 1) => {
    const { daily } = get();
    let goalCompleted = false;

    const newGoals = daily.dailyGoals.map((goal) => {
      if (goal.type !== goalType || goal.isCompleted) return goal;
      const newProgress = Math.min(goal.progress + amount, goal.target);
      const isCompleted = newProgress >= goal.target;
      if (isCompleted && !goal.isCompleted) goalCompleted = true;
      return { ...goal, progress: newProgress, isCompleted };
    });

    set({ daily: { ...daily, dailyGoals: newGoals } });

    if (goalCompleted) {
      eventBus.emit('daily_goal_completed', { goalType });
    }
  },

  completeGoal: (goalId: string) => {
    const { daily } = get();
    set({
      daily: {
        ...daily,
        dailyGoals: daily.dailyGoals.map((g) =>
          g.id === goalId ? { ...g, isCompleted: true, progress: g.target } : g,
        ),
      },
    });
  },

  processOfflineReturn: (offlineMs: number) => {
    const findings = generateOfflineFindings(offlineMs);
    set((state) => ({
      daily: {
        ...state.daily,
        offlineFindings: findings,
      },
    }));
    return findings;
  },

  setDaily: (daily: DailyState) => set({ daily }),
}));
