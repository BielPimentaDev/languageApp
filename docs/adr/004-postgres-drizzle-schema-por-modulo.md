# ADR 004 — PostgreSQL + Drizzle com um `pgSchema` por módulo

- Status: Aceito
- Data: 2026-10-04
- Referências: [architecture.md §2, §11](../architecture.md) · Constitution, princípio IV

## Contexto

Cada módulo deve ser dono dos seus dados para que a fronteira entre módulos seja real e uma extração futura consiga mover o banco do módulo sem desfazer joins. É preciso um banco relacional confiável, transações (para o outbox) e migrations versionadas.

As alternativas de acesso a dados consideradas foram Prisma e Drizzle. O Prisma abstrai mais o SQL e tem suporte mais limitado a múltiplos schemas e a migrations separadas por módulo.

## Decisão

- Banco: **PostgreSQL**.
- Acesso a dados: **Drizzle ORM**, com um **`pgSchema` por módulo** (`identity`, `conversation`, `speech`, `learning`, `notifications`), além de um schema técnico `platform` (outbox, `processed_events`).
- As tabelas e os repositórios ficam em `adapters/out/persistence/` de cada módulo.
- **Sem joins nem foreign keys entre schemas.** Dados de outro módulo vêm pela API pública dele ou por evento.
- Transações pela porta `UnitOfWork.run(fn)`; o adapter Drizzle entrega repositórios e o publisher de outbox ligados à mesma transação.

## Consequências

- ✅ O SQL fica próximo do real, e as consultas são tipadas.
- ✅ A fronteira de dados é visível no próprio banco e fácil de revisar nas migrations.
- ✅ "Dado + evento" é atômico sem a aplicação conhecer SQL.
- ✅ A extração de um módulo pode mover o schema dele para um banco próprio (ver architecture.md §18).
- ⚠️ Consultas que cruzam módulos precisam de composição na aplicação ou de dados replicados por evento, com consistência eventual.
- ⚠️ Revisar migrations exige atenção para não criar FK entre schemas.
- ❌ Descartado: Prisma (abstração maior do SQL e menos controle sobre schemas por módulo).
