# ADR 008 — Estado em memória atrás de repositórios

- Status: Aceito
- Data: 2026-10-04
- Substitui: [ADR 004](./004-postgres-drizzle-schema-por-modulo.md)
- Referências: [architecture.md](../architecture.md)

## Contexto

O MVP roda localmente e tem um único aluno (o autor). O ADR 004 previa PostgreSQL com Drizzle e um schema por módulo, o que exige Docker, migrations e transações antes de existir qualquer missão funcionando.

Ainda assim, histórico, login e itens de vocabulário vão precisar de persistência real mais adiante, e essa troca não pode exigir reescrever os casos de uso.

## Decisão

- Missões e itens de vocabulário ficam **em memória**, no processo da API.
- A aplicação acessa esses dados só pelas portas `MissionRepository` e `VocabularyRepository`. Os adaptadores `InMemory*` ficam em `infrastructure/persistence/`.
- Os repositórios em memória **guardam e devolvem cópias** dos objetos, não as referências. Assim, um caso de uso que esquece de chamar `save` falha nos testes, como falharia com um banco.
- Não há banco, Docker Compose nem migrations no MVP.

## Consequências

- ✅ Nenhuma infraestrutura para subir. Os testes de aplicação usam os próprios adaptadores em memória.
- ✅ Trocar por SQLite ou Postgres é escrever um adaptador novo para as mesmas portas.
- ⚠️ Reiniciar a API apaga todas as missões e itens de vocabulário.
- ⚠️ Sem transações, então nada garante atomicidade entre dois repositórios. Isso não é um problema enquanto cada caso de uso grava só um agregado.
- ❌ Descartado: SQLite desde o início (custo sem retorno para um único aluno) e estado guardado no navegador (o cliente poderia adulterar o histórico e a missão sairia do servidor).
