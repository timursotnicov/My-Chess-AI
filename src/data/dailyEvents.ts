import { DailyEvent, DailyGoal } from '../types';

export interface DailyGoalTemplate {
  type: string;
  descriptionKey: string;
  target: number;
  reward: { type: 'resource' | 'item' | 'xp' | 'bond'; id?: string; amount?: number };
}

export const DAILY_GOAL_TEMPLATES: DailyGoalTemplate[] = [
  {
    type: 'feed',
    descriptionKey: 'daily.goal_feed',
    target: 2,
    reward: { type: 'xp', amount: 20 },
  },
  {
    type: 'play',
    descriptionKey: 'daily.goal_play',
    target: 1,
    reward: { type: 'bond', amount: 5 },
  },
  {
    type: 'explore',
    descriptionKey: 'daily.goal_explore',
    target: 1,
    reward: { type: 'resource', id: 'herbs', amount: 5 },
  },
  {
    type: 'bond',
    descriptionKey: 'daily.goal_bond',
    target: 3,
    reward: { type: 'xp', amount: 30 },
  },
  {
    type: 'collect',
    descriptionKey: 'daily.goal_collect',
    target: 1,
    reward: { type: 'resource', id: 'crystals', amount: 2 },
  },
];

export interface DailyEventTemplate {
  type: 'visitor' | 'anomaly' | 'market' | 'ritual' | 'weather';
  titleKey: string;
  descriptionKey: string;
  reward: { type: 'resource' | 'item' | 'xp' | 'bond'; id?: string; amount?: number };
}

export const DAILY_EVENT_TEMPLATES: DailyEventTemplate[] = [
  {
    type: 'visitor',
    titleKey: 'daily.event_wanderer',
    descriptionKey: 'daily.event_wanderer_desc',
    reward: { type: 'item', id: 'healing_moss' },
  },
  {
    type: 'anomaly',
    titleKey: 'daily.event_moonrise',
    descriptionKey: 'daily.event_moonrise_desc',
    reward: { type: 'resource', id: 'moonwater', amount: 3 },
  },
  {
    type: 'market',
    titleKey: 'daily.event_shadow_merchant',
    descriptionKey: 'daily.event_shadow_merchant_desc',
    reward: { type: 'resource', id: 'crystals', amount: 2 },
  },
  {
    type: 'ritual',
    titleKey: 'daily.event_ancient_echo',
    descriptionKey: 'daily.event_ancient_echo_desc',
    reward: { type: 'xp', amount: 50 },
  },
  {
    type: 'weather',
    titleKey: 'daily.event_fog_veil',
    descriptionKey: 'daily.event_fog_veil_desc',
    reward: { type: 'resource', id: 'herbs', amount: 5 },
  },
];
