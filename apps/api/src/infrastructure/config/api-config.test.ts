import { describe, expect, it } from 'vitest';
import { InvalidConfigError, loadApiConfig } from './api-config';

const validEnv = {
  API_PORT: '4000',
  CORS_ORIGIN: 'http://localhost:3000',
  ANTHROPIC_API_KEY: 'sk-ant-test',
  CHARACTER_MODEL: 'model-a',
  OBJECTIVE_CHECKER_MODEL: 'model-b',
  EVALUATOR_MODEL: 'model-c',
};

describe('loadApiConfig', () => {
  it('reads the port, the CORS origin, the Anthropic key and the model of each role', () => {
    expect(loadApiConfig(validEnv)).toEqual({
      port: 4000,
      corsOrigin: 'http://localhost:3000',
      anthropicApiKey: 'sk-ant-test',
      models: { character: 'model-a', objectiveChecker: 'model-b', evaluator: 'model-c' },
    });
  });

  it('defaults the port to 3333 and the CORS origin to the local front-end', () => {
    const { API_PORT: _port, CORS_ORIGIN: _origin, ...env } = validEnv;

    expect(loadApiConfig(env)).toMatchObject({ port: 3333, corsOrigin: 'http://localhost:3000' });
  });

  it('names every missing or invalid variable', () => {
    const { ANTHROPIC_API_KEY: _key, ...env } = validEnv;

    const load = () => loadApiConfig({ ...env, API_PORT: 'abc', CORS_ORIGIN: 'not a url' });

    expect(load).toThrow(InvalidConfigError);
    expect(load).toThrow(/ANTHROPIC_API_KEY/);
    expect(load).toThrow(/API_PORT/);
    expect(load).toThrow(/CORS_ORIGIN/);
  });
});
