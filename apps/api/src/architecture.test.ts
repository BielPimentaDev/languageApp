import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * As regras de dependência das camadas (ADR 011, architecture.md §5): as
 * dependências apontam para dentro.
 */
const srcDirectory = dirname(fileURLToPath(import.meta.url));

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') ? [path] : [];
  });
}

const importPattern =
  /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(?\s*['"]([^'"]+)['"]/g;

/** Cada import de um arquivo: um pacote, ou a camada (`domain`, `application`...) de um import relativo. */
function importsOf(file: string): string[] {
  const code = readFileSync(file, 'utf8');
  return [...code.matchAll(importPattern)].map((match) => {
    const specifier = (match[1] ?? match[2]) as string;
    if (!specifier.startsWith('.')) return specifier;
    const target = relative(srcDirectory, resolve(dirname(file), specifier));
    return `layer:${target.split(sep)[0]}`;
  });
}

function violations(layer: string, isAllowed: (dependency: string) => boolean): string[] {
  return sourceFiles(join(srcDirectory, layer)).flatMap((file) =>
    importsOf(file)
      .filter((dependency) => !isAllowed(dependency))
      .map((dependency) => `${relative(srcDirectory, file)} -> ${dependency}`),
  );
}

describe('layer dependency rules', () => {
  it('domain imports only domain, and no library', () => {
    expect(violations('domain', (dependency) => dependency === 'layer:domain')).toEqual([]);
  });

  it('application imports only domain, application and Zod', () => {
    const allowed = new Set(['layer:domain', 'layer:application', 'zod']);

    expect(violations('application', (dependency) => allowed.has(dependency))).toEqual([]);
  });
});
