import { LocationDefinition } from '../types';

export const LOCATIONS: LocationDefinition[] = [
  {
    id: 'whispering_forest',
    nameKey: 'locations.whispering_forest',
    descriptionKey: 'locations.whispering_forest_desc',
    unlockLevel: 1,
    unlockBond: 0,
    resources: ['herbs', 'wood'],
    miniGame: 'firefly_catch',
    explorationTimeMs: 5 * 60 * 1000, // 5 minutes
    maxSecrets: 5,
  },
  {
    id: 'drowned_ruins',
    nameKey: 'locations.drowned_ruins',
    descriptionKey: 'locations.drowned_ruins_desc',
    unlockLevel: 4,
    unlockBond: 20,
    resources: ['stone', 'crystals', 'moonwater'],
    miniGame: null,
    explorationTimeMs: 10 * 60 * 1000, // 10 minutes
    maxSecrets: 7,
  },
  {
    id: 'bellless_tower',
    nameKey: 'locations.bellless_tower',
    descriptionKey: 'locations.bellless_tower_desc',
    unlockLevel: 7,
    unlockBond: 40,
    resources: ['ancient_dust', 'crystals'],
    miniGame: 'rune_search',
    explorationTimeMs: 15 * 60 * 1000, // 15 minutes
    maxSecrets: 10,
  },
];
