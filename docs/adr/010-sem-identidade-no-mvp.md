# ADR 010 — Sem identidade no MVP

- Status: Aceito
- Data: 2026-10-04
- Substitui: [ADR 007](./007-identidade-usuario-fixo-depois-google.md)
- Referências: [architecture.md](../architecture.md)

## Contexto

O ADR 007 previa um usuário fixo protegido por um token de desenvolvimento e, depois, login com Google. O MVP agora é local e só o autor o usa, então qualquer mecanismo de identidade é custo sem retorno.

## Decisão

- Não há login, conta, usuário fixo nem token de desenvolvimento.
- Os casos de uso **não recebem ator**, e as entidades não guardam dono.
- A API escuta só em `localhost`. A chave da Anthropic fica no servidor e nunca chega ao navegador.

## Consequências

- ✅ Nenhum fluxo de autenticação para construir ou testar.
- ⚠️ Quem acessar a API consegue gastar a chave da Anthropic. Por isso a API não deve ser exposta fora da máquina enquanto não houver identidade.
- ⚠️ Quando o login entrar, os casos de uso passam a receber o ator explicitamente e as entidades ganham um dono. A ideia do ADR 007 de que não existe usuário ambiente dentro da aplicação continua sendo o caminho.
- ❌ Descartado: usuário fixo com token de desenvolvimento (protege um orçamento que só o próprio autor usa).
