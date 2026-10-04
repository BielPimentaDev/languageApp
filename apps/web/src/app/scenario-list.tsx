'use client';

import type { ScenarioSummaryDto } from '@language-app/shared';
import { useEffect, useState } from 'react';
import { api } from '../api/api';

type State =
  | { status: 'loading' }
  | { status: 'failed' }
  | { status: 'loaded'; scenarios: ScenarioSummaryDto[] };

export function ScenarioList() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    api
      .listScenarios()
      .then((scenarios) => active && setState({ status: 'loaded', scenarios }))
      .catch(() => active && setState({ status: 'failed' }));
    return () => {
      active = false;
    };
  }, []);

  if (state.status === 'loading') return <p className="muted">Carregando os cenários…</p>;
  if (state.status === 'failed') {
    return (
      <p role="alert">Não foi possível carregar os cenários. Verifique se a API está rodando.</p>
    );
  }

  return (
    <ul className="scenarios">
      {state.scenarios.map((scenario) => (
        <li key={scenario.id} className="scenario">
          <h2>{scenario.title}</h2>
          <p>{scenario.description}</p>
          <h3>Objetivos</h3>
          <ul>
            {scenario.objectives.map((objective) => (
              <li key={objective.id}>{objective.description}</li>
            ))}
          </ul>
          <button type="button" disabled title="Em breve">
            Iniciar missão
          </button>
        </li>
      ))}
    </ul>
  );
}
