import React, { useState } from 'react';
import { Character, Equipment, ItemEffect } from '../types/game';
import { calculateCharacterStats, getRarityColor, getRarityBorder, formatNumber } from '../utils/gameUtils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ItemEditor } from './ItemEditor';
import { Sword, Shield, Zap, Users, Package } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

export function CharacterSheet({ character, onCharacterChange }: CharacterSheetProps) {
  const [selectedSlot, setSelectedSlot] = useState<{ type: 'weapon' | 'armor' | 'accessory', index: number | string } | null>(null);
  const [showItemEditor, setShowItemEditor] = useState(false);

  const calculatedStats = calculateCharacterStats(character);

  const handleEquipItem = (item: Equipment) => {
    const newCharacter = { ...character };
    
    if (item.type === 'weapon' && selectedSlot?.type === 'weapon') {
      newCharacter.equipment.weapons[selectedSlot.index as number] = item;
    } else if (item.type === 'armor' && selectedSlot?.type === 'armor') {
      newCharacter.equipment.armor[selectedSlot.index as keyof typeof newCharacter.equipment.armor] = item;
    } else if (item.type === 'accessory' && selectedSlot?.type === 'accessory') {
      newCharacter.equipment.accessories[selectedSlot.index as number] = item;
    }
    
    onCharacterChange(newCharacter);
    setSelectedSlot(null);
    setShowItemEditor(false);
  };

  const handleUnequipItem = (type: 'weapon' | 'armor' | 'accessory', index: number | string) => {
    const newCharacter = { ...character };
    
    if (type === 'weapon') {
      newCharacter.equipment.weapons[index as number] = null;
    } else if (type === 'armor') {
      newCharacter.equipment.armor[index as keyof typeof newCharacter.equipment.armor] = null;
    } else if (type === 'accessory') {
      newCharacter.equipment.accessories[index as number] = null;
    }
    
    onCharacterChange(newCharacter);
  };

  const EquipmentSlot = ({ 
    item, 
    type, 
    index, 
    label 
  }: { 
    item: Equipment | null; 
    type: 'weapon' | 'armor' | 'accessory'; 
    index: number | string; 
    label: string; 
  }) => (
    <div className="group">
      <div className="text-sm font-medium text-slate-300 mb-2">{label}</div>
      <div 
        className={`w-20 h-20 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer transition-all hover:border-slate-400 hover:bg-slate-800/50 ${
          item ? `${getRarityBorder(item.rarity)} bg-slate-800/80` : ''
        }`}
        onClick={() => {
          if (item) {
            handleUnequipItem(type, index);
          } else {
            setSelectedSlot({ type, index });
            setShowItemEditor(true);
          }
        }}
      >
        {item ? (
          <div className="text-center">
            <div className="text-2xl mb-1">{getItemIcon(item)}</div>
            <div className={`text-xs ${getRarityColor(item.rarity)} font-medium`}>
              {item.name.slice(0, 8)}
            </div>
          </div>
        ) : (
          <div className="text-slate-500">
            <Package size={24} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users size={20} />
            {character.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-300">Level</div>
              <div className="text-xl font-bold text-white">{character.level}</div>
            </div>
            <div>
              <div className="text-sm text-slate-300">Health</div>
              <div className="text-xl font-bold text-red-400">{formatNumber(calculatedStats.health)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-300">Armor</div>
              <div className="text-xl font-bold text-blue-400">{formatNumber(calculatedStats.armor)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-300">Damage</div>
              <div className="text-xl font-bold text-orange-400">{formatNumber(calculatedStats.damage)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="equipment" className="text-white">Equipment</TabsTrigger>
          <TabsTrigger value="stats" className="text-white">Stats</TabsTrigger>
          <TabsTrigger value="effects" className="text-white">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sword size={20} />
                Weapons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {character.equipment.weapons.map((weapon, index) => (
                  <EquipmentSlot
                    key={index}
                    item={weapon}
                    type="weapon"
                    index={index}
                    label={`Weapon ${index + 1}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield size={20} />
                Armor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <EquipmentSlot
                  item={character.equipment.armor.helmet}
                  type="armor"
                  index="helmet"
                  label="Helmet"
                />
                <EquipmentSlot
                  item={character.equipment.armor.chestplate}
                  type="armor"
                  index="chestplate"
                  label="Chestplate"
                />
                <EquipmentSlot
                  item={character.equipment.armor.leggings}
                  type="armor"
                  index="leggings"
                  label="Leggings"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap size={20} />
                Accessories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {character.equipment.accessories.map((accessory, index) => (
                  <EquipmentSlot
                    key={index}
                    item={accessory}
                    type="accessory"
                    index={index}
                    label={`Slot ${index + 1}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Character Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(calculatedStats).map(([key, value]) => (
                  <div key={key} className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-lg font-bold text-white">
                      {typeof value === 'object' ? 'Complex' : formatNumber(value)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effects">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Active Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getAllActiveEffects(character).map((effect, index) => (
                  <div key={index} className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="font-medium text-white">{effect.name}</div>
                    <div className="text-sm text-slate-300">{effect.description}</div>
                    <Badge variant="outline" className="mt-2">
                      {effect.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showItemEditor && selectedSlot && (
        <ItemEditor
          slotType={selectedSlot.type}
          onItemCreate={handleEquipItem}
          onClose={() => {
            setShowItemEditor(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}

function getItemIcon(item: Equipment): string {
  if (item.type === 'weapon') return '⚔️';
  if (item.type === 'armor') return '🛡️';
  if (item.type === 'accessory') return '💍';
  return '📦';
}

function getAllActiveEffects(character: Character): ItemEffect[] {
  const effects: ItemEffect[] = [];
  
  character.equipment.weapons.forEach(weapon => {
    if (weapon) effects.push(...weapon.effects);
  });
  
  Object.values(character.equipment.armor).forEach(armor => {
    if (armor) effects.push(...armor.effects);
  });
  
  character.equipment.accessories.forEach(accessory => {
    if (accessory) effects.push(...accessory.effects);
  });
  
  return effects;
}