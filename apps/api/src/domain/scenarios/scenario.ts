/** Uma meta comunicativa que o aluno precisa cumprir num cenário. */
export interface Objective {
  readonly id: string;
  readonly description: string;
}

/** A identidade que o personagem assume num cenário. */
export interface Persona {
  readonly name: string;
  readonly role: string;
  readonly speakingStyle: string;
}

/**
 * Uma situação de prática. É um dado: não depende de idioma nem de nível,
 * que são parâmetros da missão.
 */
export interface Scenario {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly persona: Persona;
  readonly situation: string;
  readonly objectives: readonly Objective[];
}
