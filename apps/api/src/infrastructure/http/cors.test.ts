import { describe, expect, it } from 'vitest';
import { buildTestApp, testConfig } from '../../../test/test-app';

describe('CORS', () => {
  it('allows the front-end origin', async () => {
    const app = await buildTestApp();

    const response = await app.inject({
      method: 'GET',
      url: '/scenarios',
      headers: { origin: testConfig.corsOrigin },
    });

    expect(response.headers['access-control-allow-origin']).toBe(testConfig.corsOrigin);
  });

  it('does not allow any other origin', async () => {
    const app = await buildTestApp();

    const response = await app.inject({
      method: 'GET',
      url: '/scenarios',
      headers: { origin: 'http://evil.example' },
    });

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
