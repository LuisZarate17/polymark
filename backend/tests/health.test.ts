import app from '../src/index';
import request from 'supertest';

describe('Backend Health Checks', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return API status', async () => {
    const response = await request(app)
      .get('/api/status')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'running');
    expect(response.body).toHaveProperty('version');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/api/unknown')
      .expect(404);
    
    expect(response.body).toHaveProperty('error', 'Not found');
  });
});
