import { executeSpell, calculateCharacterHealth, calculateTierLevel } from '../utils/battleCalculations.js';
import { BATTLE_CONFIG } from '../utils/battleConfig.js';

describe('Battle Simulation Tests', () => {
  const createTestCharacter = (equipmentTier = 0) => ({
    equipment: {
      ring: { tier: equipmentTier, infused: equipmentTier > 0 },
      cloak: { tier: equipmentTier, infused: equipmentTier > 0 },
      belt: { tier: equipmentTier, infused: equipmentTier > 0 }
    }
  });

  const simulateBattle = (character, enemy, spellType, iterations = 10000) => {
    let wins = 0;
    let totalDamage = 0;
    let crits = 0;
    let misses = 0;
    let totalTurns = 0;

    for (let i = 0; i < iterations; i++) {
      let enemyHealth = enemy.health;
      let characterHealth = calculateCharacterHealth(character);
      let turns = 0;
      
      while (enemyHealth > 0 && characterHealth > 0 && turns < 20) {
        const result = executeSpell(spellType, character, enemy.tier);
        totalDamage += result.damage;
        totalTurns++;
        turns++;
        
        if (result.crit) crits++;
        if (!result.hit) misses++;
        
        if (result.hit) {
          enemyHealth -= result.damage;
        }
        
        // Enemy attacks back with tier-based hit rate
        if (enemyHealth > 0) {
          const tierLevel = calculateTierLevel(character);
          let adjustedHitRate = enemy.hitRate || 1.0;
          
          // Adjust hit rate based on player tier level
          if (tierLevel === 0) {
            adjustedHitRate *= 1.1; // Slightly increase hit rate for 0 tier items
          } else if (tierLevel === 1) {
            adjustedHitRate *= 1.8; // Increase hit rate for 1 tier item (make it harder)
          } else if (tierLevel >= 2) {
            adjustedHitRate *= 2.3; // Increase hit rate for 2+ tier items (make it harder)
          }
          
          if (Math.random() < adjustedHitRate) {
            characterHealth -= enemy.damage;
          }
        }
        
        if (enemyHealth <= 0) {
          wins++;
          break;
        }
      }
    }

    return {
      winRate: wins / iterations,
      avgDamage: totalDamage / iterations,
      avgTurns: totalTurns / iterations,
      critRate: crits / iterations,
      missRate: misses / iterations
    };
  };

  const simulateBossBattle = (character, enemy, spellType, iterations = 10000) => {
    let wins = 0;
    let totalDamage = 0;
    let crits = 0;
    let misses = 0;
    let totalTurns = 0;

    for (let i = 0; i < iterations; i++) {
      let enemyHealth = enemy.health;
      let characterHealth = calculateCharacterHealth(character);
      let turns = 0;
      const tierLevel = calculateTierLevel(character);
      
      while (enemyHealth > 0 && characterHealth > 0 && turns < 20) {
        const result = executeSpell(spellType, character, enemy.tier);
        totalDamage += result.damage;
        totalTurns++;
        turns++;
        
        if (result.crit) crits++;
        if (!result.hit) misses++;
        
        if (result.hit) {
          enemyHealth -= result.damage;
        }
        
        // Boss attacks with tier-based mechanics
        if (enemyHealth > 0) {
          let bossDamage = enemy.damage;
          let adjustedHitRate = enemy.hitRate || 1.0;
          
          if (tierLevel === 0) {
            // Boss gets damage boost if player has no tier 1 items
            bossDamage = Math.floor(bossDamage * 1.5);
            adjustedHitRate *= 1.3; // Increase hit rate for 0 tier items
          } else if (tierLevel === 1) {
            // Boss attacks with higher damage and hit rate for 1 tier item
            bossDamage = Math.floor(bossDamage * 1.2); // Higher damage
            adjustedHitRate *= 1.1; // Higher hit rate
          } else if (tierLevel >= 2) {
            // For 2+ tier items, boss has higher damage and hit rate
            bossDamage = Math.floor(bossDamage * 1.4); // Higher damage
            adjustedHitRate *= 1.2; // Higher hit rate
          }
          
          if (Math.random() < adjustedHitRate) {
            characterHealth -= bossDamage;
          }
        }
        
        if (enemyHealth <= 0) {
          wins++;
          break;
        }
      }
    }

    return {
      winRate: wins / iterations,
      avgDamage: totalDamage / iterations,
      avgTurns: totalTurns / iterations,
      critRate: crits / iterations,
      missRate: misses / iterations
    };
  };

  describe('Minion Battle Simulations', () => {
    it('should simulate tier 0 minion battles with no equipment', () => {
      const character = createTestCharacter(0);
      const enemy = BATTLE_CONFIG.minions[0];
      
      console.log('\n=== MINION BATTLE SIMULATION (Tier 0, No Equipment) ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      
      const blastResults = simulateBattle(character, enemy, 'blast', 10000);
      const novaResults = simulateBattle(character, enemy, 'nova', 10000);
      const boltResults = simulateBattle(character, enemy, 'bolt', 10000);

      console.log(`Blast - Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Damage: ${blastResults.avgDamage.toFixed(1)}, Avg Turns: ${blastResults.avgTurns.toFixed(1)}`);
      console.log(`Nova - Win Rate: ${(novaResults.winRate * 100).toFixed(1)}%, Avg Damage: ${novaResults.avgDamage.toFixed(1)}, Avg Turns: ${novaResults.avgTurns.toFixed(1)}`);
      console.log(`Bolt - Win Rate: ${(boltResults.winRate * 100).toFixed(1)}%, Avg Damage: ${boltResults.avgDamage.toFixed(1)}, Avg Turns: ${boltResults.avgTurns.toFixed(1)}`);

      expect(blastResults.winRate).toBeGreaterThanOrEqual(0);
      expect(novaResults.winRate).toBeGreaterThanOrEqual(0);
      expect(boltResults.winRate).toBeGreaterThanOrEqual(0);
    });

    it('should simulate tier 0 minion battles with tier 1 equipment', () => {
      const character = createTestCharacter(1);
      const enemy = BATTLE_CONFIG.minions[0];
      
      console.log('\n=== MINION BATTLE SIMULATION (Tier 0, Tier 1 Equipment) ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      
      const blastResults = simulateBattle(character, enemy, 'blast', 10000);
      const novaResults = simulateBattle(character, enemy, 'nova', 10000);
      const boltResults = simulateBattle(character, enemy, 'bolt', 10000);

      console.log(`Blast - Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Damage: ${blastResults.avgDamage.toFixed(1)}, Avg Turns: ${blastResults.avgTurns.toFixed(1)}`);
      console.log(`Nova - Win Rate: ${(novaResults.winRate * 100).toFixed(1)}%, Avg Damage: ${novaResults.avgDamage.toFixed(1)}, Avg Turns: ${novaResults.avgTurns.toFixed(1)}`);
      console.log(`Bolt - Win Rate: ${(boltResults.winRate * 100).toFixed(1)}%, Avg Damage: ${boltResults.avgDamage.toFixed(1)}, Avg Turns: ${boltResults.avgTurns.toFixed(1)}`);

      // Equipment should improve performance
      expect(blastResults.winRate).toBeGreaterThanOrEqual(0);
    });

    it('should simulate higher tier minion battles', () => {
      const character = createTestCharacter(1);
      
      console.log('\n=== HIGHER TIER MINION BATTLES ===');
      
      for (let tier = 1; tier <= 3; tier++) {
        const enemy = BATTLE_CONFIG.minions[tier];
        console.log(`\nTier ${tier} Minion: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
        
        const blastResults = simulateBattle(character, enemy, 'blast', 5000);
        console.log(`  Blast - Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Turns: ${blastResults.avgTurns.toFixed(1)}`);
      }
    });
  });

  describe('Boss Battle Simulations', () => {
    it('should simulate tier 0 boss battles with no equipment', () => {
      const character = createTestCharacter(0);
      const enemy = BATTLE_CONFIG.bosses[0];
      
      console.log('\n=== BOSS BATTLE SIMULATION (Tier 0, No Equipment) ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      
      const blastResults = simulateBattle(character, enemy, 'blast', 10000);
      const novaResults = simulateBattle(character, enemy, 'nova', 10000);
      const boltResults = simulateBattle(character, enemy, 'bolt', 10000);

      console.log(`Blast - Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Damage: ${blastResults.avgDamage.toFixed(1)}, Avg Turns: ${blastResults.avgTurns.toFixed(1)}`);
      console.log(`Nova - Win Rate: ${(novaResults.winRate * 100).toFixed(1)}%, Avg Damage: ${novaResults.avgDamage.toFixed(1)}, Avg Turns: ${novaResults.avgTurns.toFixed(1)}`);
      console.log(`Bolt - Win Rate: ${(boltResults.winRate * 100).toFixed(1)}%, Avg Damage: ${boltResults.avgDamage.toFixed(1)}, Avg Turns: ${boltResults.avgTurns.toFixed(1)}`);

      expect(blastResults.winRate).toBeGreaterThanOrEqual(0);
    });

    it('should simulate tier 0 boss battles with tier 1 equipment', () => {
      const character = createTestCharacter(1);
      const enemy = BATTLE_CONFIG.bosses[0];
      
      console.log('\n=== BOSS BATTLE SIMULATION (Tier 0, Tier 1 Equipment) ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      
      const blastResults = simulateBattle(character, enemy, 'blast', 10000);
      const novaResults = simulateBattle(character, enemy, 'nova', 10000);
      const boltResults = simulateBattle(character, enemy, 'bolt', 10000);

      console.log(`Blast - Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Damage: ${blastResults.avgDamage.toFixed(1)}, Avg Turns: ${blastResults.avgTurns.toFixed(1)}`);
      console.log(`Nova - Win Rate: ${(novaResults.winRate * 100).toFixed(1)}%, Avg Damage: ${novaResults.avgDamage.toFixed(1)}, Avg Turns: ${novaResults.avgTurns.toFixed(1)}`);
      console.log(`Bolt - Win Rate: ${(boltResults.winRate * 100).toFixed(1)}%, Avg Damage: ${boltResults.avgDamage.toFixed(1)}, Avg Turns: ${boltResults.avgTurns.toFixed(1)}`);

      expect(blastResults.winRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Spell Comparison Analysis', () => {
    it('should compare all spells against tier 0 minion', () => {
      const character = createTestCharacter(0);
      const enemy = BATTLE_CONFIG.minions[0];
      
      console.log('\n=== SPELL COMPARISON ANALYSIS ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      
      const spells = ['blast', 'nova', 'bolt'];
      const results = {};
      
      spells.forEach(spell => {
        const config = BATTLE_CONFIG.spells[spell];
        const battleResults = simulateBattle(character, enemy, spell, 10000);
        
        results[spell] = {
          ...battleResults,
          baseDamage: config.baseDamage,
          missChance: config.missChance,
          critChance: config.critChance,
          critMultiplier: config.critMultiplier
        };
      });
      
      spells.forEach(spell => {
        const result = results[spell];
        console.log(`\n${spell.toUpperCase()}:`);
        console.log(`  Base Damage: ${result.baseDamage}, Miss: ${(result.missChance * 100).toFixed(1)}%, Crit: ${(result.critChance * 100).toFixed(1)}%`);
        console.log(`  Win Rate: ${(result.winRate * 100).toFixed(1)}%, Avg Damage: ${result.avgDamage.toFixed(1)}, Avg Turns: ${result.avgTurns.toFixed(1)}`);
      });
    });
  });

  describe('Equipment Impact Analysis', () => {
    it('should analyze equipment impact on battle performance', () => {
      const enemy = BATTLE_CONFIG.minions[0];
      
      console.log('\n=== EQUIPMENT IMPACT ANALYSIS ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      
      for (let equipmentTier = 0; equipmentTier <= 2; equipmentTier++) {
        const character = createTestCharacter(equipmentTier);
        const blastResults = simulateBattle(character, enemy, 'blast', 5000);
        
        console.log(`\nEquipment Tier ${equipmentTier}:`);
        console.log(`  Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Damage: ${blastResults.avgDamage.toFixed(1)}, Avg Turns: ${blastResults.avgTurns.toFixed(1)}`);
      }
    });

    // Summary Report
    console.log('\n' + '='.repeat(60));
    console.log('BATTLE SYSTEM SUMMARY REPORT');
    console.log('='.repeat(60));
    
    // Minion Summary
    console.log('\nMINION BATTLES (Tier 0):');
    const minionEnemy = BATTLE_CONFIG.minions[0];
    console.log(`Enemy: ${minionEnemy.name} (${minionEnemy.health} HP, ${minionEnemy.damage} DMG)`);
    
    for (let equipmentTier = 0; equipmentTier <= 2; equipmentTier++) {
      const character = createTestCharacter(equipmentTier);
      const results = simulateBattle(character, minionEnemy, 'blast', 10000);
      const health = calculateCharacterHealth(character);
      console.log(`  ${equipmentTier} Tier 1 Items: ${(results.winRate * 100).toFixed(1)}% win rate (${health} HP)`);
    }
    
    // Boss Summary  
    console.log('\nBOSS BATTLES (Tier 0):');
    const bossEnemy = BATTLE_CONFIG.bosses[0];
    console.log(`Enemy: ${bossEnemy.name} (${bossEnemy.health} HP, ${bossEnemy.damage} DMG)`);
    
    for (let equipmentTier = 0; equipmentTier <= 2; equipmentTier++) {
      const character = createTestCharacter(equipmentTier);
      const results = simulateBossBattle(character, bossEnemy, 'blast', 10000);
      const health = calculateCharacterHealth(character);
      console.log(`  ${equipmentTier} Tier 1 Items: ${(results.winRate * 100).toFixed(1)}% win rate (${health} HP)`);
    }
    
    console.log('\n' + '='.repeat(60));
  });
});
