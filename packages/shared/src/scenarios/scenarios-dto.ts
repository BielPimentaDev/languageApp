import { z } from 'zod';

export const objectiveDtoSchema = z.object({
  id: z.string(),
  description: z.string(),
});

export const scenarioSummaryDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  objectives: z.array(objectiveDtoSchema),
});

/** Resposta de `GET /scenarios`. */
export const listScenariosResponseSchema = z.object({
  scenarios: z.array(scenarioSummaryDtoSchema),
});

export type ObjectiveDto = z.infer<typeof objectiveDtoSchema>;
export type ScenarioSummaryDto = z.infer<typeof scenarioSummaryDtoSchema>;
export type ListScenariosResponse = z.infer<typeof listScenariosResponseSchema>;
