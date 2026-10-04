# ADR 013 — O personagem nunca corrige; as correções vêm só no relatório

- Status: Aceito
- Data: 2026-10-04
- Referências: [architecture.md](../architecture.md) · [CONTEXT.md](../../CONTEXT.md)

## Contexto

O aluno precisa saber o que errou e como poderia ter falado melhor. As correções podem aparecer a cada turno ou só no fim da missão.

Corrigir a cada turno quebra a imersão, que é o diferencial do produto, e custa uma chamada de IA extra por turno. Também mistura dois papéis diferentes no mesmo prompt: conversar e avaliar.

## Decisão

- Durante a missão, o **personagem** fica sempre em personagem e nunca corrige o aluno.
- As correções (gramática, vocabulário e naturalidade) são produzidas pelo **avaliador**, depois que a missão é encerrada, e entregues no **relatório**.
- Avaliador e personagem são papéis separados, cada um com seu prompt, seu contrato de saída e seus testes.

## Consequências

- ✅ A conversa fica imersiva, e o prompt do personagem é simples.
- ✅ O avaliador vê a conversa inteira e pode apontar padrões, não só erros isolados.
- ⚠️ O aluno só descobre o erro no fim. Uma correção em tempo real pode existir no futuro como um **modo** novo, sem mudar o modo padrão.
- ❌ Descartado: correção a cada turno (quebra a imersão e custa mais).
