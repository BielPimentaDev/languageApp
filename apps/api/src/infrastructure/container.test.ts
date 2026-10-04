import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildTestApp } from '../../test/test-app';

const fixtures = (name: string) =>
  fileURLToPath(new URL(`../../test/fixtures/${name}`, import.meta.url));

describe('boot', () => {
  it('refuses to start when a scenario file is invalid, naming the file and the field', async () => {
    await expect(
      buildTestApp({ scenariosDirectory: fixtures('invalid-scenarios') }),
    ).rejects.toThrow(/no-objectives\.json[\s\S]*objectives/);
  });

  it('refuses to start when two scenario files share the same id', async () => {
    await expect(
      buildTestApp({ scenariosDirectory: fixtures('duplicate-scenarios') }),
    ).rejects.toThrow(/bakery/);
  });
});
