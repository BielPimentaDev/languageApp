# ADR 015 — Cenários como dados e prompts montados por composição

- Status: Aceito
- Data: 2026-10-04
- Referências: [ADR 014](./014-tres-papeis-de-ia-e-fim-por-objetivos.md) · [architecture.md](../architecture.md)

## Contexto

Novos cenários, idiomas e níveis precisam entrar sem mudar o motor da missão. Se cada cenário trouxesse o prompt completo, as regras de roleplay, de nível e de idioma se repetiriam em todos os arquivos, e mudar uma regra global significaria editar todos eles.

## Decisão

- **Um cenário é um arquivo de dados** no repositório, com persona, situação, tom e objetivos. Os arquivos são lidos na inicialização e validados pelo schema Zod de `packages/shared`. Um arquivo inválido impede a API de subir.
- **Idioma-alvo e nível são parâmetros da missão**, não do cenário. No MVP, são sempre `en` e `C1`, mas o código os trata como valores, nunca como constantes espalhadas.
- O **`PromptBuilder`** (camada de aplicação) monta o prompt de cada papel juntando blocos: as regras do papel (por exemplo "fique em personagem, não corrija, não fale pelo aluno"), o bloco de **nível**, o bloco de **idioma** e os dados do **cenário**.
- O `PromptBuilder` é uma função pura, testada sem chamar a IA.

## Consequências

- ✅ Um cenário novo é um arquivo novo, sem código.
- ✅ Um nível ou idioma novo é um bloco novo, sem tocar nos cenários nem nos casos de uso.
- ✅ As regras de cada papel ficam num só lugar, versionadas e testadas.
- ⚠️ Cenários que precisem de comportamento fora do esquema (ramificações, por exemplo) vão exigir evoluir o schema do cenário.
- ❌ Descartado: cenários como módulos TypeScript (cenário novo exige mexer em código), cenários num banco (exige persistência e editor) e um prompt completo por cenário (regras repetidas).
