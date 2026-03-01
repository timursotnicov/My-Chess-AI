import { colors } from '../theme/colors';

export interface BackgroundConfig {
  id: string;
  skyColorTop: string;
  skyColorBottom: string;
  groundColor: string;
  hascastle: boolean;
  hasTrees: boolean;
  hasMountains: boolean;
  hasVillage: boolean;
  ambientEvents: AmbientEventType[];
}

export type AmbientEventType = 'clouds' | 'birds' | 'smoke' | 'fireflies' | 'snow' | 'leaves';

export const BACKGROUNDS: Record<string, BackgroundConfig> = {
  cave: {
    id: 'cave',
    skyColorTop: '#1A0F2E',
    skyColorBottom: '#2D1B4E',
    groundColor: '#3E2723',
    hascastle: false,
    hasTrees: false,
    hasMountains: false,
    hasVillage: false,
    ambientEvents: ['fireflies'],
  },
  meadow: {
    id: 'meadow',
    skyColorTop: '#87CEEB',
    skyColorBottom: '#B0E0E6',
    groundColor: colors.grass,
    hascastle: true,
    hasTrees: true,
    hasMountains: false,
    hasVillage: false,
    ambientEvents: ['clouds', 'birds', 'leaves'],
  },
  mountain: {
    id: 'mountain',
    skyColorTop: '#4682B4',
    skyColorBottom: '#87CEEB',
    groundColor: colors.stone,
    hascastle: false,
    hasTrees: true,
    hasMountains: true,
    hasVillage: false,
    ambientEvents: ['clouds', 'birds', 'snow'],
  },
  valley: {
    id: 'valley',
    skyColorTop: '#87CEEB',
    skyColorBottom: '#98D8C8',
    groundColor: colors.grass,
    hascastle: true,
    hasTrees: true,
    hasMountains: true,
    hasVillage: true,
    ambientEvents: ['clouds', 'birds', 'smoke'],
  },
  darkKingdom: {
    id: 'darkKingdom',
    skyColorTop: '#1A0F2E',
    skyColorBottom: '#4A2D8A',
    groundColor: '#2D2D2D',
    hascastle: true,
    hasTrees: false,
    hasMountains: true,
    hasVillage: true,
    ambientEvents: ['clouds', 'smoke', 'fireflies'],
  },
  throne: {
    id: 'throne',
    skyColorTop: '#0D0D1A',
    skyColorBottom: '#1A0F2E',
    groundColor: '#4A3728',
    hascastle: true,
    hasTrees: false,
    hasMountains: true,
    hasVillage: false,
    ambientEvents: ['smoke', 'fireflies'],
  },
};

export const getBackground = (id: string): BackgroundConfig =>
  BACKGROUNDS[id] ?? BACKGROUNDS.cave;
