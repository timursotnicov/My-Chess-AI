// ============================================================
// Dragon Keep: Dark Fantasy Pet RPG — Core Type System
// ============================================================

// ── Pet Stats ──────────────────────────────────────────────

export interface DragonStats {
  hunger: number;
  thirst: number;
  happiness: number;
  energy: number;
  health: number;
}

// ── Personality ────────────────────────────────────────────

export type PersonalityAxis =
  | 'brave_cautious'
  | 'loyal_independent'
  | 'playful_proud'
  | 'curious_shadowy';

export type PersonalityTrait =
  | 'brave'
  | 'cautious'
  | 'loyal'
  | 'independent'
  | 'playful'
  | 'proud'
  | 'curious'
  | 'shadowy';

export interface PersonalityTraits {
  brave_cautious: number;     // -100..+100 (negative = cautious, positive = brave)
  loyal_independent: number;
  playful_proud: number;
  curious_shadowy: number;
}

export interface PersonalityState {
  traits: PersonalityTraits;
  dominantTrait: PersonalityTrait;
  quirks: string[];
}

// ── Bond / Trust ───────────────────────────────────────────

export interface BondState {
  level: number;         // 0..100
  trust: number;         // accumulated trust points
  lastInteraction: number;
  totalInteractions: number;
  neglectStreak: number; // days without interaction
}

// ── Pet Mood ───────────────────────────────────────────────

export type PetMood =
  | 'joyful'
  | 'content'
  | 'curious'
  | 'anxious'
  | 'lonely'
  | 'proud'
  | 'sleepy'
  | 'sick'
  | 'excited';

// ── Appearance ─────────────────────────────────────────────

export type ColorVariant = 'amethyst' | 'obsidian' | 'crimson' | 'frost' | 'emerald';

export interface AppearanceState {
  colorVariant: ColorVariant;
  accessories: string[];
  scars: string[];
  aura: string | null;
}

// ── Dragon Evolution ───────────────────────────────────────

export type DragonStage =
  | 'egg'
  | 'baby'
  | 'young'
  | 'juvenile'
  | 'teen'
  | 'adult'
  | 'legendary';

// ── Full Dragon State ──────────────────────────────────────

export interface DragonState {
  name: string;
  stats: DragonStats;
  experience: number;
  level: number;
  age: number;
  stage: DragonStage;
  mood: PetMood;
  isSleeping: boolean;
  createdAt: number;
  lastUpdated: number;
  personality: PersonalityState;
  bond: BondState;
  appearance: AppearanceState;
}

// ── Actions ────────────────────────────────────────────────

export type ActionId =
  | 'feed'
  | 'water'
  | 'pet'
  | 'play'
  | 'train'
  | 'fly'
  | 'raid'
  | 'kidnap'
  | 'siege';

export interface PersonalityWeight {
  axis: PersonalityAxis;
  value: number;
}

export interface ActionDefinition {
  id: ActionId;
  icon: string;
  effects: Partial<DragonStats>;
  xp: number;
  bondXp: number;
  cooldownMs: number;
  unlockLevel: number;
  unlockStage: DragonStage;
  energyCost: number;
  personalityWeights: PersonalityWeight[];
}

export interface CooldownMap {
  [actionId: string]: number;
}

// ── Stages ─────────────────────────────────────────────────

export interface StageDefinition {
  id: DragonStage;
  minLevel: number;
  maxLevel: number;
  backgroundId: string;
}

// ── Shelter ────────────────────────────────────────────────

export type ShelterType = 'cave' | 'ruin' | 'tower';

export type RoomType =
  | 'hearth'
  | 'sleeping_den'
  | 'shadow_garden'
  | 'training_ground'
  | 'alchemy_lab'
  | 'treasure_vault';

export type ResourceType =
  | 'stone'
  | 'wood'
  | 'herbs'
  | 'crystals'
  | 'ancient_dust'
  | 'moonwater';

export interface ResourceInventory {
  stone: number;
  wood: number;
  herbs: number;
  crystals: number;
  ancient_dust: number;
  moonwater: number;
}

export interface RoomBonus {
  type: 'stat_regen' | 'xp_multiplier' | 'resource_gen' | 'bond_boost' | 'craft';
  stat?: keyof DragonStats | ResourceType;
  value: number;
}

export interface ShelterRoomDefinition {
  id: RoomType;
  nameKey: string;
  descriptionKey: string;
  isStarting: boolean;
  maxLevel: number;
  baseBonuses: RoomBonus[];
  upgradeCosts: Partial<ResourceInventory>[];
}

export interface ShelterRoomState {
  id: RoomType;
  level: number;
  isUnlocked: boolean;
}

export interface ShelterState {
  type: ShelterType;
  level: number;
  rooms: ShelterRoomState[];
  decorations: string[];
  resources: ResourceInventory;
}

// ── Exploration ────────────────────────────────────────────

export type LocationId = 'whispering_forest' | 'drowned_ruins' | 'bellless_tower';

export interface LocationDefinition {
  id: LocationId;
  nameKey: string;
  descriptionKey: string;
  unlockLevel: number;
  unlockBond: number;
  resources: ResourceType[];
  miniGame: string | null;
  explorationTimeMs: number;
  maxSecrets: number;
}

export interface LocationState {
  id: LocationId;
  isDiscovered: boolean;
  isUnlocked: boolean;
  explorationProgress: number; // 0..100
  secretsFound: string[];
  visitCount: number;
}

export type EncounterType = 'discovery' | 'challenge' | 'mystery' | 'treasure' | 'creature';

export interface EncounterChoice {
  labelKey: string;
  personalityWeight?: PersonalityWeight;
  bondEffect?: number;
  rewards?: EncounterReward[];
}

export interface EncounterReward {
  type: 'resource' | 'item' | 'xp' | 'bond';
  id?: string;
  amount?: number;
}

export interface EncounterDefinition {
  id: string;
  locationId: LocationId;
  type: EncounterType;
  titleKey: string;
  descriptionKey: string;
  choices: EncounterChoice[];
  minExploration: number;
}

export type ExpeditionStatus = 'idle' | 'traveling' | 'exploring' | 'encounter' | 'returning' | 'completed';

export interface Expedition {
  locationId: LocationId;
  startTime: number;
  duration: number;
  status: ExpeditionStatus;
  encounters: string[];
  rewards: EncounterReward[];
}

// ── Items ──────────────────────────────────────────────────

export type ItemType = 'accessory' | 'consumable' | 'resource' | 'lore' | 'key' | 'decoration';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ItemEffect {
  type: 'stat_boost' | 'bond_boost' | 'xp_boost' | 'personality_shift' | 'cosmetic';
  stat?: keyof DragonStats | PersonalityAxis;
  value?: number;
  duration?: number;
}

export interface ItemDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  effects: ItemEffect[];
  stackable: boolean;
  maxStack: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  acquiredAt: number;
}

// ── Collections ────────────────────────────────────────────

export interface CollectionDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  itemIds: string[];
  reward: EncounterReward;
}

export interface CollectionState {
  id: string;
  foundItems: string[];
  isCompleted: boolean;
  completedAt?: number;
}

// ── Daily Loop ─────────────────────────────────────────────

export type DailyGoalType = 'feed' | 'explore' | 'craft' | 'play' | 'bond' | 'collect';

export interface DailyGoal {
  id: string;
  type: DailyGoalType;
  descriptionKey: string;
  target: number;
  progress: number;
  reward: EncounterReward;
  isCompleted: boolean;
}

export type DailyEventType = 'visitor' | 'anomaly' | 'market' | 'ritual' | 'weather';

export interface DailyEvent {
  id: string;
  type: DailyEventType;
  titleKey: string;
  descriptionKey: string;
  expiresAt: number;
  reward: EncounterReward;
  isActive: boolean;
}

export interface OfflineFinding {
  type: 'resource' | 'event' | 'mood_change';
  descriptionKey: string;
  value?: number;
  resourceType?: ResourceType;
}

export interface DailyState {
  lastLoginDate: string; // YYYY-MM-DD
  loginStreak: number;
  dailyGoals: DailyGoal[];
  todaysEvent: DailyEvent | null;
  offlineFindings: OfflineFinding[];
}

// ── Mini-games ─────────────────────────────────────────────

export type MiniGameId = 'firefly_catch' | 'rune_search';

export interface MiniGameDefinition {
  id: MiniGameId;
  nameKey: string;
  descriptionKey: string;
  locationId: LocationId;
  durationMs: number;
  rewards: EncounterReward[];
}

export interface MiniGameResult {
  gameId: MiniGameId;
  score: number;
  rewards: EncounterReward[];
  personalityEffect?: PersonalityWeight;
  bondXp: number;
}

// ── Profile ────────────────────────────────────────────────

export interface ProfileStats {
  totalPlayTime: number;
  actionsPerformed: number;
  expeditionsCompleted: number;
  itemsCollected: number;
  collectionsCompleted: number;
  miniGamesPlayed: number;
  highestBond: number;
  roomsUpgraded: number;
}

// ── Save System ────────────────────────────────────────────

export interface GameSave {
  version: number;
  timestamp: number;
  dragon: DragonState;
  cooldowns: CooldownMap;
  shelter: ShelterState;
  locations: LocationState[];
  expedition: Expedition | null;
  inventory: InventoryItem[];
  collections: CollectionState[];
  daily: DailyState;
  profile: ProfileStats;
  settings: GameSettings;
}

export interface GameSettings {
  language: 'ru' | 'en';
  soundEnabled: boolean;
  musicEnabled: boolean;
}

// ── Event Bus ──────────────────────────────────────────────

export type GameEventType =
  | 'action_performed'
  | 'level_up'
  | 'stage_evolved'
  | 'bond_changed'
  | 'personality_shifted'
  | 'room_upgraded'
  | 'expedition_complete'
  | 'item_acquired'
  | 'collection_completed'
  | 'daily_goal_completed'
  | 'daily_event_triggered';

export interface GameEvent {
  type: GameEventType;
  payload: Record<string, unknown>;
  timestamp: number;
}
