import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

describe('Authentication Endpoints', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Clean up any existing users
    await User.deleteMany({});
    
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123'
    });
    await testUser.save();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created successfully');
    });

    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'anotheruser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: '',
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      console.log('Login response:', response.status, response.body);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
      
      // Extract token from cookie
      const cookies = response.headers['set-cookie'];
      const accessTokenCookie = cookies.find(cookie => cookie.startsWith('accessToken='));
      authToken = accessTokenCookie ? accessTokenCookie.split('=')[1].split(';')[0] : null;
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should get current user with valid token', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      expect(loginResponse.status).toBe(200);
      
      // Extract token from cookie
      const cookies = loginResponse.headers['set-cookie'];
      const accessTokenCookie = cookies.find(cookie => cookie.startsWith('accessToken='));
      const token = accessTokenCookie ? accessTokenCookie.split('=')[1].split(';')[0] : null;

      // Now test the /api/auth/me endpoint
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `accessToken=${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
