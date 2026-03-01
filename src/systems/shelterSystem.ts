import { ShelterState, RoomType, DragonStats } from '../types';
import { SHELTER_ROOMS } from '../data/shelterRooms';

export const getShelterStatBonuses = (shelter: ShelterState): Partial<DragonStats> => {
  const bonuses: Partial<DragonStats> = {};

  for (const room of shelter.rooms) {
    if (!room.isUnlocked || room.level === 0) continue;

    const def = SHELTER_ROOMS.find((r) => r.id === room.id);
    if (!def) continue;

    const multiplier = 1 + (room.level - 1) * 0.2;

    for (const bonus of def.baseBonuses) {
      if (bonus.type === 'stat_regen' && bonus.stat) {
        const stat = bonus.stat as keyof DragonStats;
        bonuses[stat] = (bonuses[stat] ?? 0) + bonus.value * multiplier;
      }
    }
  }

  return bonuses;
};

export const getShelterXpMultiplier = (shelter: ShelterState): number => {
  let multiplier = 1;

  for (const room of shelter.rooms) {
    if (!room.isUnlocked || room.level === 0) continue;

    const def = SHELTER_ROOMS.find((r) => r.id === room.id);
    if (!def) continue;

    const levelMultiplier = 1 + (room.level - 1) * 0.2;

    for (const bonus of def.baseBonuses) {
      if (bonus.type === 'xp_multiplier') {
        multiplier += (bonus.value * levelMultiplier - 1);
      }
    }
  }

  return multiplier;
};

export const canUpgradeRoom = (shelter: ShelterState, roomId: RoomType): boolean => {
  const room = shelter.rooms.find((r) => r.id === roomId);
  if (!room || !room.isUnlocked) return false;

  const def = SHELTER_ROOMS.find((r) => r.id === roomId);
  if (!def || room.level >= def.maxLevel) return false;

  const cost = def.upgradeCosts[room.level - 1];
  if (!cost) return false;

  for (const [res, amount] of Object.entries(cost)) {
    const key = res as keyof typeof shelter.resources;
    if ((shelter.resources[key] ?? 0) < (amount ?? 0)) return false;
  }

  return true;
};

export const getTotalShelterLevel = (shelter: ShelterState): number => {
  return shelter.rooms
    .filter((r) => r.isUnlocked)
    .reduce((sum, r) => sum + r.level, 0);
};
