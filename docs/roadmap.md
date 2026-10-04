# Roadmap de implementação com spec-kit

Oct 4, 2026 · @Gabriel

Este arquivo é o **tracking** do projeto. Cada linha de checklist corresponde a uma **sessão nova do Claude Code**, com contexto zerado. Ao terminar uma sessão: revise, faça o commit e marque o item com `[x]`, anotando o hash do commit.

Referências: [PRD](./prd.md) · [Arquitetura](./architecture.md) · [Constitution](../.specify/memory/constitution.md)

---

## Como funciona

### Ciclo de cada fatia (feature)

```
Sessão A  /speckit-specify  (+ /speckit-clarify)  → specs/NNN-*/spec.md
Sessão B  /speckit-plan                            → plan.md, research.md, data-model.md, contracts/, quickstart.md
Sessão C  /speckit-tasks  +  /speckit-analyze       → tasks.md (+ relatório de consistência)
Sessão D… /speckit-implement  (uma sessão por fase do tasks.md)
Sessão Z  /speckit-converge  + fechamento           → nada pendente, merge na main
```

Por que separar desse jeito:

- **Uma sessão por artefato.** Cada sessão produz um arquivo revisável, e o commit dela vira o seu histórico.
- **O implement é fatiado por fase.** O `tasks.md` sai organizado em fases (Setup, Foundational, uma por User Story e Polish). Implementar uma fase por sessão mantém o diff pequeno o bastante para revisar.
- **O contexto zerado funciona** porque tudo que importa fica em arquivo: a constitution, `docs/` e `specs/NNN-*/`. O spec-kit guarda a feature ativa em `.specify/feature.json`, então a sessão nova já sabe em qual feature está.

### Convenções de git (tracking)

- Uma branch por fatia: `NNN-nome` (ex.: `001-conversa-texto`), criada a partir da `main` antes da sessão A.
- Um commit por sessão, com prefixo padronizado:
  - `spec(001): ...` · `plan(001): ...` · `tasks(001): ...` · `feat(001): fase 3 — US1 ...` · `chore(001): converge`
- Ao fechar a fatia: merge na `main`, marcar o item no roadmap e anotar a data.
- Para revisar uma sessão: `git show <hash>` ou o painel de diff do app.

### Regras para cada sessão

1. Abra uma **sessão nova** e dê a ela o nome do item (ex.: `001 · plan`).
2. Confira se está na branch certa (`git branch --show-current`).
3. Cole o prompt do item, copiado deste arquivo.
4. Revise usando o checklist de revisão do item.
5. Faça o commit, marque `[x]` aqui e anote o hash.
6. **Trabalhe em uma fatia por vez.** Se precisar voltar a uma fatia antiga, aponte `.specify/feature.json` para a pasta dela antes de rodar qualquer comando.

### Checklists de revisão (o que olhar em cada artefato)

| Artefato | Verifique |
| --- | --- |
| `spec.md` | Não fala de tecnologia; user stories com prioridade; critérios de aceite iguais aos RFs do PRD; "fora de escopo" explícito; nenhum `[NEEDS CLARIFICATION]` sobrando |
| `plan.md` | Constitution Check passou (I–IX); estrutura de pastas igual à do `architecture.md` §5–6; Complexity Tracking vazio ou justificado |
| `research.md` | Cada decisão tem alternativa descartada e motivo |
| `data-model.md` | Tabelas no schema do módulo certo; nenhuma FK entre schemas |
| `contracts/` | DTOs e eventos batem com `architecture.md` §10 e §12; eventos com versão |
| `tasks.md` | Testes **antes** da implementação em cada fase; tarefas com caminho de arquivo; portas e fakes in-memory previstos |
| Código (implement) | `pnpm lint && pnpm typecheck && pnpm depcruise && pnpm test` verdes; domínio sem import de infra; diff só da fase pedida |

---

## Fase 0 — Preparação (sessão única)

- [ ] **000 · setup do repositório** — commit: `______`

  > Inicialize o git neste diretório, crie um `.gitignore` para Node/pnpm/Next.js e faça o commit inicial com `docs/`, `.specify/` e `.claude/`. Crie também `docs/adr/` com um ADR por decisão marcada na tabela da seção 2 do `docs/architecture.md` (001 a 007, no formato contexto, decisão e consequências). Não crie nenhum código de aplicação.

  Revisão: os ADRs batem com o `architecture.md`, e não existe código além de docs.

---

## Fatias

| # | Fatia | RFs | Semana | Status |
| --- | --- | --- | --- | --- |
| 001 | Conversa por texto (+ fundação do monorepo) | RF02, RF03, RF04, RF13 | 1 | ⬜ |
| 002 | Conversa por áudio | RF05, RF06 | 2 | ⬜ |
| 003 | Resumo da sessão (eventos + análise) | RF07, RF08, RF09, RF16 (restaurante) | 2 | ⬜ |
| 004 | Vocabulário, revisão e dias seguidos | RF10, RF11, RF14 | 3 | ⬜ |
| 005 | Lembrete por e-mail | RF15 | 3 | ⬜ |
| 006 | Espanhol por configuração | RF02 (idioma) | 3 | ⬜ |
| 007 | Login Google e exclusão de conta | RF01, LGPD | 4 | ⬜ |
| 008 | Missões, temas livres e "usar a palavra" | RF12, RF16, RF17 | 4 | ⬜ |
| 009 | Métricas, alertas e lançamento | Métricas do PRD, NFRs | 4 | ⬜ |

Legenda de status: ⬜ não iniciada · 🟨 em andamento · ✅ mergeada

> **Prompt base do plan (vale para todas as fatias).** Todo `/speckit-plan` abaixo começa com:
> *"Use `docs/architecture.md` como referência técnica obrigatória (stack, estrutura hexagonal por módulo, testes, eventos, modelo de dados e API). Não introduza tecnologia fora dele; se precisar, registre em Complexity Tracking e proponha um ADR."*
>
> **Prompt base do tasks (vale para todas as fatias).** Todo `/speckit-tasks` abaixo começa com:
> *"Testes são obrigatórios (Princípio III da constitution): em cada fase, as tarefas de teste vêm antes da implementação e têm que falhar primeiro. Inclua fakes in-memory e testes de contrato para cada porta de saída nova."*

---

### 001 · Conversa por texto (+ fundação)

Branch: `001-conversa-texto`

- [ ] **A · specify** — commit `______`

  > /speckit-specify Fatia 001 do `docs/prd.md`: a pessoa (usuário fixo, sem login) escolhe idioma-alvo (só inglês nesta fatia) e nível (A1–C1), vê o cenário "restaurante" com seu briefing e objetivos, inicia a conversa (o personagem abre em até 5 s) e troca mensagens de texto (resposta em até 6 s p95). O nível influencia a conversa. Limite diário de 40 mensagens, com aviso mostrando o horário do reset no fuso da pessoa. Cobre RF02, RF03, RF04 e RF13. Fora desta fatia: áudio, resumo, correções, vocabulário, revisão, login e espanhol. O acesso deve ser protegido por um segredo enquanto não houver login.

  Em seguida, na mesma sessão: `/speckit-clarify`

- [ ] **B · plan** — commit `______`

  > /speckit-plan [prompt base do plan] Esta é a primeira fatia, então o plano inclui a fundação: monorepo pnpm, Docker Compose, Fastify com `main.api.ts`/`main.worker.ts`, Drizzle com schemas `identity` e `conversation`, `shared/kernel` e `shared/infra`, dependency-cruiser com as regras de módulo e de camada, pipeline de CI, `AI_PROVIDER=fake`, autenticação `FixedUserAuth` com `X-Dev-Token` e plugin de cota no Redis. Na research.md, compare provedores de LLM (custo por sessão estimado) e recomende um.

- [ ] **C · tasks + analyze** — commit `______`

  > /speckit-tasks [prompt base do tasks]

  Em seguida, na mesma sessão: `/speckit-analyze`. Corrija os problemas CRITICAL/HIGH antes do commit.

- [ ] **D · implement fase 1 (Setup)** — commit `______`
  > /speckit-implement Execute somente a Fase 1 (Setup) do tasks.md. Pare ao final da fase, rode lint, typecheck e depcruise e me mostre o resumo.
- [ ] **E · implement fase 2 (Foundational)** — commit `______`
  > /speckit-implement Execute somente a Fase 2 (Foundational). Pare ao final, rode todos os testes e me mostre o resumo.
- [ ] **F · implement US1** — commit `______`
  > /speckit-implement Execute somente a fase da User Story 1. Testes primeiro. Pare ao final da fase.
- [ ] **G · implement US2…** (repita uma sessão por User Story) — commit `______`
- [ ] **H · implement Polish** — commit `______`
- [ ] **Z · converge + fechamento** — commit `______`

  > /speckit-converge — depois rode `pnpm test` completo, siga o `quickstart.md` e me diga o que falta para o critério de pronto (fluxo funcionando no celular + CI verde). Teste também a gravação de áudio no Safari/iOS (só a viabilidade; anote o resultado na research.md da fatia 002).

  Feche a fatia: merge na `main` e status ✅.

---

### 002 · Conversa por áudio

Branch: `002-conversa-audio`

- [ ] **A · specify + clarify** — commit `______`
  > /speckit-specify Fatia 002 do `docs/prd.md`: a pessoa segura um botão para falar, a transcrição aparece na conversa e a resposta chega em até 8 s p95 (RF05). Toda resposta tem botão de ouvir e o autoplay pode ser ligado ou desligado no perfil (RF06). O áudio da pessoa é descartado após a transcrição. A latência de cada etapa precisa ser mensurável. O áudio consome a mesma cota diária. Precisa funcionar no Chrome Android/desktop e no Safari iOS, com o texto como alternativa se a gravação falhar.
- [ ] **B · plan** — commit `______`
  > /speckit-plan [prompt base] Módulo `speech` (STT, TTS, cache de TTS por hash), integração com `ConversationApi.sendMessage`, métricas de duração por etapa. Na research.md, compare provedores de STT/TTS e defina onde guardar o cache de áudio.
- [ ] **C · tasks + analyze** — commit `______`
- [ ] **D… · implement por fase** — commits `______`
- [ ] **Z · converge + fechamento** — commit `______`

### 003 · Resumo da sessão

Branch: `003-resumo-sessao`

- [ ] **A · specify + clarify** — commit `______`
  > /speckit-specify Fatia 003 do `docs/prd.md`: ao encerrar a sessão, a pessoa vê em até 15 s um resumo com os erros (frase original, correção e explicação curta, sem ter interrompido a conversa), até 5 palavras/expressões sugeridas com significado e exemplo, e os objetivos da missão do restaurante marcados como cumpridos ou não, com a frase que prova. Enquanto o resumo não fica pronto, a tela mostra que está processando. A pessoa pode reportar uma correção errada. Cobre RF07, RF08, RF09 e RF16 (só restaurante). O botão "treinar essa" aparece, mas salvar a palavra é da fatia 004.
- [ ] **B · plan** — commit `______`
  > /speckit-plan [prompt base] Inclui a infraestrutura de mensageria: outbox + `UnitOfWork`, relay no worker, topologia RabbitMQ (retry 3x e DLQ por fila), `processed_events`, envelope de evento, `conversation.session-ended.v1`, consumer `conversation.analyze-session` com modelo menor, `GET /sessions/:id/report` respondendo 202.
- [ ] **C · tasks + analyze** — commit `______`
- [ ] **D… · implement por fase** — commits `______`
- [ ] **Z · converge + fechamento** — commit `______`

### 004 · Vocabulário, revisão e dias seguidos

Branch: `004-vocabulario-revisao`

- [ ] **A · specify + clarify** — commit `______`
  > /speckit-specify Fatia 004 do `docs/prd.md`: "treinar essa" salva a palavra no vocabulário pessoal sem duplicar, e a pessoa pode listar e remover palavras (RF10). As palavras entram na revisão nos dias 1, 3, 7 e 14; acertar avança o intervalo e errar volta ao dia 1; a pessoa vê a fila do dia e responde acertou/errou (RF11). O contador de dias seguidos sobe ao concluir uma sessão ou revisão no dia, no fuso da pessoa (RF14).
- [ ] **B · plan** — commit `______`
  > /speckit-plan [prompt base] Módulo `learning`, `learning.word-saved.v1` (frases de contexto via LLM), consumer `learning.record-activity` de `session-ended`, `Clock` e fuso nas regras de revisão e dias seguidos.
- [ ] **C · tasks + analyze** — commit `______`
- [ ] **D… · implement por fase** — commits `______`
- [ ] **Z · converge + fechamento** — commit `______`

### 005 · Lembrete por e-mail

Branch: `005-lembrete-email`

- [ ] **A · specify + clarify** — commit `______`
  > /speckit-specify Fatia 005 do `docs/prd.md`: quando há revisões vencidas, a pessoa recebe no máximo um e-mail por dia lembrando de revisar (RF15).
- [ ] **B · plan** — commit `______`
  > /speckit-plan [prompt base] Agendador diário no worker, `learning.reviews-due.v1`, módulo `notifications` com `notification_log` único por dia, Mailpit em dev. Na research.md, escolha o provedor de e-mail.
- [ ] **C · tasks + analyze** — commit `______`
- [ ] **D… · implement por fase** — commits `______`
- [ ] **Z · converge + fechamento** — commit `______`

### 006 · Espanhol por configuração

Branch: `006-espanhol`

> **Antes de começar:** decida a variante (`es-ES` ou `es-MX`) e registre em `docs/architecture.md` §16.

- [ ] **A · specify + clarify** — commit `______`
  > /speckit-specify Fatia 006 do `docs/prd.md`: a pessoa pode escolher espanhol como idioma-alvo e todo o ciclo existente (cenário, conversa por texto e áudio, resumo, vocabulário, revisão) funciona em espanhol, ligado por configuração.
- [ ] **B · plan** — commit `______`
  > /speckit-plan [prompt base] Critério do `architecture.md` §13: se for preciso mudar código fora de configuração, prompts e seeds, aponte isso como violação de fronteira.
- [ ] **C · tasks + analyze** — commit `______`
- [ ] **D… · implement** — commits `______`
- [ ] **Z · converge + fechamento** — commit `______`

### 007 · Login Google e exclusão de conta

Branch: `007-login-google`

- [ ] **A · specify + clarify** — commit `______`
  > /speckit-specify Fatia 007 do `docs/prd.md`: a pessoa entra com Google em um clique e a sessão dura 30 dias (RF01); o usuário fixo deixa de existir em produção. A pessoa pode excluir a conta, e isso apaga todos os seus dados (LGPD).
- [ ] **B · plan** — commit `______`
  > /speckit-plan [prompt base] Adapter `GoogleSessionAuth` substituindo `FixedUserAuth` sem tocar nos módulos, `identity.user-deleted.v1` com consumer `purge-user` em cada módulo.
- [ ] **C · tasks + analyze** — commit `______`
- [ ] **D… · implement por fase** — commits `______`
- [ ] **Z · converge + fechamento** — commit `______`

### 008 · Missões, temas livres e "usar a palavra"

Branch: `008-missoes-temas`

- [ ] **A · specify + clarify** — commit `______`
  > /speckit-specify Fatia 008 do `docs/prd.md`: adicionar os cenários com missão "pedir informação (taxista/hostel)" e o lúdico "gângster" (RF16); conversa livre por tema (cinema, livros), sem objetivos mas com correções e sugestões (RF17); modo "usar a palavra": a partir de uma palavra salva, a IA cria uma cena curta que induz o uso e no fim diz se ela foi usada corretamente (RF12).
- [ ] **B · plan** — commit `______`
  > /speckit-plan [prompt base] Cenários como dados (seed versionado), `POST /practice` usando `LearningApi.getVocabularyItem`.
- [ ] **C · tasks + analyze** — commit `______`
- [ ] **D… · implement por fase** — commits `______`
- [ ] **Z · converge + fechamento** — commit `______`

### 009 · Métricas, alertas e lançamento

Branch: `009-lancamento`

- [ ] **A · specify + clarify** — commit `______`
  > /speckit-specify Fatia 009 do `docs/prd.md`: acompanhar as métricas de sucesso do PRD (ativos por semana, sessões por usuário, palavras salvas, revisões concluídas, retenção, latência p95, custo por sessão, missões cumpridas), receber alertas (DLQ não vazia, p95 acima da meta, custo mensal acima de 80%, com bloqueio em 100%) e colocar o app no ar para os 10 primeiros usuários.
- [ ] **B · plan** — commit `______`
  > /speckit-plan [prompt base] Painel de métricas, alertas, teto mensal via `ai_usage`, hospedagem (decidir na research.md), teste de carga com k6.
- [ ] **C · tasks + analyze** — commit `______`
- [ ] **D… · implement por fase** — commits `______`
- [ ] **Z · converge + fechamento** — commit `______`

---

## Comandos auxiliares (quando usar)

| Comando | Quando |
| --- | --- |
| `/speckit-clarify` | Logo após o specify, sempre. Também quando uma spec ganha ambiguidade nova |
| `/speckit-analyze` | Logo após o tasks, sempre. Também antes de retomar uma fatia parada |
| `/speckit-checklist` | Opcional, antes do implement, para gerar checklists específicos (ex.: "segurança", "LGPD", "latência") |
| `/speckit-converge` | Fim de cada fatia: compara código e spec e cria tarefas para o que faltou |
| `/speckit-constitution` | Só quando um princípio mudar (gera nova versão + ADR) |
| `/speckit-taskstoissues` | Opcional, se quiser espelhar as tarefas em issues do GitHub |

## Log de decisões tomadas durante a execução

| Data | Fatia | Decisão | Onde está registrada |
| --- | --- | --- | --- |
| | | | |
