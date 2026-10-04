# ADR 017 — O navegador chama a API direto, com CORS

- Status: Aceito
- Data: 2026-10-04
- Referências: [architecture.md](../architecture.md)

## Contexto

O front (Next.js) e a API (Fastify) são dois processos separados. O navegador pode chamar a API direto, passar por um proxy do Next (`rewrites`) ou nunca falar com a API, se o Next usar Server Actions.

O projeto quer tratar a API como um serviço independente que o front só consome, e poder ver as chamadas reais na aba Network.

## Decisão

- O navegador chama a API Fastify **direto**, pela URL em `NEXT_PUBLIC_API_URL`.
- A API habilita CORS (`@fastify/cors`) só para a origem do front.
- Toda chamada passa por um **cliente tipado** em `apps/web`, que usa os contratos de `packages/shared` e é o único lugar que conhece a URL base.

## Consequências

- ✅ É a configuração mais simples de entender e depurar.
- ✅ A API continua utilizável por qualquer cliente (um app nativo no futuro, por exemplo).
- ⚠️ Com login, vale reavaliar um proxy no Next para manter cookies no mesmo domínio. Como o cliente tipado isola a URL, a migração é pequena.
- ❌ Descartado: proxy por `rewrites` (uma indireção sem ganho enquanto não há login) e Server Actions (acopla a UI ao Next e traz pouca vantagem para um chat interativo).
