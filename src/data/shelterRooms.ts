import { ShelterRoomDefinition } from '../types';

export const SHELTER_ROOMS: ShelterRoomDefinition[] = [
  {
    id: 'hearth',
    nameKey: 'shelter.hearth',
    descriptionKey: 'shelter.hearth_desc',
    isStarting: true,
    maxLevel: 5,
    baseBonuses: [
      { type: 'stat_regen', stat: 'hunger', value: 0.5 },
    ],
    upgradeCosts: [
      { wood: 5, stone: 3 },
      { wood: 10, stone: 8 },
      { wood: 20, stone: 15, herbs: 5 },
      { wood: 30, stone: 25, crystals: 5 },
      { wood: 50, stone: 40, crystals: 10, ancient_dust: 3 },
    ],
  },
  {
    id: 'sleeping_den',
    nameKey: 'shelter.sleeping_den',
    descriptionKey: 'shelter.sleeping_den_desc',
    isStarting: true,
    maxLevel: 5,
    baseBonuses: [
      { type: 'stat_regen', stat: 'energy', value: 0.8 },
      { type: 'bond_boost', value: 0.1 },
    ],
    upgradeCosts: [
      { wood: 8, moonwater: 2 },
      { wood: 15, moonwater: 5, herbs: 3 },
      { wood: 25, moonwater: 10, crystals: 3 },
      { wood: 40, moonwater: 15, crystals: 8 },
      { wood: 60, moonwater: 25, crystals: 15, ancient_dust: 5 },
    ],
  },
  {
    id: 'shadow_garden',
    nameKey: 'shelter.shadow_garden',
    descriptionKey: 'shelter.shadow_garden_desc',
    isStarting: false,
    maxLevel: 5,
    baseBonuses: [
      { type: 'resource_gen', stat: 'herbs', value: 1 },
      { type: 'stat_regen', stat: 'happiness', value: 0.3 },
    ],
    upgradeCosts: [
      { herbs: 10, moonwater: 5 },
      { herbs: 20, moonwater: 10, wood: 10 },
      { herbs: 35, moonwater: 20, crystals: 5 },
      { herbs: 50, moonwater: 30, crystals: 10 },
      { herbs: 80, moonwater: 50, crystals: 20, ancient_dust: 5 },
    ],
  },
  {
    id: 'training_ground',
    nameKey: 'shelter.training_ground',
    descriptionKey: 'shelter.training_ground_desc',
    isStarting: false,
    maxLevel: 5,
    baseBonuses: [
      { type: 'xp_multiplier', value: 1.1 },
    ],
    upgradeCosts: [
      { stone: 15, ancient_dust: 3 },
      { stone: 25, ancient_dust: 8, wood: 10 },
      { stone: 40, ancient_dust: 15, crystals: 5 },
      { stone: 60, ancient_dust: 25, crystals: 10 },
      { stone: 90, ancient_dust: 40, crystals: 20, moonwater: 10 },
    ],
  },
  {
    id: 'alchemy_lab',
    nameKey: 'shelter.alchemy_lab',
    descriptionKey: 'shelter.alchemy_lab_desc',
    isStarting: false,
    maxLevel: 5,
    baseBonuses: [
      { type: 'craft', value: 1 },
    ],
    upgradeCosts: [
      { herbs: 15, crystals: 5 },
      { herbs: 25, crystals: 10, stone: 10 },
      { herbs: 40, crystals: 20, ancient_dust: 5 },
      { herbs: 60, crystals: 30, ancient_dust: 10 },
      { herbs: 90, crystals: 50, ancient_dust: 20, moonwater: 15 },
    ],
  },
  {
    id: 'treasure_vault',
    nameKey: 'shelter.treasure_vault',
    descriptionKey: 'shelter.treasure_vault_desc',
    isStarting: false,
    maxLevel: 5,
    baseBonuses: [
      { type: 'resource_gen', stat: 'crystals', value: 0.5 },
    ],
    upgradeCosts: [
      { crystals: 10, ancient_dust: 5 },
      { crystals: 20, ancient_dust: 10, stone: 15 },
      { crystals: 35, ancient_dust: 20, moonwater: 5 },
      { crystals: 50, ancient_dust: 30, moonwater: 10 },
      { crystals: 80, ancient_dust: 50, moonwater: 25 },
    ],
  },
];
