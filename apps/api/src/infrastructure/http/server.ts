import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import type { ListScenarios } from '../../application/scenarios/list-scenarios';
import { registerScenariosRoutes } from './scenarios/scenarios-routes';

export interface HttpServerOptions {
  readonly logger: boolean;
  /** A única origem liberada no CORS: a do front (ADR 017). */
  readonly corsOrigin: string;
  readonly useCases: {
    readonly listScenarios: ListScenarios;
  };
}

export async function createHttpServer(options: HttpServerOptions): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger });
  await app.register(cors, { origin: [options.corsOrigin] });
  registerScenariosRoutes(app, options.useCases);
  return app;
}
