import { useState } from 'react';

const GearDisplay = ({ upgradeStatus, onGearSelect }) => {
  const [hoveredGear, setHoveredGear] = useState(null);

  const gearTypes = ['belt', 'cloak', 'ring'];
  const gearNames = {
    ring: 'Ring',
    cloak: 'Cloak', 
    belt: 'Belt'
  };

  const getGearImage = (gearType, tier) => {
    // Map gear types to image paths
    const imageMap = {
      ring: 'ring',
      cloak: 'robe', // Using robe images for cloak
      belt: 'belt'
    };
    
    const gearName = imageMap[gearType];
    return `/armor/${gearName}/tier${tier}_${gearName}.png`;
  };

  const getTierColor = (tier) => {
    const colors = {
      0: 'text-gray-400',
      1: 'text-green-400',
      2: 'text-blue-400', 
      3: 'text-purple-400',
      4: 'text-orange-400',
      5: 'text-red-400',
      6: 'text-yellow-400'
    };
    return colors[tier] || 'text-gray-400';
  };

  const getTierBorderColor = (tier) => {
    const colors = {
      0: 'border-gray-600',
      1: 'border-green-500',
      2: 'border-blue-500',
      3: 'border-purple-500', 
      4: 'border-orange-500',
      5: 'border-red-500',
      6: 'border-yellow-500'
    };
    return colors[tier] || 'border-gray-600';
  };

  const getUpgradeStatus = (gearType) => {
    if (!upgradeStatus || !upgradeStatus[gearType]) {
      return { canUpgrade: false, currentTier: 0, maxTier: 6, resourceStatus: {} };
    }
    return upgradeStatus[gearType];
  };

  const getResourceIcon = (resourceType) => {
    const icons = {
      gathering: '✨',
      minion: '⚔️',
      boss: '👑'
    };
    return icons[resourceType] || '📦';
  };

  const formatResourceName = (resourceType) => {
    return resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
  };

  const getEquipmentPrerequisites = (gearType, upgradeStatus) => {
    if (!upgradeStatus) return [];
    
    const prerequisites = [];
    const currentGearTier = upgradeStatus[gearType]?.currentTier || 0;
    
    // Check if other equipment needs to be upgraded to match this gear's tier
    gearTypes.forEach(otherGear => {
      if (otherGear !== gearType) {
        const otherTier = upgradeStatus[otherGear]?.currentTier || 0;
        // If this gear is higher tier than others, they need to be upgraded first
        if (currentGearTier > otherTier) {
          prerequisites.push(otherGear);
        }
      }
    });
    
    return prerequisites;
  };

  const getRequirementsMessage = (gearType, status, upgradeStatus) => {
    if (!status || !upgradeStatus) return '';
    
    const prerequisites = getEquipmentPrerequisites(gearType, upgradeStatus);
    
    if (prerequisites.length > 0) {
      const gearNamesList = prerequisites.map(g => gearNames[g]).join(' and ');
      return `Upgrade ${gearNamesList} first`;
    }
    
    if (status.canUpgrade) {
      return 'Ready to upgrade';
    }
    
    return 'Need more resources';
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {gearTypes.map((gearType) => {
        const status = getUpgradeStatus(gearType);
        const { canUpgrade, currentTier, maxTier } = status;
        const isMaxTier = currentTier >= maxTier;
        const requirementsMessage = getRequirementsMessage(gearType, status, upgradeStatus);
        const prerequisites = getEquipmentPrerequisites(gearType, upgradeStatus);
        
        return (
          <div
            key={gearType}
            className={`relative bg-gray-800 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
              isMaxTier ? 'opacity-75' : ''
            } ${getTierBorderColor(currentTier)} border-2`}
            onClick={() => !isMaxTier && onGearSelect(gearType)}
            onMouseEnter={() => setHoveredGear(gearType)}
            onMouseLeave={() => setHoveredGear(null)}
          >
            {/* Gear Image */}
            <div className="flex justify-center mb-4">
              <img
                src={getGearImage(gearType, currentTier)}
                alt={`${gearNames[gearType]} Tier ${currentTier}`}
                className="w-24 h-24 object-contain"
                onError={(e) => {
                  e.target.src = '/armor/ring/tier0_ring.png'; // Fallback image
                }}
              />
            </div>

            {/* Gear Info */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                {gearNames[gearType]}
              </h3>
              <p className={`text-lg font-semibold mb-2 ${getTierColor(currentTier)}`}>
                Tier {currentTier}
              </p>
              
              {/* Infusion Progress Bar */}
              {!isMaxTier && status.currentInfusionLevel !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Infusion Progress</span>
                    <span>{status.currentInfusionLevel}/{status.totalInfusionsNeeded}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-neon-green h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(status.currentInfusionLevel / status.totalInfusionsNeeded) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              {isMaxTier ? (
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                    MAX TIER
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current:</span>
                    <span className={getTierColor(currentTier)}>Tier {currentTier}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Next:</span>
                    <span className={getTierColor(currentTier + 1)}>Tier {isMaxTier ? 'MAX' : currentTier + 1}</span>
                  </div>
                  
                  <div className="mt-3">
                    {prerequisites.length > 0 ? (
                      <span className="inline-block px-3 py-1 bg-orange-600 text-white text-sm rounded-full">
                        {requirementsMessage}
                      </span>
                    ) : canUpgrade ? (
                      <span className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                        {requirementsMessage}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-yellow-600 text-white text-sm rounded-full">
                        {requirementsMessage}
                      </span>
                    )}
                  </div>

                  {/* Resource Requirements Preview */}
                  {!isMaxTier && status.resourceStatus && Object.keys(status.resourceStatus).length > 0 && prerequisites.length === 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <p className="text-xs text-gray-400 mb-2">Requirements:</p>
                      <div className="space-y-1">
                        {Object.entries(status.resourceStatus).map(([resourceType, resourceStatus]) => (
                          <div key={resourceType} className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">
                              {getResourceIcon(resourceType)} {formatResourceName(resourceType)}
                            </span>
                            <span className={`${resourceStatus.hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                              {resourceStatus.current}/{resourceStatus.required}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prerequisites Display */}
                  {prerequisites.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <p className="text-xs text-gray-400 mb-2">Prerequisites:</p>
                      <div className="space-y-1">
                        {prerequisites.map((prereq) => (
                          <div key={prereq} className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">
                              {gearNames[prereq]}
                            </span>
                            <span className="text-orange-400">
                              Tier {upgradeStatus[prereq]?.currentTier || 0} → {currentGearTier}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hover Effect */}
            {hoveredGear === gearType && !isMaxTier && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white font-semibold mb-2">Click to Upgrade</p>
                  <p className="text-gray-300 text-sm">View requirements and costs</p>
                </div>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default GearDisplay;
