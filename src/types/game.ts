// Core game types for the Forsaken D&D system

export interface CharacterStats {
  health: number;
  maxHealth: number;
  armor: number;
  damage: number;
  criticalChance: number;
  criticalDamage: number;
  movementSpeed: number;
  jumpHeight: number;
  lifesteal: number;
  elementalResistance: Record<string, number>;
  gold: number;
}

export interface ItemEffect {
  id: string;
  name: string;
  description: string;
  type: 'stat' | 'passive' | 'active' | 'conditional';
  trigger?: 'onHit' | 'onCrit' | 'onDamage' | 'onIdle' | 'onMove' | 'onTime';
  value: number;
  duration?: number;
  cooldown?: number;
  conditions?: string[];
}

export interface BaseItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  value: number;
  effects: ItemEffect[];
  customStats?: Record<string, number>;
}

export interface Weapon extends BaseItem {
  type: 'weapon';
  weaponType: 'sword' | 'bow' | 'staff' | 'dagger' | 'hammer' | 'spear' | 'custom';
  damage: number;
  critChance: number;
  attackSpeed: number;
  range: number;
  projectile?: boolean;
  elementalDamage?: Record<string, number>;
}

export interface Armor extends BaseItem {
  type: 'armor';
  slot: 'helmet' | 'chestplate' | 'leggings';
  armorValue: number;
  setBonus?: ItemEffect[];
  setName?: string;
}

export interface Accessory extends BaseItem {
  type: 'accessory';
  slot: number; // 1-8 for the 8 accessory slots
}

export type Equipment = Weapon | Armor | Accessory;

export interface Character {
  id: string;
  name: string;
  level: number;
  experience: number;
  baseStats: CharacterStats;
  equipment: {
    weapons: (Weapon | null)[];  // 3 slots
    armor: {
      helmet: Armor | null;
      chestplate: Armor | null;
      leggings: Armor | null;
    };
    accessories: (Accessory | null)[]; // 8 slots
  };
  calculatedStats?: CharacterStats;
}

export interface Enemy {
  id: string;
  name: string;
  image?: string;
  health: number;
  maxHealth: number;
  damage: number;
  armor: number;
  size: 'small' | 'medium' | 'large' | 'boss';
  spawnConditions: {
    timeOfDay: 'day' | 'night' | 'any';
    weather: string[];
    biomes: string[];
  };
  lootTable: LootEntry[];
  behavior: string;
  spawnWeight: number;
}

export interface LootEntry {
  itemId: string;
  dropChance: number;
  quantity: { min: number; max: number };
  conditions?: string[];
}

export interface Biome {
  id: string;
  name: string;
  description: string;
  image?: string;
  rarity: number;
  enemies: string[];
  weather: string[];
  specialEvents?: string[];
  environmentalEffects?: ItemEffect[];
}

export interface Weather {
  id: string;
  name: string;
  description: string;
  effects: ItemEffect[];
  conditions?: string[];
  atmospheric?: boolean;
}

export interface NPC {
  id: string;
  name: string;
  dialogue: string;
  image?: string;
  inventory: {
    itemId: string;
    price: number;
    quantity: number;
  }[];
  buybackRate: number;
}

export interface GameState {
  character: Character;
  currentBiome: Biome | null;
  currentWeather: Weather | null;
  timeOfDay: 'day' | 'night';
  activeEnemies: Enemy[];
  inventory: Equipment[];
  discoveredBiomes: Biome[];
  lastSpawnTime: number;
  spawnCooldown: number;
  maxActiveEnemies: number;
}