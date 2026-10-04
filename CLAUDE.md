# CLAUDE.md

App de idiomas por missões: o aluno conversa com um personagem de IA num cenário (MVP: cafeteria, inglês C1) até cumprir os objetivos, e depois recebe um relatório com correções. Também é um projeto de estudo de arquitetura de software.

## Leia antes de mudar algo

- [`CONTEXT.md`](./CONTEXT.md): o glossário do domínio. Use esses termos no código, nos testes e nas specs, e evite os sinônimos listados em _Evite_.
- [`docs/architecture.md`](./docs/architecture.md): a referência técnica (camadas, fluxo, API, testes, tooling).
- [`docs/adr/`](./docs/adr/README.md): as decisões vigentes e o porquê de cada uma. Não contrarie um ADR vigente sem propor um ADR novo que o substitua.
- `docs/archive/`: o plano original (v1), que **não** é a referência atual.

## Regras de arquitetura

- Monorepo pnpm: `apps/web` (Next.js), `apps/api` (Fastify) e `packages/shared` (só contratos Zod).
- A API tem três camadas, e as dependências apontam para dentro: `domain` → `application` → `infrastructure`.
  - `domain`: TypeScript puro, sem nenhuma biblioteca.
  - `application`: casos de uso, portas e `PromptBuilder`. Não importa Fastify, SDK da Anthropic nem `infrastructure`.
  - `infrastructure`: adaptadores, incluindo `http/` (Fastify), `llm/`, `persistence/`, `scenarios/`, `config/` e o composition root.
- Dentro de cada camada, as pastas são por contexto (`missions/`, `evaluation/`, `vocabulary/`, `scenarios/`).
- Toda chamada ao LLM passa pela porta `LLMClient`. Retry, timeout e validação da saída ficam só no adaptador.
- Cenários são dados (arquivos validados com Zod), nunca código. Idioma e nível são parâmetros da missão.
- O personagem nunca corrige o aluno. As correções são do avaliador, no relatório.

## Testes

- TDD em `domain` e `application`.
- Os testes usam `FakeLLMClient` e os repositórios em memória. A Claude API nunca é chamada nos testes nem na CI, só pelos evals (`pnpm eval`), rodados manualmente.
- Não faça mock de biblioteca: o que precisa ser falso é uma porta.

## Convenções

- Identificadores de código em inglês; documentação, ADRs e specs em português.
- Trabalho em fatias verticais. Fluxo: `/to-spec` → `/to-tickets` → `/implement` (com `tdd`) → `code-review`.

## Agent skills

### Issue tracker

Issues e specs ficam nas GitHub Issues de `BielPimentaDev/languageApp`, via `gh`. Veja `docs/agents/issue-tracker.md`.

### Triage labels

Os cinco labels padrão (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). Veja `docs/agents/triage-labels.md`.

### Domain docs

Contexto único: `CONTEXT.md` e `docs/adr/` na raiz. Veja `docs/agents/domain.md`.
