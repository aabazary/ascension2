import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Character from '../models/Character.js';
import bcrypt from 'bcryptjs';

describe('Gathering System Tests', () => {
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

  describe('POST /api/gathering/perform', () => {
    it('should perform successful gathering attempt', async () => {
      const gatheringAttempt = {
        timeSpent: 15000,
        buttonClicks: [
          { clicked: true, clickTime: 1000 },
          { clicked: true, clickTime: 3000 },
          { clicked: true, clickTime: 5000 },
          { clicked: false, clickTime: null },
          { clicked: true, clickTime: 9000 }
        ],
        startTime: Date.now() - 15000,
        endTime: Date.now()
      };

      const response = await request(app)
        .post('/api/gathering/perform')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          characterId: testCharacter._id,
          tier: 0,
          gatheringAttempt
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.resourcesGained).toBeGreaterThan(0);
      expect(response.body.character.resources).toBeDefined();
    });

    it('should fail with insufficient successful clicks', async () => {
      const gatheringAttempt = {
        timeSpent: 15000,
        buttonClicks: [
          { clicked: true, clickTime: 1000 },
          { clicked: false, clickTime: null },
          { clicked: false, clickTime: null },
          { clicked: false, clickTime: null },
          { clicked: false, clickTime: null }
        ],
        startTime: Date.now() - 15000,
        endTime: Date.now()
      };

      const response = await request(app)
        .post('/api/gathering/perform')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          characterId: testCharacter._id,
          tier: 0,
          gatheringAttempt
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid character ID', async () => {
      const gatheringAttempt = {
        timeSpent: 15000,
        buttonClicks: [
          { clicked: true, clickTime: 1000 },
          { clicked: true, clickTime: 3000 },
          { clicked: true, clickTime: 5000 }
        ],
        startTime: Date.now() - 15000,
        endTime: Date.now()
      };

      const response = await request(app)
        .post('/api/gathering/perform')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          characterId: 'invalid-id',
          tier: 0,
          gatheringAttempt
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/gathering/config', () => {
    it('should return gathering configuration', async () => {
      const response = await request(app)
        .get('/api/gathering/config');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.config.tiers).toBeDefined();
      expect(response.body.config.tiers[0]).toBeDefined();
    });
  });

  describe('Gathering Success Rate Analysis', () => {
    it('should analyze gathering success rates across tiers', async () => {
      console.log('\n=== GATHERING SUCCESS RATE ANALYSIS ===');
      
      const { GATHERING_CONFIG } = await import('../utils/gatheringConfig.js');
      
      for (let tier = 0; tier <= 5; tier++) {
        const config = GATHERING_CONFIG.tiers[tier];
        const successThreshold = config.successThreshold;
        const totalButtons = config.totalButtons;
        const requiredClicks = Math.ceil(totalButtons * successThreshold);
        
        console.log(`Tier ${tier}: ${totalButtons} buttons, need ${requiredClicks} successful clicks (${(successThreshold * 100).toFixed(1)}% success rate)`);
        console.log(`  Time: ${config.totalTime}ms, Button Window: ${config.buttonWindow}ms`);
        console.log(`  Resource Reward: ${config.resourceRewards.min}-${config.resourceRewards.max} resources`);
      }
    });
  });
});
