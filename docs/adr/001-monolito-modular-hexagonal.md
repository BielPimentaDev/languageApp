# ADR 001 — Monolito modular com arquitetura hexagonal por módulo

- Status: Aceito
- Data: 2026-10-04
- Referências: [architecture.md §1, §2, §4, §5](../architecture.md) · Constitution, princípios I e II

## Contexto

O MVP precisa validar o ciclo do produto (conversa → resumo → revisão) em poucas semanas, com uma pessoa desenvolvendo. Ao mesmo tempo, o projeto quer treinar fronteiras de serviço e manter a porta aberta para extrair um módulo (`speech` ou `conversation`) quando uma métrica justificar.

Microsserviços desde o início multiplicariam deploy, observabilidade e contratos de rede sem ganho medido. Um monolito sem fronteiras vira "gaveta" (como o antigo módulo `core`) e torna a extração uma reescrita.

## Decisão

- O servidor é **um único código e um único deploy**, dividido nos módulos `identity`, `conversation`, `speech`, `learning` e `notifications`, mais `shared/kernel` e `shared/infra`.
- Cada módulo é um **hexágono**: `domain` (TypeScript puro), `application` (casos de uso e portas `in`/`out`), `adapters` (`in`: http, messaging, jobs; `out`: persistence, ai, in-memory), `module.ts` (composition root) e `index.ts` (API pública).
- Um módulo só importa o `index.ts` de outro. Não pode haver ciclo entre módulos; quando dois precisam um do outro, um deles usa evento.
- As regras entre módulos **e** entre camadas ficam num único lugar, no **dependency-cruiser**, que quebra o build na CI quando são violadas.

## Consequências

- ✅ Um deploy, uma base para depurar e refatorar; a iteração continua rápida.
- ✅ O domínio não conhece HTTP, banco, broker nem LLM, então é testável com fakes e sobrevive à extração.
- ✅ Extrair um módulo vira trocar a implementação da porta pública por um cliente HTTP com o mesmo contrato (ver architecture.md §18).
- ⚠️ Mais cerimônia por feature: portas, adapters, fakes e composition root, mesmo para casos simples.
- ⚠️ As regras do dependency-cruiser precisam ser mantidas junto com a estrutura de pastas; uma regra frouxa deixa as fronteiras apodrecerem em silêncio.
- ❌ Descartado: microsserviços desde o dia 1 (custo operacional sem métrica que justifique) e camadas globais (`domain/application/infra` na raiz), que misturam módulos.
- ❌ Descartado: `eslint-plugin-boundaries`, que não expressa tão bem as regras entre camadas dentro de cada módulo.
