import { type ScenarioFile, scenarioFileSchema } from '@language-app/shared';
import type { z } from 'zod';
import type { Scenario } from '../../domain/scenarios/scenario';

/** Um arquivo de cenário que não passa no schema. Impede a API de subir. */
export class InvalidScenarioFileError extends Error {
  constructor(
    readonly fileName: string,
    problems: readonly string[],
  ) {
    super(`Invalid scenario file "${fileName}":\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    this.name = 'InvalidScenarioFileError';
  }
}

export function parseScenarioFile(fileName: string, raw: string): Scenario {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new InvalidScenarioFileError(fileName, [`not valid JSON (${reason})`]);
  }

  const result = scenarioFileSchema.safeParse(json);
  if (!result.success) {
    throw new InvalidScenarioFileError(fileName, result.error.issues.map(describeIssue));
  }
  return toScenario(result.data);
}

/** Converte o contrato do arquivo no objeto de domínio: o domínio nunca recebe o dado cru. */
function toScenario(file: ScenarioFile): Scenario {
  return {
    id: file.id,
    title: file.title,
    description: file.description,
    persona: {
      name: file.persona.name,
      role: file.persona.role,
      speakingStyle: file.persona.speakingStyle,
    },
    situation: file.situation,
    objectives: file.objectives.map(({ id, description }) => ({ id, description })),
  };
}

function describeIssue(issue: z.core.$ZodIssue): string {
  const paths =
    issue.code === 'unrecognized_keys'
      ? issue.keys.map((key) => [...issue.path, key])
      : [issue.path];
  return paths.map((path) => `${formatPath(path)}: ${issue.message}`).join('\n  - ');
}

function formatPath(path: readonly PropertyKey[]): string {
  return path.length === 0 ? '(root)' : path.map(String).join('.');
}
