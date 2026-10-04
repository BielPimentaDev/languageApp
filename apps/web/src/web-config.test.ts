import { describe, expect, it } from 'vitest';
import { loadWebConfig } from './web-config';

describe('loadWebConfig', () => {
  it('reads the API URL', () => {
    expect(loadWebConfig({ NEXT_PUBLIC_API_URL: 'http://127.0.0.1:4000' })).toEqual({
      apiUrl: 'http://127.0.0.1:4000',
    });
  });

  it('defaults the API URL to the local API', () => {
    expect(loadWebConfig({})).toEqual({ apiUrl: 'http://127.0.0.1:3333' });
  });

  it('names the variable when the API URL is invalid', () => {
    expect(() => loadWebConfig({ NEXT_PUBLIC_API_URL: 'not a url' })).toThrow(
      /NEXT_PUBLIC_API_URL/,
    );
  });
});
