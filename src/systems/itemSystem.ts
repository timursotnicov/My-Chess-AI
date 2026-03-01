import { ItemDefinition, ItemRarity, DragonStats } from '../types';
import { ITEMS } from '../data/items';

export const getItemsByType = (type: string): ItemDefinition[] =>
  ITEMS.filter((i) => i.type === type);

export const getItemsByRarity = (rarity: ItemRarity): ItemDefinition[] =>
  ITEMS.filter((i) => i.rarity === rarity);

export const applyConsumableEffects = (
  itemId: string,
  stats: DragonStats,
): DragonStats | null => {
  const item = ITEMS.find((i) => i.id === itemId);
  if (!item || item.type !== 'consumable') return null;

  const newStats = { ...stats };

  for (const effect of item.effects) {
    if (effect.type === 'stat_boost' && effect.stat && effect.value) {
      const stat = effect.stat as keyof DragonStats;
      if (stat in newStats) {
        newStats[stat] = Math.min(100, Math.max(0, newStats[stat] + effect.value));
      }
    }
  }

  return newStats;
};

export const getRarityColor = (rarity: ItemRarity): string => {
  const colorMap: Record<ItemRarity, string> = {
    common: '#9A9AB0',
    uncommon: '#3A8A3A',
    rare: '#3A5ACA',
    epic: '#8A3AC0',
    legendary: '#CA8A2A',
  };
  return colorMap[rarity];
};

export const getRandomLoot = (
  locationResources: string[],
  explorationProgress: number,
): string | null => {
  // Higher exploration = better loot chances
  const rarityRoll = Math.random() * 100;
  const progressBonus = explorationProgress * 0.3;

  let targetRarity: ItemRarity;
  if (rarityRoll + progressBonus > 95) targetRarity = 'legendary';
  else if (rarityRoll + progressBonus > 80) targetRarity = 'epic';
  else if (rarityRoll + progressBonus > 60) targetRarity = 'rare';
  else if (rarityRoll + progressBonus > 30) targetRarity = 'uncommon';
  else targetRarity = 'common';

  const candidates = ITEMS.filter(
    (i) => i.rarity === targetRarity && (i.type === 'lore' || i.type === 'consumable' || i.type === 'decoration'),
  );

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)].id;
};
