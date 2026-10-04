import { z } from 'zod';

export interface ApiConfig {
  readonly port: number;
  readonly corsOrigin: string;
  readonly anthropicApiKey: string;
  readonly models: {
    readonly character: string;
    readonly objectiveChecker: string;
    readonly evaluator: string;
  };
}

const required = z.string().trim().min(1);

const envSchema = z.object({
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3333),
  CORS_ORIGIN: z.url().default('http://localhost:3000'),
  ANTHROPIC_API_KEY: required,
  CHARACTER_MODEL: required,
  OBJECTIVE_CHECKER_MODEL: required,
  EVALUATOR_MODEL: required,
});

export class InvalidConfigError extends Error {
  constructor(problems: readonly string[]) {
    super(`Invalid API configuration:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    this.name = 'InvalidConfigError';
  }
}

/** Lê e valida as variáveis de ambiente da API. Chamado uma vez, no boot. */
export function loadApiConfig(env: Record<string, string | undefined>): ApiConfig {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    throw new InvalidConfigError(
      result.error.issues.map((issue) => `${issue.path.map(String).join('.')}: ${issue.message}`),
    );
  }
  const vars = result.data;
  return {
    port: vars.API_PORT,
    corsOrigin: vars.CORS_ORIGIN,
    anthropicApiKey: vars.ANTHROPIC_API_KEY,
    models: {
      character: vars.CHARACTER_MODEL,
      objectiveChecker: vars.OBJECTIVE_CHECKER_MODEL,
      evaluator: vars.EVALUATOR_MODEL,
    },
  };
}
