# ADR 012 — Monorepo pnpm com um pacote `shared` de contratos

- Status: Aceito
- Data: 2026-10-04
- Referências: [architecture.md](../architecture.md)

## Contexto

O front (Next.js) e a API (Fastify) precisam concordar sobre o formato das requisições, das respostas e dos arquivos de cenário. Com tipos duplicados nos dois lados, qualquer mudança de contrato pode quebrar a integração sem que o compilador perceba.

## Decisão

- Um monorepo com **pnpm workspaces**: `apps/web` (Next.js), `apps/api` (Fastify) e `packages/shared`.
- `packages/shared` contém só **contratos**: os schemas Zod dos DTOs HTTP e do arquivo de cenário, e os tipos derivados deles. Não contém regra de negócio.
- Sem Turborepo ou Nx no início. Eles entram se o build ficar lento ou se os pacotes se multiplicarem.

## Consequências

- ✅ Uma mudança de contrato quebra a compilação dos dois lados no mesmo commit.
- ✅ Um só `git`, um só `install` e um só pipeline de CI.
- ⚠️ O `shared` não pode virar uma gaveta: se algo não é contrato entre front e API, não entra nele.
- ❌ Descartado: dois repositórios (o contrato duplicado ou publicado como pacote) e pastas sem workspaces (o compartilhamento vira cópia manual ou import relativo frágil).
