import { z } from 'zod';

const nonBlank = z.string().trim().min(1);

export const objectiveFileSchema = z.strictObject({
  id: nonBlank,
  description: nonBlank,
});

export const personaFileSchema = z.strictObject({
  name: nonBlank,
  role: nonBlank,
  speakingStyle: nonBlank,
});

/**
 * O arquivo de cenário (JSON). Não declara idioma nem nível: esses são
 * parâmetros da missão (ADR 015).
 */
export const scenarioFileSchema = z.strictObject({
  id: nonBlank,
  title: nonBlank,
  description: nonBlank,
  persona: personaFileSchema,
  situation: nonBlank,
  objectives: z.array(objectiveFileSchema).min(1),
});

export type ScenarioFile = z.infer<typeof scenarioFileSchema>;
