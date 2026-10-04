import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import type { ListScenarios } from '../../application/scenarios/list-scenarios';
import { registerScenariosRoutes } from './scenarios/scenarios-routes';

/** O servidor HTTP. O Fastify não aparece fora de `infrastructure/http` (ADR 011). */
export type HttpServer = FastifyInstance;

/** Os casos de uso que as rotas expõem. */
export interface UseCases {
  readonly listScenarios: ListScenarios;
}

export interface HttpServerOptions {
  readonly logger: boolean;
  /** A única origem liberada no CORS: a do front (ADR 017). */
  readonly corsOrigin: string;
  readonly useCases: UseCases;
}

export async function createHttpServer(options: HttpServerOptions): Promise<HttpServer> {
  const app = Fastify({ logger: options.logger });
  await app.register(cors, { origin: [options.corsOrigin] });
  registerScenariosRoutes(app, options.useCases);
  return app;
}
