import React from 'react';

const SpellButtons = ({ spells, onCastSpell }) => {
  return (
    <div className="arcade-panel mb-8">
      <h3 className="font-arcade text-sm text-neon-purple mb-4 text-center">
        CHOOSE YOUR SPELL
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {spells.map((spell, index) => (
          <button
            key={index}
            onClick={() => onCastSpell(spell)}
            className="group relative p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-neon-purple transition-all"
            title={`${spell.description}\nDamage: ${spell.damage} | Hit: ${(spell.hitChance * 100).toFixed(0)}% | Crit: ${(spell.critChance * 100).toFixed(0)}%`}
          >
            <div className="text-3xl mb-2">{spell.emoji}</div>
            <div className="font-arcade text-sm text-white mb-1">{spell.name}</div>
            <div className="text-xs text-gray-400">
              <div className="text-white font-semibold mb-1">Damage: {spell.damage}</div>
              <div>Hit: {(spell.hitChance * 100).toFixed(0)}%</div>
              <div>Crit: {(spell.critChance * 100).toFixed(0)}%</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpellButtons;
