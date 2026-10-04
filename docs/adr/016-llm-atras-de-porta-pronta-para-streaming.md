# ADR 016 — LLM atrás de uma porta, pronta para streaming

- Status: Aceito
- Data: 2026-10-04
- Substitui: [ADR 006](./006-provedores-de-ia-atras-de-portas.md)
- Referências: [architecture.md](../architecture.md)

## Contexto

Os três papéis de IA (ADR 014) chamam um LLM. Os casos de uso precisam ser testados sem rede e sem custo, e o provedor ou o modelo de cada papel pode mudar.

O ADR 006 já colocava os provedores atrás de portas, mas também trazia cota diária, teto mensal, cache de TTS e testes de contrato com Testcontainers, que não fazem parte deste MVP.

## Decisão

- A aplicação depende só da porta **`LLMClient`**, com duas capacidades:
  - **Gerar texto em streaming**: devolve um fluxo de pedaços de texto, usado pelo personagem.
  - **Gerar saída estruturada** a partir de um schema: devolve um objeto já validado, usado pelo verificador e pelo avaliador.
- O primeiro adaptador usa a **Claude API** e fica em `infrastructure/llm/`. Nos testes entra um `FakeLLMClient` com respostas determinísticas.
- O modelo de cada papel é configuração. Nada no código assume um modelo específico.
- **No MVP, a resposta HTTP é completa**: o caso de uso consome o fluxo inteiro antes de responder. Para ligar o streaming (SSE) depois, basta mudar a camada HTTP.
- **Falhas são tratadas no adaptador.** Ele aplica um timeout e faz até 2 novas tentativas em falhas transitórias e quando a saída estruturada não passa no schema. Se continuar falhando, lança `LLMUnavailableError` ou `InvalidLLMOutputError`. Os casos de uso não sabem de retries, e a camada HTTP traduz esses erros em status e mensagem.
- Fala para texto (STT) e texto para fala (TTS) serão portas irmãs (`SpeechToText`, `TextToSpeech`) quando o áudio entrar.

## Consequências

- ✅ A política de retry fica num lugar só, então trocar de provedor é escrever outro adaptador.
- ✅ Os casos de uso e o motor da missão são testados sem gastar tokens.
- ✅ O streaming e o áudio entram sem mudar o domínio.
- ⚠️ O `FakeLLMClient` não detecta problemas de qualidade dos prompts. Isso é coberto pelos evals (ver [architecture.md](../architecture.md#9-testes-e-evals)).
- ❌ Descartado: chamar o SDK direto nos casos de uso (acopla ao provedor e impede testes sem custo) e usar uma biblioteca de abstração como o Vercel AI SDK (dependência grande que esconde justamente o que o projeto quer exercitar).
