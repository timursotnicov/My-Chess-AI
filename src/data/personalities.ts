import { PersonalityTrait, PersonalityAxis } from '../types';

export interface PersonalityInfo {
  trait: PersonalityTrait;
  axis: PersonalityAxis;
  side: 'positive' | 'negative';
  nameKey: string;
  descriptionKey: string;
  icon: string;
}

export const PERSONALITY_INFO: PersonalityInfo[] = [
  {
    trait: 'brave',
    axis: 'brave_cautious',
    side: 'positive',
    nameKey: 'personality.brave',
    descriptionKey: 'personality.brave_desc',
    icon: '🗡️',
  },
  {
    trait: 'cautious',
    axis: 'brave_cautious',
    side: 'negative',
    nameKey: 'personality.cautious',
    descriptionKey: 'personality.cautious_desc',
    icon: '🛡️',
  },
  {
    trait: 'loyal',
    axis: 'loyal_independent',
    side: 'positive',
    nameKey: 'personality.loyal',
    descriptionKey: 'personality.loyal_desc',
    icon: '💎',
  },
  {
    trait: 'independent',
    axis: 'loyal_independent',
    side: 'negative',
    nameKey: 'personality.independent',
    descriptionKey: 'personality.independent_desc',
    icon: '🐺',
  },
  {
    trait: 'playful',
    axis: 'playful_proud',
    side: 'positive',
    nameKey: 'personality.playful',
    descriptionKey: 'personality.playful_desc',
    icon: '🎭',
  },
  {
    trait: 'proud',
    axis: 'playful_proud',
    side: 'negative',
    nameKey: 'personality.proud',
    descriptionKey: 'personality.proud_desc',
    icon: '👑',
  },
  {
    trait: 'curious',
    axis: 'curious_shadowy',
    side: 'positive',
    nameKey: 'personality.curious',
    descriptionKey: 'personality.curious_desc',
    icon: '🔍',
  },
  {
    trait: 'shadowy',
    axis: 'curious_shadowy',
    side: 'negative',
    nameKey: 'personality.shadowy',
    descriptionKey: 'personality.shadowy_desc',
    icon: '🌑',
  },
];

export const getPersonalityInfo = (trait: PersonalityTrait): PersonalityInfo | undefined =>
  PERSONALITY_INFO.find((p) => p.trait === trait);

export const getAxisInfo = (axis: PersonalityAxis): { positive: PersonalityInfo; negative: PersonalityInfo } => {
  const positive = PERSONALITY_INFO.find((p) => p.axis === axis && p.side === 'positive')!;
  const negative = PERSONALITY_INFO.find((p) => p.axis === axis && p.side === 'negative')!;
  return { positive, negative };
};
