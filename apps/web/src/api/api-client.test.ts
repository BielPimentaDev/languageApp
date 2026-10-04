import type { ListScenariosResponse } from '@language-app/shared';
import { describe, expect, it } from 'vitest';
import { ApiError, createApiClient } from './api-client';

const scenarios: ListScenariosResponse = {
  scenarios: [
    {
      id: 'coffee-shop',
      title: 'Cafeteria',
      description: 'Peça um café.',
      objectives: [{ id: 'order-drink', description: 'O aluno pede uma bebida.' }],
    },
  ],
};

function fakeFetch(response: Response) {
  const requests: string[] = [];
  const fetch: typeof globalThis.fetch = async (input) => {
    requests.push(String(input));
    return response;
  };
  return { fetch, requests };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('api client', () => {
  it('lists the scenarios from GET /scenarios on the configured API', async () => {
    const { fetch, requests } = fakeFetch(json(scenarios));
    const client = createApiClient({ baseUrl: 'http://127.0.0.1:3333', fetch });

    await expect(client.listScenarios()).resolves.toEqual(scenarios.scenarios);
    expect(requests).toEqual(['http://127.0.0.1:3333/scenarios']);
  });

  it('accepts a base URL with a trailing slash', async () => {
    const { fetch, requests } = fakeFetch(json(scenarios));
    const client = createApiClient({ baseUrl: 'http://127.0.0.1:3333/', fetch });

    await client.listScenarios();

    expect(requests).toEqual(['http://127.0.0.1:3333/scenarios']);
  });

  it('fails with the status when the API answers with an error', async () => {
    const { fetch } = fakeFetch(json({ message: 'boom' }, 500));
    const client = createApiClient({ baseUrl: 'http://127.0.0.1:3333', fetch });

    const error = await client.listScenarios().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500 });
  });

  it('fails when the response does not match the shared contract', async () => {
    const { fetch } = fakeFetch(json({ scenarios: [{ id: 'coffee-shop' }] }));
    const client = createApiClient({ baseUrl: 'http://127.0.0.1:3333', fetch });

    await expect(client.listScenarios()).rejects.toBeInstanceOf(ApiError);
  });
});
