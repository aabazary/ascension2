import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Character from '../models/Character.js';
import bcrypt from 'bcryptjs';

describe('Upgrade System Tests', () => {
  let testUser;
  let testCharacter;
  let authToken;

  beforeEach(async () => {
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123'
    });
    await testUser.save();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword123'
      });
    
    // Extract token from cookie
    const cookies = loginResponse.headers['set-cookie'];
    const accessTokenCookie = cookies.find(cookie => cookie.startsWith('accessToken='));
    authToken = accessTokenCookie ? accessTokenCookie.split('=')[1].split(';')[0] : null;

    testCharacter = await Character.create({
      userId: testUser._id,
      name: 'TestMage'
    });
  });

  describe('GET /api/upgrade/info/:characterId/:equipmentType', () => {
    it('should get upgrade info for belt', async () => {
      const response = await request(app)
        .get(`/api/upgrade/info/${testCharacter._id}/belt`)
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.upgradeInfo).toBeDefined();
      expect(response.body.upgradeInfo.currentTier).toBe(0);
      expect(response.body.upgradeInfo.targetTier).toBe(1);
      expect(response.body.upgradeInfo.resourceStatus).toBeDefined();
    });

    it('should get upgrade info for cloak', async () => {
      const response = await request(app)
        .get(`/api/upgrade/info/${testCharacter._id}/cloak`)
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.upgradeInfo.resourceStatus.gathering).toBeDefined();
      expect(response.body.upgradeInfo.resourceStatus.minion).toBeDefined();
    });

    it('should get upgrade info for ring', async () => {
      const response = await request(app)
        .get(`/api/upgrade/info/${testCharacter._id}/ring`)
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.upgradeInfo.resourceStatus.gathering).toBeDefined();
      expect(response.body.upgradeInfo.resourceStatus.minion).toBeDefined();
      expect(response.body.upgradeInfo.resourceStatus.boss).toBeDefined();
    });

    it('should fail with invalid equipment type', async () => {
      const response = await request(app)
        .get(`/api/upgrade/info/${testCharacter._id}/invalid`)
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/upgrade/perform', () => {
    beforeEach(async () => {
      // Add sufficient resources for 10x requirements
      await testCharacter.addResource('gathering', 0, 100);
      await testCharacter.addResource('minion', 0, 50);
      await testCharacter.addResource('boss', 0, 30);
    });

    it('should upgrade belt with sufficient resources', async () => {
      const response = await request(app)
        .post('/api/upgrade/perform')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          characterId: testCharacter._id,
          equipmentType: 'belt'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.upgrade.newTier).toBe(1);
      expect(response.body.upgrade.resourcesUsed).toBeDefined();
    });

    it('should fail to upgrade with insufficient resources', async () => {
      // Remove all resources
      testCharacter.resources = [];
      await testCharacter.save();

      const response = await request(app)
        .post('/api/upgrade/perform')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          characterId: testCharacter._id,
          equipmentType: 'belt'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid equipment type', async () => {
      const response = await request(app)
        .post('/api/upgrade/perform')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          characterId: testCharacter._id,
          equipmentType: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/upgrade/status/:characterId', () => {
    it('should get character upgrade status', async () => {
      const response = await request(app)
        .get(`/api/upgrade/status/${testCharacter._id}`)
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.character).toBeDefined();
      expect(response.body.upgradeStatus).toBeDefined();
      expect(response.body.upgradeStatus.ring).toBeDefined();
      expect(response.body.upgradeStatus.cloak).toBeDefined();
      expect(response.body.upgradeStatus.belt).toBeDefined();
      expect(response.body.tierInfo).toBeDefined();
    });
  });

  describe('Upgrade Cost Analysis', () => {
    it('should analyze upgrade costs across all tiers', async () => {
      console.log('\n=== UPGRADE COST ANALYSIS ===');
      
      const { UPGRADE_CONFIG } = await import('../utils/upgradeConfig.js');
      
      for (let tier = 0; tier <= 4; tier++) {
        const infusionCost = UPGRADE_CONFIG.infusionCosts[tier];
        const resourceCosts = UPGRADE_CONFIG.resourceCosts[tier];
        
        console.log(`\nTier ${tier} -> ${tier + 1} (${infusionCost} infusions):`);
        console.log(`  Belt: ${resourceCosts.gathering * infusionCost} gathering resources`);
        console.log(`  Cloak: ${resourceCosts.gathering * infusionCost} gathering + ${resourceCosts.minion * infusionCost} minion resources`);
        console.log(`  Ring: ${resourceCosts.gathering * infusionCost} gathering + ${resourceCosts.minion * infusionCost} minion + ${resourceCosts.boss * infusionCost} boss resources`);
        
        // Calculate total resources needed for all equipment
        const totalGathering = resourceCosts.gathering * infusionCost * 3; // All 3 pieces need gathering
        const totalMinion = resourceCosts.minion * infusionCost * 2; // Cloak and ring need minion
        const totalBoss = resourceCosts.boss * infusionCost; // Only ring needs boss
        
        console.log(`  Total for all equipment: ${totalGathering} gathering + ${totalMinion} minion + ${totalBoss} boss resources`);
      }
    });
  });
});
