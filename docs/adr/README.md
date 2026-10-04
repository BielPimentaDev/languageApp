# Architecture Decision Records

Decisões marcadas como **ADR** no [`docs/architecture.md`](../architecture.md) §2. Para mudar uma delas, crie um ADR novo que substitui o anterior e marque o antigo como `Substituído por NNN`.

| # | Decisão | Status |
| --- | --- | --- |
| [001](./001-monolito-modular-hexagonal.md) | Monolito modular com arquitetura hexagonal por módulo e fronteiras verificadas pelo dependency-cruiser | Aceito |
| [002](./002-processos-api-e-worker.md) | Dois processos (`api` e `worker`) na mesma base de código | Aceito |
| [003](./003-fastify-composition-root-manual.md) | Fastify com composition root manual, sem container de DI | Aceito |
| [004](./004-postgres-drizzle-schema-por-modulo.md) | PostgreSQL + Drizzle com um `pgSchema` por módulo | Aceito |
| [005](./005-rabbitmq-com-outbox.md) | RabbitMQ (`amqplib`) com outbox | Aceito |
| [006](./006-provedores-de-ia-atras-de-portas.md) | Provedores de LLM, STT e TTS atrás de portas | Aceito |
| [007](./007-identidade-usuario-fixo-depois-google.md) | Usuário fixo até a semana 4, depois login Google | Aceito |

Formato: **Contexto**, **Decisão** e **Consequências**.
