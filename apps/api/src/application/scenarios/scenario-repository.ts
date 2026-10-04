import type { Scenario } from '../../domain/scenarios/scenario';

export interface ScenarioRepository {
  list(): Promise<readonly Scenario[]>;
}
