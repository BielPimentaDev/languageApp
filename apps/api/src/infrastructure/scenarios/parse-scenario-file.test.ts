import { describe, expect, it } from 'vitest';
import { InvalidScenarioFileError, parseScenarioFile } from './parse-scenario-file';

const validScenario = {
  id: 'bakery',
  title: 'Padaria',
  description: 'Compre pão.',
  persona: { name: 'Ana', role: 'baker', speakingStyle: 'Warm.' },
  situation: 'A busy bakery.',
  objectives: [{ id: 'pay', description: 'O aluno paga.' }],
};

function errorFrom(fileName: string, raw: string): Error {
  try {
    parseScenarioFile(fileName, raw);
  } catch (error) {
    if (error instanceof Error) return error;
  }
  throw new Error('expected parseScenarioFile to throw');
}

describe('parseScenarioFile', () => {
  it('returns the scenario when the file is valid', () => {
    expect(parseScenarioFile('bakery.json', JSON.stringify(validScenario))).toEqual(validScenario);
  });

  it('names the file and the missing field', () => {
    const { situation: _, ...withoutSituation } = validScenario;

    const error = errorFrom('bakery.json', JSON.stringify(withoutSituation));

    expect(error).toBeInstanceOf(InvalidScenarioFileError);
    expect(error.message).toContain('bakery.json');
    expect(error.message).toContain('situation');
  });

  it('names the nested field path when an objective is invalid', () => {
    const scenario = { ...validScenario, objectives: [{ id: 'pay', description: '' }] };

    const error = errorFrom('bakery.json', JSON.stringify(scenario));

    expect(error.message).toContain('objectives.0.description');
  });

  it('names an unknown field, so typos in the file do not go unnoticed', () => {
    const scenario = { ...validScenario, objectivs: [] };

    const error = errorFrom('bakery.json', JSON.stringify(scenario));

    expect(error.message).toContain('objectivs');
  });

  it('names the file when it is not valid JSON', () => {
    const error = errorFrom('broken.json', '{ "id": ');

    expect(error).toBeInstanceOf(InvalidScenarioFileError);
    expect(error.message).toContain('broken.json');
    expect(error.message).toContain('JSON');
  });
});
