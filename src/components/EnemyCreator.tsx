import React, { useState, useEffect } from 'react';
import { Enemy } from '../types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion } from 'framer-motion';

interface EnemyCreatorProps {
  enemy: Enemy | null;
  onSave: (enemy: Enemy) => void;
  onClose: () => void;
  existingIds: string[];
}

const initialEnemyState: Omit<Enemy, 'id'> = {
  name: '',
  image: '',
  health: 100,
  maxHealth: 100,
  damage: 10,
  armor: 0,
  size: 'medium',
  spawnConditions: {
    timeOfDay: 'any',
    weather: [],
    biomes: [],
  },
  lootTable: [],
  behavior: 'aggressive',
  spawnWeight: 5,
};

export function EnemyCreator({ enemy, onSave, onClose, existingIds }: EnemyCreatorProps) {
  const [formData, setFormData] = useState<Omit<Enemy, 'id'>>(initialEnemyState);
  const [id, setId] = useState('');

  useEffect(() => {
    if (enemy) {
      setFormData(enemy);
      setId(enemy.id);
    } else {
      setFormData(initialEnemyState);
      setId('');
    }
  }, [enemy]);

  const handleSave = () => {
    if (!formData.name) return;
    const finalId = id || formData.name.toLowerCase().replace(/\s+/g, '-');
    if (!id && existingIds.includes(finalId)) {
      // Handle ID conflict for new enemies
      alert('An enemy with this name already exists. Please choose a different name.');
      return;
    }
    onSave({ ...formData, id: finalId });
  };

  const handleInputChange = (field: keyof Omit<Enemy, 'id'>, value: string | number | Enemy['size']) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpawnConditionChange = (field: keyof Enemy['spawnConditions'], value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      spawnConditions: { ...prev.spawnConditions, [field]: value },
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <DialogHeader className="p-6">
            <DialogTitle className="text-white text-2xl">{enemy ? 'Edit Enemy' : 'Create New Enemy'}</DialogTitle>
          </DialogHeader>

          <div className="px-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="bg-slate-700 border-slate-600 text-white" placeholder="e.g., Shadow Stalker" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-slate-300">Image URL</Label>
                <Input id="image" value={formData.image} onChange={(e) => handleInputChange('image', e.target.value)} className="bg-slate-700 border-slate-600 text-white" placeholder="https://example.com/image.png" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="health" className="text-slate-300">Health</Label>
                <Input id="health" type="number" value={formData.health} onChange={(e) => handleInputChange('health', parseFloat(e.target.value))} className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="damage" className="text-slate-300">Damage</Label>
                <Input id="damage" type="number" value={formData.damage} onChange={(e) => handleInputChange('damage', parseFloat(e.target.value))} className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="armor" className="text-slate-300">Armor</Label>
                <Input id="armor" type="number" value={formData.armor} onChange={(e) => handleInputChange('armor', parseFloat(e.target.value))} className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size" className="text-slate-300">Size</Label>
                <Select value={formData.size} onValueChange={(v) => handleInputChange('size', v)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="boss">Boss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Spawn Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-slate-300">Time of Day</Label>
                  <Select value={formData.spawnConditions.timeOfDay} onValueChange={(v) => handleSpawnConditionChange('timeOfDay', v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Biomes (comma-separated)</Label>
                  <Input value={formData.spawnConditions.biomes.join(', ')} onChange={(e) => handleSpawnConditionChange('biomes', e.target.value.split(', ').map(s => s.trim()))} className="bg-slate-700 border-slate-600 text-white" placeholder="e.g., forest, desert" />
                </div>
              </div>
            </div>

          </div>

          <DialogFooter className="p-6 bg-slate-800/50 mt-6">
            <Button onClick={onClose} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">Cancel</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">{enemy ? 'Save Changes' : 'Create Enemy'}</Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}