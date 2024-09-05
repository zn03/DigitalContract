const request = require('supertest');
const app = require('../../app');
const { dummyData, createDummyAccount } = require('../helpers/auth.helper');
require('dotenv').config();

describe('GET /api/auth/signup', () => {
  it('should signup user successfully', async () => {
    const data = dummyData;
    const res = await request(app).post('/api/auth/signup').send(data);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.username).toEqual(data.username);
    expect(res.body.data.name).toEqual(data.name);
    expect(res.body.data.email).toEqual(data.email);
    expect(res.body.data.role).toEqual(data.role);
  });

  it('should return error for duplicate username', async () => {
    createDummyAccount(dummyData);
    const data = dummyData;
    const res = await request(app).post('/api/auth/signup').send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Username already exists');
  });
});

describe('POST /api/auth/login', () => {
  it('should login successfully', async () => {
    createDummyAccount(dummyData);
    const data = {
      username: dummyData.username,
      password: dummyData.password
    };
    const res = await request(app).post('/api/auth/login').send(data);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).not.toBeUndefined();
  });
});