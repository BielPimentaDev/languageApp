# App de idiomas por missões

O aluno pratica um idioma cumprindo missões de conversa com personagens de IA em cenários do dia a dia. Ao fim de cada missão, recebe um relatório com correções e escolhe as palavras que quer treinar.

Nos identificadores de código, o termo canônico é o nome em inglês, entre parênteses.

## Pessoas e papéis

**Aluno** (`Learner`):
A pessoa que pratica o idioma. No MVP, há um único aluno implícito, sem conta.
_Evite_: usuário, cliente, estudante

**Personagem** (`Character`):
O papel de IA que conversa com o aluno dentro do cenário (por exemplo, o atendente da cafeteria). Fica sempre em personagem e nunca corrige o aluno.
_Evite_: bot, assistente, atendente (atendente é a persona de um cenário específico, não o papel)

**Verificador de objetivos** (`ObjectiveChecker`):
O papel de IA que, após cada turno, decide quais objetivos da missão o aluno já cumpriu. Não fala com o aluno.
_Evite_: juiz, validador

**Avaliador** (`Evaluator`):
O papel de IA que analisa a conversa de uma missão encerrada e produz o relatório.
_Evite_: corretor, revisor

## Cenários e missões

**Cenário** (`Scenario`):
A descrição de uma situação de prática: persona do personagem, contexto, tom e objetivos. É um dado, não depende de idioma nem de nível.
_Evite_: lição, exercício, template

**Persona** (`Persona`):
A identidade que o personagem assume num cenário (nome, função, jeito de falar).

**Objetivo** (`Objective`):
Uma meta comunicativa que o aluno precisa cumprir num cenário, como "pedir a bebida" ou "escolher a forma de pagamento".
_Evite_: tarefa, passo, etapa

**Missão** (`Mission`):
Uma tentativa do aluno de cumprir os objetivos de um cenário, num idioma-alvo e num nível. Contém a conversa e, depois de encerrada, o relatório.
_Evite_: sessão, conversa, partida

**Estado da missão** (`MissionStatus`):
`em andamento` enquanto há objetivos pendentes; `concluída` quando todos os objetivos foram cumpridos; `abandonada` quando o aluno encerrou antes disso.

**Turno** (`Turn`):
Uma fala do aluno seguida da resposta do personagem.
_Evite_: rodada, interação

**Mensagem** (`Message`):
Uma fala individual dentro da missão, do aluno ou do personagem.

**Idioma-alvo** (`TargetLanguage`):
O idioma que o aluno pratica numa missão. No MVP, sempre inglês.
_Evite_: língua, idioma (sem qualificador)

**Nível** (`Level`):
O nível de proficiência (escala CEFR, A1 a C2) que calibra a fala do personagem e o rigor do avaliador. No MVP, sempre C1.
_Evite_: dificuldade

## Relatório e prática

**Relatório** (`Report`):
O resultado do avaliador sobre uma missão encerrada: as correções e quais objetivos foram cumpridos. É gerado uma vez e não muda.
_Evite_: resumo, feedback, avaliação

**Correção** (`Correction`):
Um trecho dito pelo aluno, a forma recomendada e uma explicação curta. Pode ser de gramática, de vocabulário ou de naturalidade (quando a frase está certa, mas há uma forma mais natural de dizer).
_Evite_: erro, sugestão (como termos separados)

**Item de vocabulário** (`VocabularyItem`):
Uma palavra ou expressão que o aluno escolheu treinar a partir de uma correção ("Quero treinar").
_Evite_: flashcard, palavra salva, card
