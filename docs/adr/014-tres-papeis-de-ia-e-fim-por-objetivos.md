# ADR 014 — Três papéis de IA, e a missão termina por objetivos

- Status: Aceito
- Data: 2026-10-04
- Referências: [ADR 013](./013-correcoes-so-no-relatorio.md) · [architecture.md](../architecture.md) · [CONTEXT.md](../../CONTEXT.md)

## Contexto

Para o avaliador rodar no fim (ADR 013), o sistema precisa saber quando a missão acabou. Deixar o personagem decidir isso é imprevisível e difícil de testar. Deixar só o aluno decidir tira a sensação de missão cumprida.

Se o próprio personagem marcasse os objetivos cumpridos na mesma resposta, misturaria conversa e saída estruturada no mesmo prompt. Isso piora o roleplay e complica o streaming futuro.

## Decisão

- Cada cenário define uma lista de **objetivos**.
- Há três papéis de IA, cada um com seu prompt e seu contrato:
  - **Personagem**: conversa com o aluno, devolvendo texto livre.
  - **Verificador de objetivos**: depois de cada turno, numa chamada separada, recebe a conversa e os objetivos pendentes e devolve os que foram cumpridos (saída estruturada).
  - **Avaliador**: produz o relatório depois do encerramento (saída estruturada).
- A missão passa para **`concluída`** automaticamente no turno em que o último objetivo é cumprido. O aluno pode **encerrar** antes, e a missão passa para **`abandonada`**.
- Se o verificador falhar, a resposta do personagem é entregue mesmo assim, com os objetivos do turno anterior. Os objetivos voltam a ser verificados no turno seguinte.

## Consequências

- ✅ O personagem só conversa, então novos cenários não exigem código: os objetivos vêm do arquivo do cenário.
- ✅ Cada papel pode usar um modelo diferente (por exemplo, um modelo menor para o verificador).
- ⚠️ Cada turno faz duas chamadas de IA, e isso pesa no custo e na latência.
- ⚠️ Uma falha do verificador no último turno atrasa a conclusão da missão em um turno.
- ❌ Descartado: o personagem marcar os objetivos na mesma resposta (mistura papéis) e uma máquina de estados com roteiro linear por cenário (impede cenários e modos mais livres).
