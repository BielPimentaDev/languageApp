import { listScenariosResponseSchema } from '@language-app/shared';
import { describe, expect, it } from 'vitest';
import { buildTestApp } from '../../../../test/test-app';

describe('GET /scenarios', () => {
  it('lists the scenarios read from the scenario files, with title, description and objectives', async () => {
    const app = await buildTestApp();

    const response = await app.inject({ method: 'GET', url: '/scenarios' });

    expect(response.statusCode).toBe(200);
    expect(listScenariosResponseSchema.parse(response.json())).toEqual({
      scenarios: [
        {
          id: 'bakery',
          title: 'Padaria',
          description: 'Compre pão numa padaria movimentada.',
          objectives: [
            { id: 'choose-bread', description: 'O aluno escolhe o pão.' },
            { id: 'pay', description: 'O aluno paga.' },
          ],
        },
      ],
    });
  });
});
