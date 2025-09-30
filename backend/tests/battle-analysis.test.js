import { executeSpell, calculateCharacterHealth, calculateTierLevel } from '../utils/battleCalculations.js';
import { BATTLE_CONFIG } from '../utils/battleConfig.js';
import { UPGRADE_CONFIG } from '../utils/upgradeConfig.js';

describe('Battle Success Rate Analysis', () => {
          const createTestCharacter = (tierItems = 0) => {
            const equipment = {
              ring: { tier: tierItems > 0 ? 1 : 0, infused: tierItems > 0 },
              cloak: { tier: tierItems > 1 ? 1 : 0, infused: tierItems > 1 },
              belt: { tier: tierItems > 2 ? 1 : 0, infused: tierItems > 2 }
            };
            return { equipment };
          };

  const simulateBattle = (character, enemy, spellType, iterations = 10000) => {
    let wins = 0;
    let totalDamage = 0;
    let crits = 0;
    let misses = 0;
    let totalTurns = 0;
    const tierLevel = calculateTierLevel(character);

    for (let i = 0; i < iterations; i++) {
      let enemyHealth = enemy.health;
      let characterHealth = calculateCharacterHealth(character);
      let turns = 0;

      while (enemyHealth > 0 && characterHealth > 0 && turns < 20) {
        const result = executeSpell(spellType, character, 0); // Tier 0 for now
        totalDamage += result.damage;
        totalTurns++;
        turns++;

        if (result.crit) crits++;
        if (!result.hit) misses++;

        // Player attacks first
        if (result.hit) {
          enemyHealth -= result.damage;
        }

        // Check if enemy defeated
        if (enemyHealth <= 0) {
          wins++;
          break;
        }

        // Enemy attacks back
        let enemyDamage = enemy.damage;
        
        // Boss special mechanics
        if (enemy.name.includes('Dragon')) {
          if (tierLevel === 0) {
            enemyDamage = Math.floor(enemyDamage * 1.3); // 30% damage boost
          } else if (tierLevel === 1) {
            // Boss attacks normally with 1 tier item
            enemyDamage = enemyDamage;
          } else if (tierLevel >= 2) {
            // Boss has 20% miss chance with 2+ tier items
            const bossMissChance = 0.2;
            if (Math.random() < bossMissChance) {
              enemyDamage = 0; // Boss misses
            }
          }
        }
        
        characterHealth -= enemyDamage;
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

  describe('Minion Battle Analysis', () => {
    it('should analyze tier 0 minion battles with no equipment', async () => {
      const character = createTestCharacter(0);
      const enemy = BATTLE_CONFIG.minions[0];
      
      const blastResults = simulateBattle(character, enemy, 'blast', 10000);
      const novaResults = simulateBattle(character, enemy, 'nova', 10000);
      const boltResults = simulateBattle(character, enemy, 'bolt', 10000);

      console.log('\n=== TIER 0 MINION BATTLES (No Tier 1 Items) ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      console.log(`Character: ${calculateCharacterHealth(character)} HP`);
      console.log(`Blast - Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Damage: ${blastResults.avgDamage.toFixed(1)}, Avg Turns: ${blastResults.avgTurns.toFixed(1)}`);
      console.log(`Nova - Win Rate: ${(novaResults.winRate * 100).toFixed(1)}%, Avg Damage: ${novaResults.avgDamage.toFixed(1)}, Avg Turns: ${novaResults.avgTurns.toFixed(1)}`);
      console.log(`Bolt - Win Rate: ${(boltResults.winRate * 100).toFixed(1)}%, Avg Damage: ${boltResults.avgDamage.toFixed(1)}, Avg Turns: ${boltResults.avgTurns.toFixed(1)}`);

      expect(blastResults.winRate).toBeGreaterThanOrEqual(0);
      expect(novaResults.winRate).toBeGreaterThanOrEqual(0);
      expect(boltResults.winRate).toBeGreaterThanOrEqual(0);
    });

    it('should analyze tier 0 minion battles with tier 1 equipment', async () => {
      const character = createTestCharacter(1);
      const enemy = BATTLE_CONFIG.minions[0];
      
      const blastResults = simulateBattle(character, enemy, 'blast', 10000);
      const novaResults = simulateBattle(character, enemy, 'nova', 10000);
      const boltResults = simulateBattle(character, enemy, 'bolt', 10000);

      console.log('\n=== TIER 0 MINION BATTLES (1 Tier 1 Item) ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      console.log(`Character: ${calculateCharacterHealth(character)} HP`);
      console.log(`Blast - Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Damage: ${blastResults.avgDamage.toFixed(1)}, Avg Turns: ${blastResults.avgTurns.toFixed(1)}`);
      console.log(`Nova - Win Rate: ${(novaResults.winRate * 100).toFixed(1)}%, Avg Damage: ${novaResults.avgDamage.toFixed(1)}, Avg Turns: ${novaResults.avgTurns.toFixed(1)}`);
      console.log(`Bolt - Win Rate: ${(boltResults.winRate * 100).toFixed(1)}%, Avg Damage: ${boltResults.avgDamage.toFixed(1)}, Avg Turns: ${boltResults.avgTurns.toFixed(1)}`);

      expect(blastResults.winRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Boss Battle Analysis', () => {
    it('should analyze tier 0 boss battles with no equipment', async () => {
      const character = createTestCharacter(0);
      const enemy = BATTLE_CONFIG.bosses[0];
      
      const blastResults = simulateBattle(character, enemy, 'blast', 10000);
      const novaResults = simulateBattle(character, enemy, 'nova', 10000);
      const boltResults = simulateBattle(character, enemy, 'bolt', 10000);

      console.log('\n=== TIER 0 BOSS BATTLES (No Equipment) ===');
      console.log(`Enemy: ${enemy.name} (${enemy.health} HP, ${enemy.damage} DMG)`);
      console.log(`Blast - Win Rate: ${(blastResults.winRate * 100).toFixed(1)}%, Avg Damage: ${blastResults.avgDamage.toFixed(1)}, Crit Rate: ${(blastResults.critRate * 100).toFixed(1)}%`);
      console.log(`Nova - Win Rate: ${(novaResults.winRate * 100).toFixed(1)}%, Avg Damage: ${novaResults.avgDamage.toFixed(1)}, Crit Rate: ${(novaResults.critRate * 100).toFixed(1)}%`);
      console.log(`Bolt - Win Rate: ${(boltResults.winRate * 100).toFixed(1)}%, Avg Damage: ${boltResults.avgDamage.toFixed(1)}, Crit Rate: ${(boltResults.critRate * 100).toFixed(1)}%`);

      expect(blastResults.winRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Equipment Upgrade Analysis', () => {
    it('should calculate battles needed for tier 0 to tier 1 upgrade', () => {
      console.log('\n=== EQUIPMENT UPGRADE ANALYSIS ===');
      
      // Belt upgrade (gathering only)
      const beltCost = UPGRADE_CONFIG.resourceCosts[0].gathering * UPGRADE_CONFIG.infusionCosts[0];
      console.log(`Belt (Tier 0->1): Needs ${beltCost} gathering resources`);
      
      // Cloak upgrade (gathering + minion)
      const cloakGatheringCost = UPGRADE_CONFIG.resourceCosts[0].gathering * UPGRADE_CONFIG.infusionCosts[0];
      const cloakMinionCost = UPGRADE_CONFIG.resourceCosts[0].minion * UPGRADE_CONFIG.infusionCosts[0];
      console.log(`Cloak (Tier 0->1): Needs ${cloakGatheringCost} gathering + ${cloakMinionCost} minion resources`);
      
      // Ring upgrade (all resources)
      const ringGatheringCost = UPGRADE_CONFIG.resourceCosts[0].gathering * UPGRADE_CONFIG.infusionCosts[0];
      const ringMinionCost = UPGRADE_CONFIG.resourceCosts[0].minion * UPGRADE_CONFIG.infusionCosts[0];
      const ringBossCost = UPGRADE_CONFIG.resourceCosts[0].boss * UPGRADE_CONFIG.infusionCosts[0];
      console.log(`Ring (Tier 0->1): Needs ${ringGatheringCost} gathering + ${ringMinionCost} minion + ${ringBossCost} boss resources`);

      expect(beltCost).toBeGreaterThan(0);
      expect(cloakGatheringCost).toBeGreaterThan(0);
      expect(ringBossCost).toBeGreaterThan(0);
    });

    it('should calculate battles needed for higher tier upgrades', () => {
      console.log('\n=== HIGHER TIER UPGRADE ANALYSIS ===');
      
      for (let tier = 1; tier <= 4; tier++) {
        const infusionCost = UPGRADE_CONFIG.infusionCosts[tier];
        const resourceCosts = UPGRADE_CONFIG.resourceCosts[tier];
        
        console.log(`\nTier ${tier} -> ${tier + 1} (${infusionCost} infusions needed):`);
        console.log(`  Belt: ${resourceCosts.gathering * infusionCost} gathering resources`);
        console.log(`  Cloak: ${resourceCosts.gathering * infusionCost} gathering + ${resourceCosts.minion * infusionCost} minion resources`);
        console.log(`  Ring: ${resourceCosts.gathering * infusionCost} gathering + ${resourceCosts.minion * infusionCost} minion + ${resourceCosts.boss * infusionCost} boss resources`);
      }
    });
  });

  describe('Progression Time Analysis', () => {
    it('should estimate time to complete tier 0 to tier 1', () => {
      console.log('\n=== PROGRESSION TIME ESTIMATION ===');
      
      // Assuming average success rates
      const gatheringSuccessRate = 0.5; // 50% success rate
      const minionSuccessRate = 0.2; // 20% success rate  
      const bossSuccessRate = 0.1; // 10% success rate
      
      // Average resources per successful attempt
      const avgGatheringResources = 4; // Average from 1-8 range
      const avgMinionResources = 3; // Average from 1-5 range
      const avgBossResources = 2; // Average from 1-3 range
      
      // Calculate attempts needed
      const beltGatheringAttempts = Math.ceil(UPGRADE_CONFIG.resourceCosts[0].gathering / (avgGatheringResources * gatheringSuccessRate));
      const cloakGatheringAttempts = Math.ceil(UPGRADE_CONFIG.resourceCosts[0].gathering / (avgGatheringResources * gatheringSuccessRate));
      const cloakMinionAttempts = Math.ceil(UPGRADE_CONFIG.resourceCosts[0].minion / (avgMinionResources * minionSuccessRate));
      const ringGatheringAttempts = Math.ceil(UPGRADE_CONFIG.resourceCosts[0].gathering / (avgGatheringResources * gatheringSuccessRate));
      const ringMinionAttempts = Math.ceil(UPGRADE_CONFIG.resourceCosts[0].minion / (avgMinionResources * minionSuccessRate));
      const ringBossAttempts = Math.ceil(UPGRADE_CONFIG.resourceCosts[0].boss / (avgBossResources * bossSuccessRate));
      
      console.log(`Estimated attempts needed for Tier 0 -> 1:`);
      console.log(`  Belt: ${beltGatheringAttempts} gathering attempts`);
      console.log(`  Cloak: ${cloakGatheringAttempts} gathering + ${cloakMinionAttempts} minion attempts`);
      console.log(`  Ring: ${ringGatheringAttempts} gathering + ${ringMinionAttempts} minion + ${ringBossAttempts} boss attempts`);
      
      const totalAttempts = Math.max(beltGatheringAttempts, cloakGatheringAttempts + cloakMinionAttempts, ringGatheringAttempts + ringMinionAttempts + ringBossAttempts);
      console.log(`\nTotal estimated attempts: ${totalAttempts}`);
      
      expect(totalAttempts).toBeGreaterThan(0);
    });
  });
});
