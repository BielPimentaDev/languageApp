import { ListScenarios } from '../application/scenarios/list-scenarios';
import type { ApiConfig } from './config/api-config';
import { createHttpServer, type HttpServer } from './http/server';
import { FileScenarioRepository } from './scenarios/file-scenario-repository';

export interface BuildAppOptions {
  readonly config: ApiConfig;
  readonly scenariosDirectory: string;
  readonly logger?: boolean;
}

/** Composition root: instancia os adaptadores e os injeta nos casos de uso (ADR 003, ADR 011). */
export async function buildApp(options: BuildAppOptions): Promise<HttpServer> {
  const scenarioRepository = await FileScenarioRepository.load(options.scenariosDirectory);

  return createHttpServer({
    logger: options.logger ?? false,
    corsOrigin: options.config.corsOrigin,
    useCases: {
      listScenarios: new ListScenarios(scenarioRepository),
    },
  });
}
