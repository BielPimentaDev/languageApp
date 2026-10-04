import type { ListScenariosResponse } from '@language-app/shared';
import type { FastifyInstance } from 'fastify';
import type { UseCases } from '../server';

export function registerScenariosRoutes(
  app: FastifyInstance,
  useCases: Pick<UseCases, 'listScenarios'>,
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
