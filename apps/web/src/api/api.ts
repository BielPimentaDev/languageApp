import { loadWebConfig } from '../web-config';
import { createApiClient } from './api-client';

// `process.env.NEXT_PUBLIC_API_URL` precisa aparecer literalmente para o Next o embutir no bundle do navegador.
const config = loadWebConfig({ NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL });

export const api = createApiClient({ baseUrl: config.apiUrl });
