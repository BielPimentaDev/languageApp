import type { ListScenariosResponse } from '@language-app/shared';
import type { FastifyInstance } from 'fastify';
import type { ListScenarios } from '../../../application/scenarios/list-scenarios';

export function registerScenariosRoutes(
  app: FastifyInstance,
  useCases: { listScenarios: ListScenarios },
): void {
  app.get('/scenarios', async (): Promise<ListScenariosResponse> => {
    const scenarios = await useCases.listScenarios.execute();
    return {
      scenarios: scenarios.map((scenario) => ({
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        objectives: scenario.objectives.map(({ id, description }) => ({ id, description })),
      })),
    };
  });
}
