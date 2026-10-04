<!--
Sync Impact Report
- Version change: template (não ratificada) → 1.0.0
- Princípios definidos (antes eram placeholders):
  - [PRINCIPLE_1_NAME] → I. Monolito Modular com Fronteiras Impostas
  - [PRINCIPLE_2_NAME] → II. Arquitetura Hexagonal por Módulo
  - [PRINCIPLE_3_NAME] → III. Testes Primeiro (NÃO NEGOCIÁVEL)
  - [PRINCIPLE_4_NAME] → IV. Dados Pertencem ao Módulo
  - [PRINCIPLE_5_NAME] → V. Contratos Explícitos e Versionados
  - Adicionados: VI. Eventos Confiáveis, VII. Custo de IA Sob Controle,
    VIII. Observável por Padrão, IX. Simplicidade e Extração por Evidência
- Seções adicionadas: "Restrições Técnicas e Stack", "Fluxo de Desenvolvimento e Quality Gates"
- Seções removidas: nenhuma
- Templates: nenhum alterado (lêem a constitution em tempo de execução)
  - .specify/templates/plan-template.md ✅ compatível (o Constitution Check usa os princípios I–IX)
  - .specify/templates/spec-template.md ✅ compatível
  - .specify/templates/tasks-template.md ✅ compatível (os testes são obrigatórios pelo Princípio III)
- TODOs pendentes: nenhum
-->

# Constitution do App de Idiomas

## Core Principles

### I. Monolito Modular com Fronteiras Impostas

O servidor é um único código, com um deploy e dois processos (`api` e `worker`), dividido nos módulos
`identity`, `conversation`, `speech`, `learning` e `notifications`.

- Um módulo MUST importar de outro módulo apenas o `index.ts` dele, nunca arquivos internos.
- MUST NOT existir ciclo de imports entre módulos. Quando dois módulos precisam um do outro, um dos
  lados MUST usar evento em vez de chamada.
- A API pública de um módulo MUST ser exposta como portas de entrada (interfaces), para que possa
  virar um cliente HTTP quando o módulo for extraído.
- As regras MUST ser verificadas pelo `dependency-cruiser` na CI, e uma violação quebra o build.

**Motivo:** a modularidade só se mantém quando uma ferramenta a impõe; contar com disciplina não basta.

### II. Arquitetura Hexagonal por Módulo

Cada módulo segue a mesma estrutura: `domain/`, `application/` (`ports/in`, `ports/out`,
`use-cases/`), `adapters/` (`in/http`, `in/messaging`, `in/jobs`, `out/persistence`, `out/ai`,
`out/in-memory`), `module.ts` (composition root) e `index.ts`.

- `domain` MUST importar apenas o próprio domínio e `shared/kernel`. MUST NOT depender de framework,
  banco, broker, provedor de IA, `zod` ou `packages/contracts`.
- `application` MUST depender apenas de `domain`, das próprias portas e de `shared/kernel`.
- Toda I/O (banco, fila, cache, IA, e-mail), assim como tempo (`Clock`) e geração de ids, MUST passar
  por uma porta de saída.
- Casos de uso MUST receber o ator explicitamente (`userId`), sem usuário implícito no ambiente.
- DTOs (`zod`) MUST ser convertidos para objetos de domínio no adapter. O domínio nunca recebe DTO cru.
- Erros de domínio MUST ser subclasses de `DomainError` com `code` estável. O mapeamento para HTTP
  (`application/problem+json`) acontece num único handler.

**Motivo:** isolar o domínio deixa as regras testáveis sem infraestrutura e permite trocar
provedores ou extrair módulos sem reescrever lógica de negócio.

### III. Testes Primeiro (NÃO NEGOCIÁVEL)

- Código em `domain` e `application` MUST seguir TDD: escrever o teste, vê-lo falhar, implementar e
  refatorar.
- Toda porta de saída MUST ter um fake oficial em `adapters/out/in-memory` e uma suíte de contrato
  que roda contra o fake e contra o adapter real (o real via Testcontainers).
- MUST NOT haver mock de biblioteca (Drizzle, amqplib, SDKs de IA). O que precisa ser falso é uma porta.
- Provedores de IA MUST NOT ser chamados na CI; a CI usa fakes roteirizados.
- Mensageria MUST ter testes de integração cobrindo outbox, retry, DLQ e entrega duplicada.
- A cobertura de `domain` + `application` MUST ser de no mínimo 90%.
- Uma feature só está pronta quando os testes aplicáveis de cada nível (domínio, aplicação, contrato,
  HTTP, mensageria, e2e) existem e passam.

**Motivo:** testes rápidos e confiáveis são o que permite evoluir a arquitetura sem medo, e esse é
um objetivo explícito do projeto.

### IV. Dados Pertencem ao Módulo

- Cada módulo MUST ser dono exclusivo do próprio schema no PostgreSQL.
- MUST NOT haver join, foreign key ou consulta direta entre schemas de módulos diferentes.
  Referências entre módulos guardam apenas o id.
- Dados de outro módulo MUST ser obtidos pela API pública dele ou por evento.
- Tabelas técnicas compartilhadas (outbox, eventos processados, uso de IA) ficam no schema
  `platform` e MUST NOT conter regra de negócio.

**Motivo:** o isolamento de dados é o que torna possível extrair um módulo para um banco próprio.

### V. Contratos Explícitos e Versionados

- DTOs HTTP e eventos MUST ser definidos em `packages/contracts` com `zod` e validados nas bordas.
- Eventos MUST usar o envelope padrão (`eventId`, `type`, `version`, `occurredAt`, `userId`,
  `traceparent`, `payload`) e a routing key `<type>.v<version>`.
- Uma mudança incompatível MUST gerar uma nova versão (`v2`). A versão anterior continua sendo
  publicada enquanto houver consumidor dela.
- Chamadas cujo resultado a pessoa espera na hora são síncronas, pela API pública. Só o que pode
  acontecer depois vai para fila.

**Motivo:** contratos versionados permitem que cliente, módulos e serviços futuros evoluam sem
quebrar uns aos outros.

### VI. Eventos Confiáveis

- Todo evento MUST ser gravado no outbox na mesma transação do dado de negócio, através da porta
  `UnitOfWork`.
- O relay MUST publicar com publisher confirms e só depois marcar o evento como publicado.
- Todo consumidor MUST ser idempotente: registra (`event_id`, `consumer`) em
  `platform.processed_events` na mesma transação do trabalho.
- O ack MUST ser manual e enviado só depois do commit. Uma falha gera até 3 tentativas com espera
  crescente e depois vai para a DLQ do próprio consumidor.

**Motivo:** a entrega é pelo menos uma vez e o broker pode cair; nenhum evento pode ser perdido nem
aplicado duas vezes.

### VII. Custo de IA Sob Controle

- Toda rota que aciona um provedor de IA MUST passar pela cota diária por pessoa (Redis, no fuso da
  pessoa) antes de qualquer chamada.
- O custo estimado de cada chamada a provedor MUST ser registrado em `platform.ai_usage`. O sistema
  MUST alertar quando o teto mensal chegar a 80% e bloquear as rotas de IA em 100%.
- Chamadas a provedores MUST ter timeout e no máximo uma tentativa extra.
- Tarefas pós-sessão SHOULD usar um modelo menor que o da conversa; respostas repetidas de TTS
  SHOULD ser cacheadas.

**Motivo:** cada mensagem custa dinheiro, e o MVP tem um orçamento fixo.

### VIII. Observável por Padrão

- Os logs MUST ser JSON estruturado (`pino`) com `trace_id`, `user_id` e `session_id`. O texto das
  mensagens e o e-mail MUST NOT ser logados em nível `info`.
- O trace OpenTelemetry MUST seguir da requisição HTTP até o worker, pelo `traceparent` do envelope.
- Cada etapa de IA (STT, LLM, TTS) MUST registrar a própria duração. Tamanho das filas, mensagens na
  DLQ, falhas por provedor e custo por sessão MUST ser expostos como métricas.

**Motivo:** a latência do áudio é o maior risco do produto, e só dá para atacar o que é medido.

### IX. Simplicidade e Extração por Evidência

- Um novo serviço, abstração, dependência ou infraestrutura MUST ter justificativa na seção de
  complexidade do plano da feature.
- Um módulo só MUST ser extraído para serviço próprio quando houver uma métrica que o justifique
  (latência, custo ou escala).
- O escopo MUST respeitar a lista "Fica fora" do PRD.

**Motivo:** o MVP precisa provar o ciclo de aprendizado em 4 semanas; excesso de engenharia é um
risco mapeado no PRD.

## Restrições Técnicas e Stack

- Linguagem: TypeScript strict em Node.js LTS, num monorepo com pnpm workspaces (`apps/web`,
  `apps/server`, `packages/contracts`, `packages/config`).
- Servidor: Fastify com composition root manual. Containers de DI e frameworks que exijam decorators
  no domínio são proibidos.
- Persistência: PostgreSQL + Drizzle (`pgSchema` por módulo, migrations por módulo).
- Mensageria: RabbitMQ (`amqplib`), exchange topic `domain.events`. Cache e cotas: Redis.
- Cliente: Next.js PWA com TanStack Query, consumindo os tipos de `packages/contracts`.
- Testes: Vitest, Testcontainers, Playwright (smoke do cliente) e k6 (carga).
- Privacidade (LGPD): o áudio da pessoa MUST ser descartado após a transcrição. A exclusão de conta
  MUST apagar os dados em todos os módulos via `identity.user-deleted`.
- Segredos MUST vir apenas de variáveis de ambiente, validadas no boot.
- Antes do login com Google, a API MUST exigir um token secreto de desenvolvimento.
- Trocar qualquer item desta seção exige um ADR (ver Governance).

## Fluxo de Desenvolvimento e Quality Gates

- Cada feature é uma fatia vertical testável de ponta a ponta, conduzida pelo spec-kit:
  `specify → clarify → plan → tasks → analyze → implement`.
- A pipeline de CI MUST rodar, nesta ordem: `lint → typecheck → depcruise → test:unit →
  test:integration → test:e2e → build`. Qualquer etapa vermelha bloqueia o merge.
- Todo `plan.md` MUST passar pelo Constitution Check (Princípios I–IX) antes da pesquisa e de novo
  depois do design.
- Uma feature é considerada entregue quando o fluxo funciona no celular (Chrome Android ou Safari iOS)
  e a CI está verde.
- A referência técnica detalhada é `docs/architecture.md`. O produto é definido em `docs/prd.md`.

## Governance

- Esta constitution prevalece sobre qualquer outra prática ou documento. Se `docs/architecture.md`
  divergir dela, o documento de arquitetura MUST ser corrigido.
- Emendas MUST ser feitas pelo `/speckit-constitution`, com Sync Impact Report. Uma emenda que mude
  decisão técnica MUST vir acompanhada de um ADR em `docs/adr/NNN-titulo.md` (contexto, decisão,
  consequências), que substitui o ADR anterior.
- Versionamento semântico: MAJOR para remoção ou redefinição incompatível de princípio; MINOR para
  princípio ou seção nova ou expansão material; PATCH para esclarecimentos e redação.
- Toda revisão de PR MUST verificar a conformidade com os princípios. Uma violação só é aceita com
  justificativa registrada na seção de complexidade do plano.

**Version**: 1.0.0 | **Ratified**: 2026-10-04 | **Last Amended**: 2026-10-04
