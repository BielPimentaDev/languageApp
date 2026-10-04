import { ScenarioList } from './scenario-list';

export default function HomePage() {
  return (
    <main className="page">
      <header>
        <h1>Missões</h1>
        <p className="muted">
          Escolha um cenário e cumpra os objetivos conversando com o personagem.
        </p>
      </header>
      <ScenarioList />
    </main>
  );
}
