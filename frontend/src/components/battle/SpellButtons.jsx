const SpellButtons = ({ spells, isPlayerTurn, gameEnded, onCastSpell }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {spells.map((spell) => (
        <button
          key={spell.name}
          onClick={() => onCastSpell(spell)}
          disabled={!isPlayerTurn || gameEnded}
          className="arcade-button p-4 text-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          title={`Hit: ${Math.round(spell.hitChance * 100)}% | Crit: ${Math.round(spell.critChance * 100)}% | Damage: ${spell.damage}`}
        >
          <div className="text-2xl mb-2">{spell.emoji}</div>
          <div className="font-arcade text-sm">{spell.name}</div>
          <div className="text-xs text-gray-400 mt-1">
            {Math.round(spell.hitChance * 100)}% hit, {Math.round(spell.critChance * 100)}% crit
          </div>
        </button>
      ))}
    </div>
  );
};

export default SpellButtons;
