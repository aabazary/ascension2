import EnergyWave from '../EnergyWave';

const BattleField = ({
  character,
  enemyHealth,
  maxEnemyHealth,
  playerHealth,
  isPlayerAttack: _isPlayerAttack,
  isEnemyAttack: _isEnemyAttack,
  damageText,
  playerProjectiles,
  enemyProjectiles,
  tierConfig
}) => {
  return (
    <div className="relative bg-dark-bg rounded-lg border-2 border-dark-border p-2 sm:p-4 md:p-8">
      {/* Player */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <img 
            src={`/mages/${character.avatar}_mage.png`}
            alt={character.name}
            className="w-24 h-24 xs:w-28 xs:h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
          />
          <div>
            <h3 className="font-arcade text-sm sm:text-base text-neon-green break-words">
              {character.name}
            </h3>
            <div className="w-12 xs:w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-neon-green h-full rounded-full transition-all duration-300"
                style={{ width: `${(playerHealth / 100) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{playerHealth}/100</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg sm:text-xl md:text-2xl font-arcade text-neon-pink mb-2">VS</div>
          {damageText && (
            <div className={`text-lg sm:text-xl md:text-2xl font-arcade animate-bounce -translate-y-4 sm:-translate-y-6 md:-translate-y-8 ${
              damageText.includes('MISS') ? 'text-red-500' : 'text-red-500'
            }`}>
              {damageText}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right">
            <h3 className="font-arcade text-sm sm:text-base text-red-400 break-words">
              {tierConfig.minionName}
            </h3>
            <div className="w-12 xs:w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-red-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(enemyHealth / maxEnemyHealth) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{enemyHealth}/{maxEnemyHealth}</p>
          </div>
          <img 
            src={tierConfig.minionImage}
            alt={tierConfig.minionName}
            className="w-24 h-24 xs:w-28 xs:h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
          />
        </div>
      </div>
      
      {/* Projectiles */}
      {playerProjectiles.map((projectile) => (
        <EnergyWave
          key={projectile.id}
          element={projectile.element}
          position={projectile.position}
          direction="right"
          isActive={projectile.active}
          projectileId={projectile.id}
        />
      ))}
      
      {enemyProjectiles.map((projectile) => (
        <EnergyWave
          key={projectile.id}
          element={projectile.element}
          position={projectile.position}
          direction="left"
          isActive={projectile.active}
          projectileId={projectile.id}
        />
      ))}
    </div>
  );
};

export default BattleField;
