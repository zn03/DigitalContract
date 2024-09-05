const request = require('supertest');
const app = require('../../app');
require('dotenv').config();
const packageJson = require('../../package.json');

describe('GET /api', () => {
  it('should return version and name', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toBe(200);
    expect(res.body.version).toEqual(packageJson.version);
    expect(res.body.name).toEqual(packageJson.name);
  });
});