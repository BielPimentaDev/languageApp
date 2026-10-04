# ADR 003 — Fastify com composition root manual, sem container de DI

- Status: Aceito · Complementado por [011](./011-api-em-tres-camadas-por-contexto.md) (um único composition root no lugar de um `module.ts` por módulo)
- Data: 2026-10-04
- Referências: [architecture.md](../architecture.md) · [architecture-v1.md §2, §5](../archive/architecture-v1.md)

## Contexto

O servidor HTTP precisa de validação, plugins (autenticação, cota, tratamento de erro) e bom desempenho. As alternativas consideradas foram NestJS e Fastify.

NestJS traz um container de injeção de dependência baseado em decorators, que tende a vazar para o domínio e a aplicação e esconde a ligação porta → adapter. Tornar essa ligação explícita é justamente um dos objetivos de aprendizado do projeto (arquitetura hexagonal).

## Decisão

- O servidor HTTP é o **Fastify**.
- Não há container de DI. Cada módulo tem um **`module.ts`** (composition root) que instancia os adapters e os injeta nos casos de uso por construtor ou parâmetro.
- O Fastify fica restrito aos adapters de entrada `http/` e a `shared/infra/http` (bootstrap, handler de erro `application/problem+json`, plugins de auth e cota).
- Domínio e aplicação não usam decorators nem conhecem o framework.

## Consequências

- ✅ Domínio e aplicação são TypeScript puro, testáveis sem subir o servidor.
- ✅ A ligação de dependências é código legível e rastreável ("ir para definição" funciona).
- ✅ O Fastify é leve, rápido e tem um sistema de plugins adequado para auth, cota e erros.
- ⚠️ A injeção é manual: mais linhas nos `module.ts` à medida que os casos de uso crescem.
- ⚠️ Convenções que o NestJS daria prontas (estrutura, validação) precisam ser mantidas pela equipe e pelo dependency-cruiser.
- ❌ Descartado: NestJS (decorators e container escondem a ligação e acoplam camadas internas ao framework).
