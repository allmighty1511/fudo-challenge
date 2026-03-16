import { apiClient } from '../client';

describe('api client', () => {
  it('has correct baseURL', () => {
    expect(apiClient.defaults.baseURL).toBe(
      'https://665de6d7e88051d60408c32d.mockapi.io'
    );
  });

  it('has JSON content type', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});
