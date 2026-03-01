import { EncounterDefinition } from '../types';

export const ENCOUNTERS: EncounterDefinition[] = [
  // === Whispering Forest ===
  {
    id: 'forest_mushroom_ring',
    locationId: 'whispering_forest',
    type: 'discovery',
    titleKey: 'encounters.mushroom_ring_title',
    descriptionKey: 'encounters.mushroom_ring_desc',
    minExploration: 0,
    choices: [
      {
        labelKey: 'encounters.investigate',
        personalityWeight: { axis: 'curious_shadowy', value: 2 },
        rewards: [{ type: 'resource', id: 'herbs', amount: 3 }],
      },
      {
        labelKey: 'encounters.leave_it',
        personalityWeight: { axis: 'brave_cautious', value: -1 },
        rewards: [],
      },
    ],
  },
  {
    id: 'forest_lost_traveler',
    locationId: 'whispering_forest',
    type: 'creature',
    titleKey: 'encounters.lost_traveler_title',
    descriptionKey: 'encounters.lost_traveler_desc',
    minExploration: 10,
    choices: [
      {
        labelKey: 'encounters.help_them',
        personalityWeight: { axis: 'loyal_independent', value: 3 },
        bondEffect: 5,
        rewards: [{ type: 'item', id: 'healing_moss' }],
      },
      {
        labelKey: 'encounters.ignore',
        personalityWeight: { axis: 'loyal_independent', value: -2 },
        rewards: [{ type: 'resource', id: 'wood', amount: 2 }],
      },
    ],
  },
  {
    id: 'forest_ancient_tree',
    locationId: 'whispering_forest',
    type: 'mystery',
    titleKey: 'encounters.ancient_tree_title',
    descriptionKey: 'encounters.ancient_tree_desc',
    minExploration: 30,
    choices: [
      {
        labelKey: 'encounters.touch_bark',
        personalityWeight: { axis: 'brave_cautious', value: 2 },
        rewards: [{ type: 'item', id: 'ancient_scroll_1' }],
      },
      {
        labelKey: 'encounters.observe',
        personalityWeight: { axis: 'curious_shadowy', value: 1 },
        rewards: [{ type: 'xp', amount: 20 }],
      },
    ],
  },
  {
    id: 'forest_firefly_glade',
    locationId: 'whispering_forest',
    type: 'treasure',
    titleKey: 'encounters.firefly_glade_title',
    descriptionKey: 'encounters.firefly_glade_desc',
    minExploration: 50,
    choices: [
      {
        labelKey: 'encounters.catch_fireflies',
        personalityWeight: { axis: 'playful_proud', value: 3 },
        rewards: [
          { type: 'item', id: 'glowing_mushroom' },
          { type: 'bond', amount: 3 },
        ],
      },
      {
        labelKey: 'encounters.watch_quietly',
        personalityWeight: { axis: 'playful_proud', value: -2 },
        bondEffect: 2,
        rewards: [{ type: 'xp', amount: 15 }],
      },
    ],
  },

  // === Drowned Ruins ===
  {
    id: 'ruins_sunken_chest',
    locationId: 'drowned_ruins',
    type: 'treasure',
    titleKey: 'encounters.sunken_chest_title',
    descriptionKey: 'encounters.sunken_chest_desc',
    minExploration: 0,
    choices: [
      {
        labelKey: 'encounters.dive_in',
        personalityWeight: { axis: 'brave_cautious', value: 3 },
        rewards: [{ type: 'resource', id: 'crystals', amount: 2 }],
      },
      {
        labelKey: 'encounters.search_shore',
        personalityWeight: { axis: 'brave_cautious', value: -1 },
        rewards: [{ type: 'resource', id: 'stone', amount: 3 }],
      },
    ],
  },
  {
    id: 'ruins_water_spirit',
    locationId: 'drowned_ruins',
    type: 'creature',
    titleKey: 'encounters.water_spirit_title',
    descriptionKey: 'encounters.water_spirit_desc',
    minExploration: 20,
    choices: [
      {
        labelKey: 'encounters.offer_gift',
        personalityWeight: { axis: 'loyal_independent', value: 2 },
        bondEffect: 5,
        rewards: [{ type: 'resource', id: 'moonwater', amount: 3 }],
      },
      {
        labelKey: 'encounters.challenge_it',
        personalityWeight: { axis: 'brave_cautious', value: 4 },
        rewards: [{ type: 'item', id: 'rusty_key' }],
      },
    ],
  },
  {
    id: 'ruins_inscription',
    locationId: 'drowned_ruins',
    type: 'mystery',
    titleKey: 'encounters.inscription_title',
    descriptionKey: 'encounters.inscription_desc',
    minExploration: 40,
    choices: [
      {
        labelKey: 'encounters.decipher',
        personalityWeight: { axis: 'curious_shadowy', value: 3 },
        rewards: [{ type: 'item', id: 'ancient_scroll_2' }],
      },
      {
        labelKey: 'encounters.copy_symbols',
        personalityWeight: { axis: 'curious_shadowy', value: 1 },
        rewards: [{ type: 'xp', amount: 30 }],
      },
    ],
  },

  // === Bellless Tower ===
  {
    id: 'tower_wind_whisper',
    locationId: 'bellless_tower',
    type: 'mystery',
    titleKey: 'encounters.wind_whisper_title',
    descriptionKey: 'encounters.wind_whisper_desc',
    minExploration: 0,
    choices: [
      {
        labelKey: 'encounters.listen_closely',
        personalityWeight: { axis: 'curious_shadowy', value: 3 },
        rewards: [{ type: 'resource', id: 'ancient_dust', amount: 2 }],
      },
      {
        labelKey: 'encounters.block_ears',
        personalityWeight: { axis: 'brave_cautious', value: -2 },
        rewards: [{ type: 'xp', amount: 10 }],
      },
    ],
  },
  {
    id: 'tower_rune_chamber',
    locationId: 'bellless_tower',
    type: 'discovery',
    titleKey: 'encounters.rune_chamber_title',
    descriptionKey: 'encounters.rune_chamber_desc',
    minExploration: 25,
    choices: [
      {
        labelKey: 'encounters.activate_runes',
        personalityWeight: { axis: 'brave_cautious', value: 4 },
        rewards: [{ type: 'item', id: 'rune_fragment_1' }],
      },
      {
        labelKey: 'encounters.study_runes',
        personalityWeight: { axis: 'curious_shadowy', value: 2 },
        rewards: [{ type: 'xp', amount: 40 }],
      },
    ],
  },
  {
    id: 'tower_shadow_guardian',
    locationId: 'bellless_tower',
    type: 'challenge',
    titleKey: 'encounters.shadow_guardian_title',
    descriptionKey: 'encounters.shadow_guardian_desc',
    minExploration: 50,
    choices: [
      {
        labelKey: 'encounters.fight',
        personalityWeight: { axis: 'brave_cautious', value: 5 },
        rewards: [
          { type: 'item', id: 'rune_fragment_2' },
          { type: 'xp', amount: 60 },
        ],
      },
      {
        labelKey: 'encounters.negotiate',
        personalityWeight: { axis: 'playful_proud', value: -3 },
        bondEffect: 8,
        rewards: [{ type: 'item', id: 'ancient_scroll_3' }],
      },
    ],
  },
  {
    id: 'tower_apex',
    locationId: 'bellless_tower',
    type: 'treasure',
    titleKey: 'encounters.tower_apex_title',
    descriptionKey: 'encounters.tower_apex_desc',
    minExploration: 80,
    choices: [
      {
        labelKey: 'encounters.claim_treasure',
        personalityWeight: { axis: 'playful_proud', value: -4 },
        rewards: [
          { type: 'item', id: 'rune_fragment_3' },
          { type: 'item', id: 'crown_of_embers' },
        ],
      },
      {
        labelKey: 'encounters.share_with_dragon',
        personalityWeight: { axis: 'loyal_independent', value: 4 },
        bondEffect: 15,
        rewards: [
          { type: 'item', id: 'rune_fragment_3' },
          { type: 'bond', amount: 10 },
        ],
      },
    ],
  },
];

export const getEncountersForLocation = (locationId: string, explorationProgress: number): EncounterDefinition[] =>
  ENCOUNTERS.filter((e) => e.locationId === locationId && e.minExploration <= explorationProgress);

export const getRandomEncounter = (locationId: string, explorationProgress: number): EncounterDefinition | null => {
  const available = getEncountersForLocation(locationId, explorationProgress);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
};
