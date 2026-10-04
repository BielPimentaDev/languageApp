# ADR 009 — Processo único, sem mensageria, com relatório sob demanda

- Status: Aceito
- Data: 2026-10-04
- Substitui: [ADR 002](./002-processos-api-e-worker.md) e [ADR 005](./005-rabbitmq-com-outbox.md)
- Referências: [architecture.md](../architecture.md)

## Contexto

Os ADRs 002 e 005 previam um processo `worker` e RabbitMQ com outbox para o trabalho que acontece depois da conversa (análise da sessão, lembretes, exclusão de dados). No MVP, o único trabalho desse tipo é gerar o relatório da missão, para um aluno só.

O relatório chama o avaliador, que é lento (alguns segundos) e pode falhar. Se ele rodasse dentro do encerramento, uma falha levaria o encerramento junto.

## Decisão

- Existe **um processo**, a API. Não há worker, broker nem outbox.
- **Encerrar e gerar o relatório são operações separadas:**
  - `POST /missions/:id/end` só muda o estado da missão (para `abandonada`, quando chamado antes de todos os objetivos estarem cumpridos) e responde na hora.
  - `POST /missions/:id/report` executa o caso de uso `EvaluateMission` de forma síncrona, guarda o relatório na missão e o devolve.
- O relatório é **idempotente**: depois de gerado, novas chamadas devolvem o mesmo relatório, sem chamar o avaliador de novo.
- Uma missão encerrada não recebe mais mensagens.

## Consequências

- ✅ Nenhuma infraestrutura de mensageria para manter.
- ✅ Se o avaliador falhar, o aluno tenta de novo sem refazer a missão.
- ⚠️ A requisição do relatório leva alguns segundos, e o front precisa mostrar um estado de carregamento.
- ⚠️ Quando surgir trabalho de fundo de verdade (lembretes, e-mails), uma fila deve ser reavaliada. O caso de uso `EvaluateMission` pode então ser acionado por um consumidor sem mudar.
- ❌ Descartado: gerar o relatório dentro do encerramento (a falha do avaliador derrubaria o encerramento) e geração assíncrona com polling (exige fila e um estado "gerando").
