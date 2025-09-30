import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Character from '../models/Character.js';
import bcrypt from 'bcryptjs';

describe('Character Endpoints', () => {
  let testUser;
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
  });

  describe('POST /api/characters', () => {
    it('should create a new character', async () => {
      const response = await request(app)
        .post('/api/characters')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          name: 'TestMage'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.character.name).toBe('TestMage');
      expect(response.body.character.equipment).toBeDefined();
    });

    it('should fail with duplicate character name', async () => {
      await request(app)
        .post('/api/characters')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          name: 'TestMage'
        });

      const response = await request(app)
        .post('/api/characters')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          name: 'TestMage'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid character name', async () => {
      const response = await request(app)
        .post('/api/characters')
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          name: 'a'.repeat(25)
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/characters', () => {
    it('should get user characters', async () => {
      await Character.create({
        userId: testUser._id,
        name: 'TestMage1'
      });

      await Character.create({
        userId: testUser._id,
        name: 'TestMage2'
      });

      const response = await request(app)
        .get('/api/characters')
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.characters).toHaveLength(2);
    });
  });

  describe('GET /api/characters/:id', () => {
    it('should get specific character', async () => {
      const character = await Character.create({
        userId: testUser._id,
        name: 'TestMage'
      });

      const response = await request(app)
        .get(`/api/characters/${character._id}`)
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.character.name).toBe('TestMage');
    });

    it('should fail with invalid character ID', async () => {
      const response = await request(app)
        .get('/api/characters/invalid-id')
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/characters/:id', () => {
    it('should update character', async () => {
      const character = await Character.create({
        userId: testUser._id,
        name: 'TestMage'
      });

      const response = await request(app)
        .put(`/api/characters/${character._id}`)
        .set('Cookie', `accessToken=${authToken}`)
        .send({
          name: 'UpdatedMage'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.character.name).toBe('UpdatedMage');
    });
  });

  describe('DELETE /api/characters/:id', () => {
    it('should delete character', async () => {
      const character = await Character.create({
        userId: testUser._id,
        name: 'TestMage'
      });

      const response = await request(app)
        .delete(`/api/characters/${character._id}`)
        .set('Cookie', `accessToken=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
