import { DailyGoal, DailyEvent, OfflineFinding, ResourceType } from '../types';
import { DAILY_GOAL_TEMPLATES, DAILY_EVENT_TEMPLATES } from '../data/dailyEvents';

let goalIdCounter = 0;

export const generateDailyGoals = (): DailyGoal[] => {
  // Pick 3 random goals from templates
  const shuffled = [...DAILY_GOAL_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  return selected.map((template) => ({
    id: `goal_${++goalIdCounter}`,
    type: template.type as DailyGoal['type'],
    descriptionKey: template.descriptionKey,
    target: template.target,
    progress: 0,
    reward: template.reward,
    isCompleted: false,
  }));
};

export const generateDailyEvent = (): DailyEvent | null => {
  if (Math.random() > 0.7) return null; // 30% chance of no event

  const template = DAILY_EVENT_TEMPLATES[
    Math.floor(Math.random() * DAILY_EVENT_TEMPLATES.length)
  ];

  return {
    id: `event_${Date.now()}`,
    type: template.type,
    titleKey: template.titleKey,
    descriptionKey: template.descriptionKey,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // expires in 24h
    reward: template.reward,
    isActive: true,
  };
};

export const generateOfflineFindings = (offlineMs: number): OfflineFinding[] => {
  const findings: OfflineFinding[] = [];
  const hours = offlineMs / (1000 * 60 * 60);

  if (hours < 1) return findings;

  // Resource gathering based on time away
  const resourceChance = Math.min(0.8, hours * 0.1);
  const resources: ResourceType[] = ['herbs', 'wood', 'stone'];

  for (const res of resources) {
    if (Math.random() < resourceChance) {
      const amount = Math.floor(1 + Math.random() * Math.min(hours, 5));
      findings.push({
        type: 'resource',
        descriptionKey: `offline.found_${res}`,
        value: amount,
        resourceType: res,
      });
    }
  }

  // Rare findings for longer absences
  if (hours >= 4 && Math.random() < 0.3) {
    findings.push({
      type: 'event',
      descriptionKey: 'offline.mysterious_visitor',
    });
  }

  if (hours >= 2) {
    findings.push({
      type: 'mood_change',
      descriptionKey: hours >= 8 ? 'offline.missed_you' : 'offline.waited_patiently',
    });
  }

  return findings;
};
