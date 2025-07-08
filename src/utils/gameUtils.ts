import { Character, CharacterStats, Equipment } from '../types/game';

export function createDefaultCharacter(): Character {
  const baseStats: CharacterStats = {
    health: 100,
    maxHealth: 100,
    armor: 0,
    damage: 10,
    criticalChance: 0.05,
    criticalDamage: 1.5,
    movementSpeed: 100,
    jumpHeight: 100,
    lifesteal: 0,
    elementalResistance: {
      fire: 0,
      ice: 0,
      lightning: 0,
      poison: 0,
      holy: 0,
      dark: 0,
    },
    gold: 0,
  };

  return {
    id: 'player-1',
    name: 'Forsaken Warrior',
    level: 1,
    experience: 0,
    baseStats,
    equipment: {
      weapons: [null, null, null],
      armor: {
        helmet: null,
        chestplate: null,
        leggings: null,
      },
      accessories: [null, null, null, null, null, null, null, null],
    },
  };
}

export function calculateCharacterStats(character: Character): CharacterStats {
  const stats: CharacterStats = { ...character.baseStats };
  
  // Apply weapon stats
  character.equipment.weapons.forEach(weapon => {
    if (weapon) {
      stats.damage += weapon.damage;
      stats.criticalChance += weapon.critChance;
      
      // Apply weapon effects
      weapon.effects.forEach(effect => {
        if (effect.type === 'stat') {
          applyStatEffect(stats, effect);
        }
      });
    }
  });

  // Apply armor stats
  Object.values(character.equipment.armor).forEach(armor => {
    if (armor) {
      stats.armor += armor.armorValue;
      
      // Apply armor effects
      armor.effects.forEach(effect => {
        if (effect.type === 'stat') {
          applyStatEffect(stats, effect);
        }
      });
    }
  });

  // Apply accessory stats
  character.equipment.accessories.forEach(accessory => {
    if (accessory) {
      accessory.effects.forEach(effect => {
        if (effect.type === 'stat') {
          applyStatEffect(stats, effect);
        }
      });
    }
  });

  return stats;
}

function applyStatEffect(stats: CharacterStats, effect: Equipment['effects'][0]) {
  const statMap: Record<string, keyof CharacterStats> = {
    'health': 'maxHealth',
    'armor': 'armor',
    'damage': 'damage',
    'criticalChance': 'criticalChance',
    'criticalDamage': 'criticalDamage',
    'movementSpeed': 'movementSpeed',
    'jumpHeight': 'jumpHeight',
    'lifesteal': 'lifesteal',
  };

  const statKey = statMap[effect.name];
  if (statKey && typeof stats[statKey] === 'number') {
    (stats[statKey] as number) += effect.value;
  }
}

export function getRarityColor(rarity: Equipment['rarity']): string {
  const colors = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-orange-400',
    mythic: 'text-red-400',
  };
  return colors[rarity] || colors.common;
}

export function getRarityBorder(rarity: Equipment['rarity']): string {
  const borders = {
    common: 'border-gray-400',
    uncommon: 'border-green-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-orange-400',
    mythic: 'border-red-400',
  };
  return borders[rarity] || borders.common;
}

export function formatNumber(num: number): string {
  if (num % 1 === 0) return num.toString();
  return num.toFixed(2);
}