import type { HttpServer } from './server';

/** Sem identidade no MVP, a API não pode ser exposta fora da máquina (ADR 010). */
const LOOPBACK_HOST = '127.0.0.1';

export async function listen(app: HttpServer, port: number): Promise<string> {
  return app.listen({ host: LOOPBACK_HOST, port });
}
