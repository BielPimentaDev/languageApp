import { fileURLToPath } from 'node:url';
import type { ApiConfig } from '../src/infrastructure/config/api-config';
import { buildApp } from '../src/infrastructure/container';

export const fixtureScenariosDirectory = fileURLToPath(
  new URL('./fixtures/scenarios', import.meta.url),
);

export const testConfig: ApiConfig = {
  port: 0,
  corsOrigin: 'http://localhost:3000',
  anthropicApiKey: 'test-key-never-used',
  models: {
    character: 'test-character-model',
    objectiveChecker: 'test-objective-checker-model',
    evaluator: 'test-evaluator-model',
  },
};

export function buildTestApp(overrides: { scenariosDirectory?: string } = {}) {
  return buildApp({
    config: testConfig,
    scenariosDirectory: overrides.scenariosDirectory ?? fixtureScenariosDirectory,
  });
}
