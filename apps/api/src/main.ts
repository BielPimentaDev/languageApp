import { fileURLToPath } from 'node:url';
import { loadApiConfig } from './infrastructure/config/api-config';
import { buildApp } from './infrastructure/container';
import { listen } from './infrastructure/http/listen';

const config = loadApiConfig(process.env);
const app = await buildApp({
  config,
  scenariosDirectory: fileURLToPath(new URL('../scenarios', import.meta.url)),
  logger: true,
});
await listen(app, config.port);
