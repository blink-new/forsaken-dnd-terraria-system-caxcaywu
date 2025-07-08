import { useState } from 'react';
import { CharacterSheet } from './components/CharacterSheet';
import { GameInterface } from './components/GameInterface';
import { Character } from './types/game';
import { createDefaultCharacter } from './utils/gameUtils';

function App() {
  const [character, setCharacter] = useState<Character>(createDefaultCharacter());
  const [currentView, setCurrentView] = useState<'character' | 'game'>('character');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Forsaken D&D System</h1>
          <p className="text-slate-300">Terraria-inspired RPG with unlimited customization</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setCurrentView('character')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentView === 'character'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Character Sheet
          </button>
          <button
            onClick={() => setCurrentView('game')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentView === 'game'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Game World
          </button>
        </div>

        {currentView === 'character' ? (
          <CharacterSheet character={character} onCharacterChange={setCharacter} />
        ) : (
          <GameInterface character={character} onCharacterChange={setCharacter} />
        )}
      </div>
    </div>
  );
}

export default App;