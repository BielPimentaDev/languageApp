# ADR 002 — Dois processos (`api` e `worker`) na mesma base de código

- Status: Aceito
- Data: 2026-10-04
- Referências: [architecture.md §2, §9](../architecture.md) · Constitution, princípio I

## Contexto

Parte do trabalho do produto não deve bloquear a requisição HTTP: analisar a sessão após o fim, atualizar os dias seguidos, gerar frases de contexto para revisão, enviar lembretes e apagar dados (LGPD). Esse trabalho precisa de retry, DLQ e um agendador diário.

Rodar tudo dentro do processo HTTP acopla a latência da API ao trabalho de fundo. Criar repositórios ou serviços separados multiplicaria o custo de manutenção.

## Decisão

- Dois entrypoints na mesma base: `main.api.ts` (HTTP, autenticação, cota, casos de uso, gravação no outbox) e `main.worker.ts` (relay do outbox, consumers, agendador diário).
- Cada módulo exporta `register({ mode: 'api' | 'worker', deps })`; o entrypoint chama o `register` de todos e liga só o que pertence ao modo.
- O worker expõe apenas `/health` e `/metrics`.
- Em produção é a **mesma imagem Docker** com comandos diferentes (`node dist/main.api.js` e `node dist/main.worker.js`).

## Consequências

- ✅ A API escala por tráfego e o worker pelo tamanho das filas, de forma independente.
- ✅ Falha ou lentidão de um consumer não derruba a API.
- ✅ Pratica trabalho assíncrono real (filas, retry, DLQ) sem multiplicar repositórios.
- ⚠️ Em desenvolvimento são dois processos rodando (dois terminais) mais a infraestrutura do Docker Compose.
- ⚠️ O código compartilhado precisa funcionar nos dois modos; o `register` de cada módulo tem que separar bem o que é de cada processo.
- ❌ Descartado: um único processo com jobs em memória (perde trabalho em restart e acopla latências) e repositórios separados (custo sem benefício no MVP).
