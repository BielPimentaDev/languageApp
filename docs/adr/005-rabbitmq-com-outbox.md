# ADR 005 — RabbitMQ (`amqplib`) com outbox

- Status: Aceito
- Data: 2026-10-04
- Referências: [architecture.md §2, §10](../architecture.md) · Constitution, princípios V e VI

## Contexto

Os módulos se comunicam por eventos quando uma chamada síncrona criaria ciclo ou acoplamento indevido: `session-ended` dispara a análise e os dias seguidos, `word-saved` prepara revisões, `reviews-due` dispara o lembrete e `user-deleted` apaga dados em todos os módulos (LGPD).

Publicar no broker depois do commit pode perder eventos se o processo cair entre os dois passos. Publicar antes do commit pode emitir eventos de dados que nunca foram gravados. O projeto também quer praticar exchanges, ack manual, retry e DLQ.

## Decisão

- Broker: **RabbitMQ** com o cliente **`amqplib`**.
- Exchange `domain.events` (topic), routing key `<type>.v<version>`, uma fila por consumidor.
- **Outbox transacional**: o evento é gravado na mesma transação do dado de negócio; o relay (no worker) publica com *publisher confirms* e só então marca `published_at`.
- Entrega **pelo menos uma vez**; todo consumidor é **idempotente** via `platform.processed_events` (chave única `event_id` + `consumer`), gravado na mesma transação do trabalho.
- **Ack manual** só após o commit do consumidor.
- **Retry** com até 3 tentativas (5 s, 30 s, 2 min, por filas com TTL e dead-letter) e depois **DLQ por fila**, com o script `pnpm ops:dlq:replay <fila>`.
- Envelope padronizado e versionado em `packages/contracts` (zod); mudança incompatível gera `v2`, e as duas versões são emitidas enquanto houver consumidor de `v1`.

## Consequências

- ✅ Nenhum evento se perde se o broker ou o processo cair.
- ✅ Falhas ficam isoladas por consumidor e podem ser reprocessadas pela DLQ.
- ✅ O `traceparent` no envelope permite rastrear do HTTP até o worker.
- ⚠️ Mais infraestrutura (RabbitMQ no Compose e em produção) e mais peças (relay, tabelas de outbox e idempotência).
- ⚠️ Consistência eventual: o relatório da sessão, por exemplo, responde `202` até a análise terminar.
- ⚠️ Todo consumidor novo precisa de teste de integração que entregue o mesmo evento duas vezes.
- ❌ Descartado: eventos em memória (perdidos em restart), publicação direta sem outbox (perda ou evento fantasma) e Redis Streams/BullMQ (menos aderente ao objetivo de praticar roteamento, ack e DLQ).
