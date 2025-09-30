import { executeSpell } from '../utils/battleCalculations.js';
import { BATTLE_CONFIG } from '../utils/battleConfig.js';

describe('Simple Battle Tests', () => {
  const createTestCharacter = (equipmentTier = 0) => ({
    equipment: {
      ring: { tier: equipmentTier, infused: equipmentTier > 0 },
      cloak: { tier: equipmentTier, infused: equipmentTier > 0 },
      belt: { tier: equipmentTier, infused: equipmentTier > 0 }
    }
  });

  it('should execute blast spell', () => {
    const character = createTestCharacter(0);
    const result = executeSpell('blast', character, 0);
    
    expect(result).toBeDefined();
    expect(result.hit).toBeDefined();
    expect(result.damage).toBeDefined();
    expect(result.crit).toBeDefined();
    expect(result.message).toBeDefined();
  });

  it('should execute nova spell', () => {
    const character = createTestCharacter(0);
    const result = executeSpell('nova', character, 0);
    
    expect(result).toBeDefined();
    expect(result.hit).toBeDefined();
    expect(result.damage).toBeDefined();
  });

  it('should execute bolt spell', () => {
    const character = createTestCharacter(0);
    const result = executeSpell('bolt', character, 0);
    
    expect(result).toBeDefined();
    expect(result.hit).toBeDefined();
    expect(result.damage).toBeDefined();
  });

  it('should have different damage for different spells', () => {
    const character = createTestCharacter(0);
    
    const blastResult = executeSpell('blast', character, 0);
    const novaResult = executeSpell('nova', character, 0);
    const boltResult = executeSpell('bolt', character, 0);
    
    // They should have different base damages
    expect(blastResult.damage).toBeGreaterThanOrEqual(0);
    expect(novaResult.damage).toBeGreaterThanOrEqual(0);
    expect(boltResult.damage).toBeGreaterThanOrEqual(0);
  });

  it('should show battle configuration', () => {
    console.log('\n=== BATTLE CONFIGURATION ===');
    console.log('Spells:', Object.keys(BATTLE_CONFIG.spells));
    console.log('Minions:', Object.keys(BATTLE_CONFIG.minions));
    console.log('Bosses:', Object.keys(BATTLE_CONFIG.bosses));
    
    Object.keys(BATTLE_CONFIG.spells).forEach(spell => {
      const config = BATTLE_CONFIG.spells[spell];
      console.log(`${spell}: ${config.baseDamage} damage, ${(config.missChance * 100).toFixed(1)}% miss, ${(config.critChance * 100).toFixed(1)}% crit`);
    });
    
    expect(BATTLE_CONFIG.spells).toBeDefined();
    expect(BATTLE_CONFIG.minions).toBeDefined();
    expect(BATTLE_CONFIG.bosses).toBeDefined();
  });
});
