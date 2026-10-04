# PRD — MVP app de idiomas com conversação por IA

Oct 4, 2026 · @Gabriel

## Contexto e problema

Quem estuda um idioma sozinho trava na conversação: falta assunto, falta alguém que corrija e as palavras novas se perdem. O app resolve isso com conversas guiadas por cenários (reais e lúdicos), correção ao final e revisão das palavras que a pessoa escolhe fixar.

- Apps de gamificação ensinam vocabulário solto, mas treinam pouco a fala.
- Tutores humanos corrigem bem, porém custam caro e exigem agenda.
- Chatbots genéricos conversam, mas não guardam seus erros nem trazem a palavra de volta depois.

O diferencial é o ciclo fechado: conversa, correção, palavra salva, revisão e uso em uma nova situação.

## Objetivos

O MVP precisa provar o ciclo de aprendizado com pessoas reais e, ao mesmo tempo, servir de campo de prática para arquitetura de software.

**Produto**

- Fechar o ciclo completo (conversa, correção, palavra salva, revisão) em uma única sessão de uso.
- Ter 10 pessoas usando por 4 semanas seguidas.
- Manter o custo de IA por sessão previsível e abaixo do teto definido.

**Aprendizado de arquitetura**

- Monolito modular com fronteiras impostas por regra (um módulo só importa o `index.ts` do outro).
- Mensageria com RabbitMQ: outbox, consumidores idempotentes, retries e dead-letter queue.
- Controle de custo de IA com rate limiting por usuário e cache.
- Observabilidade básica: logs estruturados, trace id por sessão e métricas de latência por etapa.
- Extrair um módulo (áudio ou conversação) para serviço próprio quando houver motivo medido.

## Público-alvo

O MVP atende adultos que estudam um idioma por conta própria, em nível A2 a B2, e querem treinar conversação sem depender de agenda de professor.

| Persona | Perfil | O que busca |
| --- | --- | --- |
| Principal (o autor) | Pratica 2 idiomas, usa o app todo dia | Conversar sobre situações reais e fixar palavras úteis |
| Secundária | Amigos e colegas em grupos de estudo | Um lugar para errar sem vergonha e receber correção |

A interface do app é em português. Os idiomas de prática do MVP são inglês e espanhol (o espanhol é ativado por configuração na semana 3, depois de estabilizar o inglês).

- [x] Qual variante do espanhol usar no MVP (es-ES ou es-MX)?

## Escopo do MVP

O MVP entrega o ciclo completo com o mínimo de funcionalidades. Tudo que não ajuda a validar esse ciclo fica para depois.

**Entra**

- Seletor de idioma-alvo (inglês ou espanhol) e nível, com usuário fixo até o login entrar na semana 4
- 3 cenários com missões (restaurante, pedir informação a um taxista ou no hostel, e um lúdico como gângster) e conversa livre por tema (cinema, livros)
- Conversa por texto e por áudio, com resposta em texto e em áudio
- Correção discreta de erros, sem interromper a conversa
- Sugestão de palavras e expressões
- Resumo ao fim da sessão com o botão "treinar essa"
- Revisão com intervalos fixos (1, 3, 7 e 14 dias)
- Missões simples: briefing, 2 a 3 objetivos e avaliação ao fim da sessão, incluindo o modo "usar a palavra"
- Limite diário de uso por usuário
- Contador simples de dias seguidos

**Fica fora**

- Nota de pronúncia
- Ranking, XP e conquistas
- Algoritmo de repetição espaçada avançado (SM-2 ou FSRS)
- App nativo (React Native)
- Streaming de áudio em tempo real
- Cenários criados pelo usuário, idiomas além de inglês e espanhol, cenários extras (café, loja), cardápio ilustrado, dicas durante a missão, narrativas com ramificações e apresentação em reunião de trabalho
- Pagamentos e planos

## Requisitos funcionais

Cada requisito tem um critério de aceite verificável. Os números de tempo são metas iniciais, ajustáveis depois da primeira medição.

| ID | Requisito | Critério de aceite |
| --- | --- | --- |
| RF01 | Login com Google (entra na semana 4; antes disso, usuário fixo) | A pessoa entra com um clique e a sessão dura 30 dias |
| RF02 | Perfil com idioma-alvo (inglês ou espanhol) e nível (A1 a C1) | O nível é alterável e vai no prompt de toda conversa |
| RF03 | Escolher cenário | Ao escolher, o personagem inicia a conversa em até 5 s |
| RF04 | Enviar mensagem por texto | A resposta em texto chega em até 6 s (p95) |
| RF05 | Enviar mensagem por áudio (segurar para falar) | A transcrição aparece na conversa e a resposta chega em até 8 s (p95) |
| RF06 | Ouvir a resposta | Toda resposta tem botão de ouvir; o autoplay pode ser ligado ou desligado |
| RF07 | Correção discreta | Cada erro guarda frase original, correção e explicação curta, sem interromper a conversa |
| RF08 | Sugestão de palavras e expressões | Até 5 por sessão, cada uma com significado e exemplo |
| RF09 | Resumo da sessão | Ao encerrar, mostra erros e sugestões em até 15 s, com o botão "treinar essa" |
| RF10 | Vocabulário pessoal | Palavra repetida não duplica; a pessoa pode removê-la |
| RF11 | Revisão com intervalos fixos | Palavras entram na fila nos dias 1, 3, 7 e 14; acertar avança o intervalo, errar volta ao dia 1 |
| RF12 | Modo "usar a palavra" | A IA cria uma cena curta que induz o uso e, no fim, diz se a palavra foi usada corretamente, como uma missão de objetivo único |
| RF13 | Limite diário de uso | Ao atingir o limite (40 mensagens/dia, proposta), aparece aviso com o horário do reset |
| RF14 | Contador de dias seguidos | Sobe ao concluir uma sessão ou revisão no dia, no fuso da pessoa |
| RF15 | Lembrete de revisão | Quando há revisões pendentes, a pessoa recebe e-mail uma vez por dia |
| RF16 | Missões com objetivos | Antes de começar mostra o briefing (contexto e 2 a 3 objetivos); ao fim, cada objetivo aparece como cumprido ou não, com a frase da pessoa que o cumpriu |
| RF17 | Conversa livre por tema | A pessoa escolhe um tema (cinema, livros) e conversa sem objetivos, com as mesmas correções e sugestões |

## Fluxos principais

**Sessão de conversa**

1. A pessoa escolhe o cenário (ex.: restaurante), lê o briefing da missão (ex.: pedir a bebida X no tamanho Y e perguntar onde é o banheiro) e começa a conversar por texto ou áudio.
2. O personagem responde em texto e em áudio, mantendo a conversa no ritmo do nível escolhido.
3. Os erros ficam registrados em segundo plano, sem cortar a conversa.
4. Ao encerrar, o resumo mostra erros corrigidos, palavras sugeridas e quais objetivos da missão foram cumpridos.
5. A pessoa toca em "treinar essa" nas palavras que quer fixar.
6. As palavras salvas entram no calendário de revisão e a IA propõe uma situação para usá-las.

**Revisão diária**

1. A pessoa recebe o lembrete quando há palavras vencidas.
2. Abre a fila e responde a cada palavra (acertou ou errou).
3. Opcionalmente entra no modo "usar a palavra" e pratica a palavra numa cena curta.
4. O contador de dias seguidos é atualizado.

## Requisitos não funcionais

A latência do áudio é o maior risco de experiência, então ela é medida desde a primeira semana, etapa por etapa.

| Área | Meta |
| --- | --- |
| Latência (texto) | Resposta em até 6 s no p95 |
| Latência (áudio) | Falar, transcrever, responder e tocar em até 8 s no p95; streaming só depois de medir |
| Custo de IA | Teto mensal de R$ 100 no MVP (proposta) e custo por sessão acompanhado |
| Limites | Limite diário por usuário, aplicado no gateway |
| Disponibilidade | Melhor esforço; sem SLA no MVP |
| Privacidade | Áudio descartado após a transcrição; excluir a conta apaga todos os dados (LGPD) |
| Observabilidade | Logs estruturados, trace id por sessão e métrica de latência por etapa |
| Compatibilidade | Chrome (Android e desktop) e Safari (iOS) testados na semana 1 |
| Resiliência | Eventos não se perdem se o broker cair (outbox) e consumidores toleram entrega duplicada |

## Métricas de sucesso

O MVP é validado se 10 pessoas usarem o ciclo completo por 4 semanas. As metas abaixo são iniciais e devem ser ajustadas depois da primeira semana de dados.

| Métrica | Meta (4 semanas) | Como medir |
| --- | --- | --- |
| Usuários ativos por semana | 10 | Eventos de sessão iniciada |
| Sessões por usuário por semana | 3 ou mais | Eventos de sessão iniciada |
| Palavras salvas por sessão | 2 ou mais | Eventos de palavra salva |
| Revisões concluídas sobre as agendadas | 60% ou mais | Fila de revisão |
| Retenção na semana 2 | 40% ou mais | Usuários da semana 1 que voltam |
| Latência p95 (texto e áudio) | 6 s e 8 s | Métrica por etapa |
| Custo de IA por sessão | R$ 0,50 ou menos (proposta) | Custo dos provedores por sessão |
| Missões com todos os objetivos cumpridos | 50% ou mais (proposta) | Avaliação ao fim da sessão |

**Como validar com pessoas reais:** convidar 10 a 20 pessoas de grupos de estudo, conversar 15 minutos com cada uma após a primeira semana e observar em que ponto abandonam a sessão.

## Riscos e mitigações

| Risco | Mitigação |
| --- | --- |
| Latência do áudio acima de 5 s quebra o fluxo da conversa | Medir cedo, entregar texto primeiro e evoluir para streaming só depois |
| Custo de IA estoura o orçamento | Limite diário, cache de áudio de frases repetidas e modelo menor para análise pós-sessão |
| Gravação instável no Safari/iOS | Testar na semana 1 e manter o texto como alternativa |
| IA corrige errado ou explica mal | Nível no prompt, explicação curta e botão para reportar correção; revisar uma amostra à mão |
| O escopo cresce e o MVP atrasa | Lista de "fica fora" respeitada; meta de 4 semanas para o primeiro uso real; espanhol ligado só na semana 3, com o inglês já estável |
| A arquitetura vira excesso de engenharia | Começar com monolito modular e extrair serviço só com motivo medido |

## Roadmap pós-MVP

A ordem abaixo segue o que mais ajuda a aprendizagem e o que mais exercita a arquitetura.

1. Nota de pronúncia, o item mais difícil e o que mais agrega à conversação.
2. Repetição espaçada com FSRS no lugar dos intervalos fixos.
3. XP, ranking e conquistas sobre o contador de dias seguidos.
4. Streaming de áudio para reduzir a latência.
5. App com Expo (React Native), reaproveitando contratos e lógica.
6. Mais cenários (café, loja, hostel), cenários criados pelo usuário, dicas durante a missão, cardápio ilustrado, narrativas com ramificações e apresentação em reunião de trabalho (falar 1 minuto e receber feedback).
7. Extração do módulo de áudio ou conversação para serviço próprio.
8. Segundo projeto: agendamento via WhatsApp, reaproveitando webhooks, filas e NLU.

   |  |  |  |
   | --- | --- | --- |
   |  |  |  |
   |  |  |  |
