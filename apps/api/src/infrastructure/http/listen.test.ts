import type { AddressInfo } from 'node:net';
import { describe, expect, it } from 'vitest';
import { buildTestApp } from '../../../test/test-app';
import { listen } from './listen';

describe('listen', () => {
  it('listens only on the loopback address, so the API is not reachable from outside the machine', async () => {
    const app = await buildTestApp();

    await listen(app, 0);

    try {
      expect((app.server.address() as AddressInfo).address).toBe('127.0.0.1');
    } finally {
      await app.close();
    }
  });
});
