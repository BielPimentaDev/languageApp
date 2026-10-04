import { listScenariosResponseSchema, type ScenarioSummaryDto } from '@language-app/shared';
import type { z } from 'zod';

/** A API respondeu com erro, ou com um corpo fora do contrato compartilhado. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientOptions {
  readonly baseUrl: string;
  readonly fetch?: typeof globalThis.fetch;
}

export interface ApiClient {
  listScenarios(): Promise<ScenarioSummaryDto[]>;
}

/**
 * O único lugar do front que conhece a URL da API (ADR 017). Valida cada
 * resposta com os contratos de `@language-app/shared`.
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const fetch = options.fetch ?? globalThis.fetch.bind(globalThis);

  async function get<Schema extends z.ZodType>(
    path: string,
    schema: Schema,
  ): Promise<z.infer<Schema>> {
    const response = await fetch(`${baseUrl}${path}`, { headers: { accept: 'application/json' } });
    if (!response.ok) {
      throw new ApiError(`GET ${path} failed with status ${response.status}`, response.status);
    }
    const result = schema.safeParse(await response.json());
    if (!result.success) {
      throw new ApiError(`GET ${path} returned a body outside the contract`, response.status);
    }
    return result.data;
  }

  return {
    async listScenarios() {
      return (await get('/scenarios', listScenariosResponseSchema)).scenarios;
    },
  };
}
