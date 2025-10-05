import React from 'react';
import EnergyWave from '../EnergyWave';

const BattleField = ({
  character,
  playerHealth,
  maxPlayerHealth,
  enemyHealth,
  maxEnemyHealth,
  playerHit,
  enemyHit,
  playerAttack,
  enemyAttack,
  damageText,
  playerProjectiles,
  enemyProjectiles,
  tierConfig,
  selectedTier,
  isBossBattle = false
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-8">
      {/* Player */}
      <div className={`text-center transition-all duration-300 ${
        playerHit ? 'animate-pulse' : ''
      } ${playerAttack ? 'scale-110' : ''}`}>
        <div className="mb-2 relative">
          <img 
            src={`/mages/${character.avatar?.replace('_mage', '') || 'earth'}_mage.png`} 
            alt={`${character.avatar?.replace('_mage', '') || 'earth'} mage`}
            className="w-24 h-24 xs:w-28 xs:h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto object-contain"
          />
          {damageText && damageText.isPlayer && (
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 sm:-translate-y-6 md:-translate-y-8 animate-bounce font-arcade text-lg sm:text-xl md:text-2xl ${
              damageText.isVulnerable ? 'text-yellow-400' : 
              damageText.isCrit ? 'text-orange-400' : 'text-red-500'
            }`}>
              {damageText.text}
            </div>
          )}
        </div>
        <div className="font-arcade text-xs sm:text-sm text-neon-blue mb-2 break-words">{character.name}</div>
        <div className="w-12 xs:w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2 mb-1 mx-auto">
          <div 
            className="bg-neon-green h-1.5 sm:h-2 rounded-full transition-all duration-500"
            style={{ width: `${(playerHealth / maxPlayerHealth) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-400">{playerHealth}/{maxPlayerHealth}</div>
      </div>

      {/* VS */}
      <div className="text-center relative">
        <div className="font-arcade text-lg sm:text-xl md:text-2xl text-neon-purple mb-2">VS</div>
        
        {/* Player Energy Waves */}
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
        
        {/* Enemy Energy Waves */}
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

      {/* Enemy */}
      <div className={`text-center transition-all duration-300 ${
        enemyHit ? 'animate-pulse' : ''
      } ${enemyAttack ? 'scale-110' : ''}`}>
        <div className="mb-2 relative">
          <img 
            src={isBossBattle && selectedTier === 6 ? 
              `/mages/${character.avatar?.replace('_mage', '') || 'earth'}_mage.png` : 
              (isBossBattle ? (tierConfig?.bossImage || '/dragons/mountain_wyrm.png') : (tierConfig?.minionImage || '/dragonling/earth__dragonling.png'))} 
            alt={isBossBattle ? (tierConfig?.bossName || 'Dragon') : (tierConfig?.minionName || 'Dragonling')}
            className={`w-24 h-24 xs:w-28 xs:h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto object-contain ${
              isBossBattle && selectedTier === 6 ? 'brightness-50 contrast-150 sepia' : ''
            }`}
          />
          {damageText && !damageText.isPlayer && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 sm:-translate-y-6 md:-translate-y-8 animate-bounce text-red-500 font-arcade text-lg sm:text-xl md:text-2xl">
              {damageText.text}
            </div>
          )}
        </div>
        <div className="font-arcade text-xs sm:text-sm text-neon-red mb-2 break-words">{isBossBattle ? (tierConfig?.bossName || 'Dragon') : (tierConfig?.minionName || 'Dragonling')}</div>
        <div className="w-12 xs:w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2 mb-1 mx-auto">
          <div 
            className="bg-red-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
            style={{ width: `${(enemyHealth / maxEnemyHealth) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-400">{enemyHealth}/{maxEnemyHealth}</div>
      </div>
    </div>
  );
};

export default BattleField;
