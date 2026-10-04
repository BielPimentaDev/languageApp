# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This is a **single-context** repo.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — the domain glossary.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in. Only ADRs with status **Aceito** are in force; ADRs marked `Substituído por NNN` are history. The index is `docs/adr/README.md`.
- **`docs/architecture.md`** — the current technical reference (layers, flow, HTTP API, tests, tooling).

Do **not** treat `docs/archive/` as current: it holds the superseded v1 plan.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill creates them lazily when terms or decisions actually get resolved.

## File structure

```
/
├── CONTEXT.md
├── docs/
│   ├── architecture.md
│   ├── adr/
│   │   ├── README.md
│   │   ├── 008-estado-em-memoria-atras-de-repositorios.md
│   │   └── 009-processo-unico-e-relatorio-sob-demanda.md
│   └── archive/          ← superseded v1 plan, not current
└── apps/ · packages/
```

ADRs use **3-digit** sequential numbering (`NNN-slug.md`), written in Portuguese, with a header (status, date, references) and **Contexto**, **Decisão** and **Consequências** sections. To change a decision, write a new ADR that supersedes the old one and mark the old one `Substituído por NNN`.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids. In code, use the English canonical name given in parentheses (`Mission`, `Objective`, `Character`...).

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR 014 (three AI roles, mission ends by objectives) — but worth reopening because…_
