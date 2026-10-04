import { z } from 'zod';

export interface WebConfig {
  readonly apiUrl: string;
}

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default('http://127.0.0.1:3333'),
});

/** Valida a configuração do front. Chamado no boot (`next.config.ts`) e ao criar o cliente da API. */
export function loadWebConfig(env: Record<string, string | undefined>): WebConfig {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `  - ${issue.path.map(String).join('.')}: ${issue.message}`,
    );
    throw new Error(`Invalid web configuration:\n${problems.join('\n')}`);
  }
  return { apiUrl: result.data.NEXT_PUBLIC_API_URL };
}
