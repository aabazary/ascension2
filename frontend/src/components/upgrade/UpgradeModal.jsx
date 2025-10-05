import { useState, useEffect } from 'react';

const UpgradeModal = ({ isOpen, onClose, gear, upgradeStatus, onUpgrade, loading }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeAnimation, setUpgradeAnimation] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsUpgrading(false);
      setUpgradeAnimation(false);
    }
  }, [isOpen]);

  if (!isOpen || !gear) return null;

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setUpgradeAnimation(true);
    
    try {
      const result = await onUpgrade(gear.type);
      
      if (result?.success) {
        // Keep animation running for a bit to show the upgrade effect
        setTimeout(() => {
          setUpgradeAnimation(false);
          setIsUpgrading(false);
        }, 1500);
      } else {
        setUpgradeAnimation(false);
        setIsUpgrading(false);
      }
    } catch (error) {
      setUpgradeAnimation(false);
      setIsUpgrading(false);
    }
  };

  const getGearImage = (gearType, tier) => {
    const imageMap = {
      ring: 'ring',
      cloak: 'robe',
      belt: 'belt'
    };
    
    const gearName = imageMap[gearType];
    return `/armor/${gearName}/tier${tier}_${gearName}.png`;
  };

  const getResourceIcon = (resourceType) => {
    const icons = {
      gathering: '✨',
      minion: '⚔️',
      boss: '👑'
    };
    return icons[resourceType] || '📦';
  };

  const getResourceColor = (hasEnough) => {
    return hasEnough ? 'text-green-400' : 'text-red-400';
  };

  const formatResourceName = (resourceType) => {
    return resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Upgrade {gear.type.charAt(0).toUpperCase() + gear.type.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            disabled={isUpgrading}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current and Target Tier Display */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* Current Tier */}
            <div className="text-center">
              <div className="relative">
                <img
                  src={getGearImage(gear.type, gear.currentTier)}
                  alt={`Current ${gear.type} Tier ${gear.currentTier}`}
                  className="w-20 h-20 object-contain mx-auto"
                  onError={(e) => {
                    e.target.src = '/armor/ring/tier0_ring.png';
                  }}
                />
                {upgradeAnimation && (
                  <div className="absolute inset-0 animate-pulse bg-yellow-400 rounded-full opacity-30"></div>
                )}
              </div>
              <p className="text-gray-400 mt-2">Current Tier {gear.currentTier}</p>
            </div>

            {/* Arrow */}
            <div className="text-3xl text-gray-400">→</div>

            {/* Target Tier */}
            <div className="text-center">
              <div className="relative">
                <img
                  src={getGearImage(gear.type, gear.targetTier)}
                  alt={`Target ${gear.type} Tier ${gear.targetTier}`}
                  className="w-20 h-20 object-contain mx-auto"
                  onError={(e) => {
                    e.target.src = '/armor/ring/tier0_ring.png';
                  }}
                />
                {upgradeAnimation && (
                  <div className="absolute inset-0 animate-bounce bg-green-400 rounded-full opacity-50"></div>
                )}
              </div>
              <p className="text-green-400 mt-2">Target Tier {gear.targetTier}</p>
            </div>
          </div>

          {/* Infusion Progress */}
          {gear.currentInfusionLevel !== undefined && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Infusion Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Current Infusion Level:</span>
                <span className="text-neon-green font-semibold">
                  {gear.currentInfusionLevel}/{gear.totalInfusionsNeeded}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div 
                  className="bg-neon-green h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(gear.currentInfusionLevel / gear.totalInfusionsNeeded) * 100}%` 
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {gear.totalInfusionsNeeded - gear.currentInfusionLevel} more infusions needed to reach Tier {gear.targetTier}
              </p>
            </div>
          )}

          {/* Upgrade Requirements */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upgrade Requirements</h3>
            
            <div className="space-y-3">
              {Object.entries(gear.resourceStatus || {}).map(([resourceType, status]) => (
                <div key={resourceType} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getResourceIcon(resourceType)}</span>
                    <span className="text-white">{formatResourceName(resourceType)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${getResourceColor(status.hasEnough)}`}>
                      {status.current} / {status.required}
                    </span>
                    {!status.hasEnough && (
                      <span className="text-red-400 text-sm">
                        (Need {status.needed} more)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Resource Breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-600">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Cost Breakdown:</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(gear.requiredResources || {}).map(([resourceType, amount]) => (
                  <div key={resourceType} className="flex justify-between">
                    <span className="text-gray-400">
                      {getResourceIcon(resourceType)} {formatResourceName(resourceType)}:
                    </span>
                    <span className="text-white">{amount} units</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Infusion Cost */}
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-white">Infusion Cost:</span>
                <span className="text-yellow-400 font-semibold">
                  {gear.infusionCost || gear.totalInfusionsNeeded} infusions
                </span>
              </div>
            </div>
          </div>

          {/* Upgrade Message */}
          <div className="mb-6">
            <p className={`text-center ${gear.canUpgrade ? 'text-green-400' : 'text-red-400'}`}>
              {gear.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              disabled={isUpgrading}
            >
              Cancel
            </button>
            
            <button
              onClick={handleUpgrade}
              disabled={!gear.canUpgrade || isUpgrading || loading}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                gear.canUpgrade && !isUpgrading && !loading
                  ? 'bg-neon-green text-black hover:bg-green-400 hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              } ${upgradeAnimation ? 'animate-pulse' : ''}`}
            >
              {isUpgrading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Infusing...
                </div>
              ) : (
                gear.currentInfusionLevel !== undefined && gear.currentInfusionLevel + 1 < gear.totalInfusionsNeeded
                  ? `Infuse (${gear.currentInfusionLevel + 1}/${gear.totalInfusionsNeeded})`
                  : `Upgrade to Tier ${gear.targetTier}`
              )}
            </button>
          </div>

          {/* Success Animation Overlay */}
          {upgradeAnimation && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-6xl mb-2">✨</div>
                <p className="text-2xl font-bold text-green-400">Upgrade Successful!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
