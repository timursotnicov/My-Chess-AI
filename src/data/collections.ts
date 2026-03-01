import { CollectionDefinition } from '../types';

export const COLLECTIONS: CollectionDefinition[] = [
  {
    id: 'ancient_scrolls',
    nameKey: 'collections.ancient_scrolls',
    descriptionKey: 'collections.ancient_scrolls_desc',
    itemIds: ['ancient_scroll_1', 'ancient_scroll_2', 'ancient_scroll_3'],
    reward: { type: 'xp', amount: 200 },
  },
  {
    id: 'rune_fragments',
    nameKey: 'collections.rune_fragments',
    descriptionKey: 'collections.rune_fragments_desc',
    itemIds: ['rune_fragment_1', 'rune_fragment_2', 'rune_fragment_3'],
    reward: { type: 'item', id: 'tower_sigil' },
  },
  {
    id: 'shelter_decor',
    nameKey: 'collections.shelter_decor',
    descriptionKey: 'collections.shelter_decor_desc',
    itemIds: ['glowing_mushroom', 'crystal_lantern', 'ancient_tapestry'],
    reward: { type: 'bond', amount: 15 },
  },
  {
    id: 'dark_regalia',
    nameKey: 'collections.dark_regalia',
    descriptionKey: 'collections.dark_regalia_desc',
    itemIds: ['iron_collar', 'shadow_cloak', 'crown_of_embers'],
    reward: { type: 'xp', amount: 500 },
  },
];
