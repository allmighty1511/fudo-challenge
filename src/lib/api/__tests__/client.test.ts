import { apiClient } from '../client';

describe('api client', () => {
  it('has baseURL from env', () => {
    expect(apiClient.defaults.baseURL).toBe(process.env.VITE_API_BASE_URL);
  });

  it('has JSON content type', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});
