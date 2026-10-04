# ADR 007 — Usuário fixo até a semana 4, depois login Google

- Status: Substituído por [010](./010-sem-identidade-no-mvp.md)
- Data: 2026-10-04
- Referências: [architecture-v1.md §2, §5, §12](../archive/architecture-v1.md) · [PRD v1](../archive/prd-v1.md) RF01

## Contexto

O valor do produto está no ciclo conversa → resumo → revisão, não no login. Implementar autenticação primeiro atrasaria a validação desse ciclo. Ainda assim, a API chama provedores de IA pagos e não pode ficar aberta a qualquer pessoa.

O login definitivo (RF01) será com Google, e a exclusão de conta (LGPD) depende de existir identidade real.

## Decisão

- Os casos de uso **recebem o ator explicitamente** (`{ userId, ... }`). Quem resolve o usuário é o adapter HTTP, pela porta `IdentityApi.resolveUser`. Não existe "usuário ambiente" na aplicação.
- **Até a semana 4**: o adapter `FixedUserAuth` sempre resolve o usuário seed, mas exige o header `X-Dev-Token` com um segredo em variável de ambiente, para proteger o orçamento de IA.
- **Na semana 4** (fatia 007): entra `GoogleSessionAuth` (`POST /auth/google`), com o mesmo contrato de `resolveUser`, junto com `DELETE /me` e o evento `identity.user-deleted.v1`.

## Consequências

- ✅ As fatias 001–006 focam no valor do produto sem bloquear em autenticação.
- ✅ Trocar o adapter de autenticação não toca nenhum módulo, porque todos já recebem `userId` explicitamente.
- ✅ O orçamento de IA fica protegido desde o primeiro deploy.
- ⚠️ Até a semana 4 o app é de uma pessoa só; dados de teste do usuário seed precisam ser tratados como descartáveis ou migrados.
- ⚠️ O `X-Dev-Token` é um segredo compartilhado, sem rotação nem identidade por pessoa; não serve para usuários reais.
- ❌ Descartado: login desde o dia 1 (atrasa a validação) e API aberta sem segredo (risco de custo).
