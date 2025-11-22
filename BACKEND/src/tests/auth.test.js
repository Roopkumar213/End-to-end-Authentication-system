/**
 * auth.test.js
 *
 * Tests (integration) for auth flows:
 * - signup (email/password)
 * - login (email/password)
 * - /me protected route
 * - send-otp and verify-otp (SHOW_OTP=true)
 * - refresh token rotation
 * - logout
 *
 * Uses mongodb-memory-server so tests do not touch real DB.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');         // src/app.js
const connectDB = require('../config/db');

const User = require('../models/User');
const Otp = require('../models/Otp');
const Token = require('../models/Token');

jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  // Start in-memory mongo
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Set required env vars used by jwt util and other modules.
  process.env.MONGO_URI = uri;
  process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test_access_secret_123';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_456';
  process.env.JWT_ACCESS_EXPIRES = '15m';
  process.env.JWT_REFRESH_EXPIRES = '7d';
  process.env.OTP_EXPIRE_MINUTES = '5';
  process.env.SHOW_OTP = 'true'; // return otp in response in dev
  process.env.NODE_ENV = 'test';
  process.env.FRONTEND_URL = 'http://localhost:3000';
  process.env.SMTP_HOST = 'smtp.example.invalid'; // not used because SENDGRID not set and we won't actually send in tests (SHOW_OTP)
  process.env.SMTP_USER = 'test@example.invalid';
  process.env.SMTP_PASS = 'not-a-real-pass';

  // Connect mongoose using your connectDB helper (it reads MONGO_URI)
  await connectDB();
});

afterAll(async () => {
  // Close mongoose and stop mongo server
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  // Clear DB between tests
  await User.deleteMany({});
  await Otp.deleteMany({});
  await Token.deleteMany({});
});

describe('Auth integration tests', () => {
  test('Signup -> returns access token and sets refresh cookie', async () => {
    const agent = request.agent(app);

    const resp = await agent
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'test1@example.com', password: 'Passw0rd!' })
      .expect(201);

    expect(resp.body).toHaveProperty('accessToken');
    expect(resp.body).toHaveProperty('user');
    // Cookie present
    const cookies = resp.headers['set-cookie'];
    expect(Array.isArray(cookies)).toBe(true);
    const hasRefreshCookie = cookies.some((c) => c.startsWith('refreshToken='));
    expect(hasRefreshCookie).toBe(true);

    // /me with access token
    const me = await agent
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${resp.body.accessToken}`)
      .expect(200);

    expect(me.body).toHaveProperty('email', 'test1@example.com');
  });

  test('Login with credentials works and refresh rotates', async () => {
    // Create a user manually
    const user = new User({
      name: 'LoginUser',
      email: 'login@example.com',
      passwordHash: await require('bcrypt').hash('Secret123!', 8),
      provider: 'local',
    });
    await user.save();

    const agent = request.agent(app);

    // Login
    const loginResp = await agent.post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'Secret123!',
    }).expect(200);

    expect(loginResp.body).toHaveProperty('accessToken');

    // Call refresh endpoint (agent has cookie)
    const refreshResp = await agent.post('/api/auth/refresh').expect(200);
    expect(refreshResp.body).toHaveProperty('accessToken');

    // After refresh, cookie must be replaced (new set-cookie header)
    const refreshCookies = refreshResp.headers['set-cookie'];
    expect(Array.isArray(refreshCookies)).toBe(true);

    // Logout
    const logoutResp = await agent.post('/api/auth/logout').expect(200);
    expect(logoutResp.body).toHaveProperty('message', 'Logged out');

    // After logout, refresh should no longer work
    const refreshAfterLogout = await agent.post('/api/auth/refresh').expect(401);
    expect(refreshAfterLogout.body).toHaveProperty('error');
  });

  test('Send OTP and verify OTP (creates user if not exist)', async () => {
    const agent = request.agent(app);

    // Send OTP (SHOW_OTP=true returns otp in response for tests)
    const sendResp = await agent.post('/api/auth/send-otp').send({ email: 'otpuser@example.com', purpose: 'login' }).expect(200);
    expect(sendResp.body).toHaveProperty('message', expect.any(String));
    // Because SHOW_OTP=true, should return otp
    expect(sendResp.body).toHaveProperty('otp');
    const otp = sendResp.body.otp;
    expect(typeof otp).toBe('string');
    expect(otp.length).toBe(6);

    // Verify OTP
    const verifyResp = await agent.post('/api/auth/verify-otp').send({ email: 'otpuser@example.com', otp, purpose: 'login' }).expect(200);
    expect(verifyResp.body).toHaveProperty('accessToken');
    expect(verifyResp.body).toHaveProperty('user');

    // Check that user is created
    const created = await User.findOne({ email: 'otpuser@example.com' });
    expect(created).not.toBeNull();
    expect(created.isEmailVerified).toBeTruthy();
  });

  test('Invalid OTP is rejected and attempts increment', async () => {
    const agent = request.agent(app);
    const sendResp = await agent.post('/api/auth/send-otp').send({ email: 'badotp@example.com' }).expect(200);
    const otpDocBefore = await Otp.findOne({ email: 'badotp@example.com' });
    expect(otpDocBefore).not.toBeNull();

    // Submit wrong OTP
    await agent.post('/api/auth/verify-otp').send({ email: 'badotp@example.com', otp: '000000' }).expect(401);

    const otpDocAfter = await Otp.findOne({ email: 'badotp@example.com' });
    expect(otpDocAfter.attempts).toBeGreaterThanOrEqual(1);
  });
});
