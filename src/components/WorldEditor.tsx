import React, { useState } from 'react';
import { Enemy } from '../types/game';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { EnemyCreator } from './EnemyCreator';
import { PlusCircle } from 'lucide-react';

interface WorldEditorProps {
  enemies: Enemy[];
  onEnemiesChange: (enemies: Enemy[]) => void;
}

export function WorldEditor({ enemies, onEnemiesChange }: WorldEditorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEnemy, setEditingEnemy] = useState<Enemy | null>(null);

  const handleEnemySave = (enemy: Enemy) => {
    if (editingEnemy) {
      // Update existing enemy
      onEnemiesChange(enemies.map(e => e.id === enemy.id ? enemy : e));
    } else {
      // Add new enemy
      onEnemiesChange([...enemies, enemy]);
    }
    setEditingEnemy(null);
    setIsCreating(false);
  };

  const handleEdit = (enemy: Enemy) => {
    setEditingEnemy(enemy);
    setIsCreating(true);
  }

  const handleDelete = (enemyId: string) => {
    onEnemiesChange(enemies.filter(e => e.id !== enemyId));
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Enemy Database</CardTitle>
          <Button onClick={() => { setIsCreating(true); setEditingEnemy(null); }} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Enemy
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enemies.map(enemy => (
              <motion.div
                key={enemy.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{enemy.name}</h3>
                    {enemy.image && <img src={enemy.image} alt={enemy.name} className="w-16 h-16 rounded-md object-cover border-2 border-slate-600" />}
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{enemy.size} | HP: {enemy.health} | DMG: {enemy.damage}</p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => handleEdit(enemy)}>Edit</Button>
                  <Button size="sm" variant="destructive" className="w-full bg-red-800/80 hover:bg-red-800" onClick={() => handleDelete(enemy.id)}>Delete</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isCreating && (
          <EnemyCreator
            enemy={editingEnemy}
            onSave={handleEnemySave}
            onClose={() => {
              setIsCreating(false);
              setEditingEnemy(null);
            }}
            existingIds={enemies.map(e => e.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}