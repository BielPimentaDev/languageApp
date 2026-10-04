# ADR 006 — Provedores de LLM, STT e TTS atrás de portas

- Status: Substituído por [016](./016-llm-atras-de-porta-pronta-para-streaming.md)
- Data: 2026-10-04
- Referências: [architecture-v1.md §2, §13, §15, §16](../archive/architecture-v1.md) · Constitution v1, princípios II e VII

## Contexto

O produto depende de três capacidades de IA: conversa e análise (LLM), transcrição de fala (STT) e síntese de voz (TTS). Preço, latência e qualidade dos provedores mudam rápido, e a escolha ainda está em aberto (será pesquisada no `/speckit-plan` da feature 001).

O custo de IA é o principal risco operacional do MVP. Também é preciso desenvolver e testar sem gastar orçamento.

## Decisão

- LLM, STT e TTS são **portas de saída** em `application/ports/out` dos módulos que os usam (`conversation`, `speech`, `learning`).
- Cada provedor é um **adapter** em `adapters/out/ai/`, que usa clientes HTTP sem regra de negócio de `shared/infra/ai`.
- A montagem do prompt (cenário, idioma, nível, histórico) é uma **função pura** da aplicação/domínio, testável; o adapter só envia texto e devolve texto ou JSON validado.
- Cada porta tem um **fake oficial** em `adapters/out/in-memory/` e um **teste de contrato** que roda contra o fake e o adapter real.
- `AI_PROVIDER=fake` liga os fakes para desenvolvimento offline e CI.
- Erros técnicos de provedor viram `ProviderUnavailableError` no adapter, com timeout e uma tentativa extra.
- Controle de custo na borda: cota diária por pessoa, teto mensal global (`ai_usage`), cache de TTS por hash e modelo menor para tarefas de análise.

## Consequências

- ✅ Trocar de provedor não toca o domínio nem a aplicação; basta um adapter novo que passe nos testes de contrato.
- ✅ É possível desenvolver e rodar a CI sem custo e de forma determinística.
- ✅ Os prompts são versionados e testados como código.
- ⚠️ É preciso manter fakes realistas o bastante para não esconder problemas que só aparecem com o provedor real.
- ⚠️ Recursos específicos de um provedor (streaming, function calling) só entram se couberem no contrato da porta.
- ❌ Descartado: chamar SDKs de provedores direto nos casos de uso (acopla o domínio ao fornecedor e impede testes sem custo).
