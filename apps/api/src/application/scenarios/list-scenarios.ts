import type { Scenario } from '../../domain/scenarios/scenario';
import type { ScenarioRepository } from './scenario-repository';

export class ListScenarios {
  constructor(private readonly scenarios: ScenarioRepository) {}

  execute(): Promise<readonly Scenario[]> {
    return this.scenarios.list();
  }
}
