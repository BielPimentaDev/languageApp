import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ScenarioRepository } from '../../application/scenarios/scenario-repository';
import type { Scenario } from '../../domain/scenarios/scenario';
import { parseScenarioFile } from './parse-scenario-file';

interface LoadedScenario {
  readonly fileName: string;
  readonly scenario: Scenario;
}

/**
 * Lê os arquivos de cenário (`*.json`) uma vez, na inicialização, e os mantém em memória.
 * Um arquivo inválido ou um id repetido faz o carregamento falhar.
 */
export class FileScenarioRepository implements ScenarioRepository {
  private constructor(private readonly scenarios: readonly Scenario[]) {}

  static async load(directory: string): Promise<FileScenarioRepository> {
    const fileNames = (await readdir(directory)).filter((name) => name.endsWith('.json')).sort();
    const loaded = await Promise.all(
      fileNames.map(
        async (fileName): Promise<LoadedScenario> => ({
          fileName,
          scenario: parseScenarioFile(fileName, await readFile(join(directory, fileName), 'utf8')),
        }),
      ),
    );
    assertUniqueIds(loaded);
    return new FileScenarioRepository(loaded.map(({ scenario }) => scenario));
  }

  async list(): Promise<readonly Scenario[]> {
    return this.scenarios;
  }
}

function assertUniqueIds(loaded: readonly LoadedScenario[]): void {
  const fileNameById = new Map<string, string>();
  for (const { fileName, scenario } of loaded) {
    const previous = fileNameById.get(scenario.id);
    if (previous !== undefined) {
      throw new Error(
        `Scenario id "${scenario.id}" is used by both "${previous}" and "${fileName}"`,
      );
    }
    fileNameById.set(scenario.id, fileName);
  }
}
