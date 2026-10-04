# ADR 011 — API em três camadas, organizadas por contexto

- Status: Aceito
- Data: 2026-10-04
- Substitui: [ADR 001](./001-monolito-modular-hexagonal.md)
- Complementa: [ADR 003](./003-fastify-composition-root-manual.md)
- Referências: [architecture.md](../architecture.md)

## Contexto

O ADR 001 previa um monolito modular com cinco módulos hexagonais (`identity`, `conversation`, `speech`, `learning`, `notifications`), cada um com portas `in`/`out`, `module.ts` e `index.ts`, e fronteiras verificadas pelo dependency-cruiser. Com o escopo reduzido a uma missão, sem login, áudio, revisão nem e-mail, a maior parte desses módulos não teria conteúdo.

O objetivo de estudo continua: isolar o domínio de framework, provedor de IA e persistência, e testar os casos de uso sem subir o servidor.

## Decisão

A API (`apps/api/src`) tem três camadas, e as dependências só apontam para dentro:

- **`domain/`**: entidades e regras puras (`Mission`, `Objective`, `Scenario`, `Report`...). Não importa nada de fora da camada, nem bibliotecas.
- **`application/`**: casos de uso (`StartMission`, `SendMessage`, `EndMission`, `EvaluateMission`...), as portas que eles exigem (`LLMClient`, `MissionRepository`, `ScenarioRepository`, `VocabularyRepository`) e o `PromptBuilder`.
- **`infrastructure/`**: tudo o que fala com o mundo externo, incluindo **`http/`** (rotas Fastify), `llm/` (adaptador Claude), `persistence/` (repositórios em memória), `scenarios/` (leitura dos arquivos) e `config/`.

Regras complementares:

- Dentro de cada camada, as pastas são **por contexto** (`missions/`, `evaluation/`, `vocabulary/`, `scenarios/`), e não por tipo técnico (sem uma pasta `services/` única).
- Existe **um único composition root**, que instancia os adaptadores e os injeta nos casos de uso. Ele substitui os `module.ts` por módulo do ADR 003, mantendo a decisão daquele ADR de não usar um container de DI.
- Sem DDD tático completo: não há agregados formais nem eventos de domínio no MVP.

## Consequências

- ✅ O HTTP é só mais um adaptador de entrada, e o Fastify não aparece fora de `infrastructure/http`.
- ✅ Os casos de uso são testados com fakes, sem servidor e sem rede.
- ✅ Organizar por contexto evita uma pasta gigante de "services" e prepara a separação em módulos quando houver mais de um contexto com peso real.
- ⚠️ No começo, as regras de dependência são garantidas só por revisão. Uma ferramenta que as verifique (dependency-cruiser) é uma [questão em aberto](../architecture.md#13-questões-em-aberto).
- ❌ Descartado: o monolito modular com cinco módulos do ADR 001 (excessivo para uma missão), pastas só por funcionalidade misturando HTTP, regra e dados (o acoplamento ao framework vaza) e plugins Fastify como módulos (amarra a regra de negócio ao framework).
