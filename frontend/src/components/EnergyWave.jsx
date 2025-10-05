import React, { useState, useEffect } from 'react';

const EnergyWave = ({ element, position, direction, isActive, projectileId = 0 }) => {
  const [scale, setScale] = useState(0.2);
  const [opacity, setOpacity] = useState(0.4);
  
  // Get the impact image for the element
  const getSpellImage = (element) => {
    const elementImages = {
      fire: '/spells/fire/fire_impact.png',
      water: '/spells/water/water_impact.png',
      earth: '/spells/earth/earth_impact.png',
      lightning: '/spells/lightning/lightning_impact.png',
      ice: '/spells/ice/ice_impact.png',
      shadow: '/spells/shadow/shadow_impact.png'
    };
    
    return elementImages[element] || elementImages.fire;
  };

  // Get element-specific colors
  const getElementColors = (element) => {
    const colorMap = {
      fire: { glow: '#ff6b35', shadow: '#ff0000', particle: '#ff8c42' },
      water: { glow: '#42a5f5', shadow: '#1976d2', particle: '#64b5f6' },
      earth: { glow: '#ffb74d', shadow: '#f57c00', particle: '#ffcc02' },
      lightning: { glow: '#ffeb3b', shadow: '#fbc02d', particle: '#fff176' },
      ice: { glow: '#81d4fa', shadow: '#29b6f6', particle: '#b3e5fc' },
      shadow: { glow: '#ba68c8', shadow: '#8e24aa', particle: '#ce93d8' }
    };
    
    return colorMap[element] || colorMap.fire;
  };

  // Simple scaling animation
  useEffect(() => {
    if (!isActive) {
      setScale(0.2);
      setOpacity(0.4);
      return;
    }
    
    // Start small
    setScale(0.2);
    setOpacity(0.4);
    
    // Grow to medium
    const mediumTimeout = setTimeout(() => {
      setScale(0.6);
      setOpacity(0.8);
    }, 300);
    
    // Grow to large
    const largeTimeout = setTimeout(() => {
      setScale(6.0); // 4 times larger than 1.5
      setOpacity(1.0);
    }, 600);
    
    return () => {
      clearTimeout(mediumTimeout);
      clearTimeout(largeTimeout);
    };
  }, [isActive]);

  if (!isActive) return null;

  const colors = getElementColors(element);
  const shouldFlip = direction === 'left';
  const sizeVariation = 0.8 + (projectileId * 0.1);

  return (
    <div 
      className="absolute top-1/2 z-20"
      style={{ 
        left: `${position}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-70 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${colors.glow}80 0%, transparent 70%)`,
          transform: 'scale(2.5)',
          filter: 'blur(20px)'
        }}
      />
      
      {/* Main spell image */}
      <img 
        src={getSpellImage(element)}
        alt={`${element} Spell`}
        className="w-16 h-16 object-contain relative z-10"
        style={{
          transform: `${shouldFlip ? 'scaleX(-1)' : 'scaleX(1)'} scale(${scale * sizeVariation})`,
          opacity: opacity,
          filter: `brightness(1.4) saturate(1.8) drop-shadow(0 0 20px ${colors.glow})`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
      
      {/* Energy particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 rounded-full animate-ping"
            style={{
              backgroundColor: colors.particle,
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i * 6)}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnergyWave;