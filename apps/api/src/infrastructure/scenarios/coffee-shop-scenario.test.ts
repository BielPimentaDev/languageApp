import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { FileScenarioRepository } from './file-scenario-repository';

describe('the scenario files shipped with the API', () => {
  it('are valid, so the API boots', async () => {
    const repository = await FileScenarioRepository.load(
      fileURLToPath(new URL('../../../scenarios', import.meta.url)),
    );

    expect((await repository.list()).map((scenario) => scenario.id)).toContain('coffee-shop');
  });
});
