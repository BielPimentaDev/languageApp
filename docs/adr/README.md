# Architecture Decision Records

Um ADR registra uma decisão **difícil de reverter**, que **surpreenderia** quem lesse o código sem contexto e que foi **resultado de uma troca real** entre alternativas. Decisões fáceis de mudar ficam só no [`docs/architecture.md`](../architecture.md).

Para mudar uma decisão, crie um ADR novo que substitui o anterior e marque o antigo como `Substituído por NNN`. Os ADRs substituídos continuam aqui, como histórico do raciocínio.

Formato: cabeçalho (status, data, referências), **Contexto**, **Decisão** e **Consequências**.

## Vigentes

| # | Decisão |
| --- | --- |
| [003](./003-fastify-composition-root-manual.md) | Fastify com composition root manual, sem container de DI |
| [008](./008-estado-em-memoria-atras-de-repositorios.md) | Estado em memória atrás de repositórios |
| [009](./009-processo-unico-e-relatorio-sob-demanda.md) | Processo único, sem mensageria, com relatório sob demanda |
| [010](./010-sem-identidade-no-mvp.md) | Sem identidade no MVP |
| [011](./011-api-em-tres-camadas-por-contexto.md) | API em três camadas, organizadas por contexto |
| [012](./012-monorepo-com-pacote-shared.md) | Monorepo pnpm com um pacote `shared` de contratos |
| [013](./013-correcoes-so-no-relatorio.md) | O personagem nunca corrige; as correções vêm só no relatório |
| [014](./014-tres-papeis-de-ia-e-fim-por-objetivos.md) | Três papéis de IA, e a missão termina por objetivos |
| [015](./015-cenarios-como-dados-e-prompts-compostos.md) | Cenários como dados e prompts montados por composição |
| [016](./016-llm-atras-de-porta-pronta-para-streaming.md) | LLM atrás de uma porta, pronta para streaming |
| [017](./017-navegador-chama-a-api-direto.md) | O navegador chama a API direto, com CORS |

## Substituídos

Decisões da primeira versão do plano ([`docs/archive/`](../archive/)), revistas em 2026-10-04 quando o MVP foi reduzido a uma missão local para um único aluno.

| # | Decisão | Substituído por |
| --- | --- | --- |
| [001](./001-monolito-modular-hexagonal.md) | Monolito modular com arquitetura hexagonal por módulo | [011](./011-api-em-tres-camadas-por-contexto.md) |
| [002](./002-processos-api-e-worker.md) | Dois processos (`api` e `worker`) | [009](./009-processo-unico-e-relatorio-sob-demanda.md) |
| [004](./004-postgres-drizzle-schema-por-modulo.md) | PostgreSQL + Drizzle com um `pgSchema` por módulo | [008](./008-estado-em-memoria-atras-de-repositorios.md) |
| [005](./005-rabbitmq-com-outbox.md) | RabbitMQ (`amqplib`) com outbox | [009](./009-processo-unico-e-relatorio-sob-demanda.md) |
| [006](./006-provedores-de-ia-atras-de-portas.md) | Provedores de LLM, STT e TTS atrás de portas | [016](./016-llm-atras-de-porta-pronta-para-streaming.md) |
| [007](./007-identidade-usuario-fixo-depois-google.md) | Usuário fixo, depois login Google | [010](./010-sem-identidade-no-mvp.md) |
