import React, { useState } from 'react';
import { Equipment, Weapon, Armor, Accessory, ItemEffect } from '../types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trash2, Plus } from 'lucide-react';

interface ItemEditorProps {
  slotType: 'weapon' | 'armor' | 'accessory';
  onItemCreate: (item: Equipment) => void;
  onClose: () => void;
}

export function ItemEditor({ slotType, onItemCreate, onClose }: ItemEditorProps) {
  const [item, setItem] = useState<Partial<Equipment>>({
    name: '',
    description: '',
    rarity: 'common',
    value: 0,
    effects: [],
  });

  const [currentEffect, setCurrentEffect] = useState<Partial<ItemEffect>>({
    name: '',
    description: '',
    type: 'stat',
    value: 0,
  });

  const handleCreateItem = () => {
    if (!item.name || !item.description) return;

    const baseItem = {
      id: `${slotType}-${Date.now()}`,
      type: slotType,
      name: item.name,
      description: item.description,
      rarity: item.rarity || 'common',
      value: item.value || 0,
      effects: item.effects || [],
    };

    let finalItem: Equipment;

    if (slotType === 'weapon') {
      finalItem = {
        ...baseItem,
        type: 'weapon',
        weaponType: 'sword',
        damage: 10,
        critChance: 0.05,
        attackSpeed: 1.0,
        range: 100,
        projectile: false,
      } as Weapon;
    } else if (slotType === 'armor') {
      finalItem = {
        ...baseItem,
        type: 'armor',
        slot: 'helmet',
        armorValue: 5,
      } as Armor;
    } else {
      finalItem = {
        ...baseItem,
        type: 'accessory',
        slot: 1,
      } as Accessory;
    }

    onItemCreate(finalItem);
  };

  const handleAddEffect = () => {
    if (!currentEffect.name || !currentEffect.description) return;

    const effect: ItemEffect = {
      id: `effect-${Date.now()}`,
      name: currentEffect.name,
      description: currentEffect.description,
      type: currentEffect.type || 'stat',
      value: currentEffect.value || 0,
      trigger: currentEffect.trigger,
      duration: currentEffect.duration,
      cooldown: currentEffect.cooldown,
    };

    setItem(prev => ({
      ...prev,
      effects: [...(prev.effects || []), effect],
    }));

    setCurrentEffect({
      name: '',
      description: '',
      type: 'stat',
      value: 0,
    });
  };

  const handleRemoveEffect = (index: number) => {
    setItem(prev => ({
      ...prev,
      effects: prev.effects?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            Create {slotType.charAt(0).toUpperCase() + slotType.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                value={item.name || ''}
                onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label htmlFor="rarity" className="text-white">Rarity</Label>
              <Select value={item.rarity} onValueChange={(value) => setItem(prev => ({ ...prev, rarity: value as Equipment['rarity'] }))}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                  <SelectItem value="mythic">Mythic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={item.description || ''}
              onChange={(e) => setItem(prev => ({ ...prev, description: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="value" className="text-white">Value (Gold)</Label>
            <Input
              id="value"
              type="number"
              value={item.value || 0}
              onChange={(e) => setItem(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Item value"
            />
          </div>

          <Card className="bg-slate-900/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="effect-name" className="text-white">Effect Name</Label>
                  <Input
                    id="effect-name"
                    value={currentEffect.name || ''}
                    onChange={(e) => setCurrentEffect(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., Increased Damage"
                  />
                </div>
                <div>
                  <Label htmlFor="effect-type" className="text-white">Effect Type</Label>
                  <Select value={currentEffect.type} onValueChange={(value) => setCurrentEffect(prev => ({ ...prev, type: value as ItemEffect['type'] }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="stat">Stat Modifier</SelectItem>
                      <SelectItem value="passive">Passive Effect</SelectItem>
                      <SelectItem value="active">Active Effect</SelectItem>
                      <SelectItem value="conditional">Conditional Effect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="effect-desc" className="text-white">Effect Description</Label>
                <Input
                  id="effect-desc"
                  value={currentEffect.description || ''}
                  onChange={(e) => setCurrentEffect(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Describe what this effect does"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="effect-value" className="text-white">Value</Label>
                  <Input
                    id="effect-value"
                    type="number"
                    step="0.01"
                    value={currentEffect.value || 0}
                    onChange={(e) => setCurrentEffect(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Effect strength"
                  />
                </div>
                <div>
                  <Label htmlFor="effect-trigger" className="text-white">Trigger (Optional)</Label>
                  <Select value={currentEffect.trigger || ''} onValueChange={(value) => setCurrentEffect(prev => ({ ...prev, trigger: value as ItemEffect['trigger'] || undefined }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="onHit">On Hit</SelectItem>
                      <SelectItem value="onCrit">On Critical Hit</SelectItem>
                      <SelectItem value="onDamage">On Taking Damage</SelectItem>
                      <SelectItem value="onIdle">While Idle</SelectItem>
                      <SelectItem value="onMove">While Moving</SelectItem>
                      <SelectItem value="onTime">Over Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleAddEffect} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!currentEffect.name || !currentEffect.description}
              >
                <Plus size={16} className="mr-2" />
                Add Effect
              </Button>

              {item.effects && item.effects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Current Effects:</h4>
                  {item.effects.map((effect, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-white">{effect.name}</div>
                        <div className="text-sm text-slate-300">{effect.description}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{effect.type}</Badge>
                          <Badge variant="outline">Value: {effect.value}</Badge>
                          {effect.trigger && <Badge variant="outline">{effect.trigger}</Badge>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEffect(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={handleCreateItem} 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!item.name || !item.description}
            >
              Create {slotType.charAt(0).toUpperCase() + slotType.slice(1)}
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex-1 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}