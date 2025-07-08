const defaultBiomes: Biome[] = [
  {
    id: 'forest',
    name: 'Mystic Forest',
    description: 'A lush forest filled with ancient magic',
    rarity: 8,
    enemies: ['goblin', 'wolf'],
    weather: ['clear', 'rain'],
  },
  {
    id: 'desert',
    name: 'Scorching Desert',
    description: 'An endless expanse of burning sand',
    rarity: 5,
    enemies: ['scorpion', 'sandworm'],
    weather: ['clear', 'sandstorm'],
  },
  {
    id: 'dungeon',
    name: 'Ancient Dungeon',
    description: 'Dark corridors filled with forgotten treasures',
    rarity: 2,
    enemies: ['skeleton', 'lich'],
    weather: ['dark'],
  },
];

const defaultEnemies: Enemy[] = [
  {
    id: 'goblin',
    name: 'Forest Goblin',
    health: 25,
    maxHealth: 25,
    damage: 5,
    armor: 1,
    size: 'small',
    spawnConditions: {
      timeOfDay: 'any',
      weather: [],
      biomes: ['forest'],
    },
    lootTable: [],
    behavior: 'aggressive',
    spawnWeight: 10,
  },
  {
    id: 'wolf',
    name: 'Shadow Wolf',
    health: 40,
    maxHealth: 40,
    damage: 8,
    armor: 2,
    size: 'medium',
    spawnConditions: {
      timeOfDay: 'night',
      weather: [],
      biomes: ['forest'],
    },
    lootTable: [],
    behavior: 'pack',
    spawnWeight: 6,
  },
  {
    id: 'skeleton',
    name: 'Ancient Skeleton',
    health: 35,
    maxHealth: 35,
    damage: 12,
    armor: 3,
    size: 'medium',
    spawnConditions: {
      timeOfDay: 'any',
      weather: [],
      biomes: ['dungeon'],
    },
    lootTable: [],
    behavior: 'guard',
    spawnWeight: 8,
  },
];

const defaultWeather: Weather[] = [
  {
    id: 'clear',
    name: 'Clear Skies',
    description: 'Perfect weather for adventuring',
    effects: [],
  },
  {
    id: 'rain',
    name: 'Heavy Rain',
    description: 'Rain reduces movement speed but increases magic regeneration',
    effects: [
      {
        id: 'rain-movement',
        name: 'Reduced Movement',
        description: 'Movement speed reduced by 25%',
        type: 'stat',
        value: -0.25,
      },
    ],
  },
  {
    id: 'sandstorm',
    name: 'Raging Sandstorm',
    description: 'Reduces visibility and increases critical hit chance',
    effects: [
      {
        id: 'sandstorm-crit',
        name: 'Sharp Sand',
        description: 'Critical hit chance increased by 15%',
        type: 'stat',
        value: 0.15,
      },
    ],
  },
];

import React, { useState, useEffect } from 'react';
import { Character, GameState, Biome, Enemy, Weather } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { MapPin, Sun, Moon, Cloud, Zap, Heart, Coins } from 'lucide-react';

interface GameInterfaceProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

export function GameInterface({ character, onCharacterChange }: GameInterfaceProps) {
  const [gameState, setGameState] = useState<GameState>({
    character,
    currentBiome: null,
    currentWeather: null,
    timeOfDay: 'day',
    activeEnemies: [],
    inventory: [],
    discoveredBiomes: defaultBiomes,
    lastSpawnTime: 0,
    spawnCooldown: 1000,
    maxActiveEnemies: 3,
  });

  const [biomeTimer, setBiomeTimer] = useState(0);
  const [lastActionTime, setLastActionTime] = useState(Date.now());

  useEffect(() => {
    // Update character in game state when it changes
    setGameState(prev => ({ ...prev, character }));
  }, [character]);

  useEffect(() => {
    // Timer for biome enemy spawning
    const interval = setInterval(() => {
      if (gameState.currentBiome) {
        setBiomeTimer(prev => {
          const newTimer = prev + 1;
          if (newTimer >= 20 && gameState.activeEnemies.length < gameState.maxActiveEnemies) {
            // Spawn enemy after 20 seconds
            spawnRandomEnemy();
            return 0;
          }
          return newTimer;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.currentBiome, gameState.activeEnemies.length]);

  const spawnRandomEnemy = () => {
    if (!gameState.currentBiome || gameState.activeEnemies.length >= gameState.maxActiveEnemies) return;
    
    const now = Date.now();
    if (now - gameState.lastSpawnTime < gameState.spawnCooldown) return;

    const availableEnemies = defaultEnemies.filter(enemy => 
      enemy.spawnConditions.biomes.includes(gameState.currentBiome!.id) &&
      (enemy.spawnConditions.timeOfDay === 'any' || enemy.spawnConditions.timeOfDay === gameState.timeOfDay)
    );

    if (availableEnemies.length > 0) {
      const randomEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
      const enemyInstance = { ...randomEnemy, id: `${randomEnemy.id}-${Date.now()}` };
      
      setGameState(prev => ({
        ...prev,
        activeEnemies: [...prev.activeEnemies, enemyInstance],
        lastSpawnTime: now,
      }));
    }
  };

  const teleportToBiome = () => {
    const weightedBiomes: Biome[] = [];
    gameState.discoveredBiomes.forEach(biome => {
      for (let i = 0; i < biome.rarity; i++) {
        weightedBiomes.push(biome);
      }
    });

    if (weightedBiomes.length > 0) {
      const randomBiome = weightedBiomes[Math.floor(Math.random() * weightedBiomes.length)];
      setGameState(prev => ({ ...prev, currentBiome: randomBiome, activeEnemies: [] }));
      setBiomeTimer(0);
      setLastActionTime(Date.now());
    }
  };

  const attackEnemy = (enemyId: string) => {
    const now = Date.now();
    if (now - lastActionTime < 500) return; // Attack cooldown

    const enemy = gameState.activeEnemies.find(e => e.id === enemyId);
    if (!enemy) return;

    const damage = character.baseStats.damage;
    const newHealth = Math.max(0, enemy.health - damage);
    
    const updatedEnemies = [...gameState.activeEnemies];
    
    const enemyIndex = updatedEnemies.findIndex(e => e.id === enemyId);
    if (enemyIndex !== -1) {
      updatedEnemies[enemyIndex] = { ...enemy, health: newHealth };
    }

    if (newHealth <= 0) {
      // Enemy defeated
      const goldReward = Math.floor(Math.random() * 10) + 1;
      const newCharacter = { ...character };
      newCharacter.baseStats.gold += goldReward;
      onCharacterChange(newCharacter);
      updatedEnemies.splice(enemyIndex, 1);
    }

    setGameState(prev => ({ ...prev, activeEnemies: updatedEnemies, character }));
    setLastActionTime(now); // Added back the setLastActionTime call
  };

  const toggleTimeOfDay = () => {
    setGameState(prev => {
      const newTimeOfDay = prev.timeOfDay === 'day' ? 'night' : 'day';
      
      // Remove enemies that can't spawn in the new time
      const validEnemies = prev.activeEnemies.filter(enemy => 
        enemy.spawnConditions.timeOfDay === 'any' || enemy.spawnConditions.timeOfDay === newTimeOfDay
      );

      return {
        ...prev,
        timeOfDay: newTimeOfDay,
        activeEnemies: validEnemies,
      };
    });
  };

  const changeWeather = () => {
    const randomWeather = defaultWeather[Math.floor(Math.random() * defaultWeather.length)];
    setGameState(prev => ({ ...prev, currentWeather: randomWeather }));
  };

  return (
    <div className="space-y-6">
      {/* Game Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-blue-400" />
              <span className="text-white font-medium">Current Biome</span>
            </div>
            <div className="text-lg text-white">
              {gameState.currentBiome ? gameState.currentBiome.name : 'None'}
            </div>
            {gameState.currentBiome && (
              <div className="text-sm text-slate-300 mt-1">
                {gameState.currentBiome.description}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {gameState.timeOfDay === 'day' ? (
                <Sun size={16} className="text-yellow-400" />
              ) : (
                <Moon size={16} className="text-blue-300" />
              )}
              <span className="text-white font-medium">Time of Day</span>
            </div>
            <div className="text-lg text-white capitalize">{gameState.timeOfDay}</div>
            <Button 
              onClick={toggleTimeOfDay}
              size="sm"
              className="mt-2 bg-blue-600 hover:bg-blue-700"
            >
              Toggle Time
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cloud size={16} className="text-gray-400" />
              <span className="text-white font-medium">Weather</span>
            </div>
            <div className="text-lg text-white">
              {gameState.currentWeather ? gameState.currentWeather.name : 'Clear'}
            </div>
            <Button 
              onClick={changeWeather}
              size="sm"
              className="mt-2 bg-purple-600 hover:bg-purple-700"
            >
              Change Weather
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Movement Panel */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap size={20} />
            Free Movement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={teleportToBiome}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Teleport to Random Biome
            </Button>
            {gameState.currentBiome && (
              <div className="text-slate-300">
                Enemy spawn in: {Math.max(0, 20 - biomeTimer)}s
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Enemies */}
      {gameState.activeEnemies.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active Enemies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gameState.activeEnemies.map((enemy) => (
                <div key={enemy.id} className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-white flex items-center gap-2">
                        <span className="text-2xl">👹</span>
                        {enemy.name}
                        <Badge variant="outline" className={
                          enemy.size === 'boss' ? 'border-red-500 text-red-400' :
                          enemy.size === 'large' ? 'border-orange-500 text-orange-400' :
                          'border-gray-500 text-gray-400'
                        }>
                          {enemy.size}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-300">
                        Health: {enemy.health}/{enemy.maxHealth} | Damage: {enemy.damage}
                      </div>
                    </div>
                    <Button 
                      onClick={() => attackEnemy(enemy.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Attack
                    </Button>
                  </div>
                  <Progress 
                    value={(enemy.health / enemy.maxHealth) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Character Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Character Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-400" />
              <div>
                <div className="text-sm text-slate-300">Health</div>
                <div className="text-lg font-bold text-red-400">
                  {character.baseStats.health}/{character.baseStats.maxHealth}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins size={16} className="text-yellow-400" />
              <div>
                <div className="text-sm text-slate-300">Gold</div>
                <div className="text-lg font-bold text-yellow-400">
                  {character.baseStats.gold}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}